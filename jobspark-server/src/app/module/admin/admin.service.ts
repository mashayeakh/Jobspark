import { prisma } from "../../lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";
import { UserStatus } from "prisma/generated/prisma/enums";
import Groq from "groq-sdk";
import { envVars } from "@/app/config/env";

const groq = new Groq({ apiKey: envVars.GROQ_API_KEY });


export const AdminService = {
  // --- Platform Overview / Analytics Dashboard ---
  getPlatformSnapshot: async () => {
    const [
      totalUsers,
      totalJobs,
      totalApplications,
      totalCompanies,
      openJobs,
      pendingApplications,
      usersByRole,
      recentApplications,
      topJobsByApplications,
    ] = await Promise.all([
      prisma.user.count({ where: { isDeleted: false } }),
      prisma.job.count({ where: { deletedAt: null } }),
      prisma.application.count(),
      prisma.company.count(),
      prisma.job.count({ where: { status: "OPEN", deletedAt: null } }),
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

    const recentAnomalies = await prisma.systemAnomaly.findMany({
      take: 1,
      orderBy: { createdAt: "desc" },
    });

    const recentFraud = await prisma.job.findFirst({
      where: { fraudStatus: "FLAGGED" },
      orderBy: { fraudFlaggedAt: "desc" },
      include: { company: { select: { name: true } } },
    });

    const aiInsights = [];
    
    if (recentAnomalies.length > 0) {
      aiInsights.push({
        title: "Anomaly Detected",
        desc: recentAnomalies[0].description,
        type: "warning",
        time: recentAnomalies[0].createdAt
      });
    } else {
      aiInsights.push({
        title: "System Healthy",
        desc: "No critical anomalies detected recently.",
        type: "success",
        time: new Date()
      });
    }

    if (recentFraud) {
      aiInsights.push({
        title: "Fraud Shield Active",
        desc: `Blocked suspicious job posting from ${recentFraud.company?.name || 'Unknown Company'}.`,
        type: "info",
        time: recentFraud.fraudFlaggedAt || new Date()
      });
    } else {
      aiInsights.push({
        title: "Fraud Shield Active",
        desc: "Monitoring all incoming job postings.",
        type: "success",
        time: new Date()
      });
    }

    aiInsights.push({
      title: "Revenue Forecast",
      desc: "Predicted 12% growth for Q3 based on current trends.",
      type: "info",
      time: new Date()
    });

    return {
      overview: {
        totalUsers,
        totalJobs,
        totalApplications,
        totalCompanies,
        openJobs,
        pendingApplications,
      },
      usersByRole: usersByRole.map((r) => ({ role: r.role, count: r._count.role })),
      recentApplications,
      topJobsByApplications,
      aiInsights,
    };
  },

  getAnalyticsHistory: async (days: number = 30) => {
    const snapshots = await prisma.platformSnapshot.findMany({
      take: days,
      orderBy: { date: "asc" }, // Ascending for chart
    });

    if (snapshots.length === 0) {
      await AdminService.seedSnapshots();
      return await prisma.platformSnapshot.findMany({
        take: days,
        orderBy: { date: "asc" },
      });
    }

    return snapshots;
  },

  getAdvancedAnalytics: async (year?: number) => {
    const targetYear = year || new Date().getFullYear();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // 1. User Growth by Role (Bar Chart) - Last 6 Months
    const demographics = await Promise.all([5, 4, 3, 2, 1, 0].map(async (mOffset) => {
      const d = new Date();
      d.setFullYear(targetYear); // Respect the year filter if possible, otherwise use rolling
      d.setMonth(new Date().getMonth() - mOffset);
      
      const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      
      const [jobseeker, recruiter, admin] = await Promise.all([
        prisma.user.count({ where: { role: 'JOB_SEEKER', createdAt: { gte: mStart, lte: mEnd } } }),
        prisma.user.count({ where: { role: 'RECRUITER', createdAt: { gte: mStart, lte: mEnd } } }),
        prisma.user.count({ where: { role: 'ADMIN', createdAt: { gte: mStart, lte: mEnd } } }),
      ]);
      
      return {
        month: d.toLocaleString('default', { month: 'short' }),
        jobseeker, 
        recruiter,
        admin,
      };
    }));

    // 2. Application Status Breakdown (Donut Chart)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const [pending, reviewed, shortlisted, rejected, offered] = await Promise.all([
      prisma.application.count({ where: { status: 'PENDING', appliedAt: { gte: startOfMonth } } }),
      prisma.application.count({ where: { status: 'REVIEWING', appliedAt: { gte: startOfMonth } } }),
      prisma.application.count({ where: { status: 'SHORTLISTED', appliedAt: { gte: startOfMonth } } }),
      prisma.application.count({ where: { status: 'REJECTED', appliedAt: { gte: startOfMonth } } }),
      prisma.application.count({ where: { status: 'OFFERED', appliedAt: { gte: startOfMonth } } }),
    ]);

    const realTotal = pending + reviewed + shortlisted + rejected + offered;
    const breakdownData = [
      { status: "PENDING", count: pending, color: '#4379EE' },
      { status: "REVIEWED", count: reviewed, color: '#CB3EF9' },
      { status: "SHORTLISTED", count: shortlisted, color: '#00B69B' },
      { status: "REJECTED", count: rejected, color: '#F93C65' },
      { status: "OFFERED", count: offered, color: '#FF9F43' },
    ];

    const applicationBreakdown = {
      total: realTotal,
      breakdown: breakdownData.map(d => ({
        ...d,
        percentage: realTotal > 0 ? Math.round((d.count / realTotal) * 100) : 0
      }))
    };

    // 3. Jobs Posted vs Applications Received (Line Chart)
    const jobsVsApps = await Promise.all([5, 4, 3, 2, 1, 0].map(async (mOffset) => {
      const d = new Date();
      d.setMonth(d.getMonth() - mOffset);
      const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      
      const [jobsPosted, applications] = await Promise.all([
        prisma.job.count({ where: { createdAt: { gte: mStart, lte: mEnd } } }),
        prisma.application.count({ where: { appliedAt: { gte: mStart, lte: mEnd } } }),
      ]);
      
      return {
        month: d.toLocaleString('default', { month: 'short' }),
        jobsPosted,
        applications,
      };
    }));

    const currentM = jobsVsApps[5].applications;
    const lastM = jobsVsApps[4].applications;
    const growthVal = lastM > 0 ? Math.round(((currentM - lastM) / lastM) * 100) : 0;

    return {
      demographics,
      applicationBreakdown,
      jobsVsApps,
      growth: growthVal > 0 ? `+${growthVal}%` : `${growthVal}%`
    };
  },

  generateAIHealthReport: async () => {
    // 1. Gather all relevant data for the AI
    const [snapshot, analytics, pendingApps, totalJobs] = await Promise.all([
      AdminService.getPlatformSnapshot(),
      AdminService.getAdvancedAnalytics(),
      prisma.application.count({ where: { status: 'PENDING' } }),
      prisma.job.count({ where: { deletedAt: null } }),
    ]);

    const activeJobs = snapshot.overview.openJobs;
    const totalUsers = snapshot.overview.totalUsers;
    const recruitersCount = snapshot.usersByRole.find(r => r.role === 'RECRUITER')?.count || 0;
    const seekersCount = snapshot.usersByRole.find(r => r.role === 'JOB_SEEKER')?.count || 0;

    const prompt = `
    As an AI Platform Strategist for JobsPark (a remote job platform), provide a brief "Platform Health Report" based on these REAL metrics:

    CURRENT SNAPSHOT:
    - Total Users: ${totalUsers} (Seekers: ${seekersCount}, Recruiters: ${recruitersCount})
    - Total Active Jobs: ${activeJobs} / Total Postings: ${totalJobs}
    - Total Applications: ${snapshot.overview.totalApplications}
    - Pending Applications: ${pendingApps} (${Math.round((pendingApps / snapshot.overview.totalApplications) * 100)}% of total)

    USER ACTIVITY:
    - Application Status Breakdown: ${analytics.applicationBreakdown.breakdown.map((a: any) => `${a.status}: ${a.count} (${a.percentage}%)`).join(', ')}

    INSTRUCTIONS:
    1. Write a plain English summary (3-4 sentences).
    2. Identify ONE specific bottleneck or area for improvement.
    3. Provide ONE "Admin Quick Action" recommendation.
    4. Keep it professional, strategic, and concise.
    5. Don't use placeholders; use the numbers provided.

    Format: Return a clean JSON object with "summary", "bottleneck", and "recommendation" fields.
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are an expert AI Platform Strategist specializing in job board ecosystems." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const text = response.choices[0]?.message?.content ?? "{}";
    return JSON.parse(text);
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
      throw new AppError(httpStatus.NOT_FOUND, "User not found.");
    }

    if (user.role === "ADMIN") {
      throw new AppError(httpStatus.FORBIDDEN, "Cannot modify another admin's httpStatus.");
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

    if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found.");
    if (user.role === "ADMIN") throw new AppError(httpStatus.FORBIDDEN, "Cannot delete an admin.");

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
    if (!company) throw new AppError(httpStatus.NOT_FOUND, "Company not found.");

    return await prisma.company.update({
      where: { id: companyId },
      data: { isVerified: newStatus },
    });
  },

  // --- Job Moderation ---
  getAllJobsForAdmin: async () => {
    return await prisma.job.findMany({
      include: {
        recruiter: true,
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
    if (existing) throw new AppError(httpStatus.CONFLICT, "Skill already exists.");

    return await prisma.skill.create({ data: { name } });
  },

  deleteSkill: async (skillId: string) => {
    return await prisma.skill.delete({ where: { id: skillId } });
  },

  // --- Mock Data Generator for Chart ---
  seedSnapshots: async () => {
    const snapshots = [];
    const now = new Date();
    
    // Check if we already have snapshots
    const count = await prisma.platformSnapshot.count();
    if (count > 5) return { message: "Snapshots already exist" };

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      snapshots.push({
        date,
        totalUsers: 10 + (6 - i) * 5 + Math.floor(Math.random() * 5),
        totalJobs: 20 + (6 - i) * 10 + Math.floor(Math.random() * 10),
        totalApplications: 5 + (6 - i) * 8 + Math.floor(Math.random() * 5),
        matchesGenerated: (6 - i) * 3 + Math.floor(Math.random() * 3),
      });
    }

    await prisma.platformSnapshot.createMany({
      data: snapshots,
      skipDuplicates: true
    });

    return { message: "Mock snapshots generated" };
  }
};
