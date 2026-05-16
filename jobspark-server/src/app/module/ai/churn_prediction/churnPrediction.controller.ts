import { Request, Response } from "express";
import httpStatus from "http-status";
import { ChurnPredictionService } from "./churnPrediction.service";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";



const getChurnPredictions = catchAsyc(async (req: Request, res: Response) => {
  const result = await ChurnPredictionService.getChurnPredictions();

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Churn predictions retrieved successfully",
    result,
  });
});

const retrainModel = catchAsyc(async (req: Request, res: Response) => {
  const result = await ChurnPredictionService.retrainModel();

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Model retraining initiated",
    result,
  });
});

export const ChurnPredictionController = {
  getChurnPredictions,
  retrainModel
};
