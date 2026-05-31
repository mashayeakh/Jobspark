import { Request, Response } from "express";

import { AppError } from "../../errorHelpers/AppError";
import httpStatus from "http-status";
import { stripe } from "../../config/stripe.config";
import { envVars } from "../../config/env";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { SubscriptionService } from "./subscription.service";

export const SubscriptionController = {
  createCheckoutSession: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }

    console.log("Creating checkout session for userId:", userId);

    const session = await SubscriptionService.createCheckoutSession(userId);

    res.status(200).json({
      success: true,
      message: "Checkout session created",
      data: session,
    });
  }),

  createCustomerPortal: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const portal = await SubscriptionService.createCustomerPortal(userId);

    res.status(200).json({
      success: true,
      message: "Customer portal created",
      data: portal,
    });
  }),

  getSubscriptionStatus: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const status = await SubscriptionService.getSubscriptionStatus(userId);

    res.status(200).json({
      success: true,
      message: "Subscription status retrieved",
      data: status,
    });
  }),

  webhook: async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        envVars.STRIPE.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      await SubscriptionService.handleWebhook(event);
      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  },
};
