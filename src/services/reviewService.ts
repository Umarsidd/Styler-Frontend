import api from './api';
import { ApiResponse, Review, PaginatedResponse } from '../types';

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
    async getMyReviews(filters: ReviewFilters = {}): Promise<ApiResponse<PaginatedResponse<Review>>> {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get<ApiResponse<PaginatedResponse<Review>>>(`/reviews/my?${params.toString()}`);
        return response.data;
    }

    /**
     * Get salon reviews
     */
    async getSalonReviews(
        salonId: string,
        filters: ReviewFilters = {}
    ): Promise<ApiResponse<PaginatedResponse<Review>>> {
        const params = new URLSearchParams();

        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.rating) params.append('rating', filters.rating.toString());

        const response = await api.get<ApiResponse<PaginatedResponse<Review>>>(
            `/reviews/salon/${salonId}?${params.toString()}`
        );
        return response.data;
    }

    /**
     * Get salon rating summary
     */
    async getSalonRatingSummary(salonId: string): Promise<ApiResponse<{
        averageRating: number;
        totalReviews: number;
        ratingDistribution: {
            5: number;
            4: number;
            3: number;
            2: number;
            1: number;
        };
    }>> {
        const response = await api.get<ApiResponse<any>>(`/reviews/salon/${salonId}/rating`);
        return response.data;
    }

    /**
     * Add response to review (salon owner)
     */
    async addResponse(reviewId: string, responseText: string): Promise<ApiResponse<Review>> {
        const response = await api.post<ApiResponse<Review>>(`/reviews/${reviewId}/response`, {
            response: responseText,
        });
        return response.data;
    }

    /**
     * Get barber reviews
     */
    async getBarberReviews(
        barberId: string,
        filters: ReviewFilters = {}
    ): Promise<ApiResponse<PaginatedResponse<Review>>> {
        const params = new URLSearchParams();

        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.rating) params.append('rating', filters.rating.toString());

        const response = await api.get<ApiResponse<PaginatedResponse<Review>>>(
            `/reviews/barber/${barberId}?${params.toString()}`
        );
        return response.data;
    }
}

export const reviewService = new ReviewService();
export default reviewService;
