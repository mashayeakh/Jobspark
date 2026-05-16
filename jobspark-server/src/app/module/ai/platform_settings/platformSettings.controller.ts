import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { PlatformSettingsService } from "./platformSettings.service";

export const PlatformSettingsController = {
  getSettings: catchAsyc(async (req: Request, res: Response) => {
    const result = await PlatformSettingsService.getSettings();
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Platform settings retrieved successfully",
      result,
    });
  }),

  updateSettings: catchAsyc(async (req: Request, res: Response) => {
    const result = await PlatformSettingsService.updateSettings(req.body);
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Platform settings updated successfully",
      result,
    });
  }),

  optimizeSettings: catchAsyc(async (req: Request, res: Response) => {
    const result = await PlatformSettingsService.runAIOptimization();
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "AI Optimization complete",
      result,
    });
  })
};
