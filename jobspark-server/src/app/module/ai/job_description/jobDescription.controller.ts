import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { JobDescriptionService } from "./jobDescription.service";

export const JobDescriptionController = {
  generate: catchAsyc(async (req: Request, res: Response) => {
    const { role, technologies, experience } = req.body;
    
    const result = await JobDescriptionService.generateDescription(role, technologies, experience);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Job description generated successfully",
      result,
    });
  }),
};
