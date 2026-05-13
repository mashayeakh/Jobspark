/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient, ApiResponse } from '@/lib/api';

export interface JobSeekerSkill {
    profileId?: string;
    skillId?: string;
    level: number;
    yearsExp: number;
    name?: string;
    skill?: {
        id: string;
        name: string;
    };
}

export interface WorkExperience {
    id?: string;
    companyName: string;
    title: string;
    startDate: string;
    endDate?: string | null;
    description?: string | null;
}

export interface Education {
    id?: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string | null;
}

export interface JobSeekerProfile {
    id: string;
    name: string;
    userId: string;
    headline?: string | null;
    bio?: string | null;
    resumeUrl?: string | null;
    preferredSalaryMin?: number | null;
    preferredSalaryMax?: number | null;
    isProfileComplete?: boolean;
    views?: number;
    user?: {
        name?: string | null;
        email: string;
        image?: string | null;
    };
    workExperience?: WorkExperience[];
    education?: Education[];
    skills?: JobSeekerSkill[];
}

class JobSeekerService {
    async getProfile(): Promise<ApiResponse<JobSeekerProfile>> {
        const response = await apiClient.get<any>('/jobseeker/me');

        if (response.success && response.data?.result) {
            return {
                success: true,
                data: response.data.result,
            };
        }

        return {
            success: false,
            error: response.error || 'Failed to fetch job seeker profile',
        };
    }

    async getDashboardData(): Promise<ApiResponse<any>> {
        const response = await apiClient.get<any>('/jobseeker/dashboard');

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

    async updateProfile(data: Partial<JobSeekerProfile>): Promise<ApiResponse<JobSeekerProfile>> {
        const response = await apiClient.patch<any>('/jobseeker/update', data);

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
}

export const jobSeekerService = new JobSeekerService();
