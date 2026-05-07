import express from "express";
import { JobController } from "./job.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated";

const router = express.Router();

// Public/Seeker routes
router.get("/", JobController.getAllJobs);

// Specific routes (must come before dynamic :id)
router.get("/my-jobs", checkAuth(UserRole.RECRUITER), JobController.getRecruiterJobs);

// Dynamic routes
router.get("/:id", JobController.getJobById);

// Recruiter routes
router.post("/create", checkAuth(UserRole.RECRUITER), JobController.createJob);
router.patch("/:id", checkAuth(UserRole.RECRUITER), JobController.updateJob);

export const JobRoutes = router;
