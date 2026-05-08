import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { CategoryService } from "./category.service";

const createCategory = catchAsyc(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategory(req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully",
    result,
  });
});

const getAllCategories = catchAsyc(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategories();
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Categories fetched successfully",
    result,
  });
});

const getCategoryById = catchAsyc(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.getCategoryById(id as string);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Category fetched successfully",
    result,
  });
});

const updateCategory = catchAsyc(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.updateCategory(id as string, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully",
    result,
  });
});

const deleteCategory = catchAsyc(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.deleteCategory(id as string);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully",
    result,
  });
});

// SubCategory Controllers
const createSubCategory = catchAsyc(async (req: Request, res: Response) => {
  const result = await CategoryService.createSubCategory(req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "SubCategory created successfully",
    result,
  });
});

const updateSubCategory = catchAsyc(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.updateSubCategory(id as string, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "SubCategory updated successfully",
    result,
  });
});

const deleteSubCategory = catchAsyc(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.deleteSubCategory(id as string);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "SubCategory deleted successfully",
    result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
