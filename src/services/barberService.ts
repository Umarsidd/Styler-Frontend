import api from './api';
import { ApiResponse, Barber, BarberStatus } from '../types';

// ==================== Request Types ====================

export interface RegisterBarberRequest {
    experience: number;
    specialties: string[];
    bio?: string;
    certifications?: string[];
}

export interface UpdateAvailabilityRequest {
    availability: Array<{
        day: string;
        slots: Array<{
            startTime: string;
            endTime: string;
        }>;
    }>;
}

export interface UploadDocumentsRequest {
    documents: string[]; // URLs or file IDs
}

// ==================== Barber Service ====================

class BarberService {
    /**
     * Register as barber
     */
    async registerAsBarber(data: RegisterBarberRequest): Promise<ApiResponse<Barber>> {
        const response = await api.post<ApiResponse<Barber>>('/barbers', data);
        return response.data;
    }

    /**
     * Get barber profile
     */
    async getBarberProfile(id: string): Promise<ApiResponse<Barber>> {
        const response = await api.get<ApiResponse<Barber>>(`/barbers/${id}`);
        return response.data;
    }

    /**
     * Update barber profile
     */
    async updateBarberProfile(id: string, data: Partial<RegisterBarberRequest>): Promise<ApiResponse<Barber>> {
        const response = await api.put<ApiResponse<Barber>>(`/barbers/${id}`, data);
        return response.data;
    }

    /**
     * Upload verification documents
     */
    async uploadDocuments(id: string, data: UploadDocumentsRequest): Promise<ApiResponse<Barber>> {
        const response = await api.post<ApiResponse<Barber>>(`/barbers/${id}/documents`, data);
        return response.data;
    }

    /**
     * Get barber availability
     */
    async getAvailability(): Promise<ApiResponse<any>> {
        const response = await api.get<ApiResponse<any>>('/barbers/availability');
        return response.data;
    }

    /**
     * Update barber availability
     */
    async updateAvailability(data: { date: string; isAvailable: boolean; startTime?: string; endTime?: string }): Promise<ApiResponse<any>> {
        const response = await api.put<ApiResponse<any>>('/barbers/availability', data);
        return response.data;
    }

    /**
     * Get salon barbers (public)
     */
    async getSalonBarbers(salonId: string): Promise<ApiResponse<Barber[]>> {
        const response = await api.get<ApiResponse<Barber[]>>(`/barbers/salon/${salonId}`);
        return response.data;
    }

    /**
     * Get pending barber approvals (salon owner)
     */
    async getPendingBarbers(): Promise<ApiResponse<Barber[]>> {
        const response = await api.get<ApiResponse<Barber[]>>('/barbers/pending');
        return response.data;
    }

    /**
     * Get approved barbers (salon owner)
     */
    async getApprovedBarbers(): Promise<ApiResponse<Barber[]>> {
        const response = await api.get<ApiResponse<Barber[]>>('/barbers/approved');
        return response.data;
    }

    /**
     * Approve barber (salon owner)
     */
    async approveBarber(id: string): Promise<ApiResponse<Barber>> {
        const response = await api.post<ApiResponse<Barber>>(`/barbers/${id}/approve`);
        return response.data;
    }

    /**
     * Reject barber (salon owner)
     */
    async rejectBarber(id: string): Promise<ApiResponse<Barber>> {
        const response = await api.post<ApiResponse<Barber>>(`/barbers/${id}/reject`);
        return response.data;
    }

    /**
     * Get barber statistics
     */
    async getBarberStats(): Promise<ApiResponse<any>> {
        const response = await api.get<ApiResponse<any>>('/barbers/stats');
        return response.data;
    }
}

export const barberService = new BarberService();
export default barberService;
