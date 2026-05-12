import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { InterviewService } from './interview.service';
import { catchAsyc } from '@/app/shared/catchAsyc';
import { sendResponse } from '@/app/Utils/sendResponse';

const createInterview = catchAsyc(async (req: Request, res: Response) => {
  const result = await InterviewService.createInterview(req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: 'Interview scheduled successfully',
    result,
  });
});

const getMyInterviews = catchAsyc(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const result = await InterviewService.getRecruiterInterviews(userId, req.query);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: 'Interviews fetched successfully',
    result,
  });
});

const updateInterview = catchAsyc(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await InterviewService.updateInterview(id as string, req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: 'Interview updated successfully',
    result,
  });
});

const cancelInterview = catchAsyc(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const result = await InterviewService.cancelInterview(id as string, reason);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: 'Interview cancelled successfully',
    result,
  });
});

export const InterviewController = {
  createInterview,
  getMyInterviews,
  updateInterview,
  cancelInterview,
};
