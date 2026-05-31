import { apiClient, ApiResponse } from '@/lib/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  role?: string;
  companyName?: string;
  industry?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  status?: string;
  isDeleted?: boolean;
  emailVerified?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  result: {
    user: User;
    token: string; // session token
    accessToken: string;
    refreshToken: string;
  };
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    console.log('API Response:', response); // Debug log

    if (response.success && response.data) {
      console.log('Storing tokens to localStorage...');

      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.data.result.accessToken);
      localStorage.setItem('refreshToken', response.data.result.refreshToken);
      localStorage.setItem('sessionToken', response.data.result.token);
      localStorage.setItem('user', JSON.stringify(response.data.result.user));

      // Verify storage
      const storedTokens = {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        sessionToken: localStorage.getItem('sessionToken'),
        user: localStorage.getItem('user')
      };

      console.log('Tokens stored successfully:', storedTokens);
    } else {
      console.log('Login failed:', response);
    }

    return response;
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/register', data);
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>('/auth/logout');

    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('user');

    return response;
  }

  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    return apiClient.post<{ accessToken: string }>('/auth/refresh');
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/auth/me');
  }

  // Helper methods to get stored data
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  getSessionToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('sessionToken');
  }

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getSessionToken();
  }

  // Helper method to clear all auth data
  clearAuthData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService();
