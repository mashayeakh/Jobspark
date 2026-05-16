import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { BioGeneratorService } from "./bioGenerator.service";

export const BioGeneratorController = {
  generate: catchAsyc(async (req: Request, res: Response) => {
    const { headline, currentBio, skills } = req.body;
    
    const bios = await BioGeneratorService.generateBios(headline, currentBio, skills);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Bio options generated successfully",
      result: bios,
    });
  }),
};
