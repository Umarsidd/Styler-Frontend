import api from './api';
import { ApiResponse, Review } from '../types';

// Request Types
export interface SubmitReviewRequest {
    targetType: 'salon' | 'barber';
    targetId: string;
    appointmentId: string;
    rating: number;
    comment: string;
    images?: string[];
}

export interface ReviewFilters {
    rating?: number;
    page?: number;
    limit?: number;
}

// Service Class
class ReviewService {
    /**
     * Submit a review
     */
    async submitReview(data: SubmitReviewRequest): Promise<ApiResponse<Review>> {
        const response = await api.post<ApiResponse<Review>>('/reviews', data);
        return response.data;
    }

    /**
     * Get my reviews
     */
    async getMyReviews(): Promise<ApiResponse<Review[]>> {
        const response = await api.get<ApiResponse<Review[]>>('/reviews/my');
        return response.data;
    }

    /**
     * Get salon reviews
     */
    async getSalonReviews(salonId: string, params: ReviewFilters = {}): Promise<ApiResponse<Review[]>> {
        const queryParams = new URLSearchParams();
        if (params.rating) queryParams.append('rating', params.rating.toString());
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const url = `/reviews/salon/${salonId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await api.get<ApiResponse<Review[]>>(url);
        return response.data;
    }

    /**
     * Get barber reviews
     */
    async getBarberReviews(barberId: string, params: ReviewFilters = {}): Promise<ApiResponse<Review[]>> {
        const queryParams = new URLSearchParams();
        if (params.rating) queryParams.append('rating', params.rating.toString());
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const url = `/reviews/barber/${barberId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await api.get<ApiResponse<Review[]>>(url);
        return response.data;
    }

    /**
     * Add response to review (salon owner)
     */
    async addResponse(reviewId: string, comment: string): Promise<ApiResponse<Review>> {
        const response = await api.post<ApiResponse<Review>>(`/reviews/${reviewId}/response`, { comment });
        return response.data;
    }
}

export const reviewService = new ReviewService();
export default reviewService;
