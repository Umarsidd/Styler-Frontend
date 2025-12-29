import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const reviewService = {
    // Submit review
    submitReview: async (data) => {
        const response = await api.post(API_ENDPOINTS.REVIEWS_CREATE, data);
        return response.data;
    },

    // Get my reviews
    getMyReviews: async () => {
        const response = await api.get(API_ENDPOINTS.REVIEWS_MY);
        return response.data;
    },

    // Get salon reviews
    getSalonReviews: async (salonId, params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.rating) queryParams.append('rating', params.rating.toString());
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const endpoint = API_ENDPOINTS.REVIEWS_SALON.replace(':salonId', salonId);
        const url = `${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await api.get(url);
        return response.data;
    },

    // Get salon rating summary
    getSalonRating: async (salonId) => {
        const endpoint = API_ENDPOINTS.REVIEWS_SALON_RATING.replace(':salonId', salonId);
        const response = await api.get(endpoint);
        return response.data;
    },

    // Add response (salon owner)
    addResponse: async (reviewId, comment) => {
        const endpoint = API_ENDPOINTS.REVIEWS_RESPONSE.replace(':id', reviewId);
        const response = await api.post(endpoint, { comment });
        return response.data;
    },
};
