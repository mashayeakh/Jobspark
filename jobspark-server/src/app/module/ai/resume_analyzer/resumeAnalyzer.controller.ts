import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { ResumeAnalyzerService } from "./resumeAnalyzer.service";

export const ResumeAnalyzerController = {
  analyze: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { targetRole } = req.body;

    const result = await ResumeAnalyzerService.analyzeResume(userId, targetRole);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Resume analysis completed successfully",
      result,
    });
  }),
};
