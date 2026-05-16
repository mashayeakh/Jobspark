import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { BlogGeneratorService } from "./blogGenerator.service";

export const BlogGeneratorController = {
  generateBlog: catchAsyc(async (req: Request, res: Response) => {
    const { topic } = req.body;
    
    if (!topic) {
      return sendResponse(res, {
        httpStatusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Topic is required for blog generation",
      });
    }

    const result = await BlogGeneratorService.generateBlog(topic);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Blog content generated successfully by AI",
      result,
    });
  }),
};
