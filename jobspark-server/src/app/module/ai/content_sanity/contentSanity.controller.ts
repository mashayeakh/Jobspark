import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { ContentSanityService } from "./contentSanity.service";

export const ContentSanityController = {
  // Analyze a specific job posting
  analyzeJob: catchAsyc(async (req: Request, res: Response) => {
    const { jobId } = req.params;
    
    const result = await ContentSanityService.analyzeJobContent(jobId as string);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Job content analysis completed",
      result,
    });
  }),

  // Batch analyze multiple jobs
  analyzeBatch: catchAsyc(async (req: Request, res: Response) => {
    const { jobIds } = req.body;

    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      return sendResponse(res, {
        httpStatusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Job IDs array is required",
        result: null,
      });
    }

    const results = await ContentSanityService.analyzeBatch(jobIds);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Batch content analysis completed",
      result: Object.fromEntries(results),
    });
  }),

  // Analyze all jobs
  analyzeAllJobs: catchAsyc(async (req: Request, res: Response) => {
    const results = await ContentSanityService.analyzeAllJobs();

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "All jobs content analysis completed",
      result: Object.fromEntries(results),
    });
  }),

  // Get content sanity statistics
  getStats: catchAsyc(async (req: Request, res: Response) => {
    const stats = await ContentSanityService.getStats();

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Content sanity statistics retrieved",
      result: stats,
    });
  }),

  // Get jobs needing review
  getJobsNeedingReview: catchAsyc(async (req: Request, res: Response) => {
    const { limit = 50, offset = 0 } = req.query;

    const jobs = await ContentSanityService.getJobsNeedingReview(
      parseInt(limit as string),
      parseInt(offset as string)
    );

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Jobs needing review retrieved",
      result: jobs,
    });
  }),

  // Apply automated corrections
  applyCorrections: catchAsyc(async (req: Request, res: Response) => {
    const { jobId } = req.params;
    const { corrections } = req.body;

    if (!Array.isArray(corrections)) {
      return sendResponse(res, {
        httpStatusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Corrections array is required",
        result: null,
      });
    }

    const updatedJob = await ContentSanityService.applyCorrections(
      jobId as string,
      corrections
    );

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Corrections applied successfully",
      result: updatedJob,
    });
  }),
};
