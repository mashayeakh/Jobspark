import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { RecommendationService } from "./recommendation.service";

export const RecommendationController = {
  getRecommendedJobs: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await RecommendationService.getRecommendedJobs(userId);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Job recommendations fetched successfully",
      result,
    });
  }),
};
