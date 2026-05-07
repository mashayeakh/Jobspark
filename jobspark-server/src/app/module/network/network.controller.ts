import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { NetworkService, NotificationService } from "./network.service";

export const NetworkController = {
  sendConnectionRequest: catchAsyc(async (req: Request, res: Response) => {
    const senderId = (req as any).user.userId;
    const { userId: receiverId } = req.params;
    const result = await NetworkService.sendConnectionRequest(senderId, receiverId);

    sendResponse(res, {
      httpStatusCode: httpStatus.CREATED,
      success: true,
      message: "Connection request sent successfully",
      result,
    });
  }),

  acceptConnection: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const result = await NetworkService.updateConnectionStatus(userId, id, "ACCEPTED");

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Connection accepted",
      result,
    });
  }),

  rejectConnection: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const result = await NetworkService.updateConnectionStatus(userId, id, "REJECTED");

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Connection rejected",
      result,
    });
  }),

  getConnections: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await NetworkService.getConnections(userId);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Connections fetched successfully",
      result,
    });
  }),

  getPendingRequests: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await NetworkService.getPendingRequests(userId);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Pending requests fetched successfully",
      result,
    });
  }),
};

export const NotificationController = {
  getNotifications: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await NotificationService.getNotifications(userId);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Notifications fetched successfully",
      result,
    });
  }),

  markAsRead: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const result = await NotificationService.markAsRead(userId, id);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Notification marked as read",
      result,
    });
  }),

  markAllAsRead: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await NotificationService.markAllAsRead(userId);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "All notifications marked as read",
      result,
    });
  }),
};
