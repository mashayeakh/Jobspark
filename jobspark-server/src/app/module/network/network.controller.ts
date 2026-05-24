import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { NetworkService, NotificationService } from "./network.service";

export const NetworkController = {
  sendConnectionRequest: catchAsyc(async (req: Request, res: Response) => {
    const senderId = (req as any).user.userId;
    const { userId: receiverId } = req.params;
    const result = await NetworkService.sendConnectionRequest(senderId, receiverId as string);

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
    const result = await NetworkService.updateConnectionStatus(userId, id as string, "ACCEPTED");

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
    const result = await NetworkService.updateConnectionStatus(userId, id as string, "REJECTED");

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Connection rejected",
      result,
    });
  }),

  removeConnection: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const result = await NetworkService.removeConnection(userId, id as string);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Connection removed successfully",
      result,
    });
  }),

  blockUser: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { id: blockedUserId } = req.params;
    const result = await NetworkService.blockUser(userId, blockedUserId as string);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "User blocked successfully",
      result,
    });
  }),

  unblockUser: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { id: blockedUserId } = req.params;
    const result = await NetworkService.unblockUser(userId, blockedUserId as string);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "User unblocked successfully",
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

  getConnectStatus: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { id: targetUserId } = req.params;
    const result = await NetworkService.getConnectStatus(userId, targetUserId as string);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Connection status fetched successfully",
      result,
    });
  }),

  getBlockedUsers: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await NetworkService.getBlockedUsers(userId);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Blocked users fetched successfully",
      result,
    });
  }),

  getRecommendedUsers: catchAsyc(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId || null;
    const result = await NetworkService.getRecommendedUsers(userId);
    console.log("Recommended users count:", result.length);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Recommended users fetched successfully",
      result,
    });
  }),

  getUserProfile: catchAsyc(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await NetworkService.getUserProfile(id as string);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "User profile fetched successfully",
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
    const result = await NotificationService.markAsRead(userId, id as string);

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
