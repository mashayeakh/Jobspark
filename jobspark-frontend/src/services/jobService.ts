/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient, ApiResponse } from '@/lib/api';

export interface Skill {
  id: string;
  name: string;
}

export interface JobSkill {
  jobId: string;
  skillId: string;
  isRequired: boolean;
  skill: Skill;
}

export interface Company {
  id: string;
  name: string;
  logo: string | null;
  website: string;
  description: string | null;
  industry: string;
  size: string | null;
  location: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'ACTIVE' | 'CLOSED' | 'DRAFT' | 'ARCHIVED';

  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  locationType: 'REMOTE' | 'ONSITE' | 'HYBRID';
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'EXECUTIVE';
  salaryMin?: number;
  salaryMax?: number;
  location: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  vacancy?: number;
  applicationDeadline?: string;
  applicationCount: number;

  viewCount: number;
  companyId: string;
  recruiterId: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  categoryId: string | null;
  subCategoryId: string | null;
  company: Company;
  skills: JobSkill[];
  category: any; // Update when category structure is known
  subCategory: any; // Update when subcategory structure is known
}

export interface CreateJobData {
  title: string;
  description: string;
  type: Job['type'];
  locationType: Job['locationType'];
  experienceLevel: Job['experienceLevel'];
  salaryMin?: number;
  salaryMax?: number;
  location: string;
  categoryId?: string;
  subCategoryId?: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  vacancy?: number;
  applicationDeadline?: string;
  company?: string;
  department?: string;
  status?: string;
  skills?: {
    name: string;
    isRequired?: boolean;
  }[];
}

export interface JobFilters {
  searchTerm?: string;
  type?: Job['type'];
  locationType?: Job['locationType'];
  experienceLevel?: Job['experienceLevel'];
  location?: string;
  categoryId?: string;
  subCategoryId?: string;
  minSalary?: number;
  maxSalary?: number;
  remote?: boolean;
}

export interface AIRecommendedJob {
  jobId: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  type: string;
  salaryRange?: string;
  score: number;
  explanation: string;
  matchReasons: string[];
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JobResponse {
  success: boolean;
  message: string;
  result: Job[] | { jobs: Job[]; meta: Meta };
}

export class JobService {
  async getJobs(filters?: JobFilters & { page?: number; limit?: number }): Promise<ApiResponse<{ jobs: Job[]; meta?: Meta }>> {
    const response = await apiClient.get<JobResponse>('/jobs', filters as Record<string, string>);

    if (response.success && response.data) {
      const result = response.data.result;
      
      if (Array.isArray(result)) {
        return {
          success: true,
          data: { jobs: result },
        };
      }

      return {
        success: true,
        data: result,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch jobs',
    };
  }

  async getJob(id: string): Promise<ApiResponse<Job>> {
    const response = await apiClient.get<{ success: boolean; result: Job }>(`/jobs/${id}`);

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.result,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch job',
    };
  }

  async createJob(data: CreateJobData): Promise<ApiResponse<Job>> {
    const response = await apiClient.post<{ success: boolean; result: Job }>('/jobs/create', data);

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.result,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to create job',
    };
  }

  async updateJob(id: string, data: Partial<CreateJobData>): Promise<ApiResponse<Job>> {
    const response = await apiClient.patch<{ success: boolean; result: Job }>(`/jobs/${id}`, data);


    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.result,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to update job',
    };
  }

  async deleteJob(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/jobs/${id}`);
  }

  async applyToJob(jobId: string, data?: { coverLetter?: string; resumeUrl?: string }): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/applications/apply`, { jobId, ...(data || {}) });
  }

  async saveJob(jobId: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/jobs/${jobId}/save`);
  }

  async unsaveJob(jobId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/jobs/${jobId}/save`);
  }

  async getSavedJobs(): Promise<ApiResponse<Job[]>> {
    const response = await apiClient.get<JobResponse>('/jobs/saved');

    if (response.success && response.data) {
      const result = response.data.result;
      // Narrow the union: the saved-jobs endpoint returns a plain array,
      // but the shared JobResponse type also allows the paginated shape.
      const jobs = Array.isArray(result) ? result : result.jobs;
      return {
        success: true,
        data: jobs,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch saved jobs',
    };
  }

  async checkIfJobSaved(jobId: string): Promise<ApiResponse<{ isSaved: boolean }>> {
    const response = await apiClient.get<{ result: { isSaved: boolean } }>(`/jobs/${jobId}/saved-status`);

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.result,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to check save status',
    };
  }

  async checkIfJobApplied(jobId: string): Promise<ApiResponse<{ isApplied: boolean }>> {
    const response = await apiClient.get<{ result: { isApplied: boolean } }>(`/applications/status/${jobId}`);

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.result,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to check application status',
    };
  }

  async getRecruiterJobs(): Promise<ApiResponse<Job[]>> {
    const response = await apiClient.get<JobResponse>('/jobs/my-jobs');

    if (response.success && response.data) {
      const result = response.data.result;
      // Narrow the union: recruiter jobs endpoint returns a plain array,
      // but the shared JobResponse type also allows the paginated shape.
      const jobs = Array.isArray(result) ? result : result.jobs;
      return {
        success: true,
        data: jobs,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch recruiter jobs',
    };
  }

  async getAIRecommendedJobs(): Promise<ApiResponse<AIRecommendedJob[]>> {
    const response = await apiClient.get<{ success: boolean; result: AIRecommendedJob[] }>('/jobseeker/recommended');

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.result,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch AI recommendations',
    };
  }
}

export const jobService = new JobService();
