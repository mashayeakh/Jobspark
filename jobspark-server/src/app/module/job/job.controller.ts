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

  saveJob: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { jobId } = req.params;
    const result = await JobService.saveJob(userId, jobId as string);

    sendResponse(res, {
      httpStatusCode: httpStatus.CREATED,
      success: true,
      message: "Job saved successfully",
      result,
    });
  }),

  unsaveJob: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { jobId } = req.params;
    const result = await JobService.unsaveJob(userId, jobId as string);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Job unsaved successfully",
      result,
    });
  }),

  getSavedJobs: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await JobService.getSavedJobs(userId);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Saved jobs fetched successfully",
      result,
    });
  }),

  checkIfJobSaved: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { jobId } = req.params;
    const isSaved = await JobService.checkIfJobSaved(userId, jobId as string);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Job save status checked",
      result: { isSaved },
    });
  }),
};
