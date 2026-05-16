/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient, ApiResponse } from '@/lib/api';

export interface Blog {
  id?: string | number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image?: string;
  status: 'Draft' | 'Published';
  date?: string;
  views?: string | number;
}

export interface GeneratedBlogResponse {
  title: string;
  excerpt: string;
  category: string;
  content: string;
}

export const blogService = {
  generateWithAI: async (topic: string): Promise<ApiResponse<GeneratedBlogResponse>> => {
    const res = await apiClient.post<any>('/ai/blog-generator/generate', { topic });
    
    // The backend wraps the payload in a 'result' object, but apiClient wraps everything in 'data'
    if (res.success && res.data && res.data.result) {
      return { success: true, data: res.data.result };
    }
    return res;
  },

  createBlog: async (blogData: Blog): Promise<ApiResponse<Blog>> => {
    const res = await apiClient.post<any>('/blogs', blogData);
    if (res.success && res.data && res.data.result) {
      return { success: true, data: res.data.result };
    }
    return res;
  },

  getAllBlogs: async (): Promise<ApiResponse<Blog[]>> => {
    const res = await apiClient.get<any>('/blogs');
    if (res.success && res.data && res.data.result) {
      return { success: true, data: res.data.result };
    }
    return res;
  },

  getSingleBlog: async (id: string): Promise<ApiResponse<Blog>> => {
    const res = await apiClient.get<any>(`/blogs/${id}`);
    if (res.success && res.data && res.data.result) {
      return { success: true, data: res.data.result };
    }
    return res;
  }
};
