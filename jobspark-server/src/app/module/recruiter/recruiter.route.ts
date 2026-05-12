import express from "express";
import { RecruiterController } from "./recruiter.controller";
import { PotentialAnalysisController } from "../ai/potential_analysis/potentialAnalysis.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();

router.get("/me", checkAuth(UserRole.RECRUITER), RecruiterController.getMyProfile);
router.get("/dashboard", checkAuth(UserRole.RECRUITER), RecruiterController.getDashboard);
router.get("/applications", checkAuth(UserRole.RECRUITER), RecruiterController.getAllApplications);
router.get("/applications/:applicationId/analyze", checkAuth(UserRole.RECRUITER), PotentialAnalysisController.analyzeApplication);
router.get("/applications/:applicationId", checkAuth(UserRole.RECRUITER), RecruiterController.getApplicationDetails);
router.post("/create-profile", checkAuth(UserRole.RECRUITER), RecruiterController.createProfile);
router.patch("/update", checkAuth(UserRole.RECRUITER), RecruiterController.updateProfile);

export const RecruiterRoutes = router;
