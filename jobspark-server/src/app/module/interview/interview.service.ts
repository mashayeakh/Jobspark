import { prisma } from '@/app/lib/prisma';
import { InterviewStatus, InterviewType } from '../../../../prisma/generated/prisma/client';
import httpStatus from 'http-status';
import { sendEmail } from '@/app/Utils/sendEmail';
import { generateMeetLink } from '@/app/Utils/googleCalendar';


const createInterview = async (data: any) => {
  // 🚀 AUTOMATICALLY GENERATE GOOGLE MEET LINK
  if (!data.meetingLink && data.type === InterviewType.VIDEO) {
    const job = await prisma.job.findUnique({
      where: { id: data.applicationId ? (await prisma.application.findUnique({ where: { id: data.applicationId } }))?.jobId : undefined },
      select: { title: true }
    });

    console.log(`[Google Meet] Generating link for interview...`);
    const meetLink = await generateMeetLink(
      `Interview: ${job?.title || 'Job Candidate'}`,
      new Date(data.scheduledAt)
    );

    if (meetLink) {
      console.log(`[Google Meet] ✅ Link generated: ${meetLink}`);
      data.meetingLink = meetLink;
    }
  }

  const result = await prisma.interview.create({
    data: {
      ...data,
      interviewers: {
        connect: data.interviewers?.map((id: string) => ({ id })) || [],
      },
    },
    include: {
      application: {
        include: {
          seeker: {
            include: {
              user: { select: { name: true, email: true } },
            },
          },
          job: {
            include: {
              company: { select: { name: true } },
            },
          },
        },
      },
      interviewers: true,
    },
  });

  // ── TRIGGER INTERVIEW INVITATION EMAIL ────────────────────────
  const scheduledDate = new Date(result.scheduledAt);
  
  sendEmail({
    to: result.application.seeker.user.email,
    subject: `Interview Invitation: ${result.application.job.title} at ${result.application.job.company.name}`,
    templateName: 'interview_invite',
    templateData: {
      name: result.application.seeker.user.name,
      jobTitle: result.application.job.title,
      companyName: result.application.job.company.name,
      interviewType: result.type,
      date: scheduledDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: scheduledDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      location: result.location,
      meetingLink: result.meetingLink,
    }
  }).catch(err => {
    console.error(`[Interview Email] Failed to send invite to ${result.application.seeker.user.email}:`, err);
  });

  return result;
};

const getRecruiterInterviews = async (userId: string, filters: any) => {
  const { status, timeframe } = filters;

  const where: any = {
    application: {
      job: {
        recruiter: {
          userId,
        },
      },
    },
  };

  if (status) {
    where.status = status;
  }

  // Handle timeframe (Upcoming vs Completed)
  if (timeframe === 'upcoming') {
    where.scheduledAt = { gte: new Date() };
  } else if (timeframe === 'past') {
    where.scheduledAt = { lt: new Date() };
  }

  const interviews = await prisma.interview.findMany({
    where,
    include: {
      application: {
        include: {
          job: { select: { title: true, location: true } },
          seeker: {
            include: {
              user: { select: { name: true, email: true, image: true } },
            },
          },
        },
      },
      interviewers: true,
    },
    orderBy: { scheduledAt: 'asc' },
  });

  // Calculate stats
  const totalInterviews = await prisma.interview.count({ where });
  const completedInterviews = await prisma.interview.count({
    where: { ...where, status: InterviewStatus.COMPLETED },
  });
  const cancelledInterviews = await prisma.interview.count({
    where: { ...where, status: InterviewStatus.CANCELLED },
  });

  return {
    interviews,
    stats: {
      total: totalInterviews,
      completed: completedInterviews,
      cancelled: cancelledInterviews,
      upcoming: totalInterviews - completedInterviews - cancelledInterviews,
    },
  };
};

const updateInterview = async (id: string, data: any) => {
  const { interviewers, ...updateData } = data;

  const updatePayload: any = { ...updateData };

  if (interviewers) {
    updatePayload.interviewers = {
      set: interviewers.map((id: string) => ({ id })),
    };
  }

  return await prisma.interview.update({
    where: { id },
    data: updatePayload,
    include: {
      interviewers: true,
      application: true,
    },
  });
};

const cancelInterview = async (id: string, reason: string) => {
  return await prisma.interview.update({
    where: { id },
    data: {
      status: InterviewStatus.CANCELLED,
      notes: reason ? `Cancellation reason: ${reason}` : undefined,
    },
  });
};

export const InterviewService = {
  createInterview,
  getRecruiterInterviews,
  updateInterview,
  cancelInterview,
};
