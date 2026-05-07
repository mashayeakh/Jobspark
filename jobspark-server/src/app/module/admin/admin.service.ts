import { prisma } from "../../lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import status from "http-status";

import { UserStatus } from "prisma/generated";

export const AdminService = {
  // --- Platform Overview / Analytics Dashboard ---
  getPlatformSnapshot: async () => {
    const [
      totalUsers,
      totalJobs,
      totalApplications,
      totalCompanies,
      activeJobs,
      pendingApplications,
      usersByRole,
      recentApplications,
      topJobsByApplications,
    ] = await Promise.all([
      prisma.user.count({ where: { isDeleted: false } }),
      prisma.job.count({ where: { deletedAt: null } }),
      prisma.application.count(),
      prisma.company.count(),
      prisma.job.count({ where: { status: "ACTIVE", deletedAt: null } }),
      prisma.application.count({ where: { status: "PENDING" } }),
      prisma.user.groupBy({
        by: ["role"],
        _count: { role: true },
        where: { isDeleted: false },
      }),
      prisma.application.findMany({
        take: 5,
        orderBy: { appliedAt: "desc" },
        include: {
          seeker: {
            include: { user: { select: { name: true, email: true } } },
          },
          job: { select: { title: true } },
        },
      }),
      prisma.job.findMany({
        take: 5,
        orderBy: { applicationCount: "desc" },
        where: { deletedAt: null },
        select: {
          id: true,
          title: true,
          applicationCount: true,
          viewCount: true,
          status: true,
          company: { select: { name: true } },
        },
      }),
    ]);

    return {
      overview: {
        totalUsers,
        totalJobs,
        totalApplications,
        totalCompanies,
        activeJobs,
        pendingApplications,
      },
      usersByRole: usersByRole.map((r) => ({ role: r.role, count: r._count.role })),
      recentApplications,
      topJobsByApplications,
    };
  },

  getAnalyticsHistory: async (days: number = 30) => {
    return await prisma.platformSnapshot.findMany({
      take: days,
      orderBy: { date: "desc" },
    });
  },

  getAnalyticsLogs: async (limit: number = 100) => {
    return await prisma.analyticsLog.findMany({
      take: limit,
      orderBy: { timestamp: "desc" },
    });
  },

  // --- User Management ---
  getAllUsers: async (filters: { role?: string; status?: string; search?: string }) => {
    const { role, status: userStatus, search } = filters;

    return await prisma.user.findMany({
      where: {
        ...(role ? { role: role as any } : {}),
        ...(userStatus ? { status: userStatus as any } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        // Include profile context for better moderation
        recruiterProfile: {
          select: {
            position: true,
            company: { select: { name: true, industry: true } },
          },
        },
        jobSeekerProfile: {
          select: {
            headline: true,
            isProfileComplete: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // --- Block / Unblock a user ---
  updateUserStatus: async (targetUserId: string, newStatus: UserStatus) => {
    const user = await prisma.user.findUnique({ where: { id: targetUserId } });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found.");
    }

    if (user.role === "ADMIN") {
      throw new AppError(status.FORBIDDEN, "Cannot modify another admin's status.");
    }

    return await prisma.user.update({
      where: { id: targetUserId },
      data: { status: newStatus },
      select: { id: true, name: true, email: true, status: true },
    });
  },

  // --- Soft Delete a user ---
  deleteUser: async (targetUserId: string) => {
    const user = await prisma.user.findUnique({ where: { id: targetUserId } });

    if (!user) throw new AppError(status.NOT_FOUND, "User not found.");
    if (user.role === "ADMIN") throw new AppError(status.FORBIDDEN, "Cannot delete an admin.");

    return await prisma.user.update({
      where: { id: targetUserId },
      data: { isDeleted: true, status: "DELETED" },
    });
  },

  // --- Company Management ---
  getAllCompanies: async () => {
    return await prisma.company.findMany({
      include: {
        _count: {
          select: { recruiters: true, jobs: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  verifyCompany: async (companyId: string, newStatus: boolean) => {
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new AppError(status.NOT_FOUND, "Company not found.");

    return await prisma.company.update({
      where: { id: companyId },
      data: { isVerified: newStatus },
    });
  },

  // --- Job Moderation ---
  getAllJobsForAdmin: async () => {
    return await prisma.job.findMany({
      include: {
        company: { select: { name: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  forceUpdateJobStatus: async (jobId: string, newStatus: string) => {
    return await prisma.job.update({
      where: { id: jobId },
      data: { status: newStatus as any },
    });
  },

  // --- Skill Database Management ---
  getAllSkills: async () => {
    return await prisma.skill.findMany({
      include: {
        _count: {
          select: { candidates: true, jobs: true },
        },
      },
      orderBy: { name: "asc" },
    });
  },

  createSkill: async (name: string) => {
    const existing = await prisma.skill.findUnique({ where: { name } });
    if (existing) throw new AppError(status.CONFLICT, "Skill already exists.");

    return await prisma.skill.create({ data: { name } });
  },

  deleteSkill: async (skillId: string) => {
    return await prisma.skill.delete({ where: { id: skillId } });
  },
};
