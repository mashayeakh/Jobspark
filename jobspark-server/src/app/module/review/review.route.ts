import express from "express";
import { ReviewController } from "./review.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();

router.get("/", ReviewController.getAllReviews);
router.post("/", checkAuth(UserRole.JOB_SEEKER, UserRole.RECRUITER), ReviewController.createReview);

export const ReviewRoutes = router;
