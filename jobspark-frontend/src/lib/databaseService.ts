/* eslint-disable @typescript-eslint/no-explicit-any */
// Database Service - Connects to real job database
// This replaces hardcoded mock data with actual database connections

interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  companyId: string;
  recruiterId: string;
  status: string;
  createdAt: string;
  company?: {
    name: string;
  };
  recruiter?: {
    user: {
      name: string;
    };
  };
}

interface ContentSanityResult {
  biasScore: number;
  biasFlags: {
    gender: boolean;
    age: boolean;
    race: boolean;
    disability: boolean;
    cultural: boolean;
  };
  qualityScore: number;
  languageIssues: string[];
  suggestions: string[];
  needsReview: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface SanityStats {
  totalJobs: number;
  safeJobs: number;
  flaggedJobs: number;
  sanityRate: string;
  biasBreakdown: {
    gender: number;
    age: number;
    race: number;
  };
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

interface JobAnalysis {
  id: string;
  title: string;
  company: string;
  recruiter: string;
  analysis: ContentSanityResult;
  createdAt: string;
  status: 'SAFE' | 'UNDER_REVIEW' | 'FLAGGED';
}

// Content Analysis Functions
function analyzeBias(text: string): ContentSanityResult['biasFlags'] {
  const lowerText = text.toLowerCase();

  return {
    gender: /\b(man|men|male|he|his|him|salesman|chairman|foreman)\b/.test(lowerText),
    age: /\b(young|old|senior|junior|recent graduate|entry level|experienced|age \d+|\d+ years? old)\b/.test(lowerText),
    race: /\b(minority|diverse|cultural|ethnic|race|racial)\b/.test(lowerText) && /\b(prefer|require|must be|only)\b/.test(lowerText),
    disability: /\b(disabled|handicap|able-bodied|physically fit|good health)\b/.test(lowerText) && /\b(require|must|essential)\b/.test(lowerText),
    cultural: /\b(cultural fit|team player|work hard|fast-paced|dynamic|rockstar|ninja|guru)\b/.test(lowerText)
  };
}

function calculateBiasScore(biasFlags: ContentSanityResult['biasFlags']): number {
  const weights = { gender: 25, age: 20, race: 30, disability: 15, cultural: 10 };
  return Object.entries(biasFlags).reduce((score, [flag, present]) =>
    score + (present ? weights[flag as keyof typeof weights] : 0), 0);
}

function analyzeQuality(text: string): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 100;

  if (text.length < 100) {
    issues.push("Job description too short");
    score -= 20;
  }

  if (!/\b(requirements|qualifications|skills)\b/i.test(text)) {
    issues.push("Missing clear requirements");
    score -= 15;
  }

  if (!/\b(salary|pay|compensation|benefits)\b/i.test(text)) {
    issues.push("No compensation information");
    score -= 10;
  }

  if (/\b(urgent|immediate|asap)\b/i.test(text)) {
    issues.push("Contains urgency indicators");
    score -= 5;
  }

  return { score: Math.max(0, score), issues };
}

function determineRiskLevel(biasScore: number, qualityScore: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  const combinedScore = (biasScore * 0.6) + ((100 - qualityScore) * 0.4);

  if (combinedScore >= 70) return 'CRITICAL';
  if (combinedScore >= 50) return 'HIGH';
  if (combinedScore >= 30) return 'MEDIUM';
  return 'LOW';
}

function analyzeJobContent(job: Job): ContentSanityResult {
  const fullText = `${job.title} ${job.description} ${job.requirements || ''} ${job.benefits || ''}`;

  const biasFlags = analyzeBias(fullText);
  const biasScore = calculateBiasScore(biasFlags);
  const { score: qualityScore, issues: qualityIssues } = analyzeQuality(fullText);

  const languageIssues = [...qualityIssues];
  const suggestions = [];

  if (biasFlags.gender) {
    suggestions.push("Use gender-neutral language (e.g., 'Sales Representative' instead of 'Salesman')");
  }
  if (biasFlags.age) {
    suggestions.push("Remove age-related terms and focus on skills/experience requirements");
  }
  if (biasFlags.race) {
    suggestions.push("Ensure language doesn't exclude candidates based on race/ethnicity");
  }
  if (biasFlags.disability) {
    suggestions.push("Review disability-related language for compliance");
  }
  if (biasFlags.cultural) {
    suggestions.push("Remove cultural fit language that may exclude diverse candidates");
  }

  if (qualityScore < 70) {
    suggestions.push("Improve job description with more details about requirements and benefits");
  }

  const needsReview = biasScore > 30 || qualityScore < 50;
  const riskLevel = determineRiskLevel(biasScore, qualityScore);

  return {
    biasScore,
    biasFlags,
    qualityScore,
    languageIssues,
    suggestions,
    needsReview,
    riskLevel
  };
}

// Database Service Implementation
export const DatabaseService = {
  // Get real statistics from database
  getStats: async (): Promise<SanityStats> => {
    console.log('🗄️ [DATABASE] Getting real stats from database');

    try {
      // Try to fetch real data from our direct jobs API
      const response = await fetch('/api/jobs', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const jobs = await response.json();
        console.log(`🗄️ [DATABASE] Retrieved ${jobs.result?.length || 0} jobs from database`);

        const allJobs = jobs.result || [];
        const analyzedJobs = allJobs.map((job: Job) => analyzeJobContent(job));

        const flaggedJobs = analyzedJobs.filter((job: ContentSanityResult) => job.needsReview).length;
        const safeJobs = allJobs.length - flaggedJobs;

        // Calculate bias breakdown
        const biasBreakdown = analyzedJobs.reduce((acc: { gender: number; age: number; race: number }, job: ContentSanityResult) => ({
          gender: acc.gender + (job.biasFlags.gender ? 1 : 0),
          age: acc.age + (job.biasFlags.age ? 1 : 0),
          race: acc.race + (job.biasFlags.race ? 1 : 0)
        }), { gender: 0, age: 0, race: 0 });

        // Calculate risk distribution
        const riskDistribution = analyzedJobs.reduce((acc: { low: number; medium: number; high: number; critical: number }, job: ContentSanityResult) => ({
          low: acc.low + (job.riskLevel === 'LOW' ? 1 : 0),
          medium: acc.medium + (job.riskLevel === 'MEDIUM' ? 1 : 0),
          high: acc.high + (job.riskLevel === 'HIGH' ? 1 : 0),
          critical: acc.critical + (job.riskLevel === 'CRITICAL' ? 1 : 0)
        }), { low: 0, medium: 0, high: 0, critical: 0 });

        return {
          totalJobs: allJobs.length,
          safeJobs,
          flaggedJobs,
          sanityRate: allJobs.length > 0 ? ((safeJobs / allJobs.length) * 100).toFixed(1) : '0',
          biasBreakdown,
          riskDistribution
        };
      }
    } catch (error) {
      console.warn('🗄️ [DATABASE] Could not connect to backend, using fallback:', error instanceof Error ? error.message : String(error));
    }

    // Fallback: Return empty stats if database unavailable
    return {
      totalJobs: 0,
      safeJobs: 0,
      flaggedJobs: 0,
      sanityRate: '0',
      biasBreakdown: { gender: 0, age: 0, race: 0 },
      riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 }
    };
  },

  // Get analyzed jobs from database
  getAnalyzedJobs: async (): Promise<JobAnalysis[]> => {
    console.log('🗄️ [DATABASE] Getting real analyzed jobs from database');

    try {
      // Try to fetch real data from our direct jobs API
      const response = await fetch('/api/jobs', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const jobsData = await response.json();
        const allJobs = jobsData.result || [];
        console.log(`🗄️ [DATABASE] Retrieved ${allJobs.length} jobs for analysis`);

        // Analyze each real job
        const analyzedJobs: JobAnalysis[] = allJobs.map((job: Job) => {
          const analysis = analyzeJobContent(job);

          return {
            id: job.id,
            title: job.title,
            company: job.company?.name || 'Unknown Company',
            recruiter: job.recruiter?.user?.name || 'Unknown Recruiter',
            analysis,
            createdAt: job.createdAt,
            status: analysis.needsReview ? 'FLAGGED' : 'SAFE'
          };
        });

        return analyzedJobs;
      }
    } catch (error) {
      console.warn('🗄️ [DATABASE] Could not connect to backend for jobs:', error instanceof Error ? error.message : String(error));
    }

    // Fallback: Return empty array if database unavailable
    return [];
  },

  // Analyze specific job
  analyzeJob: async (jobId: string): Promise<ContentSanityResult> => {
    console.log(`🗄️ [DATABASE] Analyzing specific job ${jobId}`);

    try {
      // Try to fetch specific job from backend
      const response = await fetch(`http://localhost:3000/api/v2/jobs/${jobId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const job = await response.json();
        console.log(`🗄️ [DATABASE] Retrieved job ${jobId} for analysis`);

        return analyzeJobContent(job.result);
      }
    } catch (error) {
      console.warn(`🗄️ [DATABASE] Could not fetch job ${jobId}:`, error instanceof Error ? error.message : String(error));
    }

    // Fallback: Return default analysis
    return {
      biasScore: 0,
      biasFlags: { gender: false, age: false, race: false, disability: false, cultural: false },
      qualityScore: 50,
      languageIssues: ['Could not analyze job - database unavailable'],
      suggestions: ['Please check database connection'],
      needsReview: false,
      riskLevel: 'LOW'
    };
  },

  // Analyze all jobs
  analyzeAllJobs: async (): Promise<{ totalAnalyzed: number; results: any[]; message: string }> => {
    console.log('🗄️ [DATABASE] Analyzing all jobs in database');

    try {
      const jobs = await DatabaseService.getAnalyzedJobs();

      return {
        totalAnalyzed: jobs.length,
        results: jobs.map(job => ({
          jobId: job.id,
          result: job.analysis
        })),
        message: `Successfully analyzed ${jobs.length} jobs from database`
      };
    } catch (error) {
      console.error('🗄️ [DATABASE] Error in batch analysis:', error instanceof Error ? error.message : String(error));

      return {
        totalAnalyzed: 0,
        results: [],
        message: 'Failed to analyze jobs - database unavailable'
      };
    }
  }
};
