import { Request, Response } from 'express';
import { CommunicationService } from './communication.service';
import httpStatus from 'http-status';
import { catchAsyc } from '@/app/shared/catchAsyc';
import { sendResponse } from '@/app/Utils/sendResponse';

export const CommunicationController = {
  getConversations: catchAsyc(async (req: Request, res: Response) => {
    const result = await CommunicationService.getConversations(req.user.userId);
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: 'Conversations fetched successfully',
      result: result,
    });
  }),

  getConversationByApplicationId: catchAsyc(async (req: Request, res: Response) => {
    const result = await CommunicationService.getConversationByApplicationId(req.params.applicationId as string);
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: 'Conversation fetched successfully',
      result: result,
    });
  }),

  getMessages: catchAsyc(async (req: Request, res: Response) => {
    const result = await CommunicationService.getMessages(req.params.conversationId as string);
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: 'Messages fetched successfully',
      result: result,
    });
  }),

  sendMessage: catchAsyc(async (req: Request, res: Response) => {
    const result = await CommunicationService.sendMessage(req.user.userId, req.params.conversationId as string, req.body.content as string);
    sendResponse(res, {
      httpStatusCode: httpStatus.CREATED,
      success: true,
      message: 'Message sent successfully',
      result: result,
    });
  }),

  markMessageAsRead: catchAsyc(async (req: Request, res: Response) => {
    const result = await CommunicationService.markMessageAsRead(req.params.messageId as string);
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: 'Message marked as read',
      result: result,
    });
  }),

  getEmailThreads: catchAsyc(async (req: Request, res: Response) => {
    const result = await CommunicationService.getEmailThreads(req.params.applicationId as string);
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: 'Email threads fetched successfully',
      result: result,
    });
  }),

  sendEmail: catchAsyc(async (req: Request, res: Response) => {
    const result = await CommunicationService.sendEmail(req.user.userId, req.params.applicationId as string, req.body);
    sendResponse(res, {
      httpStatusCode: httpStatus.CREATED,
      success: true,
      message: 'Email sent successfully',
      result: result,
    });
  })
};
