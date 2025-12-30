import api from './api';
import { ApiResponse, User } from '../types';

// Request Types
export interface UpdateProfileRequest {
    name?: string;
    phone?: string;
    email?: string;
}

// Service Class
class UserService {
    /**
     * Get user profile
     */
    async getProfile(): Promise<ApiResponse<User>> {
        const response = await api.get<ApiResponse<User>>('/user/profile');
        return response.data;
    }

    /**
     * Update user profile
     */
    async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
        const response = await api.put<ApiResponse<User>>('/user/profile', data);
        return response.data;
    }

    /**
     * Upload profile picture
     */
    async uploadProfilePicture(file: File): Promise<ApiResponse<{ url: string }>> {
        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await api.post<ApiResponse<{ url: string }>>('/user/upload-profile-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    /**
     * Delete account
     */
    async deleteAccount(): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>('/user/account');
        return response.data;
    }
}

export const userService = new UserService();
export default userService;
