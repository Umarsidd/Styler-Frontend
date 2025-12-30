import api from './api';
import { ApiResponse } from '../types';

// Response Types
export interface StatsOverview {
    totalUsers: number;
    totalSalons: number;
    totalAppointments: number;
    totalRevenue: number;
    activeUsers: number;
    pendingAppointments: number;
}

// Service Class
class StatsService {
    /**
     * Fetch statistics overview
     */
    async fetchStats(): Promise<ApiResponse<StatsOverview>> {
        const response = await api.get<ApiResponse<StatsOverview>>('/stats/overview');
        return response.data;
    }

    /**
     * Clear stats cache (admin only)
     */
    async clearStatsCache(): Promise<ApiResponse<{ message: string }>> {
        const response = await api.post<ApiResponse<{ message: string }>>('/stats/clear-cache');
        return response.data;
    }
}

export const statsService = new StatsService();
export default statsService;
