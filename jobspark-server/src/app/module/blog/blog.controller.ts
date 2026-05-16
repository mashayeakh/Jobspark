import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { BlogService } from "./blog.service";

export const BlogController = {
  createBlog: catchAsyc(async (req: Request, res: Response) => {
    const result = await BlogService.createBlog(req.body);
    
    sendResponse(res, {
      httpStatusCode: httpStatus.CREATED,
      success: true,
      message: "Blog created successfully",
      result,
    });
  }),

  getAllBlogs: catchAsyc(async (req: Request, res: Response) => {
    const result = await BlogService.getAllBlogs();
    
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Blogs fetched successfully",
      result,
    });
  }),

  getSingleBlog: catchAsyc(async (req: Request, res: Response) => {
    const result = await BlogService.getSingleBlog(req.params.id);
    
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Blog fetched successfully",
      result,
    });
  }),
};
