import { ApplicationStatus } from "prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ApplyJobDto, UpdateApplicationStatusDto } from "./application.dto";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";
import { sendEmail } from "@/app/Utils/sendEmail";
import { generateMeetLink } from '@/app/Utils/googleCalendar';

export const ApplicationService = {
  // --- SEEKER: Apply for a Job ---
  applyForJob: async (userId: string, payload: ApplyJobDto) => {
    const { jobId } = payload;

    // 1. Get the seeker's profile
    const seekerProfile = await prisma.jobSeekerProfile.findUnique({
      where: { userId },
    });

    if (!seekerProfile) {
      throw new AppError(httpStatus.FORBIDDEN, "Only job seekers can apply for jobs.");
    }

    // 2. Validate the job is ACTIVE
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new AppError(httpStatus.NOT_FOUND, "Job not found.");
    }

    if (job.status !== "OPEN") {
      throw new AppError(httpStatus.BAD_REQUEST, "This job is no longer accepting applications.");
    }

    if (job.vacancy <= 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "No vacancies left for this position.");
    }

    // 3. Check for duplicate application
    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_seekerId: {
          jobId,
          seekerId: seekerProfile.id,
        },
      },
    });

    if (existingApplication) {
      throw new AppError(httpStatus.CONFLICT, "You have already applied for this job.");
    }

    // 4. Atomic Transaction: Create application + log + update job counter & vacancy
    return await prisma.$transaction(async (tx) => {
      const application = await tx.application.create({
        data: {
          jobId,
          seekerId: seekerProfile.id,
          status: ApplicationStatus.PENDING,
        },
      });

      // Create initial audit log
      await tx.applicationStatusLog.create({
        data: {
          applicationId: application.id,
          status: ApplicationStatus.PENDING,
          reason: "Application submitted",
        },
      });

      // Decrement vacancy and increment application count
      const updatedJob = await tx.job.update({
        where: { id: jobId },
        data: {
          applicationCount: { increment: 1 },
          vacancy: { decrement: 1 },
        },
      });

      // Auto-close if vacancy hits 0
      if (updatedJob.vacancy <= 0) {
        await tx.job.update({
          where: { id: jobId },
          data: { status: "CLOSED" },
        });
      }

      return application;
    });
  },

  // --- SEEKER: View my applications ---
  getMyApplications: async (userId: string) => {
    const seekerProfile = await prisma.jobSeekerProfile.findUnique({
      where: { userId },
    });

    if (!seekerProfile) {
      throw new AppError(httpStatus.FORBIDDEN, "Job seeker profile not found.");
    }

    return await prisma.application.findMany({
      where: { seekerId: seekerProfile.id },
      include: {
        job: {
          include: {
            company: {
              select: { name: true, logo: true, location: true },
            },
          },
        },
        logs: {
          orderBy: { changedAt: "desc" },
          take: 1, // Only the latest status
        },
      },
      orderBy: { appliedAt: "desc" },
    });
  },

  checkIfJobApplied: async (userId: string, jobId: string) => {
    const seekerProfile = await prisma.jobSeekerProfile.findUnique({
      where: { userId },
    });

    if (!seekerProfile) {
      throw new AppError(httpStatus.FORBIDDEN, "Job seeker profile not found.");
    }

    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_seekerId: {
          jobId,
          seekerId: seekerProfile.id,
        },
      },
    });

    return Boolean(existingApplication);
  },

  // --- RECRUITER: Get all applicants for a specific job ---
  getApplicantsForJob: async (userId: string, jobId: string) => {
    // Verify recruiter owns this job
    const job = await prisma.job.findFirst({
      where: { id: jobId, recruiter: { userId } },
    });

    if (!job) {
      throw new AppError(httpStatus.FORBIDDEN, "You do not have access to this job's applications.");
    }

    return await prisma.application.findMany({
      where: { jobId },
      include: {
        seeker: {
          include: {
            user: {
              select: { name: true, email: true, image: true },
            },
            skills: {
              include: { skill: true },
            },
          },
        },
        logs: {
          orderBy: { changedAt: "desc" },
        },
      },
      orderBy: { appliedAt: "desc" },
    });
  },

  // --- RECRUITER: Update application status with audit log ---
  updateApplicationStatus: async (
    userId: string,
    applicationId: string,
    payload: UpdateApplicationStatusDto
  ) => {
    const { status: newStatus, reason } = payload;

    // Verify recruiter owns the job this application belongs to
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        job: { recruiter: { userId } },
      },
      include: {
        seeker: {
          include: {
            user: { select: { name: true, email: true } }
          }
        },
        job: {
          include: {
            company: { select: { name: true } }
          }
        }
      }
    });

    if (!application) {
      throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to update this application.");
    }

    // Handle Google Meet link generation before transaction if needed
    let meetingLink = null;
    let scheduledDate = new Date(Date.now() + 86400000); // Default tomorrow

    if (newStatus === ApplicationStatus.INTERVIEWING) {
        const interviewData = payload as any;
        const scheduledAtStr = interviewData.scheduledAt || scheduledDate.toISOString();
        scheduledDate = new Date(scheduledAtStr);

        if (interviewData.type === "VIDEO" || !interviewData.type) {
            console.log(`[Status Update] Generating Meet link for ${application.seeker.user.email}...`);
            meetingLink = await generateMeetLink(`Interview: ${application.job.title}`, scheduledDate);
        }
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update the application status
      const updatedApplication = await tx.application.update({
        where: { id: applicationId },
        data: { status: newStatus },
      });

      // Create audit log entry
      await tx.applicationStatusLog.create({
        data: {
          applicationId,
          status: newStatus,
          reason: reason || null,
        },
      });

      // Create Interview record if status is INTERVIEWING
      if (newStatus === ApplicationStatus.INTERVIEWING) {
        const interviewData = payload as any;
        await tx.interview.create({
            data: {
                applicationId,
                type: (interviewData.type || "VIDEO") as any,
                scheduledAt: scheduledDate,
                duration: 45,
                timezone: "UTC",
                location: interviewData.location || (meetingLink ? "Google Meet" : "Phone Call"),
                meetingLink: meetingLink,
                status: "SCHEDULED",
                notes: reason || "Scheduled via application status update"
            }
        });
      }

      return updatedApplication;
    });

    // ── TRIGGER EMAIL NOTIFICATION ─────────────────────────────────
    const emailTriggerStatuses: ApplicationStatus[] = [
      ApplicationStatus.INTERVIEWING,
      ApplicationStatus.ACCEPTED,
      ApplicationStatus.REJECTED
    ];

    if (emailTriggerStatuses.includes(newStatus)) {
      let templateName = "";
      let subject = "";
      let templateData: any = {
        name: application.seeker.user.name,
        jobTitle: application.job.title,
        companyName: application.job.company.name,
        nextSteps: reason
      };

      if (newStatus === ApplicationStatus.INTERVIEWING) {
        const interviewData = payload as any;
        templateName = "interview_invite";
        subject = `Interview Invitation: ${application.job.title} at ${application.job.company.name}`;
        
        templateData = {
          ...templateData,
          interviewType: interviewData.type || "VIDEO",
          date: scheduledDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          time: scheduledDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          location: interviewData.location || (meetingLink ? "Google Meet" : "Phone Call"),
          meetingLink
        };

      } else if (newStatus === ApplicationStatus.ACCEPTED) {
        templateName = "acceptance";
        subject = `Congratulations! Your application for ${application.job.title} was accepted`;
      } else {
        templateName = "rejection";
        subject = `Update regarding your application for ${application.job.title}`;
      }

      sendEmail({
        to: application.seeker.user.email,
        subject,
        templateName,
        templateData
      }).catch(err => {
        console.error(`[Email Notification] Failed to send ${templateName} email to ${application.seeker.user.email}:`, err);
      });
    }

    return result;
  },
};
