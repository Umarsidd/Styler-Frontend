import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const salonService = {
    // Search salons with filters
    searchSalons: async (filters) => {
        const params = new URLSearchParams();
        if (filters.name) params.append('name', filters.name);
        if (filters.city) params.append('city', filters.city);
        if (filters.serviceType) params.append('serviceType', filters.serviceType);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get(`${API_ENDPOINTS.SALONS_SEARCH}?${params.toString()}`);
        return response.data;
    },

    // Find nearby salons
    getNearbySalons: async ({ lat, lng, radius = 10, page = 1, limit = 20 }) => {
        const params = new URLSearchParams({
            lat: lat.toString(),
            lng: lng.toString(),
            radius: radius.toString(),
            page: page.toString(),
            limit: limit.toString(),
        });

        const response = await api.get(`${API_ENDPOINTS.SALONS_NEARBY}?${params.toString()}`);
        return response.data;
    },

    // Get salon details
    getSalonById: async (id) => {
        const endpoint = API_ENDPOINTS.SALONS_BY_ID.replace(':id', id);
        const response = await api.get(endpoint);
        return response.data;
    },

    // Get salon services
    getSalonServices: async (id) => {
        const endpoint = API_ENDPOINTS.SALONS_SERVICES.replace(':id', id);
        const response = await api.get(endpoint);
        return response.data;
    },

    // For salon owners
    getMySalons: async () => {
        const response = await api.get(API_ENDPOINTS.SALONS_MY);
        return response.data;
    },

    createSalon: async (data) => {
        const response = await api.post(API_ENDPOINTS.SALONS_CREATE, data);
        return response.data;
    },

    updateSalon: async (id, data) => {
        const endpoint = API_ENDPOINTS.SALONS_UPDATE.replace(':id', id);
        const response = await api.put(endpoint, data);
        return response.data;
    },

    deleteSalon: async (id) => {
        const endpoint = API_ENDPOINTS.SALONS_DELETE.replace(':id', id);
        const response = await api.delete(endpoint);
        return response.data;
    },

    // Service management
    addService: async (salonId, data) => {
        const endpoint = API_ENDPOINTS.SALONS_ADD_SERVICE.replace(':id', salonId);
        const response = await api.post(endpoint, data);
        return response.data;
    },

    updateService: async (salonId, serviceId, data) => {
        const endpoint = API_ENDPOINTS.SALONS_UPDATE_SERVICE
            .replace(':id', salonId)
            .replace(':serviceId', serviceId);
        const response = await api.put(endpoint, data);
        return response.data;
    },

    deleteService: async (salonId, serviceId) => {
        const endpoint = API_ENDPOINTS.SALONS_DELETE_SERVICE
            .replace(':id', salonId)
            .replace(':serviceId', serviceId);
        const response = await api.delete(endpoint);
        return response.data;
    },

    updateOperatingHours: async (salonId, hours) => {
        const endpoint = API_ENDPOINTS.SALONS_UPDATE_HOURS.replace(':id', salonId);
        const response = await api.put(endpoint, { operatingHours: hours });
        return response.data;
    },
};
