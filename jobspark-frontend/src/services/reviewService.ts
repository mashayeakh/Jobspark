import { apiClient, ApiResponse } from '@/lib/api';

export interface Review {
  id: string;
  authorId: string;
  rating: number;
  content: string;
  company?: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    image: string | null;
    role: string;
    jobSeekerProfile?: {
      headline: string | null;
    } | null;
  };
}

export interface CreateReviewData {
  rating: number;
  content: string;
  company?: string;
  type?: string;
}

export class ReviewService {
  async getReviews(): Promise<ApiResponse<Review[]>> {
    const response = await apiClient.get<{ success: boolean; result: Review[] }>('/reviews');

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.result,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch reviews',
    };
  }

  async createReview(data: CreateReviewData): Promise<ApiResponse<Review>> {
    const response = await apiClient.post<{ success: boolean; result: Review }>('/reviews', data);

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.result,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to create review',
    };
  }
}

export const reviewService = new ReviewService();
