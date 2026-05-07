import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import status from "http-status";
import { JobSeekerService } from "./jobSeeker.service";

export const JobSeekerController = {
  updateProfile: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await JobSeekerService.updateProfile(userId, req.body);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Profile updated successfully",
      result,
    });
  }),

  getMyProfile: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await JobSeekerService.getProfile(userId);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Profile fetched successfully",
      result,
    });
  }),
};
