import express from "express";
import { PlatformSettingsController } from "./platformSettings.controller";

const router = express.Router();

router.get("/", PlatformSettingsController.getSettings);
router.patch("/", PlatformSettingsController.updateSettings);
router.post("/optimize", PlatformSettingsController.optimizeSettings);

export const PlatformSettingsRouter = router;
