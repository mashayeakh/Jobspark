import express from "express";
import { NetworkController, NotificationController } from "./network.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { extractOptionalAuth } from "@/app/middleware/optionalAuth";

const router = express.Router();

// --- Connection Routes ---
router.post("/connect/:userId", checkAuth(), NetworkController.sendConnectionRequest);
router.patch("/connect/:id/accept", checkAuth(), NetworkController.acceptConnection);
router.patch("/connect/:id/reject", checkAuth(), NetworkController.rejectConnection);
router.get("/connections", checkAuth(), NetworkController.getConnections);
router.get("/pending", checkAuth(), NetworkController.getPendingRequests);
router.get("/connect/:id/status", checkAuth(), NetworkController.getConnectStatus);
router.delete("/connect/:id", checkAuth(), NetworkController.removeConnection);

// --- Blocking Routes ---
router.post("/block/:id", checkAuth(), NetworkController.blockUser);
router.delete("/block/:id", checkAuth(), NetworkController.unblockUser);
router.get("/blocked", checkAuth(), NetworkController.getBlockedUsers);

// --- User Profile Routes ---
router.get("/users", extractOptionalAuth(), NetworkController.getRecommendedUsers);
router.get("/users/:id", NetworkController.getUserProfile);

// --- Notification Routes ---
router.get("/notifications", checkAuth(), NotificationController.getNotifications);
router.patch("/notifications/:id/read", checkAuth(), NotificationController.markAsRead);
router.patch("/notifications/read-all", checkAuth(), NotificationController.markAllAsRead);

export const NetworkRoutes = router;
