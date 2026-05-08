import { apiClient, ApiResponse } from '@/lib/api';

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  subcategories: Subcategory[];
  _count: {
    jobs: number;
  };
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  result: Category[];
}

export class CategoryService {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await apiClient.get<CategoryResponse>('/categories');

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.result,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch categories',
    };
  }

  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    const response = await apiClient.get<{ success: boolean; result: Category }>(`/categories/${slug}`);

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.result,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch category',
    };
  }

  async getActiveCategories(): Promise<ApiResponse<Category[]>> {
    const response = await this.getCategories();

    if (response.success && response.data) {
      const activeCategories = response.data.filter(category => category.isActive);
      return {
        success: true,
        data: activeCategories.sort((a, b) => a.sortOrder - b.sortOrder),
      };
    }

    return response;
  }
}

export const categoryService = new CategoryService();
