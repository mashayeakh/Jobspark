/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient, ApiResponse } from '@/lib/api';

export interface Interview {
  id: string;
  applicationId: string;
  type: 'VIDEO' | 'PHONE' | 'ONSITE';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  scheduledAt: string;
  duration: number;
  timezone: string;
  platform?: string;
  meetingLink?: string;
  location?: string;
  phoneNumber?: string;
  notes?: string;
  application: {
    job: { title: string; location?: string };
    seeker: {
      user: { name: string; email: string; image?: string };
    };
  };
  interviewers: any[];
}

export interface InterviewStats {
  total: number;
  completed: number;
  cancelled: number;
  upcoming: number;
}

export interface InterviewsResponse {
  interviews: Interview[];
  stats: InterviewStats;
}

export const interviewService = {
  async createInterview(data: any): Promise<ApiResponse<Interview>> {
    const response = await apiClient.post<any>('/interviews', data);
    if (response.success && response.data?.result) {
      return { success: true, data: response.data.result };
    }
    return { success: false, error: response.error || 'Failed to schedule interview' };
  },

  async getInterviews(filters: any = {}): Promise<ApiResponse<InterviewsResponse>> {
    const query = new URLSearchParams(filters).toString();
    const response = await apiClient.get<any>(`/interviews?${query}`);
    if (response.success && response.data?.result) {
      return { success: true, data: response.data.result };
    }
    return { success: false, error: response.error || 'Failed to fetch interviews' };
  },

  async updateInterview(id: string, data: any): Promise<ApiResponse<Interview>> {
    const response = await apiClient.patch<any>(`/interviews/${id}`, data);
    if (response.success && response.data?.result) {
      return { success: true, data: response.data.result };
    }
    return { success: false, error: response.error || 'Failed to update interview' };
  },

  async cancelInterview(id: string, reason: string): Promise<ApiResponse<Interview>> {
    const response = await apiClient.post<any>(`/interviews/${id}/cancel`, { reason });
    if (response.success && response.data?.result) {
      return { success: true, data: response.data.result };
    }
    return { success: false, error: response.error || 'Failed to cancel interview' };
  },
};
