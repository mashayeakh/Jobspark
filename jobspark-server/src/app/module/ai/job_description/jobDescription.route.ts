import express from "express";
import { JobDescriptionController } from "./jobDescription.controller";
import { UserRole } from "@/app/lib/prisma";
import { checkAuth } from "@/app/middleware/checkAuth";
import { aiLimiter } from "@/app/middleware/rateLimiter";

const router = express.Router();

router.post("/generate", checkAuth(UserRole.RECRUITER, UserRole.ADMIN), aiLimiter, JobDescriptionController.generate);

export const JobDescriptionRouter = router;
