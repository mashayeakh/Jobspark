import express from "express";
import { RecruiterController } from "./recruiter.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();

router.get("/me", checkAuth(UserRole.RECRUITER), RecruiterController.getMyProfile);
router.post("/create-profile", checkAuth(UserRole.RECRUITER), RecruiterController.createProfile);
router.patch("/update", checkAuth(UserRole.RECRUITER), RecruiterController.updateProfile);

export const RecruiterRoutes = router;
