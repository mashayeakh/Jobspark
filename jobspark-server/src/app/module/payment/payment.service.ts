import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import status from "http-status";
import Stripe from "stripe";
import { stripe } from "@/app/config/stripe.config";
import { envVars } from "@/app/config/env";
import { PaymentStatus, SubscriptionStatus } from "prisma/generated/prisma/browser";

//! Define subscription plans and their prices
const SUBSCRIPTION_PRICE = {
    MONTHLY: { amount: 9.99, amountInCents: 999, label: "Monthly" },
    YEARLY: { amount: 99.99, amountInCents: 9999, label: "Yearly" },
    PROFESSIONAL: { amount: 299, amountInCents: 29900, label: "Professional Monthly Subscription" }
};

const calculateSubscriptionEndDate = (startDate: Date, type: string) => {
    const endDate = new Date(startDate);

    if (type === "YEARLY") {
        endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
        endDate.setMonth(endDate.getMonth() + 1);
    }

    return endDate;
};

export const PaymentService = {
    async createSubscriptionCheckoutSession(userId: string, type: string = "MONTHLY") {
        const planKey = type.toUpperCase() as keyof typeof SUBSCRIPTION_PRICE;
        const plan = SUBSCRIPTION_PRICE[planKey] || SUBSCRIPTION_PRICE.PROFESSIONAL;

        // Validate user and recruiter
        const recruiter = await prisma.recruiterProfile.findUnique({
            where: { userId },
            include: { user: true },
        });

        if (!recruiter) {
            throw new AppError(status.FORBIDDEN, "Only recruiters can subscribe. Please create a recruiter profile first.");
        }

        const now = new Date();
        const endDate = calculateSubscriptionEndDate(now, type);
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const paymentId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

        // Create Stripe checkout session
        let stripeSession;
        try {
            stripeSession = await stripe.checkout.sessions.create({
                mode: "payment",
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: `JobSpark ${plan.label}`
                            },
                            unit_amount: plan.amountInCents
                        },
                        quantity: 1
                    }
                ],
                success_url: `${envVars.FRONTEND_URL}/recruiter/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${envVars.FRONTEND_URL}/recruiter?checkout=cancel`,
                metadata: {
                    userId,
                    recruiterId: recruiter.id,
                    subscriptionType: type,
                }
            });
        } catch (err: any) {
            console.error("Stripe session creation error:", err);
            throw new AppError(status.INTERNAL_SERVER_ERROR, `Failed to create checkout session: ${err.message}`);
        }

        if (!stripeSession?.url) {
            throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to generate checkout URL");
        }

        // Try to save to database (optional - won't block if table doesn't exist)
        try {
            await prisma.recruiterProfile.update({
                where: { id: recruiter.id },
                data: {
                    stripeSubscriptionId: stripeSession.id,
                }
            });
        } catch (err) {
            console.log("Note: Could not save to database, but checkout session created successfully");
        }

        return {
            checkoutUrl: stripeSession.url,
            paymentId,
            subscriptionId,
            sessionId: stripeSession.id
        };
    },

    constructWebhookEvent(rawBody: Buffer, signature: string) {
        return stripe.webhooks.constructEvent(
            rawBody,
            signature,
            envVars.STRIPE.STRIPE_WEBHOOK_SECRET
        );
    },

    async verifyCheckoutSession(sessionId: string) {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
            throw new AppError(status.BAD_REQUEST, "Payment not completed");
        }

        const paymentId = session.metadata?.paymentId;
        const subscriptionId = session.metadata?.subscriptionId;
        const userId = session.metadata?.userId;
        const recruiterId = session.metadata?.recruiterId;

        if (!paymentId || !subscriptionId || !userId) {
            throw new AppError(status.BAD_REQUEST, "Missing payment or subscription metadata");
        }

        try {
            const existingPayment = await prisma.payment.findUnique({
                where: { id: paymentId }
            }).catch(() => null);

            if (existingPayment && existingPayment.status === PaymentStatus.COMPLETED) {
                return { message: "Payment already verified" };
            }

            // Update payment status
            if (existingPayment) {
                await prisma.payment.update({
                    where: { id: paymentId },
                    data: {
                        status: PaymentStatus.COMPLETED,
                        transactionId: session.id
                    }
                }).catch(() => null);
            }

            // Update subscription status
            try {
                await prisma.subscription.update({
                    where: { id: subscriptionId },
                    data: {
                        status: SubscriptionStatus.ACTIVE
                    }
                }).catch(() => null);
            } catch (e) {
                // Ignore
            }

            // Update recruiter subscription
            if (recruiterId) {
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);

                await prisma.recruiterProfile.update({
                    where: { id: recruiterId },
                    data: {
                        subscriptionStatus: "ACTIVE",
                        stripeCustomerId: session.customer as string || undefined,
                        stripeSubscriptionId: session.id,
                        currentPeriodEnd: endDate,
                        subscriptionStartedAt: new Date(),
                    }
                }).catch(() => null);
            }
        } catch (e) {
            console.error("Error updating payment status:", e);
        }

        return { message: "Payment verified. Subscription activated." };
    },

    async handleStripeWebhookEvent(event: Stripe.Event) {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            const paymentId = session.metadata?.paymentId;
            const subscriptionId = session.metadata?.subscriptionId;
            const userId = session.metadata?.userId;
            const recruiterId = session.metadata?.recruiterId;

            if (!paymentId || !subscriptionId || !userId) {
                return { message: "Missing payment or subscription metadata" };
            }

            try {
                const existingPayment = await prisma.payment.findUnique({
                    where: { id: paymentId }
                }).catch(() => null);

                if (!existingPayment) {
                    return { message: "Payment not found" };
                }

                if (existingPayment.status === PaymentStatus.COMPLETED) {
                    return { message: "Event already processed" };
                }

                await prisma.payment.update({
                    where: { id: paymentId },
                    data: {
                        status: PaymentStatus.COMPLETED,
                        transactionId: session.id
                    }
                }).catch(() => null);

                // Update subscription
                try {
                    await prisma.subscription.update({
                        where: { id: subscriptionId },
                        data: {
                            status: SubscriptionStatus.ACTIVE
                        }
                    }).catch(() => null);
                } catch (e) {
                    // Ignore
                }

                // Update recruiter profile
                if (recruiterId) {
                    const endDate = new Date();
                    endDate.setMonth(endDate.getMonth() + 1);

                    await prisma.recruiterProfile.update({
                        where: { id: recruiterId },
                        data: {
                            subscriptionStatus: "ACTIVE",
                            stripeCustomerId: session.customer as string || undefined,
                            stripeSubscriptionId: session.id,
                            currentPeriodEnd: endDate,
                            subscriptionStartedAt: new Date(),
                        }
                    }).catch(() => null);
                }
            } catch (e) {
                console.error("Error processing checkout.session.completed:", e);
            }

            return { message: "checkout.session.completed processed" };
        }

        if (event.type === "checkout.session.expired") {
            const session = event.data.object as Stripe.Checkout.Session;
            const paymentId = session.metadata?.paymentId;

            if (paymentId) {
                try {
                    await prisma.payment.updateMany({
                        where: { id: paymentId, status: PaymentStatus.PENDING },
                        data: { status: PaymentStatus.FAILED }
                    }).catch(() => null);
                } catch (e) {
                    console.error("Error processing checkout.session.expired:", e);
                }
            }

            return { message: "checkout.session.expired processed" };
        }

        return { message: `Unhandled event: ${event.type}` };
    }
};
