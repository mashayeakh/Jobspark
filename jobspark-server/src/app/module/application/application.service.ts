import { prisma } from "../../lib/prisma";
import { ApplyJobDto, UpdateApplicationStatusDto } from "./application.dto";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";
import { ApplicationStatus } from "prisma/generated";

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

    if (job.status !== "ACTIVE") {
      throw new AppError(httpStatus.BAD_REQUEST, "This job is no longer accepting applications.");
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

    // 4. Atomic Transaction: Create application + log + update job counter
    return await prisma.$transaction(async (tx) => {
      const application = await tx.application.create({
        data: {
          jobId,
          seekerId: seekerProfile.id,
          status: ApplicationhttpStatus.PENDING,
        },
      });

      // Create initial audit log
      await tx.applicationStatusLog.create({
        data: {
          applicationId: application.id,
          status: ApplicationhttpStatus.PENDING,
          reason: "Application submitted",
        },
      });

      // Increment job's denormalized application counter
      await tx.job.update({
        where: { id: jobId },
        data: { applicationCount: { increment: 1 } },
      });

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
    });

    if (!application) {
      throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to update this application.");
    }

    return await prisma.$transaction(async (tx) => {
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

      return updatedApplication;
    });
  },
};
