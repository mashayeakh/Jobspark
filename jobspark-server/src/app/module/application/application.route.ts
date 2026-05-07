import express from "express";
import { ApplicationController } from "./application.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated";

const router = express.Router();

// --- Seeker Routes ---
router.post("/apply", checkAuth(UserRole.JOB_SEEKER), ApplicationController.applyForJob);
router.get("/my-applications", checkAuth(UserRole.JOB_SEEKER), ApplicationController.getMyApplications);

// --- Recruiter Routes ---
router.get("/job/:jobId", checkAuth(UserRole.RECRUITER), ApplicationController.getApplicantsForJob);
router.patch("/:applicationId/status", checkAuth(UserRole.RECRUITER), ApplicationController.updateApplicationStatus);

export const ApplicationRoutes = router;
