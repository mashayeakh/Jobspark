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

export const CompanyController = {
  getAllCompanies,
  getCompanyById
};
