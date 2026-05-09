import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { FraudDetectionService } from "./fraudDetection.service";
import { prisma } from "@/app/lib/prisma";

export const FraudDetectionController = {
  // Analyze a specific job posting
  analyzeJob: catchAsyc(async (req: Request, res: Response) => {
    const { jobId } = req.params;
    const result = await FraudDetectionService.analyzeJobPost(jobId as string);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Job fraud analysis completed",
      result,
    });
  }),

  // Batch analyze multiple jobs
  analyzeBatch: catchAsyc(async (req: Request, res: Response) => {
    const { jobIds } = req.body;

    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      return sendResponse(res, {
        httpStatusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Job IDs array is required",
        result: null,
      });
    }

    const results = await FraudDetectionService.analyzeBatch(jobIds);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Batch analysis completed",
      result: Object.fromEntries(results),
    });
  }),

  // Get fraud detection statistics
  getStats: catchAsyc(async (req: Request, res: Response) => {
    const stats = await FraudDetectionService.getFraudStats();

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Fraud detection statistics retrieved",
      result: stats,
    });
  }),

  // Get all flagged jobs
  getFlaggedJobs: catchAsyc(async (req: Request, res: Response) => {
    const { limit = 50, offset = 0, riskLevel } = req.query;

    const whereClause: any = {
      fraudStatus: 'FLAGGED',
      deletedAt: null,
    };

    if (riskLevel) {
      whereClause.fraudScore = {
        gte: riskLevel === 'HIGH' ? 60 : riskLevel === 'MEDIUM' ? 40 : 80
      };
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: whereClause,
        include: {
          company: { select: { name: true, isVerified: true } },
          recruiter: {
            include: { user: { select: { name: true, email: true } } }
          },
          _count: { select: { applications: true } }
        },
        orderBy: { fraudFlaggedAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      }),
      prisma.job.count({ where: whereClause })
    ]);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Flagged jobs retrieved",
      result: {
        jobs,
        pagination: {
          total,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          pages: Math.ceil(total / parseInt(limit as string))
        }
      },
    });
  }),

  // Get jobs under review
  getUnderReview: catchAsyc(async (req: Request, res: Response) => {
    const { limit = 50, offset = 0 } = req.query;

    const jobs = await prisma.job.findMany({
      where: {
        fraudStatus: 'UNDER_REVIEW',
        deletedAt: null,
      },
      include: {
        company: { select: { name: true, isVerified: true } },
        recruiter: {
          include: { user: { select: { name: true, email: true } } }
        },
        _count: { select: { applications: true } }
      },
      orderBy: { fraudReviewedAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Jobs under review retrieved",
      result: jobs,
    });
  }),

  // Analyze all jobs
  analyzeAllJobs: catchAsyc(async (req: Request, res: Response) => {
    const results = await FraudDetectionService.analyzeAllJobs();

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "All jobs analyzed successfully",
      result: {
        totalAnalyzed: results.length,
        results
      }
    });
  }),

  // Manual review override
  overrideDetection: catchAsyc(async (req: Request, res: Response) => {
    const { jobId } = req.params;
    const { status, reason } = req.body;

    // Ensure jobId is a string (Express can return string[] in some cases)
    const jobIdString = Array.isArray(jobId) ? jobId[0] : jobId;

    if (!['SAFE', 'FLAGGED'].includes(status)) {
      return sendResponse(res, {
        httpStatusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Invalid status. Must be SAFE or FLAGGED",
        result: null,
      });
    }

    if (!reason || reason.trim().length === 0) {
      return sendResponse(res, {
        httpStatusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Review reason is required",
        result: null,
      });
    }

    await FraudDetectionService.overrideFraudDetection(
      jobIdString,
      status as 'SAFE' | 'FLAGGED',
      reason
    );

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: `Job marked as ${status}`,
      result: null,
    });
  }),

  // Get fraud detection history
  getHistory: catchAsyc(async (req: Request, res: Response) => {
    const { limit = 100, offset = 0, dateFrom, dateTo } = req.query;

    const whereClause: any = {
      deletedAt: null,
      fraudFlaggedAt: { not: null },
    };

    if (dateFrom || dateTo) {
      whereClause.fraudFlaggedAt = {};
      if (dateFrom) whereClause.fraudFlaggedAt.gte = new Date(dateFrom as string);
      if (dateTo) whereClause.fraudFlaggedAt.lte = new Date(dateTo as string);
    }

    const [history, total] = await Promise.all([
      prisma.job.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          fraudScore: true,
          fraudStatus: true,
          fraudFlaggedAt: true,
          fraudReviewedAt: true,
          fraudReviewReason: true,
          company: { select: { name: true } },
          recruiter: {
            include: { user: { select: { name: true } } }
          }
        },
        orderBy: { fraudFlaggedAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      }),
      prisma.job.count({ where: whereClause })
    ]);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Fraud detection history retrieved",
      result: {
        history,
        pagination: {
          total,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          pages: Math.ceil(total / parseInt(limit as string))
        }
      },
    });
  }),

  // Get real-time fraud alerts
  getAlerts: catchAsyc(async (req: Request, res: Response) => {
    const { limit = 20 } = req.query;

    // Get recent high-risk detections
    const alerts = await prisma.job.findMany({
      where: {
        fraudScore: { gte: 70 },
        fraudStatus: 'FLAGGED',
        fraudFlaggedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        },
        deletedAt: null,
      },
      include: {
        company: { select: { name: true, isVerified: true } },
        recruiter: {
          include: { user: { select: { name: true, email: true } } }
        }
      },
      orderBy: { fraudScore: 'desc' },
      take: parseInt(limit as string),
    });

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Fraud alerts retrieved",
      result: alerts,
    });
  }),

  // Trigger manual analysis for a job
  triggerAnalysis: catchAsyc(async (req: Request, res: Response) => {
    const { jobId } = req.params;

    // Force re-analysis by clearing cache first
    const Redis = require('ioredis');
    const { envVars } = await import('../../config/env');
    const redisClient = new Redis(envVars.REDIS_URL);
    await redisClient.del(`fraud_analysis:${jobId}`);

    const result = await FraudDetectionService.analyzeJobPost(jobId as string);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Manual fraud analysis triggered",
      result,
    });
  }),

  // Get fraud detection metrics for dashboard
  getMetrics: catchAsyc(async (req: Request, res: Response) => {
    const { days = 30 } = req.query;

    const dateFrom = new Date(Date.now() - parseInt(days as string) * 24 * 60 * 60 * 1000);

    const [
      totalJobs,
      flaggedJobs,
      avgRiskScore,
      riskDistribution,
      topScamCategories,
      recentTrends
    ] = await Promise.all([
      // Total jobs in period
      prisma.job.count({
        where: {
          createdAt: { gte: dateFrom },
          deletedAt: null,
        }
      }),

      // Flagged jobs in period
      prisma.job.count({
        where: {
          createdAt: { gte: dateFrom },
          fraudStatus: 'FLAGGED',
          deletedAt: null,
        }
      }),

      // Average risk score
      prisma.job.aggregate({
        where: {
          fraudScore: { not: null },
          createdAt: { gte: dateFrom },
          deletedAt: null,
        },
        _avg: { fraudScore: true }
      }),

      // Risk level distribution
      prisma.job.groupBy({
        by: ['fraudStatus'],
        _count: { id: true },
        where: {
          createdAt: { gte: dateFrom },
          deletedAt: null,
        }
      }),

      // Top scam categories (you'd need to implement this in the service)
      [], // Placeholder for scam categories

      // Recent trends (daily counts)
      prisma.$queryRaw`
        SELECT 
          DATE(fraudFlaggedAt) as date,
          COUNT(*) as count
        FROM Job 
        WHERE fraudFlaggedAt >= ${dateFrom}
        AND deletedAt IS NULL
        GROUP BY DATE(fraudFlaggedAt)
        ORDER BY date DESC
        LIMIT 30
      `
    ]);

    const metrics = {
      totalJobs,
      flaggedJobs,
      fraudRate: totalJobs > 0 ? (flaggedJobs / totalJobs * 100).toFixed(2) : 0,
      avgRiskScore: avgRiskScore._avg.fraudScore || 0,
      riskDistribution: riskDistribution.reduce((acc, item) => {
        acc[item.fraudStatus || 'UNKNOWN'] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      topScamCategories, // Would be populated from service
      recentTrends,
      period: `${days} days`
    };

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Fraud detection metrics retrieved",
      result: metrics,
    });
  })
};
