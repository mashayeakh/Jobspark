import { prisma } from "../../lib/prisma";
import { UpdateRecruiterProfileDto } from "./recruiter.dto";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";

export const RecruiterService = {
  createProfile: async (userId: string, companyName: string) => {
    // First create or get company
    let company = await prisma.company.findFirst({
      where: { name: companyName }
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: companyName,
          industry: "Technology"
        }
      });
    }

    // Then create recruiter profile
    const profile = await prisma.recruiterProfile.create({
      data: {
        userId,
        companyId: company.id,
        name: `${company.name} Recruiter`
      }
    });

    return profile;
  },

  updateProfile: async (userId: string, payload: UpdateRecruiterProfileDto) => {
    const { position, company } = payload;

    const profile = await prisma.recruiterProfile.update({
      where: { userId },
      data: {
        position,
        company: company ? {
          update: company
        } : undefined
      },
      include: {
        company: true
      }
    });
    return profile;
  },

  getProfile: async (userId: string) => {
    const profile = await prisma.recruiterProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        company: true,
        jobs: true,
      },
    });
    return profile;
  },

  getDashboard: async (userId: string) => {
    const recruiter = await prisma.recruiterProfile.findUnique({
      where: { userId },
    });

    if (!recruiter) {
      throw new AppError(httpStatus.NOT_FOUND, "Recruiter profile not found");
    }

    // Get all jobs for this recruiter
    const jobs = await prisma.job.findMany({
      where: { recruiterId: recruiter.id, deletedAt: null },
      include: {
        _count: { select: { applications: true } },
        skills: { include: { skill: true } },
        company: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Get all applications across all jobs with seeker details
    const applications = await prisma.application.findMany({
      where: { job: { recruiterId: recruiter.id } },
      include: {
        job: { select: { title: true } },
        seeker: {
          include: {
            user: { select: { name: true, email: true, image: true } },
            skills: { include: { skill: true } },
            workExperience: { orderBy: { startDate: "desc" }, take: 1 },
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });

    // Compute stats
    const activeJobs = jobs.filter((j) => j.status === "OPEN" || j.status === "ACTIVE").length;
    const totalApplications = applications.length;
    const totalViews = jobs.reduce((sum, j) => sum + j.viewCount, 0);
    const pendingApplications = applications.filter((a) => a.status === "PENDING").length;
    const shortlistedCount = applications.filter((a) => ["SHORTLISTED", "INTERVIEWING", "ACCEPTED"].includes(a.status)).length;
    const interviewingCount = applications.filter((a) => a.status === "INTERVIEWING").length;
    const offeredCount = applications.filter((a) => ["OFFERED", "ACCEPTED"].includes(a.status)).length;
    const rejectedCount = applications.filter((a) => a.status === "REJECTED").length;

    // Pipeline breakdown
    const pipeline = [
      { stage: "Applied", count: applications.filter((a) => ["PENDING", "REVIEWING"].includes(a.status)).length },
      { stage: "Screening", count: shortlistedCount },
      { stage: "Interview", count: applications.filter((a) => ["INTERVIEWING", "OFFERED", "ACCEPTED"].includes(a.status)).length },
      { stage: "Offer", count: offeredCount },
      { stage: "Hired", count: applications.filter((a) => a.status === "ACCEPTED").length },
    ];

    const totalPipeline = pipeline.reduce((sum, s) => sum + s.count, 0);

    // Recent applications (top 5)
    const recentApplications = applications.slice(0, 5).map((a) => {
      const latestWork = a.seeker.workExperience[0];
      const experience = latestWork
        ? `${latestWork.title} at ${latestWork.companyName}`
        : "N/A";
      return {
        id: a.id,
        candidateName: a.seeker.user.name,
        jobTitle: a.job.title,
        status: a.status,
        applied: a.appliedAt,
        experience,
        location: "N/A",
        match: 0,
      };
    });

    // Recent jobs (top 4)
    const recentJobs = jobs.slice(0, 4).map((j) => ({
      id: j.id,
      title: j.title,
      status: j.status,
      applications: j._count.applications,
      views: j.viewCount,
      posted: j.createdAt,
      expires: j.updatedAt,
      type: j.type,
      location: j.location || "Remote",
    }));

    // Monthly activity (May to Sept)
    const monthlyActivity = [];
    const year = 2026;
    const targetMonths = [4, 5, 6, 7, 8]; // May (4) to Sept (8) - 0-indexed
    
    for (const month of targetMonths) {
      const d = new Date(year, month, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);
      
      const monthJobs = jobs.filter(j => j.createdAt >= startOfMonth && j.createdAt <= endOfMonth).length;
      const monthApps = applications.filter(a => a.appliedAt >= startOfMonth && a.appliedAt <= endOfMonth).length;
      
      monthlyActivity.push({
        month: monthName,
        jobs: monthJobs,
        applications: monthApps
      });
    }

    return {
      stats: {
        activeJobs,
        totalApplications,
        totalViews,
        interviewsScheduled: interviewingCount,
        offersMade: offeredCount,
        pendingApplications,
        shortlistedCount,
        rejectedCount,
        timeToHire: 18,
        costPerHire: 4500,
        qualityOfHire: 85,
      },
      pipeline,
      totalPipeline,
      recentJobs,
      recentApplications,
      monthlyActivity,
    };
  },



  getAllApplications: async (userId: string) => {
    const recruiter = await prisma.recruiterProfile.findUnique({
      where: { userId },
    });

    if (!recruiter) {
      throw new AppError(httpStatus.NOT_FOUND, "Recruiter profile not found");
    }

    return await prisma.application.findMany({
      where: { job: { recruiterId: recruiter.id } },
      include: {
        job: { select: { title: true, id: true, location: true } },
        seeker: {
          include: {
            user: { select: { name: true, email: true, image: true } },
            skills: { include: { skill: true } },
            workExperience: { orderBy: { startDate: "desc" } },
          },
        },
        logs: { orderBy: { changedAt: "desc" }, take: 1 },
      },
      orderBy: { appliedAt: "desc" },
    });
  },

  getApplicationById: async (applicationId: string) => {
    return await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: { 
          include: { 
            skills: { include: { skill: true } },
            company: true
          } 
        },
        seeker: {
          include: {
            user: { select: { name: true, email: true, image: true } },
            skills: { include: { skill: true } },
            workExperience: { orderBy: { startDate: "desc" } },
            education: { orderBy: { startDate: "desc" } },
          },
        },
        logs: { orderBy: { changedAt: "desc" } },
        interviews: { orderBy: { scheduledAt: "desc" }, take: 1 },
      },
    });
  },
};
