import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const barberService = {
    // Register as barber
    registerAsBarber: async (data) => {
        const response = await api.post(API_ENDPOINTS.BARBERS_REGISTER, data);
        return response.data;
    },

    // Get barber profile
    getBarberById: async (id) => {
        const endpoint = API_ENDPOINTS.BARBERS_BY_ID.replace(':id', id);
        const response = await api.get(endpoint);
        return response.data;
    },

    // Update barber profile
    updateBarber: async (id, data) => {
        const endpoint = API_ENDPOINTS.BARBERS_UPDATE.replace(':id', id);
        const response = await api.put(endpoint, data);
        return response.data;
    },

    // Upload documents
    uploadDocuments: async (id, files) => {
        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`documents`, file);
        });

        const endpoint = API_ENDPOINTS.BARBERS_UPLOAD_DOCS.replace(':id', id);
        const response = await api.post(endpoint, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    // Update availability
    updateAvailability: async (id, availability) => {
        const endpoint = API_ENDPOINTS.BARBERS_UPDATE_AVAILABILITY.replace(':id', id);
        const response = await api.put(endpoint, { availability });
        return response.data;
    },

    // Get barbers by salon (public)
    getSalonBarbers: async (salonId) => {
        const endpoint = API_ENDPOINTS.BARBERS_BY_SALON.replace(':salonId', salonId);
        const response = await api.get(endpoint);
        return response.data;
    },

    // For salon owners
    getPendingBarbers: async (salonId) => {
        const endpoint = API_ENDPOINTS.BARBERS_PENDING.replace(':salonId', salonId);
        const response = await api.get(endpoint);
        return response.data;
    },

    approveBarber: async (barberId) => {
        const endpoint = API_ENDPOINTS.BARBERS_APPROVE.replace(':id', barberId);
        const response = await api.post(endpoint);
        return response.data;
    },

    rejectBarber: async (barberId, reason) => {
        const endpoint = API_ENDPOINTS.BARBERS_REJECT.replace(':id', barberId);
        const response = await api.post(endpoint, { reason });
        return response.data;
    },
};
