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
}

export const companyService = new CompanyService();
