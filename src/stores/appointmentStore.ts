import { create } from 'zustand';
import { Appointment, AppointmentStatus } from '../types';
import appointmentService from '../services/appointmentService';

interface AppointmentState {
    appointments: Appointment[];
    currentAppointment: Appointment | null;
    upcomingAppointments: Appointment[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchAppointments: (filters?: { page?: number; limit?: number; status?: AppointmentStatus }) => Promise<void>;
    fetchUpcomingAppointments: () => Promise<void>;
    createAppointment: (data: any) => Promise<Appointment>;
    getAppointmentById: (id: string) => Promise<void>;
    updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
    cancelAppointment: (id: string, reason?: string) => Promise<void>;
    checkAvailability: (data: any) => Promise<any>;
    clearCurrentAppointment: () => void;
    clearError: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
    appointments: [],
    currentAppointment: null,
    upcomingAppointments: [],
    loading: false,
    error: null,

    fetchAppointments: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await appointmentService.getMyAppointments(filters);
            if (response.success && response.data) {
                set({ appointments: response.data.data, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch appointments', loading: false });
        }
    },

    fetchUpcomingAppointments: async () => {
        set({ loading: true, error: null });
        try {
            const response = await appointmentService.getUpcomingAppointments();
            if (response.success && response.data) {
                set({ upcomingAppointments: response.data, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch upcoming appointments', loading: false });
        }
    },

    createAppointment: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await appointmentService.createAppointment(data);
            if (response.success && response.data) {
                set({
                    currentAppointment: response.data,
                    loading: false
                });
                return response.data;
            }
            throw new Error('Failed to create appointment');
        } catch (error: any) {
            set({ error: error.message || 'Failed to create appointment', loading: false });
            throw error;
        }
    },

    getAppointmentById: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await appointmentService.getAppointmentById(id);
            if (response.success && response.data) {
                set({ currentAppointment: response.data, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch appointment', loading: false });
        }
    },

    updateAppointmentStatus: async (id, status) => {
        set({ loading: true, error: null });
        try {
            const response = await appointmentService.updateAppointmentStatus(id, status);
            if (response.success && response.data) {
                // Update the appointment in the list
                set((state) => ({
                    appointments: state.appointments.map((apt) =>
                        apt._id === id ? response.data! : apt
                    ),
                    currentAppointment:
                        state.currentAppointment?._id === id ? response.data! : state.currentAppointment,
                    loading: false,
                }));
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to update appointment status', loading: false });
            throw error;
        }
    },

    cancelAppointment: async (id, reason) => {
        set({ loading: true, error: null });
        try {
            const response = await appointmentService.cancelAppointment(id, reason);
            if (response.success && response.data) {
                // Update the appointment in the list
                set((state) => ({
                    appointments: state.appointments.map((apt) =>
                        apt._id === id ? response.data! : apt
                    ),
                    currentAppointment:
                        state.currentAppointment?._id === id ? response.data! : state.currentAppointment,
                    loading: false,
                }));
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to cancel appointment', loading: false });
            throw error;
        }
    },

    checkAvailability: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await appointmentService.checkAvailability(data);
            set({ loading: false });
            return response.data;
        } catch (error: any) {
            set({ error: error.message || 'Failed to check availability', loading: false });
            throw error;
        }
    },

    clearCurrentAppointment: () => {
        set({ currentAppointment: null });
    },

    clearError: () => {
        set({ error: null });
    },
}));
