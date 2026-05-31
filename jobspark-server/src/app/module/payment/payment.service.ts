import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import status from "http-status";
import Stripe from "stripe";
import { stripe } from "@/app/config/stripe.config";
import { envVars } from "@/app/config/env";
import { PaymentStatus, SubscriptionStatus } from "prisma/generated/prisma/browser";

//! Define subscription plans and their prices
const SUBSCRIPTION_PRICE = {
    MONTHLY: { amount: 299.00, amountInCents: 29900, label: "Monthly" },
    YEARLY: { amount: 2990.00, amountInCents: 299000, label: "Yearly" },
    PROFESSIONAL: { amount: 299.00, amountInCents: 29900, label: "Professional Monthly Subscription" }
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

        // Check for existing pending payments
        const existingPending = await prisma.payment.findFirst({
            where: {
                userId,
                status: PaymentStatus.PENDING
            }
        });

        if (existingPending) {
            throw new AppError(status.BAD_REQUEST, "You already have a pending payment waiting for admin approval.");
        }

        const now = new Date();
        const endDate = calculateSubscriptionEndDate(now, type);
        const transactionId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

        const subscription = await prisma.subscription.create({
            data: {
                userId,
                recruiterId: recruiter.id,
                type: type as any,
                status: SubscriptionStatus.PENDING,
                startDate: now,
                endDate: endDate,
            }
        });

        const payment = await prisma.payment.create({
            data: {
                userId,
                subscriptionId: subscription.id,
                amount: plan.amount,
                type: type as any,
                status: PaymentStatus.PENDING,
                transactionId: transactionId,
            }
        });

        // Update recruiter profile to show pending
        await prisma.recruiterProfile.update({
            where: { id: recruiter.id },
            data: {
                subscriptionStatus: SubscriptionStatus.PENDING,
            }
        });

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
                success_url: `${envVars.FRONTEND_URL}/recruiter/subscription?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${envVars.FRONTEND_URL}/recruiter/subscription?checkout=cancel`,
                metadata: {
                    userId,
                    recruiterId: recruiter.id,
                    paymentId: payment.id,
                    subscriptionId: subscription.id,
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

        return {
            checkoutUrl: stripeSession.url,
            paymentId: payment.id,
            subscriptionId: subscription.id,
            transactionId: payment.transactionId,
            message: "Stripe checkout session created."
        };
    },

    async getAllPayments() {
        return prisma.payment.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                subscription: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    },

    async approvePayment(paymentId: string) {
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: { subscription: true }
        });

        if (!payment) {
            throw new AppError(status.NOT_FOUND, "Payment not found");
        }

        if (payment.status === PaymentStatus.COMPLETED) {
            throw new AppError(status.BAD_REQUEST, "Payment is already approved");
        }

        // Update payment to COMPLETED
        await prisma.payment.update({
            where: { id: paymentId },
            data: { status: PaymentStatus.COMPLETED }
        });

        // Update subscription to ACTIVE
        if (payment.subscriptionId) {
            await prisma.subscription.update({
                where: { id: payment.subscriptionId },
                data: { status: SubscriptionStatus.ACTIVE }
            });

            // Update recruiter profile
            const subscription = payment.subscription;
            if (subscription && subscription.recruiterId) {
                await prisma.recruiterProfile.update({
                    where: { id: subscription.recruiterId },
                    data: {
                        subscriptionStatus: "ACTIVE",
                        currentPeriodEnd: subscription.endDate,
                        subscriptionStartedAt: new Date(),
                    }
                });
            }
        }

        return { message: "Payment approved successfully" };
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

            // Instead of marking COMPLETED, we just save the Stripe transaction ID.
            // The payment stays PENDING until the admin approves it.
            if (existingPayment) {
                await prisma.payment.update({
                    where: { id: paymentId },
                    data: {
                        transactionId: session.id
                    }
                }).catch(() => null);
            }

            // We do NOT activate the subscription or update recruiter profile here.
            // Admin must approve it via the /admin/payments page.
            
        } catch (e) {
            console.error("Error updating payment status:", e);
        }

        return { message: "Payment verified from Stripe. Waiting for admin approval." };
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

                // Just record the transaction ID, leave status PENDING for admin approval
                await prisma.payment.update({
                    where: { id: paymentId },
                    data: {
                        transactionId: session.id
                    }
                }).catch(() => null);

                // Update recruiter profile with Stripe IDs just in case, but keep status PENDING
                if (recruiterId) {
                    await prisma.recruiterProfile.update({
                        where: { id: recruiterId },
                        data: {
                            stripeCustomerId: session.customer as string || undefined,
                            stripeSubscriptionId: session.id,
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
