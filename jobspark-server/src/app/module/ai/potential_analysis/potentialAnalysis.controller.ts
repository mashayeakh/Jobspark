import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { PotentialAnalysisService } from "./potentialAnalysis.service";

const analyzeApplication = catchAsyc(async (req: Request, res: Response) => {
  const { applicationId } = req.params;
  const result = await PotentialAnalysisService.analyzeCandidatePotential(applicationId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Candidate potential analyzed successfully",
    result,
  });
});

export const PotentialAnalysisController = {
  analyzeApplication,
};
