import express from "express";
import { AuthRoutes } from "./auth/auth.route";
import { JobSeekerRoutes } from "./jobSeeker/jobSeeker.route";
import { RecruiterRoutes } from "./recruiter/recruiter.route";
import { JobRoutes } from "./job/job.route";
import { ApplicationRoutes } from "./application/application.route";
import { NetworkRoutes } from "./network/network.route";
import { AdminRoutes } from "./admin/admin.route";

const router = express.Router();

//!Auth
router.use("/auth", AuthRoutes);

//!JobSeeker
router.use("/jobseeker", JobSeekerRoutes);

//!Recruiter
router.use("/recruiter", RecruiterRoutes);

//!Jobs
router.use("/jobs", JobRoutes);

//!Applications
router.use("/applications", ApplicationRoutes);

//!Network & Notifications
router.use("/network", NetworkRoutes);

//!Admin
router.use("/admin", AdminRoutes);

export default router;