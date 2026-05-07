import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { ApplicationService } from "./application.service";

export const ApplicationController = {
  applyForJob: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await ApplicationService.applyForJob(userId, req.body);

    sendResponse(res, {
      httpStatusCode: httpStatus.CREATED,
      success: true,
      message: "Application submitted successfully",
      result,
    });
  }),

  getMyApplications: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await ApplicationService.getMyApplications(userId);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Applications fetched successfully",
      result,
    });
  }),

  getApplicantsForJob: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { jobId } = req.params;
    const result = await ApplicationService.getApplicantsForJob(userId, jobId as string);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Applicants fetched successfully",
      result,
    });
  }),

  updateApplicationStatus: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { applicationId } = req.params;
    const result = await ApplicationService.updateApplicationStatus(userId, applicationId as string, req.body);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Application status updated successfully",
      result,
    });
  }),
};
