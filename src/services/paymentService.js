import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const paymentService = {
    // Initiate payment
    initiatePayment: async (appointmentId, method) => {
        const response = await api.post(API_ENDPOINTS.PAYMENTS_INITIATE, {
            appointmentId,
            method,
        });
        return response.data;
    },

    // Verify payment
    verifyPayment: async (orderId, paymentId, signature) => {
        const response = await api.post(API_ENDPOINTS.PAYMENTS_VERIFY, {
            orderId,
            paymentId,
            signature,
        });
        return response.data;
    },

    // Get payment history
    getPaymentHistory: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.status) queryParams.append('status', params.status);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const url = `${API_ENDPOINTS.PAYMENTS_LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await api.get(url);
        return response.data;
    },

    // Request refund
    requestRefund: async (paymentId, reason) => {
        const endpoint = API_ENDPOINTS.PAYMENTS_REFUND.replace(':id', paymentId);
        const response = await api.post(endpoint, { reason });
        return response.data;
    },

    // For salon owners
    getSalonPaymentStatistics: async (salonId) => {
        const endpoint = API_ENDPOINTS.PAYMENTS_SALON_STATS.replace(':salonId', salonId);
        const response = await api.get(endpoint);
        return response.data;
    },
};
