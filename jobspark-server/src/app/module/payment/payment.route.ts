import express from "express";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import { PaymentController } from "./payment.controller";

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

export const PaymentRouter = router;
