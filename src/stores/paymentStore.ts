import { create } from 'zustand';
import { Payment, PaymentStatus, PaymentMethod } from '../types';
import paymentService from '../services/paymentService';
import { displayRazorpay, createRazorpayOptions, RazorpayResponse } from '../utils/razorpay';

interface PaymentState {
    payments: Payment[];
    currentPayment: Payment | null;
    loading: boolean;
    error: string | null;

    // Actions
    fetchPaymentHistory: (filters?: { page?: number; limit?: number }) => Promise<void>;
    initiatePayment: (appointmentId: string, method: PaymentMethod) => Promise<string>; // Returns razorpay order ID
    processRazorpayPayment: (
        paymentData: any,
        userDetails: { name: string; email: string; contact: string }
    ) => Promise<void>;
    verifyPayment: (orderId: string, paymentId: string, signature: string) => Promise<void>;
    refundPayment: (paymentId: string, reason: string, amount: number) => Promise<void>;
    clearCurrentPayment: () => void;
    clearError: () => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
    payments: [],
    currentPayment: null,
    loading: false,
    error: null,

    fetchPaymentHistory: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await paymentService.getPaymentHistory(filters);
            if (response.success && response.data) {
                set({ payments: response.data.data, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch payment history', loading: false });
        }
    },

    initiatePayment: async (appointmentId, method) => {
        set({ loading: true, error: null });
        try {
            const response = await paymentService.initiatePayment({ appointmentId, method });
            if (response.success && response.data) {
                set({ loading: false });
                return response.data.razorpayOrderId;
            }
            throw new Error('Failed to initiate payment');
        } catch (error: any) {
            set({ error: error.message || 'Failed to initiate payment', loading: false });
            throw error;
        }
    },

    processRazorpayPayment: async (paymentData, userDetails) => {
        try {
            const options = createRazorpayOptions(
                paymentData,
                userDetails,
                async (response: RazorpayResponse) => {
                    // Verify payment on success
                    await get().verifyPayment(
                        response.razorpay_order_id,
                        response.razorpay_payment_id,
                        response.razorpay_signature
                    );
                },
                () => {
                    // On modal dismiss
                    set({ error: 'Payment cancelled by user' });
                }
            );

            await displayRazorpay(options);
        } catch (error: any) {
            set({ error: error.message || 'Payment failed', loading: false });
            throw error;
        }
    },

    verify Payment: async (orderId, paymentId, signature) => {
        set({ loading: true, error: null });
        try {
            const response = await paymentService.verifyPayment({
                orderId,
                paymentId,
                signature,
            });
            if (response.success && response.data) {
                set({
                    currentPayment: response.data.payment,
                    loading: false
                });
            }
        } catch (error: any) {
            set({ error: error.message || 'Payment verification failed', loading: false });
            throw error;
        }
    },

    refundPayment: async (paymentId, reason, amount) => {
        set({ loading: true, error: null });
        try {
            const response = await paymentService.refundPayment(paymentId, { reason, amount });
            if (response.success && response.data) {
                // Update payment in list
                set((state) => ({
                    payments: state.payments.map((payment) =>
                        payment._id === paymentId ? response.data! : payment
                    ),
                    currentPayment:
                        state.currentPayment?._id === paymentId
                            ? response.data!
                            : state.currentPayment,
                    loading: false,
                }));
            }
        } catch (error: any) {
            set({ error: error.message || 'Refund failed', loading: false });
            throw error;
        }
    },

    clearCurrentPayment: () => {
        set({ currentPayment: null });
    },

    clearError: () => {
        set({ error: null });
    },
}));
