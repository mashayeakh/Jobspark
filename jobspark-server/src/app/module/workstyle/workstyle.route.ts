import express from "express";
import { WorkStyleController } from "./workstyle.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import validateRequest from "@/app/middleware/validateRequest";
import { createWorkStyleSchema } from "./workstyle.dto";

const router = express.Router();

router.get("/", WorkStyleController.getAllWorkStyles);
router.post(
  "/create",
  checkAuth(UserRole.ADMIN),
  validateRequest(createWorkStyleSchema),
  WorkStyleController.createWorkStyle
);
router.get("/job-types", WorkStyleController.getJobTypes);
router.get("/experience-levels", WorkStyleController.getExperienceLevels);
router.get("/location-types", WorkStyleController.getLocationTypes);

export const WorkStyleRoutes = router;
