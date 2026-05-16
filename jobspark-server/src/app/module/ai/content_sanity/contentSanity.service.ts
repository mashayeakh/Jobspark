import { prisma } from "../../../lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";
import Groq from "groq-sdk";
import { envVars } from "../../../config/env";

// Initialize AI services
const groq = new Groq({ apiKey: envVars.GROQ_API_KEY });

// Bias detection patterns
const BIAS_PATTERNS = {
  gender: {
    masculine: ['ninja', 'rockstar', 'guru', 'master', 'dominant', 'aggressive', 'competitive', 'driven'],
    feminine: ['nurturing', 'supportive', 'collaborative', 'empathetic', 'understanding', 'gentle'],
    neutral_suggestions: {
      'ninja': 'expert',
      'rockstar': 'top performer',
      'guru': 'specialist',
      'master': 'expert',
      'dominant': 'leading',
      'aggressive': 'proactive',
      'competitive': 'results-oriented',
      'driven': 'motivated'
    }
  },
  age: {
    patterns: ['young', 'energetic', 'recent graduate', 'fresh', 'digital native', 'early career', 'junior'],
    suggestions: {
      'young': 'enthusiastic',
      'energetic': 'dynamic',
      'recent graduate': 'entry-level',
      'fresh': 'new',
      'digital native': 'tech-savvy',
      'early career': 'developing professional',
      'junior': 'associate'
    }
  },
  race: {
    patterns: ['american', 'western', 'native english speaker', 'cultural fit', 'local'],
    suggestions: {
      'american': 'US-based',
      'western': 'international',
      'native english speaker': 'fluent in English',
      'cultural fit': 'team alignment',
      'local': 'area-based'
    }
  }
};

interface BiasDetection {
  type: 'GENDER' | 'AGE' | 'RACE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  detectedPhrases: string[];
  suggestions: string[];
}

interface ContentQualityScore {
  overallScore: number;
  completenessScore: number;
  clarityScore: number;
  inclusivityScore: number;
  details: {
    hasRequirements: boolean;
    hasResponsibilities: boolean;
    hasBenefits: boolean;
    hasSalary: boolean;
    wordCount: number;
    readabilityLevel: string;
  };
}

interface SuggestedCorrection {
  original: string;
  suggestion: string;
  reason: string;
  category: 'GENDER' | 'AGE' | 'RACE' | 'QUALITY' | 'CLARITY';
}

interface ContentSanityResult {
  jobId: string;
  biasDetection: BiasDetection[];
  contentQuality: ContentQualityScore;
  inclusiveLanguage: {
    issues: string[];
    suggestions: string[];
  };
  automatedCorrections: SuggestedCorrection[];
  overallRecommendation: 'APPROVE' | 'REVIEW' | 'REJECT';
  summary: string;
}

export const ContentSanityService = {
  // Analyze a job posting for content sanity
  analyzeJobContent: async (jobId: string): Promise<any> => {
    try {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: { 
          company: { select: { name: true } },
          recruiter: { include: { user: { select: { name: true } } } }
        },
      });

      if (!job) {
        throw new AppError(httpStatus.NOT_FOUND, "Job not found");
      }

      const text = `${job.title} ${job.description} ${job.requirements || ''} ${job.responsibilities || ''}`;

      // USE AI for deep analysis
      const prompt = `Analyze this job posting for bias and quality. 
      Return a JSON object exactly in this format:
      {
        "qualityScore": number (0-100),
        "biasScore": number (0-100, 100 being bias-free),
        "biasFlags": { "gender": boolean, "age": boolean, "race": boolean },
        "languageIssues": string[],
        "suggestions": string[],
        "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
        "recommendation": "APPROVE" | "REVIEW" | "REJECT",
        "summary": string
      }
      
      Job Title: ${job.title}
      Content: ${text}`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are a content sanity specialist for job postings. Always respond with valid JSON only." },
          { role: "user", content: prompt }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
      });

      const aiData = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');

      const frontendAnalysis = {
        id: job.id,
        title: job.title,
        company: job.company?.name || 'Unknown',
        recruiter: job.recruiter?.user?.name || 'Unknown',
        analysis: {
          biasScore: aiData.biasScore,
          biasFlags: aiData.biasFlags,
          qualityScore: aiData.qualityScore,
          languageIssues: aiData.languageIssues,
          suggestions: aiData.suggestions,
          needsReview: aiData.recommendation !== 'APPROVE',
          riskLevel: aiData.riskLevel
        },
        createdAt: job.createdAt,
        status: aiData.recommendation === 'APPROVE' ? 'SAFE' : (aiData.recommendation === 'REVIEW' ? 'UNDER_REVIEW' : 'FLAGGED'),
        summary: aiData.summary
      };

      return frontendAnalysis;
    } catch (error) {
      console.error('Content sanity analysis error:', error);
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Content sanity analysis failed");
    }
  },

  // Analyze multiple jobs
  analyzeBatch: async (jobIds: string[]): Promise<Map<string, ContentSanityResult>> => {
    const results = new Map<string, ContentSanityResult>();

    for (const jobId of jobIds) {
      try {
        const result = await ContentSanityService.analyzeJobContent(jobId);
        results.set(jobId, result);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to analyze job ${jobId}:`, error);
      }
    }

    return results;
  },

  // Analyze all jobs
  analyzeAllJobs: async (): Promise<Map<string, any>> => {
    // Since the frontend recalculates all stats and job analyses dynamically via /stats and /jobs,
    // and there is no database persistence required for the AI summary, 
    // we can return immediately to prevent the 3-5 minute bottleneck of running AI on 50+ jobs.
    return new Map();
  },

  // Get content sanity statistics
  getStats: async () => {
    const jobs = await prisma.job.findMany({
      where: { deletedAt: null },
    });

    const totalJobs = jobs.length;
    let safeJobs = 0;
    let flaggedJobs = 0;
    
    const biasBreakdown = { gender: 0, age: 0, race: 0 };
    const riskDistribution = { low: 0, medium: 0, high: 0, critical: 0 };

    for (const job of jobs) {
      const text = `${job.title} ${job.description} ${job.requirements || ''} ${job.responsibilities || ''}`.toLowerCase();
      const biasDetection = detectBias(text);
      const contentQuality = calculateContentQuality(job);
      const overallRecommendation = determineRecommendation(biasDetection, contentQuality);

      let hasBias = false;
      biasDetection.forEach(bias => {
        if (bias.type === 'GENDER') biasBreakdown.gender += bias.detectedPhrases.length;
        if (bias.type === 'AGE') biasBreakdown.age += bias.detectedPhrases.length;
        if (bias.type === 'RACE') biasBreakdown.race += bias.detectedPhrases.length;
        if (bias.detectedPhrases.length > 0) hasBias = true;
      });

      if (overallRecommendation === 'APPROVE' && !hasBias) {
        safeJobs++;
      } else {
        flaggedJobs++;
      }

      const riskLevel = determineRiskLevel(biasDetection, contentQuality.overallScore);
      if (riskLevel === 'LOW') riskDistribution.low++;
      if (riskLevel === 'MEDIUM') riskDistribution.medium++;
      if (riskLevel === 'HIGH') riskDistribution.high++;
      if (riskLevel === 'CRITICAL') riskDistribution.critical++;
    }

    return {
      totalJobs,
      safeJobs,
      flaggedJobs,
      sanityRate: totalJobs > 0 ? ((safeJobs / totalJobs) * 100).toFixed(1) : '0',
      biasBreakdown,
      riskDistribution
    };
  },

  // Get jobs needing review (used for fetching all jobs analysis in frontend)
  getJobsNeedingReview: async (limit = 50, offset = 0) => {
    const jobs = await prisma.job.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        company: { select: { name: true } },
        recruiter: {
          include: { user: { select: { name: true } } }
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return jobs.map(job => {
      const text = `${job.title} ${job.description} ${job.requirements || ''} ${job.responsibilities || ''}`.toLowerCase();
      const biasDetection = detectBias(text);
      const contentQuality = calculateContentQuality(job);
      const overallRecommendation = determineRecommendation(biasDetection, contentQuality);
      const riskLevel = determineRiskLevel(biasDetection, contentQuality.overallScore);

      const hasGender = biasDetection.some(b => b.type === 'GENDER');
      const hasAge = biasDetection.some(b => b.type === 'AGE');
      const hasRace = biasDetection.some(b => b.type === 'RACE');
      
      const biasScore = Math.max(0, 100 - (biasDetection.reduce((acc, curr) => acc + curr.detectedPhrases.length, 0) * 10));

      const inclusiveLangSync = analyzeInclusiveLanguageSync(text);

      const frontendAnalysis = {
        biasScore,
        biasFlags: {
          gender: hasGender,
          age: hasAge,
          race: hasRace,
          disability: inclusiveLangSync.issues.some(i => i.includes('accessibility')),
          cultural: false
        },
        qualityScore: contentQuality.overallScore,
        languageIssues: inclusiveLangSync.issues,
        suggestions: inclusiveLangSync.suggestions,
        needsReview: overallRecommendation !== 'APPROVE',
        riskLevel
      };

      return {
        id: job.id,
        title: job.title,
        company: job.company?.name || 'Unknown',
        recruiter: job.recruiter?.user?.name || 'Unknown',
        analysis: frontendAnalysis,
        createdAt: job.createdAt,
        status: overallRecommendation === 'APPROVE' ? 'SAFE' : (overallRecommendation === 'REVIEW' ? 'UNDER_REVIEW' : 'FLAGGED')
      };
    });
  },

  // Apply automated corrections
  applyCorrections: async (jobId: string, corrections: SuggestedCorrection[]) => {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new AppError(httpStatus.NOT_FOUND, "Job not found");
    }

    let updatedTitle = job.title;
    let updatedDescription = job.description;
    let updatedRequirements = job.requirements;

    corrections.forEach(correction => {
      updatedTitle = updatedTitle.replace(new RegExp(correction.original, 'gi'), correction.suggestion);
      updatedDescription = updatedDescription.replace(new RegExp(correction.original, 'gi'), correction.suggestion);
      if (updatedRequirements) {
        updatedRequirements = updatedRequirements.replace(new RegExp(correction.original, 'gi'), correction.suggestion);
      }
    });

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title: updatedTitle,
        description: updatedDescription,
        requirements: updatedRequirements,
      },
    });

    return updatedJob;
  },
};

// Helper functions
function detectBias(text: string): BiasDetection[] {
  const biasDetections: BiasDetection[] = [];

  // Gender bias
  const genderBias: BiasDetection = {
    type: 'GENDER',
    severity: 'LOW',
    detectedPhrases: [],
    suggestions: [],
  };

  BIAS_PATTERNS.gender.masculine.forEach(word => {
    if (text.includes(word)) {
      genderBias.detectedPhrases.push(word);
      genderBias.suggestions.push((BIAS_PATTERNS.gender.neutral_suggestions as any)[word] || 'neutral alternative');
    }
  });

  BIAS_PATTERNS.gender.feminine.forEach(word => {
    if (text.includes(word)) {
      genderBias.detectedPhrases.push(word);
    }
  });

  if (genderBias.detectedPhrases.length > 0) {
    genderBias.severity = genderBias.detectedPhrases.length > 2 ? 'HIGH' : 'MEDIUM';
    biasDetections.push(genderBias);
  }

  // Age bias
  const ageBias: BiasDetection = {
    type: 'AGE',
    severity: 'LOW',
    detectedPhrases: [],
    suggestions: [],
  };

  BIAS_PATTERNS.age.patterns.forEach(pattern => {
    if (text.includes(pattern)) {
      ageBias.detectedPhrases.push(pattern);
      ageBias.suggestions.push((BIAS_PATTERNS.age.suggestions as any)[pattern] || 'neutral alternative');
    }
  });

  if (ageBias.detectedPhrases.length > 0) {
    ageBias.severity = ageBias.detectedPhrases.length > 2 ? 'HIGH' : 'MEDIUM';
    biasDetections.push(ageBias);
  }

  // Race bias
  const raceBias: BiasDetection = {
    type: 'RACE',
    severity: 'LOW',
    detectedPhrases: [],
    suggestions: [],
  };

  BIAS_PATTERNS.race.patterns.forEach(pattern => {
    if (text.includes(pattern)) {
      raceBias.detectedPhrases.push(pattern);
      raceBias.suggestions.push((BIAS_PATTERNS.race.suggestions as any)[pattern] || 'neutral alternative');
    }
  });

  if (raceBias.detectedPhrases.length > 0) {
    raceBias.severity = raceBias.detectedPhrases.length > 1 ? 'HIGH' : 'MEDIUM';
    biasDetections.push(raceBias);
  }

  return biasDetections;
}

function calculateContentQuality(job: any): ContentQualityScore {
  let completenessScore = 0;
  let clarityScore = 0;

  // Completeness checks
  if (job.requirements && job.requirements.length > 50) completenessScore += 25;
  if (job.responsibilities && job.responsibilities.length > 50) completenessScore += 25;
  if (job.benefits && job.benefits.length > 20) completenessScore += 25;
  if (job.salaryMin || job.salaryMax) completenessScore += 25;

  // Clarity checks
  const wordCount = (job.description || '').split(/\s+/).length;
  if (wordCount > 50 && wordCount < 500) clarityScore += 50;
  if (wordCount >= 500) clarityScore += 30;

  const inclusivityScore = 100 - (detectBias(`${job.title} ${job.description} ${job.requirements || ''}`).length * 20);

  const overallScore = (completenessScore + clarityScore + inclusivityScore) / 3;

  return {
    overallScore: Math.round(overallScore),
    completenessScore: Math.round(completenessScore),
    clarityScore: Math.round(clarityScore),
    inclusivityScore: Math.round(Math.max(0, inclusivityScore)),
    details: {
      hasRequirements: !!job.requirements,
      hasResponsibilities: !!job.responsibilities,
      hasBenefits: !!job.benefits,
      hasSalary: !!(job.salaryMin || job.salaryMax),
      wordCount,
      readabilityLevel: wordCount > 500 ? 'Lengthy' : wordCount > 100 ? 'Optimal' : 'Brief',
    },
  };
}

async function analyzeInclusiveLanguage(text: string): Promise<{
  issues: string[];
  suggestions: string[];
}> {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check for exclusive language
  const exclusivePhrases = ['must be', 'required to be', 'only', 'exclusively'];
  exclusivePhrases.forEach(phrase => {
    if (text.includes(phrase)) {
      issues.push(`Exclusive language detected: "${phrase}"`);
      suggestions.push(`Consider using "preferred" or "ideal candidate" instead of "${phrase}"`);
    }
  });

  // Check for accessibility
  if (!text.includes('accommodation') && !text.includes('accessible')) {
    issues.push('No mention of accessibility accommodations');
    suggestions.push('Consider adding: "We provide reasonable accommodations for candidates with disabilities"');
  }

  // Check for diversity statement
  if (!text.includes('equal opportunity') && !text.includes('diversity')) {
    issues.push('No diversity/inclusion statement');
    suggestions.push('Consider adding: "We are an equal opportunity employer and value diversity"');
  }

  return { issues, suggestions };
}

async function generateCorrections(
  job: any,
  biasDetection: BiasDetection[],
  inclusiveLanguage: any
): Promise<SuggestedCorrection[]> {
  const corrections: SuggestedCorrection[] = [];

  // Generate corrections from bias detection
  biasDetection.forEach(bias => {
    bias.detectedPhrases.forEach((phrase, index) => {
      if (bias.suggestions[index]) {
        corrections.push({
          original: phrase,
          suggestion: bias.suggestions[index],
          reason: `Replace ${bias.type.toLowerCase()} bias with neutral term`,
          category: bias.type,
        });
      }
    });
  });

  // Generate corrections from inclusive language
  inclusiveLanguage.issues.forEach((issue: string, index: string | number) => {
    if (inclusiveLanguage.suggestions[index]) {
      corrections.push({
        original: issue,
        suggestion: inclusiveLanguage.suggestions[index],
        reason: 'Improve inclusivity',
        category: 'CLARITY',
      });
    }
  });

  return corrections;
}

function determineRecommendation(
  biasDetection: BiasDetection[],
  contentQuality: ContentQualityScore
): 'APPROVE' | 'REVIEW' | 'REJECT' {
  const highSeverityBias = biasDetection.filter(b => b.severity === 'HIGH').length;
  const overallScore = contentQuality.overallScore;

  if (highSeverityBias > 0 || overallScore < 40) {
    return 'REJECT';
  }

  if (biasDetection.length > 0 || overallScore < 70) {
    return 'REVIEW';
  }

  return 'APPROVE';
}

function determineRiskLevel(biasDetection: BiasDetection[], qualityScore: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  const highSeverityBias = biasDetection.filter(b => b.severity === 'HIGH').length;
  
  if (highSeverityBias > 1 || qualityScore < 30) return 'CRITICAL';
  if (highSeverityBias === 1 || qualityScore < 50) return 'HIGH';
  if (biasDetection.length > 0 || qualityScore < 70) return 'MEDIUM';
  return 'LOW';
}

function analyzeInclusiveLanguageSync(text: string): {
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check for exclusive language
  const exclusivePhrases = ['must be', 'required to be', 'only', 'exclusively'];
  exclusivePhrases.forEach(phrase => {
    if (text.includes(phrase)) {
      issues.push(`Exclusive language detected: "${phrase}"`);
      suggestions.push(`Consider using "preferred" or "ideal candidate" instead of "${phrase}"`);
    }
  });

  // Check for accessibility
  if (!text.includes('accommodation') && !text.includes('accessible')) {
    issues.push('No mention of accessibility accommodations');
    suggestions.push('Consider adding: "We provide reasonable accommodations for candidates with disabilities"');
  }

  // Check for diversity statement
  if (!text.includes('equal opportunity') && !text.includes('diversity')) {
    issues.push('No diversity/inclusion statement');
    suggestions.push('Consider adding: "We are an equal opportunity employer and value diversity"');
  }

  return { issues, suggestions };
}
