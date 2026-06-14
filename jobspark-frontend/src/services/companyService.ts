/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/api';

export interface Company {
  id: string;
  name: string;
  logo: string | null;
  website: string | null;
  description: string | null;
  industry: string;
  size: string | null;
  location: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  benefits: string | null;
  email: string | null;
  mission: string | null;
  phone: string | null;
  socialLinks: any | null;
  tagline: string | null;
  values: string | null;
  foundedYear: string | null;
  headquarters: string | null;
  _count?: {
    jobs: number;
  };
  jobs?: any[];
  recruiters?: any[];
  coverImage?: string | null;
}

class CompanyService {
  async getAllCompanies(): Promise<Company[]> {
    const response = await apiClient.get<any>('/companies');
    if (response.success && response.data?.result) {
        return response.data.result;
    }
    return [];
  }

  async getCompanyById(id: string): Promise<Company | null> {
    console.log("Fetching company with ID:", id);
    const response = await apiClient.get<any>(`/companies/${id}`);
    console.log("Response from apiClient:", response);
    if (response.success && response.data?.result) {
        return response.data.result;
    }
    return null;
  }

  async getPipelineStages(companyId: string) {
    const response = await apiClient.get<any>(`/companies/${companyId}/pipeline-stages`);
    return response.success && response.data?.result ? response.data.result : [];
  }

  async createPipelineStage(companyId: string, data: any) {
    const response = await apiClient.post<any>(`/companies/${companyId}/pipeline-stages`, data);
    return response.success ? response.data?.result : null;
  }

  async updatePipelineStage(companyId: string, stageId: string, data: any) {
    const response = await apiClient.patch<any>(`/companies/${companyId}/pipeline-stages/${stageId}`, data);
    return response.success ? response.data?.result : null;
  }

  async deletePipelineStage(companyId: string, stageId: string) {
    const response = await apiClient.delete<any>(`/companies/${companyId}/pipeline-stages/${stageId}`);
    return response.success;
  }

  async reorderPipelineStages(companyId: string, stages: {id: string, order: number}[]) {
    const response = await apiClient.put<any>(`/companies/${companyId}/pipeline-stages/reorder`, { stages });
    return response.success;
  }
}

export const companyService = new CompanyService();
