import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import status from "http-status";
import { RecruiterService } from "./recruiter.service";

export const RecruiterController = {
  updateProfile: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await RecruiterService.updateProfile(userId, req.body);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Profile updated successfully",
      result,
    });
  }),

  getMyProfile: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await RecruiterService.getProfile(userId);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Profile fetched successfully",
      result,
    });
  }),
};
