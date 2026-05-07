import express from "express";
import { JobSeekerController } from "./jobSeeker.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();

router.get("/me", checkAuth(UserRole.JOB_SEEKER), JobSeekerController.getMyProfile);
router.patch("/update", checkAuth(UserRole.JOB_SEEKER), JobSeekerController.updateProfile);

export const JobSeekerRoutes = router;
