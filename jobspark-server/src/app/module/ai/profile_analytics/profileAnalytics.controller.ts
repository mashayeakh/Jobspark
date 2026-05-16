
import { Request, Response } from "express";
import httpStatus from "http-status";
import { ProfileAnalyticsService } from "./profileAnalytics.service";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";

const getProfileScore = catchAsyc(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await ProfileAnalyticsService.getProfileCompleteness(userId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Profile analytics fetched successfully",
    result: result,
  });
});

export const ProfileAnalyticsController = {
  getProfileScore,
};
