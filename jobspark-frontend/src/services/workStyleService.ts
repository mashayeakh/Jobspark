import { apiClient, ApiResponse } from '@/lib/api';

export interface WorkStyle {
  id: number;
  label: string;
  value: string;
}

export interface JobType {
  label: string;
  value: string;
}

export interface ExperienceLevel {
  label: string;
  value: string;
}

export interface LocationType {
  label: string;
  value: string;
}

export interface WorkStyleResponse {
  success: boolean;
  message: string;
  result: WorkStyle[];
}

export interface JobTypeResponse {
  success: boolean;
  message: string;
  result: JobType[];
}

export interface ExperienceLevelResponse {
  success: boolean;
  message: string;
  result: ExperienceLevel[];
}

export interface LocationTypeResponse {
  success: boolean;
  message: string;
  result: LocationType[];
}

export class WorkStyleService {
  async getWorkStyles(): Promise<ApiResponse<WorkStyle[]>> {
    const response = await apiClient.get<WorkStyleResponse>('/workstyles');

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.result,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch work styles',
    };
  }

  async getJobTypes(): Promise<ApiResponse<JobType[]>> {
    const response = await apiClient.get<JobTypeResponse>('/workstyles/job-types');

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.result,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch job types',
    };
  }

  async getExperienceLevels(): Promise<ApiResponse<ExperienceLevel[]>> {
    const response = await apiClient.get<ExperienceLevelResponse>('/workstyles/experience-levels');

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.result,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch experience levels',
    };
  }

  async getLocationTypes(): Promise<ApiResponse<LocationType[]>> {
    const response = await apiClient.get<LocationTypeResponse>('/workstyles/location-types');

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.result,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch location types',
    };
  }

  async getActiveWorkStyles(): Promise<ApiResponse<WorkStyle[]>> {
    const response = await this.getWorkStyles();

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return response;
  }

  async getActiveJobTypes(): Promise<ApiResponse<JobType[]>> {
    const response = await this.getJobTypes();

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return response;
  }

  async getActiveExperienceLevels(): Promise<ApiResponse<ExperienceLevel[]>> {
    const response = await this.getExperienceLevels();

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return response;
  }

  async getActiveLocationTypes(): Promise<ApiResponse<LocationType[]>> {
    const response = await this.getLocationTypes();

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return response;
  }
}

export const workStyleService = new WorkStyleService();
