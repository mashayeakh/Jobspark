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
  status: 'ACTIVE' | 'CLOSED';
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
  skills?: string[]; // Array of skill IDs
}

export interface JobFilters {
  search?: string;
  type?: Job['type'];
  locationType?: Job['locationType'];
  experienceLevel?: Job['experienceLevel'];
  location?: string;
  categoryId?: string;
  subCategoryId?: string;
  salaryMin?: number;
  salaryMax?: number;
  remote?: boolean;
}

export interface JobResponse {
  success: boolean;
  message: string;
  result: Job[];
}

export class JobService {
  async getJobs(filters?: JobFilters): Promise<ApiResponse<Job[]>> {
    const response = await apiClient.get<JobResponse>('/jobs', filters as Record<string, string>);

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.result,
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
    const response = await apiClient.put<{ success: boolean; result: Job }>(`/jobs/${id}`, data);

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

  async applyToJob(jobId: string, data: { coverLetter?: string; resumeUrl?: string }): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/jobs/${jobId}/apply`, data);
  }

  async getMyApplications(): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>('/applications/my');
  }

  async getRecruiterJobs(): Promise<ApiResponse<Job[]>> {
    const response = await apiClient.get<JobResponse>('/jobs/my-jobs');

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.result,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch recruiter jobs',
    };
  }
}

export const jobService = new JobService();
