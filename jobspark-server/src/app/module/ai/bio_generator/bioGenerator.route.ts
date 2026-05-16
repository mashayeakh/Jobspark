import express from "express";
import { BioGeneratorController } from "./bioGenerator.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/generate", checkAuth(UserRole.JOB_SEEKER), BioGeneratorController.generate);

export const BioGeneratorRouter = router;
