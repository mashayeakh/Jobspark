import { prisma } from "../../lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";
import { ConnectionStatus } from "prisma/generated/prisma/enums";

export const NetworkService = {
  // --- Send a connection request ---
  sendConnectionRequest: async (senderId: string, receiverId: string) => {
    // Prevent self-connection
    if (senderId === receiverId) {
      throw new AppError(httpStatus.BAD_REQUEST, "You cannot connect with yourself.");
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, name: true },
    });

    if (!receiver) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found.");
    }

    // Check for existing connection
    const existing = await prisma.connection.findUnique({
      where: {
        senderId_receiverId: { senderId, receiverId },
      },
    });

    if (existing) {
      throw new AppError(httpStatus.CONFLICT, "Connection request already sent.");
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
        httpStatus.FORBIDDEN,
        "You can only respond to connection requests sent to you."
      );
    }

    if (connection.status !== ConnectionStatus.PENDING) {
      throw new AppError(httpStatus.BAD_REQUEST, "This connection request has already been responded to.");
    }

    return await prisma.connection.update({
      where: { id: connectionId },
      data: { status: newStatus },
    });
  },

  // --- Remove a connection ---
  removeConnection: async (userId: string, connectionId: string) => {
    const connection = await prisma.connection.findFirst({
      where: {
        id: connectionId,
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });

    if (!connection) {
      throw new AppError(httpStatus.NOT_FOUND, "Connection not found or unauthorized.");
    }

    return await prisma.connection.delete({
      where: { id: connectionId },
    });
  },

  // --- Block a user ---
  blockUser: async (userId: string, blockedUserId: string) => {
    if (userId === blockedUserId) {
      throw new AppError(httpStatus.BAD_REQUEST, "You cannot block yourself.");
    }

    // Check if the user to be blocked exists
    const blockedUser = await prisma.user.findUnique({
      where: { id: blockedUserId },
    });
    if (!blockedUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found.");
    }

    // Delete any existing connections between these two users
    await prisma.connection.deleteMany({
      where: {
        OR: [
          { senderId: userId, receiverId: blockedUserId },
          { senderId: blockedUserId, receiverId: userId },
        ],
      },
    });

    // Create a new connection with BLOCKED status, sender is the blocker
    return await prisma.connection.create({
      data: {
        senderId: userId,
        receiverId: blockedUserId,
        status: ConnectionStatus.BLOCKED,
      },
    });
  },

  // --- Unblock a user ---
  unblockUser: async (userId: string, blockedUserId: string) => {
    // Find the block record where sender is the blocker
    const block = await prisma.connection.findFirst({
      where: {
        senderId: userId,
        receiverId: blockedUserId,
        status: ConnectionStatus.BLOCKED,
      },
    });

    if (!block) {
      throw new AppError(httpStatus.NOT_FOUND, "Block record not found.");
    }

    // Delete the block
    return await prisma.connection.delete({
      where: { id: block.id },
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

  // --- Get pending connection requests (both received and sent) ---
  getPendingRequests: async (userId: string) => {
    const received = await prisma.connection.findMany({
      where: {
        receiverId: userId,
        status: ConnectionStatus.PENDING,
      },
      include: {
        sender: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const sent = await prisma.connection.findMany({
      where: {
        senderId: userId,
        status: ConnectionStatus.PENDING,
      },
      include: {
        receiver: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return { received, sent };
  },
  // --- Get all blocked users for the current user ---
  getBlockedUsers: async (userId: string) => {
    return await prisma.connection.findMany({
      where: {
        senderId: userId,
        status: ConnectionStatus.BLOCKED,
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            jobSeekerProfile: {
              select: { headline: true, location: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  getConnectStatus: async (currentUserId: string, targetUserId: string) => {
    const connection = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: currentUserId },
        ],
      },
    });

    if (!connection) {
      return { status: "NONE" };
    }

    return { status: connection.status, senderId: connection.senderId };
  },

  // --- Get recommended users (not connected yet) ---
  getRecommendedUsers: async (userId: string | null) => {
    let connectedUserIds = new Set<string>();

    if (userId) {
      // Fetch user's existing connections
      const connections = await prisma.connection.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      });

      connectedUserIds = new Set(
        connections.map((c) => (c.senderId === userId ? c.receiverId : c.senderId))
      );
      connectedUserIds.add(userId);
    }

    // Fetch users who are not in the connected/pending list
    const recommendedUsers = await prisma.user.findMany({
      where: {
        id: { notIn: Array.from(connectedUserIds) },
        role: "JOB_SEEKER", // Assuming we recommend job seekers, or remove to recommend anyone
      },
      select: {
        id: true,
        name: true,
        image: true,
        jobSeekerProfile: {
          select: { headline: true },
        },
        _count: {
          select: { receivedConnections: true, sentConnections: true },
        },
      },
    });

    return recommendedUsers.map((user) => ({
      id: user.id,
      name: user.name,
      avatar: user.image || "https://github.com/shadcn.png",
      title: user.jobSeekerProfile?.headline || "Member",
      connections: user._count.receivedConnections + user._count.sentConnections,
    }));
  },

  // --- Get public profile of a user ---
  getUserProfile: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        jobSeekerProfile: {
          include: {
            workExperience: true,
            education: true,
          },
        },
        _count: {
          select: { receivedConnections: true, sentConnections: true },
        },
      },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User profile not found.");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.image || "https://github.com/shadcn.png",
      title: user.jobSeekerProfile?.headline || "Member",
      about: user.jobSeekerProfile?.bio || "No bio available.",
      location: user.jobSeekerProfile?.location || "Not specified",
      linkedinUrl: user.jobSeekerProfile?.linkedinUrl,
      websiteUrl: user.jobSeekerProfile?.websiteUrl,
      expertise: user.jobSeekerProfile?.expertise || [],
      interests: user.jobSeekerProfile?.interests || [],
      openToNetworking: user.jobSeekerProfile?.openToNetworking ?? false,
      openToAdvising: user.jobSeekerProfile?.openToAdvising ?? false,
      company: user.jobSeekerProfile?.workExperience?.[0]?.companyName || "Open to work",
      connections: user._count.receivedConnections + user._count.sentConnections,
      experience: user.jobSeekerProfile?.workExperience || [],
      education: user.jobSeekerProfile?.education || [],
    };
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
      throw new AppError(httpStatus.NOT_FOUND, "Notification not found.");
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
