import express from "express";
import { RecommendationController } from "./recommendation.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();

router.get("/", checkAuth(UserRole.JOB_SEEKER), RecommendationController.getRecommendedJobs);

export const RecommendationRoutes = router;
