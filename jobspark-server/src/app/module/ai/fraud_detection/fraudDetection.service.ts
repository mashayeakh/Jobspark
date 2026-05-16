import { prisma } from "../../../lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";
import Groq from "groq-sdk";
import natural from "natural";
import Redis from "ioredis";
import { envVars } from "../../../config/env";

// Initialize AI services
const groq = new Groq({ apiKey: envVars.GROQ_API_KEY });

// Redis disabled for development to prevent blocking
let redis: Redis | null = null;

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// Scam pattern keywords and weights
// 🔥 Enhanced Scam Pattern Keywords and Weights
const SCAM_PATTERNS = {
  payment_request: {
    keywords: ['pay', 'payment', 'fee', 'cost', 'charge', 'money', 'deposit'],
    weight: 0.35,
    description: 'Payment requests'
  },

  onboarding_scam: {
    keywords: ['onboarding fee', 'registration fee', 'training fee', 'activation fee'],
    weight: 0.35,
    description: 'Onboarding payment scam'
  },

  suspicious_tasks: {
    keywords: [
      'receive packages', 'reship items', 'forward packages',
      'transfer money', 'handle transactions', 'use your bank account'
    ],
    weight: 0.3,
    description: 'Suspicious job responsibilities'
  },

  investment_scam: {
    keywords: [
      'investment opportunity', 'crypto earnings', 'trading profit',
      'guaranteed returns', 'double your money'
    ],
    weight: 0.3,
    description: 'Investment scam indicators'
  },

  personal_data_request: {
    keywords: [
      'nid', 'passport', 'bank details',
      'credit card', 'verification document',
      'upload your id', 'personal information'
    ],
    weight: 0.25,
    description: 'Sensitive personal data request'
  },

  fake_hiring: {
    keywords: [
      'no interview', 'instant hiring', 'quick hiring',
      'guaranteed job', 'no selection process'
    ],
    weight: 0.25,
    description: 'Suspicious hiring process'
  },

  income_exaggeration: {
    keywords: [
      'earn daily', 'earn per day',
      'easy income', 'passive income',
      'make money fast'
    ],
    weight: 0.25,
    description: 'Unrealistic income promises'
  },

  external_messaging: {
    keywords: [
      'whatsapp', 'telegram', 'signal', 'skype',
      'contact me on', 'text this number'
    ],
    weight: 0.2,
    description: 'External messaging request'
  },

  pyramid_scheme: {
    keywords: [
      'refer others', 'invite friends',
      'earn per referral', 'network marketing'
    ],
    weight: 0.2,
    description: 'Pyramid scheme indicators'
  },

  generic_job_title: {
    keywords: [
      'online job', 'part time job',
      'data entry job', 'easy job', 'home job'
    ],
    weight: 0.2,
    description: 'Generic job role'
  },

  suspicious_contact: {
    keywords: ['gmail.com', 'yahoo.com', 'hotmail.com', 'personal email'],
    weight: 0.15,
    description: 'Suspicious contact methods'
  },

  unrealistic_benefits: {
    keywords: ['high salary', 'quick money', 'unlimited vacation'],
    weight: 0.15,
    description: 'Unrealistic benefits'
  },

  urgent_language: {
    keywords: ['urgent', 'immediate', 'act now', 'hurry'],
    weight: 0.1,
    description: 'Urgent language'
  },

  vague_description: {
    keywords: ['exciting opportunity', 'fast growing'],
    weight: 0.05,
    description: 'Vague descriptions'
  },

  ghost_job_indicators: {
    keywords: ['always hiring', 'multiple positions'],
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

      // 2. Groq AI analysis (with error handling)
      let aiAnalysis;
      try {
        aiAnalysis = await analyzeWithGroq(job);
        result.riskScore += aiAnalysis.score * 0.35; // Reduce Groq weight to 35% to prevent false positives
        result.flaggedIssues.push(...aiAnalysis.issues);
        result.scamIndicators.push(...aiAnalysis.indicators);
      } catch (error) {
        console.error('AI analysis failed, continuing with pattern analysis:', error);
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

      // Auto-flag only high or critical risk jobs (not medium)
      if (result.riskLevel === 'HIGH' || result.riskLevel === 'CRITICAL') {
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
        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
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
      safeJobs: safeJobs + nullStatusJobs,
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
        // ✅ 2 second delay between each job to avoid quota exhaustion
        await new Promise(resolve => setTimeout(resolve, 2000));
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

async function analyzeWithGroq(job: any) {
  try {
    const prompt = `
    Analyze this job posting for potential fraud indicators. Be STRICT and CONSERVATIVE - only flag jobs with CLEAR evidence of fraud.

    Title: ${job.title}
    Description: ${job.description}
    Requirements: ${job.requirements}
    Company: ${job.company?.name}

    IMPORTANT SCORING GUIDELINES:
    - 0-20: Legitimate job posting with normal characteristics
    - 21-40: Minor concerns (e.g., generic company name, missing some details) - NOT fraud
    - 41-60: Moderate concerns - requires human review but likely legitimate
    - 61-80: Strong fraud indicators (upfront fees, unrealistic pay, suspicious contact methods)
    - 81-100: Definite scam (requests money, identity theft, illegal activities)

    Only assign scores above 40 if you find SPECIFIC evidence of:
    1. Requests for upfront payment or fees from applicants
    2. Unrealistically high pay for minimal work
    3. Suspicious contact methods (personal emails, WhatsApp only)
    4. Vague descriptions with no real job duties
    5. Pressure tactics or urgency to act immediately
    6. Requests for personal financial information
    7. Involvement in illegal activities (money laundering, reshipping scams)

    Do NOT penalize for:
    - Missing application instructions (this is handled by the platform)
    - Generic but plausible company names
    - Standard job benefits (remote work, health insurance, 401k)
    - Detailed technical requirements or experience levels
    - Realistic salary ranges

    Return ONLY a raw JSON object, no markdown, no code fences:
    {"riskScore": 0-100, "issues": ["issue1"], "indicators": [{"category": "type", "confidence": 0-100, "evidence": ["text1"]}]}
    `;

    console.log(`🔍 Using Groq model: llama-3.3-70b-versatile`);
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a fraud detection specialist for job postings. Always respond with valid JSON only." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const text = response.choices[0]?.message?.content ?? "";
    const analysis = JSON.parse(text);

    return {
      score: analysis.riskScore || 0,
      issues: analysis.issues || [],
      indicators: analysis.indicators || [],
    };
  } catch (error: any) {
    console.error("Groq analysis failed:", error);
    return { score: 0, issues: [], indicators: [] };
  }
}

async function detectGhostJobs(job: any) {
  let risk = 0;

  const ghostIndicators = [
    job.createdAt && (Date.now() - new Date(job.createdAt).getTime()) > 90 * 24 * 60 * 60 * 1000,
    job.applicationCount === 0 && job.createdAt && (Date.now() - new Date(job.createdAt).getTime()) > 30 * 24 * 60 * 60 * 1000,
    job.description.toLowerCase().includes('always hiring'),
    job.description.toLowerCase().includes('multiple positions'),
    !job.salary || job.salary === 'Negotiable'
  ];

  risk = ghostIndicators.filter(Boolean).length * 20;

  return { risk: Math.min(risk, 100) };
}

async function analyzeCompany(company: any) {
  let risk = 0;
  const issues: string[] = [];

  if (!company) {
    return { risk: 20, issues: ['No company information available'] };
  }

  // Only flag unverified companies if combined with other risk factors
  if (!company.isVerified) {
    risk += 5; // Reduced from 15 - unverified alone shouldn't flag
    issues.push('Company not verified');
  }

  if (!company.website || !company.description) {
    risk += 3; // Reduced from 10 - minor issue
    issues.push('Incomplete company profile');
  }

  if (company.email && company.email.includes('@gmail.com')) {
    risk += 8; // Reduced from 10 - personal email is suspicious but not definitive
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
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
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