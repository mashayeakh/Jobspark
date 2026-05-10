import express from "express";
import { ContentSanityController } from "./contentSanity.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();

// Admin only routes
router.use(checkAuth(UserRole.ADMIN));

// Analyze a specific job posting
router.get("/analyze/:jobId", ContentSanityController.analyzeJob);

// Batch analyze multiple jobs
router.post("/analyze-batch", ContentSanityController.analyzeBatch);

// Analyze all jobs
router.post("/analyze-all", ContentSanityController.analyzeAllJobs);

// Get content sanity statistics
router.get("/stats", ContentSanityController.getStats);

// Get jobs needing review
router.get("/jobs", ContentSanityController.getJobsNeedingReview);

// Apply automated corrections
router.post("/apply-corrections/:jobId", ContentSanityController.applyCorrections);

export const ContentSanityRouter = router;
