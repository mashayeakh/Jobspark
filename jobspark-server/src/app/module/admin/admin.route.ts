import express from "express";
import { AdminController } from "./admin.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();

// All admin routes are protected
const adminAuth = checkAuth(UserRole.ADMIN);

// Analytics
router.get("/dashboard", adminAuth, AdminController.getPlatformSnapshot);
router.get("/dashboard/history", adminAuth, AdminController.getAnalyticsHistory);
router.get("/dashboard/logs", adminAuth, AdminController.getAnalyticsLogs);

// User Management
router.get("/users", adminAuth, AdminController.getAllUsers);
router.patch("/users/:userId/block", adminAuth, AdminController.blockUser);
router.patch("/users/:userId/unblock", adminAuth, AdminController.unblockUser);
router.delete("/users/:userId", adminAuth, AdminController.deleteUser);

// Company Management
router.get("/companies", adminAuth, AdminController.getAllCompanies);
router.patch("/companies/:companyId/verify", adminAuth, AdminController.verifyCompany);

// Job Moderation
router.get("/jobs", adminAuth, AdminController.getAllJobs);
router.patch("/jobs/:jobId/status", adminAuth, AdminController.forceUpdateJobStatus);

// Skill Database Management
router.get("/skills", adminAuth, AdminController.getAllSkills);
router.post("/skills", adminAuth, AdminController.createSkill);
router.delete("/skills/:skillId", adminAuth, AdminController.deleteSkill);

export const AdminRoutes = router;
