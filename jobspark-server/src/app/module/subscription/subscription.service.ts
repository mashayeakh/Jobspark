import { prisma } from "../../lib/prisma";
import { AppError } from "../../errorHelpers/AppError";
import httpStatus from "http-status";
import { stripe } from "../../config/stripe.config";
import { envVars } from "../../config/env";
import Stripe from "stripe";

const SUBSCRIPTION_PRICE = {
  amount: 299,
  amountInCents: 29900,
  label: "Professional Monthly Subscription",
};

export const SubscriptionService = {
  createCheckoutSession: async (userId: string) => {
    const recruiter = await prisma.recruiterProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!recruiter) {
      throw new AppError(httpStatus.FORBIDDEN, "Only recruiters can subscribe.");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: SUBSCRIPTION_PRICE.label,
            },
            unit_amount: SUBSCRIPTION_PRICE.amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${envVars.FRONTEND_URL}/recruiter/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${envVars.FRONTEND_URL}/recruiter?checkout=cancel`,
      metadata: {
        userId,
        recruiterId: recruiter.id,
      },
    });

    return { checkoutUrl: session.url };
  },

  createCustomerPortal: async (userId: string) => {
    const recruiter = await prisma.recruiterProfile.findUnique({
      where: { userId },
    });

    if (!recruiter || !recruiter.stripeCustomerId) {
      throw new AppError(httpStatus.NOT_FOUND, "No active subscription found.");
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: recruiter.stripeCustomerId,
      return_url: `${envVars.FRONTEND_URL}/recruiter/dashboard`,
    });

    return { portalUrl: portalSession.url };
  },

  getSubscriptionStatus: async (userId: string) => {
    const recruiter = await prisma.recruiterProfile.findUnique({
      where: { userId },
    });

    if (!recruiter) {
      throw new AppError(httpStatus.FORBIDDEN, "Only recruiters can view subscription status.");
    }

    const jobsCount = await prisma.job.count({
      where: { recruiterId: recruiter.id },
    });

    const isSubscribed = ["ACTIVE", "TRIALING"].includes(recruiter.subscriptionStatus || "");

    return {
      isSubscribed,
      subscriptionStatus: recruiter.subscriptionStatus || "NONE",
      jobsUsed: jobsCount,
      jobLimit: isSubscribed ? "UNLIMITED" : 2,
      currentPeriodEnd: recruiter.currentPeriodEnd,
      stripeCustomerId: recruiter.stripeCustomerId,
    };
  },

  canRecruiterPostJob: async (userId: string): Promise<boolean> => {
    const status = await SubscriptionService.getSubscriptionStatus(userId);

    if (status.isSubscribed) return true;
    if (status.jobsUsed < 2) return true;

    return false;
  },

  handleWebhook: async (event: Stripe.Event) => {
    // Idempotency check
    const existingEvent = await prisma.stripeWebhookEvent.findUnique({
      where: { id: event.id },
    });

    if (existingEvent) {
      console.log(`Webhook event ${event.id} already processed.`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status !== "paid") return;

      const recruiterId = session.metadata?.recruiterId;
      const userId = session.metadata?.userId;

      if (!recruiterId || !userId) {
        console.warn("Missing recruiterId or userId in webhook metadata");
        return;
      }

      // Calculate 30-day subscription end date
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      // Create or get Stripe customer from session
      const customerId = session.customer as string | null;

      await prisma.recruiterProfile.update({
        where: { id: recruiterId },
        data: {
          subscriptionStatus: "ACTIVE",
          stripeCustomerId: customerId ?? undefined,
          stripeSubscriptionId: session.id,
          currentPeriodEnd: periodEnd,
          subscriptionStartedAt: now,
          stripePriceId: null,
        },
      });

      console.log(`✅ Subscription activated for recruiter ${recruiterId}`);
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const recruiterId = session.metadata?.recruiterId;

      if (recruiterId) {
        // Only reset if currently pending (don't touch active subscriptions)
        const recruiter = await prisma.recruiterProfile.findUnique({
          where: { id: recruiterId },
        });

        if (recruiter && recruiter.subscriptionStatus === "INCOMPLETE") {
          await prisma.recruiterProfile.update({
            where: { id: recruiterId },
            data: { subscriptionStatus: "CANCELED" },
          });
        }
      }

      console.log(`Checkout session expired for recruiter ${recruiterId}`);
    }

    // Store event for idempotency
    await prisma.stripeWebhookEvent.create({
      data: {
        id: event.id,
        eventType: event.type,
      },
    });
  },
};
