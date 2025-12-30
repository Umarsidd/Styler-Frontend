import { create } from 'zustand';
import { Review } from '../types';
import reviewService from '../services/reviewService';

interface ReviewState {
    reviews: Review[];
    myReviews: Review[];
    salonReviews: Review[];
    currentReview: Review | null;
    ratingSummary: {
        averageRating: number;
        totalReviews: number;
        ratingDistribution: {
            5: number;
            4: number;
            3: number;
            2: number;
            1: number;
        };
    } | null;
    loading: boolean;
    error: string | null;

    // Actions
    submitReview: (data: any) => Promise<Review>;
    fetchMyReviews: (filters?: { page?: number; limit?: number }) => Promise<void>;
    fetchSalonReviews: (salonId: string, filters?: { page?: number; limit?: number; rating?: number }) => Promise<void>;
    fetchSalonRatingSummary: (salonId: string) => Promise<void>;
    fetchBarberReviews: (barberId: string, filters?: { page?: number; limit?: number; rating?: number }) => Promise<void>;
    addResponse: (reviewId: string, response: string) => Promise<void>;
    clearError: () => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
    reviews: [],
    myReviews: [],
    salonReviews: [],
    currentReview: null,
    ratingSummary: null,
    loading: false,
    error: null,

    submitReview: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await reviewService.submitReview(data);
            if (response.success && response.data) {
                set({ currentReview: response.data, loading: false });
                return response.data;
            }
            throw new Error('Failed to submit review');
        } catch (error: any) {
            set({ error: error.message || 'Failed to submit review', loading: false });
            throw error;
        }
    },

    fetchMyReviews: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await reviewService.getMyReviews(filters);
            if (response.success && response.data) {
                set({ myReviews: response.data.data, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch reviews', loading: false });
        }
    },

    fetchSalonReviews: async (salonId, filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await reviewService.getSalonReviews(salonId, filters);
            if (response.success && response.data) {
                set({ salonReviews: response.data.data, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch salon reviews', loading: false });
        }
    },

    fetchSalonRatingSummary: async (salonId) => {
        set({ loading: true, error: null });
        try {
            const response = await reviewService.getSalonRatingSummary(salonId);
            if (response.success && response.data) {
                set({ ratingSummary: response.data, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch rating summary', loading: false });
        }
    },

    fetchBarberReviews: async (barberId, filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await reviewService.getBarberReviews(barberId, filters);
            if (response.success && response.data) {
                set({ reviews: response.data.data, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch barber reviews', loading: false });
        }
    },

    addResponse: async (reviewId, responseText) => {
        set({ loading: true, error: null });
        try {
            const response = await reviewService.addResponse(reviewId, responseText);
            if (response.success && response.data) {
                // Update the review in salon reviews
                set((state) => ({
                    salonReviews: state.salonReviews.map((review) =>
                        review._id === reviewId ? response.data! : review
                    ),
                    loading: false,
                }));
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to add response', loading: false });
            throw error;
        }
    },

    clearError: () => {
        set({ error: null });
    },
}));
