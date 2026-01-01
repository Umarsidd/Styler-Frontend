import api from './api';
import { ApiResponse, User } from '../types';

// Request Types
export interface UpdateProfileRequest {
    name?: string;
    phone?: string;
    email?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        country?: string;
    };
}

// Service Class
class UserService {
    /**
     * Get user profile
     */
    async getProfile(): Promise<ApiResponse<User>> {
        const response = await api.get<ApiResponse<User>>('/auth/me');
        return response.data;
    }

    /**
     * Update user profile
     */
    async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
        const response = await api.put<ApiResponse<User>>('/auth/profile', data);
        return response.data;
    }

    /**
     * Upload profile picture
     */
    async uploadProfilePicture(file: File): Promise<ApiResponse<{ profilePicture: string }>> {
        const formData = new FormData();
        formData.append('profilePicture', file);

        const response = await api.post<ApiResponse<{ profilePicture: string }>>(
            '/auth/upload-profile-picture',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    }

    /**
     * Upload cover image
     */
    async uploadCoverImage(file: File): Promise<ApiResponse<{ coverImage: string }>> {
        const formData = new FormData();
        formData.append('coverImage', file);

        const response = await api.post<ApiResponse<{ coverImage: string }>>(
            '/auth/upload-cover-image',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
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
