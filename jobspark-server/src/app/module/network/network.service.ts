import { prisma } from "../../lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import status from "http-status";
import { ConnectionStatus } from "prisma/generated/client";

export const NetworkService = {
  // --- Send a connection request ---
  sendConnectionRequest: async (senderId: string, receiverId: string) => {
    // Prevent self-connection
    if (senderId === receiverId) {
      throw new AppError(status.BAD_REQUEST, "You cannot connect with yourself.");
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, name: true },
    });

    if (!receiver) {
      throw new AppError(status.NOT_FOUND, "User not found.");
    }

    // Check for existing connection
    const existing = await prisma.connection.findUnique({
      where: {
        senderId_receiverId: { senderId, receiverId },
      },
    });

    if (existing) {
      throw new AppError(status.CONFLICT, "Connection request already sent.");
    }

    // Create connection request
    const connection = await prisma.connection.create({
      data: {
        senderId,
        receiverId,
        status: ConnectionStatus.PENDING,
      },
    });

    // Create a notification for the receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "CONNECTION_REQ",
        content: `You have a new connection request.`,
      },
    });

    return connection;
  },

  // --- Accept or Reject a connection request ---
  updateConnectionStatus: async (
    userId: string,
    connectionId: string,
    newStatus: ConnectionStatus
  ) => {
    // Only the RECEIVER can accept/reject
    const connection = await prisma.connection.findFirst({
      where: { id: connectionId, receiverId: userId },
    });

    if (!connection) {
      throw new AppError(
        status.FORBIDDEN,
        "You can only respond to connection requests sent to you."
      );
    }

    if (connection.status !== ConnectionStatus.PENDING) {
      throw new AppError(status.BAD_REQUEST, "This connection request has already been responded to.");
    }

    return await prisma.connection.update({
      where: { id: connectionId },
      data: { status: newStatus },
    });
  },

  // --- Get all accepted connections for the current user ---
  getConnections: async (userId: string) => {
    return await prisma.connection.findMany({
      where: {
        OR: [
          { senderId: userId, status: ConnectionStatus.ACCEPTED },
          { receiverId: userId, status: ConnectionStatus.ACCEPTED },
        ],
      },
      include: {
        sender: { select: { id: true, name: true, email: true, image: true } },
        receiver: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  },

  // --- Get pending connection requests (received) ---
  getPendingRequests: async (userId: string) => {
    return await prisma.connection.findMany({
      where: {
        receiverId: userId,
        status: ConnectionStatus.PENDING,
      },
      include: {
        sender: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};

export const NotificationService = {
  // --- Get all notifications for the current user ---
  getNotifications: async (userId: string) => {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  // --- Mark a single notification as read ---
  markAsRead: async (userId: string, notificationId: string) => {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new AppError(status.NOT_FOUND, "Notification not found.");
    }

    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  },

  // --- Mark ALL notifications as read ---
  markAllAsRead: async (userId: string) => {
    return await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },
};
