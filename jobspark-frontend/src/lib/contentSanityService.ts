// Content Sanity Service - Real Database Implementation
// This connects to your actual job database instead of using hardcoded data

import { DatabaseService } from './databaseService';

// Define types locally to avoid import issues
export interface ContentSanityResult {
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

export interface SanityStats {
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

export interface JobAnalysis {
  id: string;
  title: string;
  company: string;
  recruiter: string;
  analysis: ContentSanityResult;
  createdAt: string;
  status: 'SAFE' | 'UNDER_REVIEW' | 'FLAGGED';
}

// Content Sanity Service implementation - now uses real database
export const ContentSanityService = {
  // Get statistics from real database
  getStats: async () => {
    console.log('📊 [CONTENT-SANITY] Getting stats from real database');
    return await DatabaseService.getStats();
  },

  // Get analyzed jobs from real database
  getAnalyzedJobs: async () => {
    console.log('📋 [CONTENT-SANITY] Getting analyzed jobs from real database');
    return await DatabaseService.getAnalyzedJobs();
  },

  // Analyze single job from real database
  analyzeJob: async (jobId: string) => {
    console.log(`🔍 [CONTENT-SANITY] Analyzing job ${jobId} from real database`);
    return await DatabaseService.analyzeJob(jobId);
  },

  // Analyze all jobs from real database
  analyzeAllJobs: async () => {
    console.log('🔄 [CONTENT-SANITY] Analyzing all jobs from real database');
    return await DatabaseService.analyzeAllJobs();
  }
};
