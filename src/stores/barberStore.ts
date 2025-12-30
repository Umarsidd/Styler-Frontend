import { create } from 'zustand';
import { Barber, BarberStatus } from '../types';
import barberService from '../services/barberService';

interface BarberState {
    barbers: Barber[];
    currentBarber: Barber | null;
    pendingBarbers: Barber[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchSalonBarbers: (salonId: string) => Promise<void>;
    fetchPendingBarbers: (salonId: string) => Promise<void>;
    registerBarber: (data: any) => Promise<Barber>;
    getBarberById: (id: string) => Promise<void>;
    updateBarberProfile: (id: string, data: any) => Promise<void>;
    uploadDocument: (id: string, documentType: string, file: File) => Promise<void>;
    updateAvailability: (id: string, availability: any[]) => Promise<void>;
    approveBarber: (id: string) => Promise<void>;
    rejectBarber: (id: string, reason: string) => Promise<void>;
    clearCurrentBarber: () => void;
    clearError: () => void;
}

export const useBarberStore = create<BarberState>((set, get) => ({
    barbers: [],
    currentBarber: null,
    pendingBarbers: [],
    loading: false,
    error: null,

    fetchSalonBarbers: async (salonId) => {
        set({ loading: true, error: null });
        try {
            const response = await barberService.getSalonBarbers(salonId);
            if (response.success && response.data) {
                set({ barbers: response.data, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch barbers', loading: false });
        }
    },

    fetchPendingBarbers: async (salonId) => {
        set({ loading: true, error: null });
        try {
            const response = await barberService.getPendingBarbers(salonId);
            if (response.success && response.data) {
                set({ pendingBarbers: response.data, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch pending barbers', loading: false });
        }
    },

    registerBarber: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await barberService.registerAsBarber(data);
            if (response.success && response.data) {
                set({ currentBarber: response.data, loading: false });
                return response.data;
            }
            throw new Error('Failed to register barber');
        } catch (error: any) {
            set({ error: error.message || 'Failed to register barber', loading: false });
            throw error;
        }
    },

    getBarberById: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await barberService.getBarberProfile(id);
            if (response.success && response.data) {
                set({ currentBarber: response.data, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch barber', loading: false });
        }
    },

    updateBarberProfile: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const response = await barberService.updateBarberProfile(id, data);
            if (response.success && response.data) {
                set({ currentBarber: response.data, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to update barber profile', loading: false });
            throw error;
        }
    },

    uploadDocument: async (id, documentType, file) => {
        set({ loading: true, error: null });
        try {
            await barberService.uploadDocument(id, documentType as any, file);
            set({ loading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to upload document', loading: false });
            throw error;
        }
    },

    updateAvailability: async (id, availability) => {
        set({ loading: true, error: null });
        try {
            const response = await barberService.updateAvailability(id, availability);
            if (response.success && response.data) {
                set({ currentBarber: response.data, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to update availability', loading: false });
            throw error;
        }
    },

    approveBarber: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await barberService.approveBarber(id);
            if (response.success && response.data) {
                set((state) => ({
                    pendingBarbers: state.pendingBarbers.filter((b) => b._id !== id),
                    barbers: [...state.barbers, response.data!],
                    loading: false,
                }));
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to approve barber', loading: false });
            throw error;
        }
    },

    rejectBarber: async (id, reason) => {
        set({ loading: true, error: null });
        try {
            await barberService.rejectBarber(id, reason);
            set((state) => ({
                pendingBarbers: state.pendingBarbers.filter((b) => b._id !== id),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to reject barber', loading: false });
            throw error;
        }
    },

    clearCurrentBarber: () => {
        set({ currentBarber: null });
    },

    clearError: () => {
        set({ error: null });
    },
}));
