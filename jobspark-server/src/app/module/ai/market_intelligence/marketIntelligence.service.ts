import { prisma } from "../../../lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";
import Groq from "groq-sdk";
import { envVars } from "../../../config/env";

// Initialize AI services
const groq = new Groq({ apiKey: envVars.GROQ_API_KEY });

interface TrendData {
  period: string;
  count: number;
  growthRate: number;
}

interface IndustryTrend {
  industry: string;
  currentJobs: number;
  previousPeriodJobs: number;
  growthRate: number;
  trend: 'RISING' | 'STABLE' | 'DECLINING';
  prediction: string;
}

interface MarketSurge {
  category: string;
  currentPeriod: number;
  previousPeriod: number;
  surgePercentage: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  topSkills: string[];
  avgSalary: number;
}

interface DemandForecast {
  skill: string;
  currentDemand: number;
  forecastedDemand: number;
  trend: 'INCREASING' | 'STABLE' | 'DECREASING';
  confidence: number;
  timeframe: string;
}

interface CompetitiveInsight {
  metric: string;
  topCompanies: {
    name: string;
    value: number;
    industry: string;
  }[];
  marketAverage: number;
  insight: string;
}

export const MarketIntelligenceService = {
  // Industry hiring trend predictions
  getIndustryTrends: async (days: number = 90): Promise<{
    trends: IndustryTrend[];
    summary: string;
    overallMarketHealth: 'GROWING' | 'STABLE' | 'DECLINING';
  }> => {
    try {
      const currentDate = new Date();
      const previousDate = new Date(currentDate.getTime() - days * 24 * 60 * 60 * 1000);
      const comparisonDate = new Date(previousDate.getTime() - days * 24 * 60 * 60 * 1000);

      // Get jobs grouped by industry for current and previous periods
      const [currentJobs, previousJobs] = await Promise.all([
        prisma.job.groupBy({
          by: ['companyId'],
          where: {
            createdAt: { gte: previousDate, lte: currentDate },
            status: 'OPEN',
            deletedAt: null,
          },
          _count: { id: true },
        }),
        prisma.job.groupBy({
          by: ['companyId'],
          where: {
            createdAt: { gte: comparisonDate, lte: previousDate },
            status: 'OPEN',
            deletedAt: null,
          },
          _count: { id: true },
        }),
      ]);

      // Get company data for industries
      const companies = await prisma.company.findMany({
        where: {
          id: { in: [...currentJobs.map(j => j.companyId), ...previousJobs.map(j => j.companyId)] },
        },
        select: { id: true, industry: true },
      });

      const companyIndustryMap = new Map(companies.map(c => [c.id, c.industry]));

      // Aggregate by industry
      const industryCurrentMap = new Map<string, number>();
      const industryPreviousMap = new Map<string, number>();

      currentJobs.forEach(job => {
        const industry = companyIndustryMap.get(job.companyId) || 'Unknown';
        industryCurrentMap.set(industry, (industryCurrentMap.get(industry) || 0) + job._count.id);
      });

      previousJobs.forEach(job => {
        const industry = companyIndustryMap.get(job.companyId) || 'Unknown';
        industryPreviousMap.set(industry, (industryPreviousMap.get(industry) || 0) + job._count.id);
      });

      // Calculate trends
      const allIndustries = new Set([...industryCurrentMap.keys(), ...industryPreviousMap.keys()]);
      const trends: IndustryTrend[] = [];

      for (const industry of allIndustries) {
        const current = industryCurrentMap.get(industry) || 0;
        const previous = industryPreviousMap.get(industry) || 0;
        const growthRate = previous > 0 ? ((current - previous) / previous) * 100 : 0;

        let trend: 'RISING' | 'STABLE' | 'DECLINING';
        if (growthRate > 10) trend = 'RISING';
        else if (growthRate < -10) trend = 'DECLINING';
        else trend = 'STABLE';

        trends.push({
          industry,
          currentJobs: current,
          previousPeriodJobs: previous,
          growthRate: Math.round(growthRate * 100) / 100,
          trend,
          prediction: trend === 'RISING' ? 'Expected continued growth' :
            trend === 'DECLINING' ? 'Expected decline' : 'Stable market expected',
        });
      }

      // Determine overall market health
      const avgGrowthRate = trends.length > 0
        ? trends.reduce((sum, t) => sum + t.growthRate, 0) / trends.length
        : 0;

      const overallMarketHealth: 'GROWING' | 'STABLE' | 'DECLINING' =
        avgGrowthRate > 5 ? 'GROWING' : avgGrowthRate < -5 ? 'DECLINING' : 'STABLE';

      // Generate AI-powered summary
      let summary = '';
      try {
        const prompt = `Analyze these industry hiring trends and provide a concise summary:
        ${JSON.stringify(trends.slice(0, 5))}
        
        Return ONLY a brief 2-3 sentence summary of the market trends.`;

        const response = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 150,
          temperature: 0.5,
        });

        summary = response.choices[0]?.message?.content || 'Market analysis complete';
      } catch (error) {
        summary = 'Market analysis complete';
      }

      return {
        trends: trends.sort((a, b) => b.currentJobs - a.currentJobs),
        summary,
        overallMarketHealth,
      };
    } catch (error) {
      console.error('Industry trends analysis error:', error);
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to analyze industry trends");
    }
  },

  // Market surge analysis
  getMarketSurge: async (days: number = 30): Promise<{
    surges: MarketSurge[];
    summary: string;
    totalSurge: number;
  }> => {
    try {
      const currentDate = new Date();
      const previousDate = new Date(currentDate.getTime() - days * 24 * 60 * 60 * 1000);
      const comparisonDate = new Date(previousDate.getTime() - days * 24 * 60 * 60 * 1000);

      // Get jobs by category for both periods
      const [currentJobs, previousJobs] = await Promise.all([
        prisma.job.groupBy({
          by: ['categoryId'],
          where: {
            createdAt: { gte: previousDate, lte: currentDate },
            status: 'OPEN',
            deletedAt: null,
          },
          _count: { id: true },
        }),
        prisma.job.groupBy({
          by: ['categoryId'],
          where: {
            createdAt: { gte: comparisonDate, lte: previousDate },
            status: 'OPEN',
            deletedAt: null,
          },
          _count: { id: true },
        }),
      ]);

      // Get category data
      const categories = await prisma.category.findMany({
        where: { id: { in: [...currentJobs.map(j => j.categoryId!), ...previousJobs.map(j => j.categoryId!)] } },
        select: { id: true, name: true },
      });

      const categoryMap = new Map(categories.map(c => [c.id, c.name]));

      // Calculate surges
      const surges: MarketSurge[] = [];
      const allCategoryIds = new Set([...currentJobs.map(j => j.categoryId!), ...previousJobs.map(j => j.categoryId!)]);

      for (const categoryId of allCategoryIds) {
        if (!categoryId) continue;

        const categoryName = categoryMap.get(categoryId) || 'Unknown';
        const current = currentJobs.find(j => j.categoryId === categoryId)?._count.id || 0;
        const previous = previousJobs.find(j => j.categoryId === categoryId)?._count.id || 0;

        const surgePercentage = previous > 0 ? ((current - previous) / previous) * 100 : 0;

        let severity: 'LOW' | 'MEDIUM' | 'HIGH';
        if (surgePercentage > 50) severity = 'HIGH';
        else if (surgePercentage > 20) severity = 'MEDIUM';
        else severity = 'LOW';

        // Get top skills and avg salary for this category
        const categoryJobs = await prisma.job.findMany({
          where: {
            categoryId,
            status: 'OPEN',
            deletedAt: null,
          },
          include: {
            skills: { include: { skill: true } },
          },
          take: 50,
        });

        const skillCount = new Map<string, number>();
        let totalSalary = 0;
        let salaryCount = 0;

        categoryJobs.forEach(job => {
          job.skills.forEach(js => {
            skillCount.set(js.skill.name, (skillCount.get(js.skill.name) || 0) + 1);
          });
          if (job.salaryMin) {
            totalSalary += job.salaryMin;
            salaryCount++;
          }
        });

        const topSkills = Array.from(skillCount.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([skill]) => skill);

        const avgSalary = salaryCount > 0 ? Math.round(totalSalary / salaryCount) : 0;

        if (severity !== 'LOW' || current > 0) {
          surges.push({
            category: categoryName,
            currentPeriod: current,
            previousPeriod: previous,
            surgePercentage: Math.round(surgePercentage * 100) / 100,
            severity,
            topSkills,
            avgSalary,
          });
        }
      }

      const totalSurge = surges.reduce((sum, s) => sum + s.surgePercentage, 0) / (surges.length || 1);

      return {
        surges: surges.sort((a, b) => b.surgePercentage - a.surgePercentage),
        summary: `${surges.filter(s => s.severity === 'HIGH').length} high-impact surges detected`,
        totalSurge: Math.round(totalSurge * 100) / 100,
      };
    } catch (error) {
      console.error('Market surge analysis error:', error);
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to analyze market surge");
    }
  },

  // Demand forecasting
  getDemandForecast: async (days: number = 60): Promise<{
    forecasts: DemandForecast[];
    summary: string;
    emergingSkills: string[];
  }> => {
    try {
      const currentDate = new Date();
      const pastDate = new Date(currentDate.getTime() - days * 24 * 60 * 60 * 1000);

      // Get all jobs with skills in the period
      const jobs = await prisma.job.findMany({
        where: {
          createdAt: { gte: pastDate },
          status: 'OPEN',
          deletedAt: null,
        },
        include: {
          skills: { include: { skill: true } },
        },
      });

      // Aggregate skill demand
      const skillDemand = new Map<string, number>();
      const skillJobs = new Map<string, number[]>();

      jobs.forEach(job => {
        job.skills.forEach(js => {
          const skillName = js.skill.name;
          skillDemand.set(skillName, (skillDemand.get(skillName) || 0) + 1);

          // Track job dates for trend analysis
          if (!skillJobs.has(skillName)) {
            skillJobs.set(skillName, []);
          }
          skillJobs.get(skillName)!.push(new Date(job.createdAt).getTime());
        });
      });

      // Calculate forecasts
      const forecasts: DemandForecast[] = [];
      const topSkills = Array.from(skillDemand.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);

      for (const [skill, currentDemand] of topSkills) {
        const jobDates = skillJobs.get(skill) || [];

        // Simple trend calculation based on recent vs older jobs
        const midPoint = pastDate.getTime() + (days / 2) * 24 * 60 * 60 * 1000;
        const recentCount = jobDates.filter(d => d > midPoint).length;
        const olderCount = jobDates.filter(d => d <= midPoint).length;

        const trendRate = olderCount > 0 ? ((recentCount - olderCount) / olderCount) * 100 : 0;

        let trend: 'INCREASING' | 'STABLE' | 'DECREASING';
        if (trendRate > 10) trend = 'INCREASING';
        else if (trendRate < -10) trend = 'DECREASING';
        else trend = 'STABLE';

        const forecastedDemand = trend === 'INCREASING'
          ? Math.round(currentDemand * 1.2)
          : trend === 'DECREASING'
            ? Math.round(currentDemand * 0.8)
            : currentDemand;

        const confidence = Math.min(95, 50 + (jobDates.length * 2));

        forecasts.push({
          skill,
          currentDemand,
          forecastedDemand,
          trend,
          confidence,
          timeframe: `${days} days`,
        });
      }

      const emergingSkills = forecasts
        .filter(f => f.trend === 'INCREASING' && f.confidence > 70)
        .slice(0, 5)
        .map(f => f.skill);

      return {
        forecasts: forecasts.sort((a, b) => b.currentDemand - a.currentDemand),
        summary: `${emergingSkills.length} emerging skills identified`,
        emergingSkills,
      };
    } catch (error) {
      console.error('Demand forecasting error:', error);
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to forecast demand");
    }
  },

  // Competitive intelligence
  getCompetitiveIntelligence: async (days: number = 30): Promise<{
    insights: CompetitiveInsight[];
    summary: string;
    topHiringCompanies: string[];
  }> => {
    try {
      const currentDate = new Date();
      const pastDate = new Date(currentDate.getTime() - days * 24 * 60 * 60 * 1000);

      // Get recent jobs with company data
      const jobs = await prisma.job.findMany({
        where: {
          createdAt: { gte: pastDate },
          status: 'OPEN',
          deletedAt: null,
        },
        include: {
          company: true,
        },
      });

      // Analyze by company
      const companyJobCount = new Map<string, { count: number; company: any; totalSalary: number; salaryCount: number }>();

      jobs.forEach(job => {
        const companyId = job.companyId;
        if (!companyJobCount.has(companyId)) {
          companyJobCount.set(companyId, {
            count: 0,
            company: job.company,
            totalSalary: 0,
            salaryCount: 0,
          });
        }
        const data = companyJobCount.get(companyId)!;
        data.count++;
        if (job.salaryMin) {
          data.totalSalary += job.salaryMin;
          data.salaryCount++;
        }
      });

      // Generate insights
      const insights: CompetitiveInsight[] = [];

      // 1. Top hiring companies
      const topHiring = Array.from(companyJobCount.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
        .map(([_, data]) => ({
          name: data.company.name,
          value: data.count,
          industry: data.company.industry,
        }));

      const avgHiring = jobs.length / (companyJobCount.size || 1);

      insights.push({
        metric: 'Job Postings',
        topCompanies: topHiring,
        marketAverage: Math.round(avgHiring * 10) / 10,
        insight: `${topHiring[0]?.name || 'N/A'} leads with ${topHiring[0]?.value || 0} postings`,
      });

      // 2. Salary competitiveness
      const topSalaries = Array.from(companyJobCount.entries())
        .filter(([_, data]) => data.salaryCount > 0)
        .map(([_, data]) => ({
          name: data.company.name,
          value: Math.round(data.totalSalary / data.salaryCount),
          industry: data.company.industry,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

      const allSalaries = jobs.filter(j => j.salaryMin).map(j => j.salaryMin!);
      const avgSalary = allSalaries.length > 0
        ? Math.round(allSalaries.reduce((sum, s) => sum + s, 0) / allSalaries.length)
        : 0;

      insights.push({
        metric: 'Average Salary',
        topCompanies: topSalaries,
        marketAverage: avgSalary,
        insight: `Market average salary is $${avgSalary.toLocaleString()}`,
      });

      // 3. Industry distribution
      const industryCount = new Map<string, number>();
      jobs.forEach(job => {
        const industry = job.company.industry;
        industryCount.set(industry, (industryCount.get(industry) || 0) + 1);
      });

      const topIndustries = Array.from(industryCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([industry, count]) => ({
          name: industry,
          value: count,
          industry: industry,
        }));

      const avgIndustry = jobs.length / (industryCount.size || 1);

      insights.push({
        metric: 'Industry Activity',
        topCompanies: topIndustries,
        marketAverage: Math.round(avgIndustry * 10) / 10,
        insight: `${topIndustries[0]?.name || 'N/A'} is the most active industry`,
      });

      const topHiringCompanyNames = topHiring.slice(0, 5).map(c => c.name);

      return {
        insights,
        summary: `${topHiringCompanyNames.length} top hiring companies identified`,
        topHiringCompanies: topHiringCompanyNames,
      };
    } catch (error) {
      console.error('Competitive intelligence error:', error);
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to generate competitive intelligence");
    }
  },

  // Comprehensive market intelligence dashboard
  getDashboard: async (days: number = 30) => {
    const [industryTrends, marketSurge, demandForecast, competitiveIntelligence] = await Promise.all([
      MarketIntelligenceService.getIndustryTrends(days),
      MarketIntelligenceService.getMarketSurge(days),
      MarketIntelligenceService.getDemandForecast(days),
      MarketIntelligenceService.getCompetitiveIntelligence(days),
    ]);

    return {
      industryTrends,
      marketSurge,
      demandForecast,
      competitiveIntelligence,
      generatedAt: new Date().toISOString(),
      period: `${days} days`,
    };
  },
};
