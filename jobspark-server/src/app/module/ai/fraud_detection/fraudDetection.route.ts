import express from "express";
import { FraudDetectionController } from "./fraudDetection.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();

// Admin only routes
router.use(checkAuth(UserRole.ADMIN));

// Analyze a specific job posting
router.get("/analyze/:jobId", FraudDetectionController.analyzeJob);

// Analyze multiple job postings (batch)
router.post("/analyze-batch", FraudDetectionController.analyzeBatch);

// Get fraud detection statistics
router.get("/stats", FraudDetectionController.getStats);

// Get all flagged jobs
router.get("/flagged", FraudDetectionController.getFlaggedJobs);

// Get fraud alerts
router.get("/alerts", FraudDetectionController.getAlerts);

// Trigger manual analysis for a job
router.post("/trigger/:jobId", FraudDetectionController.triggerAnalysis);

// Get fraud detection metrics for dashboard
router.get("/metrics", FraudDetectionController.getMetrics);

// Analyze all existing jobs
router.post("/analyze-all", FraudDetectionController.analyzeAllJobs);

export const FraudDetectionRouter = router;
