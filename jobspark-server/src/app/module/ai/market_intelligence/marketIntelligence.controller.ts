import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { MarketIntelligenceService } from "./marketIntelligence.service";

export const MarketIntelligenceController = {
  // Get industry hiring trends
  getIndustryTrends: catchAsyc(async (req: Request, res: Response) => {
    const { days = 90 } = req.query;
    
    const result = await MarketIntelligenceService.getIndustryTrends(
      parseInt(days as string)
    );

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Industry hiring trends retrieved",
      result,
    });
  }),

  // Get market surge analysis
  getMarketSurge: catchAsyc(async (req: Request, res: Response) => {
    const { days = 30 } = req.query;
    
    const result = await MarketIntelligenceService.getMarketSurge(
      parseInt(days as string)
    );

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Market surge analysis retrieved",
      result,
    });
  }),

  // Get demand forecasting
  getDemandForecast: catchAsyc(async (req: Request, res: Response) => {
    const { days = 60 } = req.query;
    
    const result = await MarketIntelligenceService.getDemandForecast(
      parseInt(days as string)
    );

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Demand forecasting retrieved",
      result,
    });
  }),

  // Get competitive intelligence
  getCompetitiveIntelligence: catchAsyc(async (req: Request, res: Response) => {
    const { days = 30 } = req.query;
    
    const result = await MarketIntelligenceService.getCompetitiveIntelligence(
      parseInt(days as string)
    );

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Competitive intelligence retrieved",
      result,
    });
  }),

  // Get comprehensive dashboard
  getDashboard: catchAsyc(async (req: Request, res: Response) => {
    const { days = 30 } = req.query;
    
    const result = await MarketIntelligenceService.getDashboard(
      parseInt(days as string)
    );

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Market intelligence dashboard retrieved",
      result,
    });
  }),
};
