import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { ReviewService } from "./review.service";

export const ReviewController = {
  createReview: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const payload = { ...req.body, authorId: userId };
    const result = await ReviewService.createReview(payload);

    sendResponse(res, {
      httpStatusCode: httpStatus.CREATED,
      success: true,
      message: "Review created successfully",
      result,
    });
  }),

  getAllReviews: catchAsyc(async (req: Request, res: Response) => {
    const result = await ReviewService.getAllReviews();

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Reviews fetched successfully",
      result,
    });
  }),
};
