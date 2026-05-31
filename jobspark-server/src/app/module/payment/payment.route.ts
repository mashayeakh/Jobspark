import express from "express";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import { PaymentController } from "./payment.controller";
import { PaymentDetailsController } from "./payment-details.controller";

const router = express.Router();

//! create checkout session for subscription
router.post(
    "/create-checkout-session",
    checkAuth(UserRole.RECRUITER),
    PaymentController.createCheckoutSession
);

//! verify checkout session after payment
router.post(
    "/verify-checkout-session",
    checkAuth(UserRole.RECRUITER),
    PaymentController.verifyCheckoutSession
);

//! verify payment and redirect user to appropriate page
router.get(
    "/verify-payment",
    PaymentController.verifyPaymentAndRedirect
);

//! get subscription and payment details
router.get(
    "/subscription-details",
    checkAuth(UserRole.RECRUITER),
    PaymentDetailsController.getSubscriptionDetails
);

//! get all payments (admin)
router.get(
    "/all",
    checkAuth(UserRole.ADMIN),
    PaymentController.getAllPayments
);

//! approve manual payment (admin)
router.post(
    "/approve",
    checkAuth(UserRole.ADMIN),
    PaymentController.approvePayment
);

export const PaymentRouter = router;
