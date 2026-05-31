import { Router } from "express";
import { SubscriptionController } from "./subscription.controller";
import { checkAuth } from "@/app/middleware/checkAuth";

const router = Router();

// Protected routes (Require Auth + Recruiter Role)
// Assuming authGuard adds req.user. Role checking can be added if authGuard doesn't do it.
router.post(
  "/create-checkout-session",
  checkAuth(),
  SubscriptionController.createCheckoutSession
);

router.post(
  "/create-customer-portal",
  checkAuth(),
  SubscriptionController.createCustomerPortal
);

router.get(
  "/status",
  checkAuth(),
  SubscriptionController.getSubscriptionStatus
);

export const SubscriptionRoutes = router;
