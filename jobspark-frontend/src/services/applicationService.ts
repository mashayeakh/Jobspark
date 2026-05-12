import { apiClient, ApiResponse } from '@/lib/api';
import { Job } from '@/services/jobService';

export interface ApplicationStatusLog {
    id: string;
    status: string;
    reason?: string | null;
    changedAt: string;
}

export interface ApplicationWithJob {
    id: string;
    status: string;
    appliedAt: string;
    updatedAt: string;
    job: Job;
    logs: ApplicationStatusLog[];
}

export class ApplicationService {
    async getMyApplications(): Promise<ApiResponse<ApplicationWithJob[]>> {
        const response = await apiClient.get<{ success: boolean; result: ApplicationWithJob[] }>('/applications/my-applications');

        if (response.success && response.data) {
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
}

export const applicationService = new ApplicationService();
