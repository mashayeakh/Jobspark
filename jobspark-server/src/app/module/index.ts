import express from "express";
import { AuthRoutes } from "./auth/auth.route";
import { JobSeekerRoutes } from "./jobSeeker/jobSeeker.route";
import { RecruiterRoutes } from "./recruiter/recruiter.route";
import { JobRoutes } from "./job/job.route";

const router = express.Router();

//!Auth
router.use("/auth", AuthRoutes);

//!JobSeeker
router.use("/jobseeker", JobSeekerRoutes);

//!Recruiter
router.use("/recruiter", RecruiterRoutes);

//!Jobs
router.use("/jobs", JobRoutes);

export default router;