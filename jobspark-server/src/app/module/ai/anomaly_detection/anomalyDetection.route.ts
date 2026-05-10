import express from "express";
import { AnomalyDetectionController } from "./anomalyDetection.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();

// Admin only routes
router.use(checkAuth(UserRole.ADMIN));

router.get("/stats", AnomalyDetectionController.getStats);
router.get("/anomalies", AnomalyDetectionController.getAnomalies);
router.post("/resolve/:anomalyId", AnomalyDetectionController.resolveAnomaly);
router.post("/analyze", AnomalyDetectionController.analyzeTraffic);

export const AnomalyDetectionRouter = router;
