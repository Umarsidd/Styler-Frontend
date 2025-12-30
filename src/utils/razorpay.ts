/**
 * Razorpay Integration Utility
 * Handles Razorpay SDK loading and payment modal display
 */

declare global {
    interface Window {
        Razorpay: any;
    }
}

export interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    order_id: string;
    image?: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: {
        color?: string;
    };
    handler: (response: RazorpayResponse) => void;
    modal?: {
        ondismiss?: () => void;
    };
}

export interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

/**
 * Initialize Razorpay SDK by loading the script
 */
export const initRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
        // Check if already loaded
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            console.error('Razorpay SDK failed to load');
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

/**
 * Display Razorpay payment modal
 * @param options - Razorpay configuration options
 */
export const displayRazorpay = async (options: RazorpayOptions): Promise<void> => {
    const loaded = await initRazorpay();

    if (!loaded) {
        throw new Error('Razorpay SDK failed to load. Please try again.');
    }

    const razorpay = new window.Razorpay(options);
    razorpay.open();
};

/**
 * Create Razorpay options for payment
 * @param paymentData - Payment data from backend
 * @param userDetails - User details for prefill
 * @param onSuccess - Success callback
 * @param onDismiss - Modal dismiss callback
 */
export const createRazorpayOptions = (
    paymentData: {
        razorpayOrderId: string;
        amount: number;
        currency: string;
    },
    userDetails: {
        name: string;
        email: string;
        contact: string;
    },
    onSuccess: (response: RazorpayResponse) => void,
    onDismiss?: () => void
): RazorpayOptions => {
    return {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'Styler',
        description: 'Salon Appointment Payment',
        order_id: paymentData.razorpayOrderId,
        image: '/logo.png', // Update with your logo path
        prefill: {
            name: userDetails.name,
            email: userDetails.email,
            contact: userDetails.contact,
        },
        theme: {
            color: '#6366f1', // Indigo color matching your theme
        },
        handler: onSuccess,
        modal: {
            ondismiss: onDismiss,
        },
    };
};
