import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/constants';
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
} from '@/types/auth';
import type { ApiSuccessResponse } from '@/types/api';

/**
 * Auth API service.
 * All auth endpoints rely on httpOnly cookies — no tokens in JS memory.
 */
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiSuccessResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
    return res.data.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiSuccessResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      credentials,
    );
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<ApiSuccessResponse<User>>(API_ENDPOINTS.AUTH.ME);
    return res.data.data;
  },

  refreshToken: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.REFRESH);
  },
};
