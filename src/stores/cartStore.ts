import { create } from 'zustand';
import { Service } from '../types';

interface CartItem {
    service: Service;
    salonId: string;
}

interface CartState {
    items: CartItem[];
    salonId: string | null;
    addService: (service: Service, salonId: string) => void;
    removeService: (serviceId: string) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalDuration: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    salonId: null,

    addService: (service, salonId) => {
        const currentSalonId = get().salonId;

        // If adding from a different salon, clear cart first
        if (currentSalonId && currentSalonId !== salonId) {
            set({ items: [], salonId });
        }

        // Check if service already in cart
        const exists = get().items.find(item => item.service._id === service._id);
        if (exists) return;

        set((state) => ({
            items: [...state.items, { service, salonId }],
            salonId,
        }));
    },

    removeService: (serviceId) => {
        set((state) => {
            const newItems = state.items.filter(item => item.service._id !== serviceId);
            return {
                items: newItems,
                salonId: newItems.length > 0 ? state.salonId : null,
            };
        });
    },

    clearCart: () => {
        set({ items: [], salonId: null });
    },

    getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.service.price, 0);
    },

    getTotalDuration: () => {
        return get().items.reduce((total, item) => total + item.service.duration, 0);
    },
}));
