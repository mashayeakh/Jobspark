import { Request, Response } from "express";

import httpStatus from "http-status";
import { CompanyService } from "./company.service";
import { sendResponse } from "@/app/Utils/sendResponse";
import { catchAsyc } from "@/app/shared/catchAsyc";

const getAllCompanies = catchAsyc(async (req: Request, res: Response) => {
  const result = await CompanyService.getAllCompanies();

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Companies retrieved successfully",
    result: result,
  });
});

const getCompanyById = catchAsyc(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CompanyService.getCompanyById(id as string);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Company retrieved successfully",
    result: result,
  });
});

const getPipelineStages = catchAsyc(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CompanyService.getPipelineStages(id as string);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Pipeline stages retrieved successfully",
    result: result,
  });
});

const createPipelineStage = catchAsyc(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CompanyService.createPipelineStage(id as string, req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Pipeline stage created successfully",
    result: result,
  });
});

const updatePipelineStage = catchAsyc(async (req: Request, res: Response) => {
  const { stageId } = req.params;
  const result = await CompanyService.updatePipelineStage(stageId as string, req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Pipeline stage updated successfully",
    result: result,
  });
});

const deletePipelineStage = catchAsyc(async (req: Request, res: Response) => {
  const { stageId } = req.params;
  const result = await CompanyService.deletePipelineStage(stageId as string);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Pipeline stage deleted successfully",
    result: result,
  });
});

const reorderPipelineStages = catchAsyc(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CompanyService.reorderPipelineStages(id as string, req.body.stages);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Pipeline stages reordered successfully",
    result: result,
  });
});

export const CompanyController = {
  getAllCompanies,
  getCompanyById,
  getPipelineStages,
  createPipelineStage,
  updatePipelineStage,
  deletePipelineStage,
  reorderPipelineStages
};
