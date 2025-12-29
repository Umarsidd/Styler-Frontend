import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const appointmentService = {
    // Check availability
    checkAvailability: async (data) => {
        const response = await api.post(API_ENDPOINTS.APPOINTMENTS_CHECK_AVAILABILITY, data);
        return response.data;
    },

    // Create appointment
    createAppointment: async (data) => {
        const response = await api.post(API_ENDPOINTS.APPOINTMENTS_CREATE, data);
        return response.data;
    },

    // Get my appointments
    getMyAppointments: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.status) queryParams.append('status', params.status);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const url = `${API_ENDPOINTS.APPOINTMENTS_LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await api.get(url);
        return response.data;
    },

    // Get upcoming appointments
    getUpcomingAppointments: async () => {
        const response = await api.get(API_ENDPOINTS.APPOINTMENTS_UPCOMING);
        return response.data;
    },

    // Get appointment details
    getAppointmentById: async (id) => {
        const endpoint = API_ENDPOINTS.APPOINTMENTS_BY_ID.replace(':id', id);
        const response = await api.get(endpoint);
        return response.data;
    },

    // Update appointment status
    updateAppointmentStatus: async (id, status) => {
        const endpoint = API_ENDPOINTS.APPOINTMENTS_UPDATE_STATUS.replace(':id', id);
        const response = await api.patch(endpoint, { status });
        return response.data;
    },

    // Cancel appointment
    cancelAppointment: async (id, reason) => {
        const endpoint = API_ENDPOINTS.APPOINTMENTS_CANCEL.replace(':id', id);
        const response = await api.post(endpoint, { reason });
        return response.data;
    },

    // For salon owners
    getSalonAppointments: async (salonId, params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.status) queryParams.append('status', params.status);
        if (params.date) queryParams.append('date', params.date);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const endpoint = API_ENDPOINTS.APPOINTMENTS_SALON.replace(':salonId', salonId);
        const url = `${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await api.get(url);
        return response.data;
    },

    // Get salon statistics
    getSalonStatistics: async (salonId) => {
        const endpoint = API_ENDPOINTS.APPOINTMENTS_SALON_STATS.replace(':salonId', salonId);
        const response = await api.get(endpoint);
        return response.data;
    },
};
