import express from "express";
import { JobSeekerController } from "./jobSeeker.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import { upload } from "@/app/middleware/upload";

const router = express.Router();

router.get("/me", checkAuth(UserRole.JOB_SEEKER), JobSeekerController.getMyProfile);
router.get("/dashboard", checkAuth(UserRole.JOB_SEEKER), JobSeekerController.getDashboard);
router.patch("/update", checkAuth(UserRole.JOB_SEEKER), JobSeekerController.updateProfile);
router.post("/upload-resume", checkAuth(UserRole.JOB_SEEKER), upload.single("file"), JobSeekerController.uploadResume);

export const JobSeekerRoutes = router;
