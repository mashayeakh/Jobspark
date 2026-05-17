
import express from "express";
import pkg from "@prisma/client";
const { UserRole } = pkg;
import { checkAuth } from "../../../middleware/checkAuth";
import { ProfileAnalyticsController } from "./profileAnalytics.controller";

const router = express.Router();

router.get(
  "/score",
  checkAuth(UserRole.JOB_SEEKER),
  ProfileAnalyticsController.getProfileScore
);

export const ProfileAnalyticsRoutes = router;
