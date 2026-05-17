
import express from "express";
import { UserRole } from "@/app/lib/prisma";
import { checkAuth } from "../../../middleware/checkAuth";
import { ProfileAnalyticsController } from "./profileAnalytics.controller";

const router = express.Router();

router.get(
  "/score",
  checkAuth(UserRole.JOB_SEEKER),
  ProfileAnalyticsController.getProfileScore
);

export const ProfileAnalyticsRoutes = router;
