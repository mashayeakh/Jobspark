import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { RecruiterService } from "./recruiter.service";

export const RecruiterController = {
  createProfile: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { companyName } = req.body;

    const result = await RecruiterService.createProfile(userId, companyName);

    sendResponse(res, {
      httpStatusCode: httpStatus.CREATED,
      success: true,
      message: "Recruiter profile created successfully",
      result,
    });
  }),

  updateProfile: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await RecruiterService.updateProfile(userId, req.body);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Profile updated successfully",
      result,
    });
  }),

  getMyProfile: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await RecruiterService.getProfile(userId);
    
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Profile fetched successfully",
      result,
    });


  }),

  getDashboard: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await RecruiterService.getDashboard(userId);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Dashboard data fetched successfully",
      result,
    });
  }),

  getAllApplications: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await RecruiterService.getAllApplications(userId);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Applications fetched successfully",
      result,
    });
  }),
};
