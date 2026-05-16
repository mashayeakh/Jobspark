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
        console.log('[Frontend Fetch] Requesting Job Seeker Profile...');
        const response = await apiClient.get<any>('/jobseeker/me');

        if (response.success && response.data?.result) {
            console.log('[Frontend Fetch] Received Profile:', response.data.result);
            return {
                success: true,
                data: response.data.result,
            };
        }

        console.error('[Frontend Fetch] Failed to fetch profile:', response.error);
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

    async getRecommendedJobs(): Promise<ApiResponse<any[]>> {
        const response = await apiClient.get<any>('/jobseeker/recommended');
        if (response.success && response.data?.result) {
            return { success: true, data: response.data.result };
        }
        return { success: false, error: response.error || 'Failed to fetch recommendations' };
    }

    async generateBioOptions(headline: string, currentBio: string, skills: string[]): Promise<ApiResponse<string[]>> {
        const response = await apiClient.post<any>('/ai/bio-generator/generate', { headline, currentBio, skills });
        if (response.success && response.data?.result) {
            return { success: true, data: response.data.result };
        }
        return { success: false, error: response.error || 'Failed to generate bio options' };
    }

    async uploadResume(file: File): Promise<ApiResponse<{ resumeUrl: string }>> {
        try {
            console.log('[Frontend Upload] Starting resume upload...', file.name, file.size);
            const token = localStorage.getItem('accessToken');
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v2/jobseeker/upload-resume`, {
                method: 'POST',
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('[Frontend Upload] HTTP Error:', response.status, errorData);
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('[Frontend Upload] Success Response from Server:', data);
            if (data.success && data.result) {
                return { success: true, data: data.result };
            }

            return { success: false, error: data.message || 'Failed to upload resume' };
        } catch (error) {
            console.error('[Frontend Upload] Exception caught:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'An unknown error occurred during upload',
            };
        }
    }
    async analyzeResume(targetRole: string): Promise<ApiResponse<any>> {
        const response = await apiClient.post<any>('/jobseeker/resume-analyzer/analyze', { targetRole });
        if (response.success && response.data?.result) {
            return { success: true, data: response.data.result };
        }
        return { success: false, error: response.error || 'Failed to analyze resume' };
    }

    async getProfileScore(): Promise<ApiResponse<any>> {
        const response = await apiClient.get<any>('/jobseeker/profile-analytics/score');
        if (response.success && response.data?.result) {
            return { success: true, data: response.data.result };
        }
        return response;
    }
}

export const jobSeekerService = new JobSeekerService();
