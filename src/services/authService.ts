import api from './api';
import { ApiResponse, AuthResponse, User, UserRole } from '../types';

// ==================== Request Types ====================

export interface LoginRequest {
    emailOrPhone: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    phone: string;
    password: string;
    name: string;
    role?: UserRole;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

// ==================== Auth Service ====================

class AuthService {
    /**
     * Register a new user
     */
    async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
        return response.data;
    }

    /**
     * Login user
     */
    async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
        return response.data;
    }

    /**
     * Logout user
     */
    async logout(): Promise<ApiResponse<void>> {
        const response = await api.post<ApiResponse<void>>('/auth/logout');
        return response.data;
    }

    /**
     * Get current user profile
     */
    async getProfile(): Promise<ApiResponse<User>> {
        const response = await api.get<ApiResponse<User>>('/auth/me');
        return response.data;
    }

    /**
     * Change password
     */
    async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
        const response = await api.post<ApiResponse<void>>('/auth/change-password', data);
        return response.data;
    }

    /**
     * Refresh access token
     */
    async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/refresh-token', data);
        return response.data;
    }

    /**
     * Request password reset
     */
    async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
        const response = await api.post<ApiResponse<void>>('/auth/forgot-password', { email });
        return response.data;
    }

    /**
     * Reset password with token
     */
    async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
        const response = await api.post<ApiResponse<void>>('/auth/reset-password', {
            token,
            newPassword,
        });
        return response.data;
    }
}

export const authService = new AuthService();
export default authService;
