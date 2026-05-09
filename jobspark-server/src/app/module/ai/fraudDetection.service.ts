import { prisma } from "../../lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";
import { GoogleGenerativeAI } from "@google/generative-ai";
import natural from "natural";
import compromise from "compromise";
import Redis from "ioredis";
import { envVars } from "../../config/env";

// Initialize AI services
const genAI = new GoogleGenerativeAI(envVars.GEMINI_API_KEY);

// Redis disabled for development to prevent blocking
let redis: Redis | null = null;

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// Scam pattern keywords and weights
const SCAM_PATTERNS = {
  payment_request: {
    keywords: ['pay', 'payment', 'fee', 'cost', 'charge', 'money', 'invest', 'deposit'],
    weight: 0.3,
    description: 'Payment requests'
  },
  urgent_language: {
    keywords: ['urgent', 'immediate', 'act now', 'limited time', 'don\'t miss', 'hurry'],
    weight: 0.2,
    description: 'Urgent language'
  },
  suspicious_contact: {
    keywords: ['gmail.com', 'yahoo.com', 'hotmail.com', 'personal email', 'direct contact'],
    weight: 0.15,
    description: 'Suspicious contact methods'
  },
  vague_description: {
    keywords: ['exciting opportunity', 'great team', 'amazing culture', 'fast growing'],
    weight: 0.1,
    description: 'Vague descriptions'
  },
  unrealistic_benefits: {
    keywords: ['work from home', 'flexible hours', 'unlimited vacation', 'high salary', 'quick money'],
    weight: 0.15,
    description: 'Unrealistic benefits'
  },
  ghost_job_indicators: {
    keywords: ['always hiring', 'multiple positions', 'ongoing recruitment', 'evergreen'],
    weight: 0.1,
    description: 'Ghost job indicators'
  }
};

interface FraudAnalysisResult {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  flaggedIssues: string[];
  scamIndicators: {
    category: string;
    confidence: number;
    evidence: string[];
  }[];
  ghostJobRisk: number;
  recommendation: string;
}

export const FraudDetectionService = {
  // Real-time job posting analysis
  analyzeJobPost: async (jobId: string): Promise<FraudAnalysisResult> => {
    try {
      // Check cache first (disabled for development)
      const cacheKey = `fraud_analysis:${jobId}`;
      if (redis) {
        const cached = await (redis as Redis).get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
      }

      // Get job data
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
          company: true,
          recruiter: {
            include: { user: true }
          }
        }
      });

      if (!job) {
        throw new AppError(httpStatus.NOT_FOUND, "Job not found");
      }

      // Initialize analysis result
      const result: FraudAnalysisResult = {
        riskScore: 0,
        riskLevel: 'LOW',
        flaggedIssues: [],
        scamIndicators: [],
        ghostJobRisk: 0,
        recommendation: ''
      };

      // 1. Pattern-based analysis
      const patternAnalysis = await analyzePatterns(job);
      result.riskScore += patternAnalysis.score;
      result.flaggedIssues.push(...patternAnalysis.issues);
      result.scamIndicators.push(...patternAnalysis.indicators);

      // 2. Gemini AI analysis (with error handling)
      let aiAnalysis;
      try {
        aiAnalysis = await analyzeWithGemini(job);
        result.riskScore += aiAnalysis.score;
        result.flaggedIssues.push(...aiAnalysis.issues);
        result.scamIndicators.push(...aiAnalysis.indicators);
      } catch (error) {
        console.error('AI analysis failed, continuing with pattern analysis:', error);
        // Continue with pattern analysis only
        aiAnalysis = { score: 0, issues: [], indicators: [] };
      }

      // 3. Ghost job detection (with error handling)
      try {
        const ghostAnalysis = await detectGhostJobs(job);
        result.ghostJobRisk = ghostAnalysis.risk;
        result.riskScore += ghostAnalysis.risk * 0.3;
      } catch (error) {
        console.error('Ghost job analysis failed:', error);
      }

      // 4. Company verification analysis (with error handling)
      try {
        const companyAnalysis = await analyzeCompany(job.company);
        result.riskScore += companyAnalysis.risk;
        result.flaggedIssues.push(...companyAnalysis.issues);
      } catch (error) {
        console.error('Company analysis failed:', error);
      }

      // Cap risk score at 100
      result.riskScore = Math.min(result.riskScore, 100);

      // Determine risk level
      result.riskLevel = determineRiskLevel(result.riskScore);

      // Generate recommendation
      result.recommendation = generateRecommendation(result);

      // Cache for 1 hour
      if (redis) {
        await (redis as Redis).setex(cacheKey, 3600, JSON.stringify(result));
      }

      // Auto-flag if medium, high, or critical risk
      if (result.riskLevel === 'MEDIUM' || result.riskLevel === 'HIGH' || result.riskLevel === 'CRITICAL') {
        await autoFlagJob(jobId, result);
      }

      return result;
    } catch (error) {
      console.error('Fraud analysis error:', error);
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Fraud analysis failed");
    }
  },

  // Batch analysis for multiple jobs
  analyzeBatch: async (jobIds: string[]): Promise<Map<string, FraudAnalysisResult>> => {
    const results = new Map<string, FraudAnalysisResult>();

    for (const jobId of jobIds) {
      try {
        const result = await FraudDetectionService.analyzeJobPost(jobId);
        results.set(jobId, result);
      } catch (error) {
        console.error(`Failed to analyze job ${jobId}:`, error);
      }
    }

    return results;
  },

  // Get fraud detection statistics
  getFraudStats: async () => {
    const stats = await prisma.job.groupBy({
      by: ['fraudStatus'],
      _count: { id: true },
      where: {
        deletedAt: null
      }
    });

    const totalJobs = await prisma.job.count({ where: { deletedAt: null } });

    const flaggedJobs = stats.find(s => s.fraudStatus === 'FLAGGED')?._count?.id ?? 0;
    const safeJobs = stats.find(s => s.fraudStatus === 'SAFE')?._count?.id ?? 0;
    const nullStatusJobs = stats.find(s => s.fraudStatus === null)?._count?.id ?? 0;

    return {
      totalJobs,
      flaggedJobs,
      safeJobs: safeJobs + nullStatusJobs, // Count unanalyzed jobs as safe
      underReview: stats.find(s => s.fraudStatus === 'UNDER_REVIEW')?._count?.id ?? 0,
      avgRiskScore: await getAverageRiskScore(),
      recentDetections: await getRecentDetections()
    };
  },

  // Analyze all existing jobs
  analyzeAllJobs: async () => {
    const jobs = await prisma.job.findMany({
      where: { deletedAt: null },
      select: { id: true }
    });

    const results = [];
    for (const job of jobs) {
      try {
        const result = await FraudDetectionService.analyzeJobPost(job.id);
        results.push({ jobId: job.id, ...result });
      } catch (error) {
        console.error(`Failed to analyze job ${job.id}:`, error);
      }
    }

    return results;
  },

  // Manual review override
  overrideFraudDetection: async (jobId: string, status: 'SAFE' | 'FLAGGED', reason: string) => {
    await prisma.job.update({
      where: { id: jobId },
      data: {
        fraudStatus: status,
        fraudReviewReason: reason,
        fraudReviewedAt: new Date(),
        fraudReviewedBy: 'ADMIN'
      }
    });

    // Clear cache
    if (redis !== null) {
      await (redis as Redis).del(`fraud_analysis:${jobId}`);
    }
  }
};

// Helper functions
async function analyzePatterns(job: any) {
  const text = `${job.title} ${job.description} ${job.requirements}`.toLowerCase();
  const tokens = tokenizer.tokenize(text);

  let score = 0;
  const issues: string[] = [];
  const indicators: any[] = [];

  for (const [category, pattern] of Object.entries(SCAM_PATTERNS)) {
    const matches = pattern.keywords.filter(keyword => text.includes(keyword.toLowerCase()));

    if (matches.length > 0) {
      const categoryScore = (matches.length / pattern.keywords.length) * pattern.weight * 100;
      score += categoryScore;

      indicators.push({
        category: pattern.description,
        confidence: Math.min(categoryScore * 2, 100),
        evidence: matches
      });

      if (categoryScore > 15) {
        issues.push(`Suspicious ${pattern.description.toLowerCase()} detected: ${matches.join(', ')}`);
      }
    }
  }

  return { score, issues, indicators };
}

async function analyzeWithGemini(job: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze this job posting for potential fraud indicators:
    
    Title: ${job.title}
    Description: ${job.description}
    Requirements: ${job.requirements}
    Company: ${job.company?.name}
    
    Look for:
    1. Vague or generic descriptions
    2. Unusual payment requests
    3. Suspicious contact information
    4. Unrealistic promises
    5. Grammar and spelling issues
    6. Inconsistent information
    
    Return a JSON response with:
    {
      "riskScore": 0-100,
      "issues": ["issue1", "issue2"],
      "indicators": [{"category": "type", "confidence": 0-100, "evidence": ["text1"]}]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse the response (you might need to add better parsing)
    const analysis = JSON.parse(response.replace(/```json\n?|\n?```/g, ''));

    return {
      score: analysis.riskScore || 0,
      issues: analysis.issues || [],
      indicators: analysis.indicators || []
    };
  } catch (error) {
    console.error('Gemini analysis failed:', error);
    return { score: 0, issues: [], indicators: [] };
  }
}

async function detectGhostJobs(job: any) {
  let risk = 0;

  // Check for ghost job indicators
  const ghostIndicators = [
    job.createdAt && (Date.now() - new Date(job.createdAt).getTime()) > 90 * 24 * 60 * 60 * 1000, // Posted > 90 days ago
    job.applicationCount === 0 && job.createdAt && (Date.now() - new Date(job.createdAt).getTime()) > 30 * 24 * 60 * 60 * 1000, // No applications in 30 days
    job.description.toLowerCase().includes('always hiring'),
    job.description.toLowerCase().includes('multiple positions'),
    !job.salary || job.salary === 'Negotiable'
  ];

  risk = ghostIndicators.filter(Boolean).length * 20; // 20 points per indicator

  return { risk: Math.min(risk, 100) };
}

async function analyzeCompany(company: any) {
  let risk = 0;
  const issues: string[] = [];

  if (!company) {
    return { risk: 30, issues: ['No company information available'] };
  }

  if (!company.isVerified) {
    risk += 15;
    issues.push('Company not verified');
  }

  if (!company.website || !company.description) {
    risk += 10;
    issues.push('Incomplete company profile');
  }

  if (company.email && company.email.includes('@gmail.com')) {
    risk += 10;
    issues.push('Using personal email address');
  }

  return { risk, issues };
}

function determineRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}

function generateRecommendation(result: FraudAnalysisResult): string {
  switch (result.riskLevel) {
    case 'CRITICAL':
      return 'IMMEDIATE ACTION REQUIRED: This posting shows strong indicators of fraud. Recommend immediate removal and user investigation.';
    case 'HIGH':
      return 'HIGH RISK: Multiple red flags detected. Recommend manual review and potential removal.';
    case 'MEDIUM':
      return 'MODERATE RISK: Some suspicious elements found. Recommend enhanced monitoring.';
    case 'LOW':
      return 'LOW RISK: Minimal concerns detected. Standard monitoring recommended.';
    default:
      return 'No significant risks detected.';
  }
}

async function autoFlagJob(jobId: string, analysis: FraudAnalysisResult) {
  await prisma.job.update({
    where: { id: jobId },
    data: {
      fraudStatus: 'FLAGGED',
      fraudScore: analysis.riskScore,
      fraudFlaggedAt: new Date(),
      fraudIssues: analysis.flaggedIssues
    }
  });
}

async function getAverageRiskScore(): Promise<number> {
  const jobs = await prisma.job.findMany({
    where: { fraudScore: { not: null }, deletedAt: null },
    select: { fraudScore: true }
  });

  if (jobs.length === 0) return 0;

  const total = jobs.reduce((sum, job) => sum + (job.fraudScore || 0), 0);
  return total / jobs.length;
}

async function getRecentDetections() {
  return await prisma.job.findMany({
    where: {
      fraudFlaggedAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
      },
      deletedAt: null
    },
    include: {
      company: { select: { name: true } }
    },
    orderBy: { fraudFlaggedAt: 'desc' },
    take: 10
  });
}
