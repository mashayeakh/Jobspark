import { Request, Response } from 'express';
import { catchAsyc } from '@/app/shared/catchAsyc';
import { sendResponse } from '@/app/Utils/sendResponse';
import httpStatus from 'http-status';
import { ContactService } from './contact.service';

export const ContactController = {
  sendMessage: catchAsyc(async (req: Request, res: Response) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return sendResponse(res, {
        httpStatusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'All fields (name, email, subject, message) are required.',
        result: null,
      });
    }

    const result = await ContactService.sendContactMessage({ name, email, subject, message });

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: 'Your message has been sent successfully!',
      result,
    });
  }),
};
