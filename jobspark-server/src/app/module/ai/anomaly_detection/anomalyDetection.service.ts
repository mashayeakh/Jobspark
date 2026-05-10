import { prisma } from "../../../lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";

export const AnomalyDetectionService = {
  getDashboardStats: async () => {
    const totalAnomalies = await prisma.systemAnomaly.count();
    const openAnomalies = await prisma.systemAnomaly.count({ where: { status: 'OPEN' } });
    const criticalAnomalies = await prisma.systemAnomaly.count({ where: { severity: 'CRITICAL', status: 'OPEN' } });

    // Mock network metrics if none exist, or get real ones
    let avgLatency = 45; // ms
    let errorRate = 0.2; // %

    const latestLatency = await prisma.systemMetric.findFirst({
      where: { name: 'API_LATENCY' },
      orderBy: { timestamp: 'desc' }
    });
    if (latestLatency) avgLatency = latestLatency.value;

    const latestErrorRate = await prisma.systemMetric.findFirst({
      where: { name: 'ERROR_RATE' },
      orderBy: { timestamp: 'desc' }
    });
    if (latestErrorRate) errorRate = latestErrorRate.value;

    return {
      activeAnomalies: openAnomalies,
      criticalThreats: criticalAnomalies,
      networkLatency: `${avgLatency}ms`,
      systemHealth: errorRate > 5 ? 'Poor' : (errorRate > 1 ? 'Fair' : 'Optimal')
    };
  },

  getRecentAnomalies: async () => {
    return await prisma.systemAnomaly.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  },

  resolveAnomaly: async (id: string, userId?: string) => {
    const anomaly = await prisma.systemAnomaly.findUnique({ where: { id } });
    if (!anomaly) {
      throw new AppError(httpStatus.NOT_FOUND, "Anomaly not found");
    }

    return await prisma.systemAnomaly.update({
      where: { id },
      data: { status: 'RESOLVED' }
    });
  },

  analyzeTrafficSync: async () => {
    // Generate some mock metrics for the dashboard
    await prisma.systemMetric.createMany({
      data: [
        { name: 'API_LATENCY', value: Math.floor(Math.random() * (120 - 20 + 1) + 20), unit: 'ms' },
        { name: 'ERROR_RATE', value: parseFloat((Math.random() * 2.5).toFixed(2)), unit: '%' }
      ]
    });

    // Generate some mock anomalies periodically for demonstration
    const random = Math.random();
    if (random > 0.6) { // Increased probability to see more data
      await prisma.systemAnomaly.create({
        data: {
          type: 'TRAFFIC_SPIKE',
          severity: 'MEDIUM',
          description: 'Unusual spike in login requests detected from multiple IPs.',
          source: 'AUTH_SERVICE',
          metrics: { requestCount: Math.floor(Math.random() * 5000) + 1000, timeframe: '5m' }
        }
      });
    }

    if (random > 0.8) { // Increased probability
      await prisma.systemAnomaly.create({
        data: {
          type: 'SECURITY_THREAT',
          severity: 'CRITICAL',
          description: 'Multiple failed login attempts indicative of a brute force attack.',
          source: 'API_GATEWAY',
          metrics: { failedAttempts: Math.floor(Math.random() * 300) + 50, targetUser: 'admin@jobspark.com' }
        }
      });
    }

    return { success: true, message: 'Traffic analysis completed' };
  }
};
