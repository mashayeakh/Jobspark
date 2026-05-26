import { Request, Response } from 'express';
import { catchAsyc } from '@/app/shared/catchAsyc';
import { sendResponse } from '@/app/Utils/sendResponse';
import httpStatus from 'http-status';
import { NewsletterService } from './newsletter.service';

export const NewsletterController = {
  subscribe: catchAsyc(async (req: Request, res: Response) => {
    const { email, name } = req.body;
    const result = await NewsletterService.subscribe(email, name);
    sendResponse(res, {
      httpStatusCode: httpStatus.CREATED,
      success: true,
      message: 'Subscribed successfully! Check your email for a welcome message.',
      result,
    });
  }),
};
