import express from "express";
import { JobController } from "./job.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();

// Public/Seeker routes
router.get("/", JobController.getAllJobs);
router.get("/public-stats", JobController.getPublicStats);

// Specific routes (must come before dynamic :id)
router.get("/my-jobs", checkAuth(UserRole.RECRUITER), JobController.getRecruiterJobs);
router.get("/saved", checkAuth(UserRole.JOB_SEEKER), JobController.getSavedJobs);

// Dynamic routes
router.get("/:id", JobController.getJobById);
router.post("/:jobId/save", checkAuth(UserRole.JOB_SEEKER), JobController.saveJob);
router.delete("/:jobId/save", checkAuth(UserRole.JOB_SEEKER), JobController.unsaveJob);
router.get("/:jobId/saved-status", checkAuth(UserRole.JOB_SEEKER), JobController.checkIfJobSaved);

// Recruiter routes
router.post("/create", checkAuth(UserRole.RECRUITER), JobController.createJob);
router.patch("/:id", checkAuth(UserRole.RECRUITER), JobController.updateJob);

export const JobRoutes = router;
