import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { AnomalyDetectionService } from "./anomalyDetection.service";

export const AnomalyDetectionController = {
  getStats: catchAsyc(async (req: Request, res: Response) => {
    const stats = await AnomalyDetectionService.getDashboardStats();

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Anomaly detection statistics retrieved",
      result: stats,
    });
  }),

  getAnomalies: catchAsyc(async (req: Request, res: Response) => {
    const anomalies = await AnomalyDetectionService.getRecentAnomalies();

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Recent anomalies retrieved",
      result: anomalies,
    });
  }),

  resolveAnomaly: catchAsyc(async (req: Request, res: Response) => {
    const anomalyId = req.params.anomalyId as string;
    const userId = req.user?.userId;

    const result = await AnomalyDetectionService.resolveAnomaly(anomalyId, userId);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Anomaly resolved successfully",
      result,
    });
  }),

  analyzeTraffic: catchAsyc(async (req: Request, res: Response) => {
    const result = await AnomalyDetectionService.analyzeTrafficSync();

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Traffic analysis triggered",
      result,
    });
  })
};
