import { Request, Response } from "express";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";
import { stripe } from "@/app/config/stripe.config";
import { envVars } from "@/app/config/env";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { PaymentService } from "./payment.service";
import { SubscriptionType } from "prisma/generated/prisma/enums";

export const PaymentController = {
    createCheckoutSession: catchAsyc(async (req: Request, res: Response) => {
        const userId = (req as any).user?.userId;
        if (!userId) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
        }

        console.log("Creating checkout session for userId:", userId);

        const { type = SubscriptionType.MONTHLY } = req.body;

        const session = await PaymentService.createSubscriptionCheckoutSession(userId, type);

        res.status(200).json({
            success: true,
            message: session.message,
            data: session,
        });
    }),

    getAllPayments: catchAsyc(async (req: Request, res: Response) => {
        const payments = await PaymentService.getAllPayments();

        res.status(200).json({
            success: true,
            message: "Payments retrieved successfully",
            data: payments,
        });
    }),

    approvePayment: catchAsyc(async (req: Request, res: Response) => {
        const { paymentId } = req.body;
        
        if (!paymentId) {
            throw new AppError(httpStatus.BAD_REQUEST, "Payment ID is required");
        }

        const result = await PaymentService.approvePayment(paymentId);

        res.status(200).json({
            success: true,
            message: result.message,
            data: result,
        });
    }),

    verifyCheckoutSession: catchAsyc(async (req: Request, res: Response) => {
        const userId = (req as any).user?.userId;
        if (!userId) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
        }

        const { sessionId } = req.body;
        if (!sessionId) {
            throw new AppError(httpStatus.BAD_REQUEST, "Session ID is required");
        }

        const result = await PaymentService.verifyCheckoutSession(sessionId);

        res.status(200).json({
            success: true,
            message: result.message,
            data: result,
        });
    }),

    verifyPaymentAndRedirect: catchAsyc(async (req: Request, res: Response) => {
        const { session_id } = req.query;

        if (!session_id) {
            throw new AppError(httpStatus.BAD_REQUEST, "Session ID is required");
        }

        try {
            const result = await PaymentService.verifyCheckoutSession(session_id as string);

            res.status(200).json({
                success: true,
                message: result.message,
                data: result,
            });
        } catch (error) {
            throw error;
        }
    }),

    webhook: async (req: Request, res: Response) => {
        const sig = req.headers["stripe-signature"] as string;
        let event;

        try {
            event = PaymentService.constructWebhookEvent(
                req.body,
                sig
            );
        } catch (err: any) {
            console.error("Webhook signature verification failed.", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        try {
            const result = await PaymentService.handleStripeWebhookEvent(event);
            res.status(200).json({ received: true, ...result });
        } catch (error) {
            console.error("Error processing webhook:", error);
            res.status(500).json({ error: "Webhook processing failed" });
        }
    },
};
