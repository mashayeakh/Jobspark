import express from "express";
import { BioGeneratorController } from "./bioGenerator.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "@/app/lib/prisma";
import { aiLimiter } from "@/app/middleware/rateLimiter";

const router = express.Router();

router.post("/generate", checkAuth(UserRole.JOB_SEEKER), aiLimiter, BioGeneratorController.generate);

export const BioGeneratorRouter = router;
