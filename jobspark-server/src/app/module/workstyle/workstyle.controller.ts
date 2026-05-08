import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { WorkStyleService } from "./workstyle.service";

const getAllWorkStyles = catchAsyc(async (req: Request, res: Response) => {
  const result = await WorkStyleService.getAllWorkStyles();
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "WorkStyles fetched successfully",
    result,
  });
});

const createWorkStyle = catchAsyc(async (req: Request, res: Response) => {
  const result = await WorkStyleService.createWorkStyle(req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "WorkStyle created successfully",
    result,
  });
});

const getJobTypes = catchAsyc(async (req: Request, res: Response) => {
  const result = await WorkStyleService.getJobTypes();
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "JobTypes fetched successfully",
    result,
  });
});

const getExperienceLevels = catchAsyc(async (req: Request, res: Response) => {
  const result = await WorkStyleService.getExperienceLevels();
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Experience levels fetched successfully",
    result,
  });
});

const getLocationTypes = catchAsyc(async (req: Request, res: Response) => {
  const result = await WorkStyleService.getLocationTypes();
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Location types fetched successfully",
    result,
  });
});

export const WorkStyleController = {
  getAllWorkStyles,
  createWorkStyle,
  getJobTypes,
  getExperienceLevels,
  getLocationTypes,
};
