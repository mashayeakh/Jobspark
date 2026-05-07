import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { JobService } from "./job.service";

export const JobController = {
  createJob: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await JobService.createJob(userId, req.body);

    sendResponse(res, {
      httpStatusCode: httpStatus.CREATED,
      success: true,
      message: "Job created successfully",
      result,
    });
  }),

  getAllJobs: catchAsyc(async (req: Request, res: Response) => {
    const result = await JobService.getAllJobs(req.query);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Jobs fetched successfully",
      result,
    });
  }),

  getJobById: catchAsyc(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await JobService.getJobById(id as string);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Job fetched successfully",
      result,
    });
  }),

  updateJob: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const result = await JobService.updateJob(userId, id as string, req.body);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Job updated successfully",
      result,
    });
  }),

  getRecruiterJobs: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await JobService.getRecruiterJobs(userId);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Your jobs fetched successfully",
      result,
    });
  }),
};
