/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient, ApiResponse } from '@/lib/api';

export interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalCompanies: number;
  openJobs: number;
  pendingApplications: number;
  // Growth metrics (placeholder for now)
  userGrowth?: number;
  jobGrowth?: number;
  revenueGrowth?: number;
  pendingGrowth?: number;
  // For backward compatibility
  totalRevenue?: number;
  pendingJobs?: number;
  aiInsights?: Array<{ title: string; desc: string; type: string; time: string }>;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  website?: string;
  industry?: string;
  size?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  companyId: string;
  company?: Company;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  type: string;
  location: string;
  salary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

class AdminService {
  // Dashboard
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await apiClient.get<any>('/admin/dashboard');
    if (response.success && response.data?.result?.overview) {
      // Extract overview data and map to our interface
      const overview = response.data.result.overview;
      return {
        success: true,
        data: {
          ...overview,
          // Map for backward compatibility
          totalRevenue: 0, // Placeholder - not available in backend yet
          pendingJobs: overview.pendingApplications || 0,
          // Add placeholder growth metrics
          userGrowth: 0,
          jobGrowth: 0,
          revenueGrowth: 0,
          pendingGrowth: 0,
          aiInsights: response.data.result.aiInsights || []
        }
      };
    }
    return response;
  }

  async getAnalyticsHistory(days: number = 30): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get<any>('/admin/dashboard/history', { days: days.toString() });
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  async getAdvancedAnalytics(year?: number): Promise<ApiResponse<any>> {
    const params = year ? { year: year.toString() } : undefined;
    const response = await apiClient.get<any>('/admin/dashboard/advanced-analytics', params);
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  async getAIHealthReport(): Promise<ApiResponse<any>> {
    const response = await apiClient.get<any>('/admin/dashboard/ai-health-report');
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  // User Management
  async getUsers(params?: { page?: number; limit?: number; search?: string; role?: string }): Promise<ApiResponse<{ users: User[]; total: number }>> {
    const stringParams = params ? Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, value?.toString()])
    ) : undefined;
    const response = await apiClient.get<any>('/admin/users', stringParams);
    if (response.success && response.data?.result) {
      // Backend returns users directly in result, wrap it for frontend
      return {
        success: true,
        data: {
          users: Array.isArray(response.data.result) ? response.data.result : [],
          total: Array.isArray(response.data.result) ? response.data.result.length : 0
        }
      };
    }
    return response;
  }

  async blockUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/admin/users/${userId}/block`);
  }

  async unblockUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/admin/users/${userId}/unblock`);
  }

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/admin/users/${userId}`);
  }

  // Company Management
  async getCompanies(params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<{ companies: Company[]; total: number }>> {
    const stringParams = params ? Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, value?.toString()])
    ) : undefined;
    const response = await apiClient.get<any>('/admin/companies', stringParams);
    if (response.success && response.data?.result) {
      // Backend returns companies directly in result, wrap it for frontend
      return {
        success: true,
        data: {
          companies: Array.isArray(response.data.result) ? response.data.result : [],
          total: Array.isArray(response.data.result) ? response.data.result.length : 0
        }
      };
    }
    return response;
  }

  async verifyCompany(companyId: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/admin/companies/${companyId}/verify`);
  }

  // Job Management
  async getJobs(params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<{ jobs: Job[]; total: number }>> {
    const stringParams = params ? Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, value?.toString()])
    ) : undefined;
    const response = await apiClient.get<any>('/admin/jobs', stringParams);
    if (response.success && response.data?.result) {
      // Backend returns jobs directly in result, wrap it for frontend
      return {
        success: true,
        data: {
          jobs: Array.isArray(response.data.result) ? response.data.result : [],
          total: Array.isArray(response.data.result) ? response.data.result.length : 0
        }
      };
    }
    return response;
  }

  async updateJobStatus(jobId: string, status: 'APPROVED' | 'REJECTED'): Promise<ApiResponse<void>> {
    return apiClient.patch<void>(`/admin/jobs/${jobId}/status`, { status });
  }

  // Skills Management
  async getSkills(): Promise<ApiResponse<Skill[]>> {
    const response = await apiClient.get<any>('/admin/skills');
    if (response.success && response.data?.result) {
      // Backend returns skills directly in result
      return {
        success: true,
        data: Array.isArray(response.data.result) ? response.data.result : []
      };
    }
    return response;
  }

  async createSkill(name: string, categoryId?: string): Promise<ApiResponse<Skill>> {
    return apiClient.post<Skill>('/admin/skills', { name, categoryId });
  }

  async deleteSkill(skillId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/admin/skills/${skillId}`);
  }

  // Categories Management
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await apiClient.get<any>('/categories');
    if (response.success && response.data?.result) {
      // Backend returns categories directly in result
      return {
        success: true,
        data: Array.isArray(response.data.result) ? response.data.result : []
      };
    }
    return response;
  }

  async createCategory(name: string, description?: string, parentId?: string): Promise<ApiResponse<Category>> {
    return apiClient.post<Category>('/categories/create', { name, description, parentId });
  }

  async deleteCategory(categoryId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/admin/categories/${categoryId}`);
  }

  // Fraud Shield
  async getFraudStats(): Promise<ApiResponse<any>> {
    const response = await apiClient.get<any>('/admin/fraud-shield/stats');
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  async getFlaggedJobs(params?: { limit?: number; offset?: number; riskLevel?: string }): Promise<ApiResponse<any>> {
    const stringParams = params ? Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, value?.toString()])
    ) : undefined;
    const response = await apiClient.get<any>('/admin/fraud-shield/flagged', stringParams);
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  async getFraudAlerts(limit?: number): Promise<ApiResponse<any>> {
    const response = await apiClient.get<any>('/admin/fraud-shield/alerts', limit ? { limit: limit.toString() } : undefined);
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  async getFraudMetrics(days?: number): Promise<ApiResponse<any>> {
    const response = await apiClient.get<any>('/admin/fraud-shield/metrics', days ? { days: days.toString() } : undefined);
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  async analyzeAllJobs(): Promise<ApiResponse<any>> {
    const response = await apiClient.post<any>('/admin/fraud-shield/analyze-all');
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  async analyzeJob(jobId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get<any>(`/admin/fraud-shield/analyze/${jobId}`);
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  async overrideFraudDetection(jobId: string, status: 'SAFE' | 'FLAGGED', reason: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/admin/fraud-shield/override/${jobId}`, { status, reason });
  }

  async triggerAnalysis(jobId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post<any>(`/admin/fraud-shield/trigger/${jobId}`);
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  // Market Intelligence
  async getIndustryTrends(days?: number): Promise<ApiResponse<any>> {
    const response = await apiClient.get<any>('/admin/market-intelligence/trends', days ? { days: days.toString() } : undefined);
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  async getMarketSurge(days?: number): Promise<ApiResponse<any>> {
    const response = await apiClient.get<any>('/admin/market-intelligence/surge', days ? { days: days.toString() } : undefined);
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  async getDemandForecast(days?: number): Promise<ApiResponse<any>> {
    const response = await apiClient.get<any>('/admin/market-intelligence/forecast', days ? { days: days.toString() } : undefined);
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  async getCompetitiveIntelligence(days?: number): Promise<ApiResponse<any>> {
    const response = await apiClient.get<any>('/admin/market-intelligence/competitive', days ? { days: days.toString() } : undefined);
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  async getMarketIntelligenceDashboard(days?: number): Promise<ApiResponse<any>> {
    const response = await apiClient.get<any>('/admin/market-intelligence/dashboard', days ? { days: days.toString() } : undefined);
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  // Churn Prediction
  async getChurnPredictions(): Promise<ApiResponse<any>> {
    const response = await apiClient.get<any>('/admin/churn-predictor');
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  async retrainChurnModel(): Promise<ApiResponse<any>> {
    const response = await apiClient.post<any>('/admin/churn-predictor/retrain');
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  // Anomaly Detection
  async getAnomalyStats(): Promise<ApiResponse<any>> {
    const response = await apiClient.get<any>('/admin/anomaly-detection/stats');
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  async getAnomalies(): Promise<ApiResponse<any>> {
    const response = await apiClient.get<any>('/admin/anomaly-detection/anomalies');
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  async resolveAnomaly(anomalyId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post<any>(`/admin/anomaly-detection/resolve/${anomalyId}`);
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  async analyzeTraffic(): Promise<ApiResponse<any>> {
    const response = await apiClient.post<any>('/admin/anomaly-detection/analyze');
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  // Platform Settings
  async getPlatformSettings(): Promise<ApiResponse<any>> {
    const response = await apiClient.get<any>('/admin/settings');
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  async updatePlatformSettings(settings: any): Promise<ApiResponse<any>> {
    const response = await apiClient.patch<any>('/admin/settings', settings);
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

  async optimizePlatformSettings(): Promise<ApiResponse<any>> {
    const response = await apiClient.post<any>('/admin/settings/optimize');
    if (response.success && response.data?.result) {
      return {
        success: true,
        data: response.data.result
      };
    }
    return response;
  }

}

export const adminService = new AdminService();
