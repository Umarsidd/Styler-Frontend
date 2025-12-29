import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const authService = {
    // Register new user
    register: async (data) => {
        const response = await api.post(API_ENDPOINTS.AUTH_REGISTER, data);
        return response.data;
    },

    // Login user
    login: async (data) => {
        const response = await api.post(API_ENDPOINTS.AUTH_LOGIN, {
            emailOrPhone: data.emailOrPhone || data.email,
            password: data.password,
        });
        return response.data;
    },

    // Logout user
    logout: async () => {
        const response = await api.post(API_ENDPOINTS.AUTH_LOGOUT);
        return response.data;
    },

    // Get current user profile
    getMe: async () => {
        const response = await api.get(API_ENDPOINTS.AUTH_ME);
        return response.data;
    },

    // Change password
    changePassword: async (oldPassword, newPassword) => {
        const response = await api.post(API_ENDPOINTS.AUTH_CHANGE_PASSWORD, {
            oldPassword,
            newPassword,
        });
        return response.data;
    },

    // Refresh token (handled by axios interceptor, but can be called manually)
    refreshToken: async (refreshToken) => {
        const response = await api.post(API_ENDPOINTS.AUTH_REFRESH_TOKEN, {
            refreshToken,
        });
        return response.data;
    },

    //Legacy methods for backward compatibility
    updateProfile: async (userData) => {
        // Can be implemented later if needed
        return authService.getMe();
    },

    getProfile: async () => {
        return authService.getMe();
    },
};
