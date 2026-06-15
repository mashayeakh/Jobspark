import { prisma } from '@/app/lib/prisma';
import { AppError } from '@/app/errorHelpers/AppError';
import httpStatus from 'http-status';
import { getIo } from '@/socket';

export const CommunicationService = {
  getConversations: async (userId: string) => {
    // Find all conversations where the user is either the seeker or the recruiter via the application
    const seekerProfile = await prisma.jobSeekerProfile.findUnique({ where: { userId } });
    const recruiterProfile = await prisma.recruiterProfile.findUnique({ where: { userId } });

    const whereClause: any = {};
    if (seekerProfile && !recruiterProfile) {
      whereClause.application = { seekerId: seekerProfile.id };
    } else if (recruiterProfile && !seekerProfile) {
      whereClause.application = { job: { companyId: recruiterProfile.companyId } };
    } else {
      whereClause.application = {
        OR: [
          { seekerId: seekerProfile?.id || '' },
          { job: { companyId: recruiterProfile?.companyId || '' } }
        ]
      };
    }

    const conversations = await prisma.conversation.findMany({
      where: whereClause,
      include: {
        application: {
          include: {
            seeker: true,
            job: {
              include: {
                company: true
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return conversations;
  },

  getConversationByApplicationId: async (applicationId: string) => {
    let conversation = await prisma.conversation.findUnique({
      where: { applicationId },
      include: {
        application: { include: { seeker: true, job: { include: { company: true } } } }
      }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { applicationId },
        include: {
          application: { include: { seeker: true, job: { include: { company: true } } } }
        }
      });
    }

    return conversation;
  },

  getMessages: async (conversationId: string) => {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, name: true, image: true, role: true }
        }
      }
    });
  },

  sendMessage: async (senderId: string, conversationId: string, content: string) => {
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content
      },
      include: {
        sender: {
          select: { id: true, name: true, image: true, role: true }
        }
      }
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    try {
      getIo().to(conversationId).emit('new_message', message);
    } catch (e) {
      console.error('Socket.io error emitting message', e);
    }

    return message;
  },

  markMessageAsRead: async (messageId: string) => {
    return prisma.message.update({
      where: { id: messageId },
      data: { isRead: true }
    });
  },

  getEmailThreads: async (applicationId: string) => {
    return prisma.emailThread.findMany({
      where: { applicationId },
      include: {
        emails: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: { id: true, name: true, image: true }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  },

  sendEmail: async (senderId: string, applicationId: string, data: { subject: string, body: string, recipientEmail: string }) => {
    // Check if thread exists
    let thread = await prisma.emailThread.findFirst({
      where: { applicationId, subject: data.subject }
    });

    if (!thread) {
      thread = await prisma.emailThread.create({
        data: {
          applicationId,
          subject: data.subject
        }
      });
    }

    const email = await prisma.emailMessage.create({
      data: {
        threadId: thread.id,
        senderId,
        recipientEmail: data.recipientEmail,
        body: data.body
      }
    });

    await prisma.emailThread.update({
      where: { id: thread.id },
      data: { updatedAt: new Date() }
    });

    // Here you would integrate with Resend, SendGrid, or Nodemailer

    return email;
  }
};
