import { create } from 'zustand';
import { Salon } from '../types';
import salonService from '../services/salonService';

interface SalonOwnerStats {
    totalSalons: number;
    totalStaff: number;
    totalBookings: number;
    monthlyRevenue: number;
}

interface SalonState {
    stats: SalonOwnerStats | null;
    mySalons: Salon[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchOwnerStats: () => Promise<void>;
    fetchMySalons: () => Promise<void>;
    registerSalon: (data: any) => Promise<void>;
    deleteSalon: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useSalonStore = create<SalonState>((set) => ({
    stats: null,
    mySalons: [],
    loading: false,
    error: null,

    fetchOwnerStats: async () => {
        set({ loading: true, error: null });
        try {
            const response = await salonService.getOwnerStats();
            if (response.success && response.data) {
                set({
                    stats: {
                        totalSalons: response.data.totalSalons || 0,
                        totalStaff: response.data.totalStaff || 0,
                        totalBookings: response.data.totalBookings || 0,
                        monthlyRevenue: response.data.monthlyRevenue || 0,
                    },
                    loading: false
                });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch salon owner stats', loading: false });
        }
    },

    fetchMySalons: async () => {
        set({ loading: true, error: null });
        try {
            const response = await salonService.getMySalons();
            if (response.success && response.data) {
                set({ mySalons: response.data, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch my salons', loading: false });
        }
    },

    registerSalon: async (data: any) => {
        set({ loading: true, error: null });
        try {
            const response = await salonService.createSalon(data);
            if (response.success && response.data) {
                set((state) => ({
                    mySalons: [...state.mySalons, response.data!],
                    loading: false
                }));
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to create salon', loading: false });
            throw error;
        }
    },

    deleteSalon: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await salonService.deleteSalon(id);
            set((state) => ({
                mySalons: state.mySalons.filter(salon => salon._id !== id),
                loading: false
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to delete salon', loading: false });
            throw error;
        }
    },

    clearError: () => {
        set({ error: null });
    },
}));
