/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient, ApiResponse } from '@/lib/api';

export interface RecruiterDashboardData {
  stats: {
    activeJobs: number;
    totalApplications: number;
    totalViews: number;
    interviewsScheduled: number;
    offersMade: number;
    pendingApplications?: number;
    shortlistedCount?: number;
    rejectedCount?: number;
    timeToHire: number;
    costPerHire: number;
    qualityOfHire: number;
  };
  pipeline: Array<{ stage: string; count: number }>;
  totalPipeline: number;
  recentJobs: Array<{
    id: string;
    title: string;
    status: string;
    applications: number;
    views: number;
    posted: string;
    expires: string;
    type: string;
    location: string;
  }>;
  recentApplications: Array<{
    id: string;
    candidateName: string;
    jobTitle: string;
    status: string;
    applied: string;
    experience: string;
    location: string;
    match: number;
  }>;
  monthlyActivity: Array<{
    month: string;
    jobs: number;
    applications: number;
  }>;
}


export interface Application {
  id: string;
  jobId: string;
  seekerId: string;
  status: string;
  appliedAt: string;
  updatedAt: string;
  job: {
    title: string;
    id: string;
    location?: string;
  };
  seeker: {
    user: {
      name: string;
      email: string;
      image?: string;
    };
    skills: Array<{
      skill: {
        name: string;
      };
    }>;
    workExperience: Array<{
      companyName: string;
      title: string;
      startDate: string;
      endDate?: string;
    }>;
  };
  logs: Array<{
    status: string;
    reason?: string;
    changedAt: string;
  }>;
}

export interface RecruiterProfile {
  id: string;
  name: string;
  userId: string;
  position?: string;
  companyId: string;
  company: {
    id: string;
    name: string;
    logo?: string;
    website?: string;
    email?: string;
    phone?: string;
    description?: string;
    tagline?: string;
    mission?: string;
    values?: string;
    benefits?: string;
    industry: string;
    size?: string;
    location?: string;
    socialLinks?: any;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };

  user: {
    name: string;
    email: string;
    image?: string;
  };
  jobs: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }>;
}

class RecruiterService {
  async getDashboard(): Promise<ApiResponse<RecruiterDashboardData>> {
    const response = await apiClient.get<any>('/recruiter/dashboard');
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result,
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to fetch dashboard data',
    };
  }

  async getProfile(): Promise<ApiResponse<RecruiterProfile>> {
    const response = await apiClient.get<any>('/recruiter/me');
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result,
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to fetch profile',
    };
  }

  async getAllApplications(): Promise<ApiResponse<Application[]>> {
    const response = await apiClient.get<any>('/recruiter/applications');
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result,
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to fetch applications',
    };
  }

  async getApplicationDetails(applicationId: string): Promise<ApiResponse<Application>> {
    const response = await apiClient.get<any>(`/recruiter/applications/${applicationId}`);
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result,
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to fetch application details',
    };
  }

  async analyzePotential(applicationId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get<any>(`/recruiter/applications/${applicationId}/analyze`);
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result,
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to analyze potential',
    };
  }

  async updateProfile(data: { position?: string; company?: any }): Promise<ApiResponse<RecruiterProfile>> {
    const response = await apiClient.patch<any>('/recruiter/update', data);
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result,
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to update profile',
    };
  }

  async updateApplicationStatus(applicationId: string, data: { status: string; reason?: string; type?: string; location?: string; scheduledAt?: string }): Promise<ApiResponse<any>> {
    const response = await apiClient.patch<any>(`/applications/${applicationId}/status`, data);
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result,
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to update application status',
    };
  }
}

export const recruiterService = new RecruiterService();
