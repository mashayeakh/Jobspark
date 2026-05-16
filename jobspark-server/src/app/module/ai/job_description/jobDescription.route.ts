import express from "express";
import { JobDescriptionController } from "./jobDescription.controller";
import { UserRole } from "@prisma/client";
import { checkAuth } from "@/app/middleware/checkAuth";

const router = express.Router();

router.post("/generate", checkAuth(UserRole.RECRUITER, UserRole.ADMIN), JobDescriptionController.generate);

export const JobDescriptionRouter = router;
