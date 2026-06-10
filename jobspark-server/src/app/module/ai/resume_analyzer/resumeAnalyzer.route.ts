import express from "express";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import { ResumeAnalyzerController } from "./resumeAnalyzer.controller";
import { aiLimiter } from "@/app/middleware/rateLimiter";

const router = express.Router();

router.post(
  "/analyze",
  checkAuth(UserRole.JOB_SEEKER), aiLimiter,
  ResumeAnalyzerController.analyze
);

export const ResumeAnalyzerRoutes = router;
