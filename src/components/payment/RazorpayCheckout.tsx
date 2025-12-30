import React from 'react';
import { Button } from '@mui/material';
import toast from 'react-hot-toast';

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    order_id: string;
    handler: (response: any) => void;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: {
        color?: string;
    };
}

interface RazorpayCheckoutProps {
    amount: number;
    appointmentId: string;
    onSuccess?: (paymentId: string) => void;
    onFailure?: (error: string) => void;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
    amount,
    appointmentId,
    onSuccess,
    onFailure,
}) => {
    const [loading, setLoading] = React.useState(false);

    const handlePayment = async () => {
        setLoading(true);

        try {
            // Create order (mock - replace with actual API call)
            const orderId = `order_${Date.now()}`;

            const options: RazorpayOptions = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_key',
                amount: amount * 100, // Razorpay expects paise
                currency: 'INR',
                name: 'Styler',
                description: `Payment for Appointment #${appointmentId}`,
                order_id: orderId,
                handler: function (response: any) {
                    toast.success('Payment successful!');
                    if (onSuccess) {
                        onSuccess(response.razorpay_payment_id);
                    }
                },
                prefill: {
                    name: 'Customer Name',
                    email: 'customer@example.com',
                    contact: '9999999999',
                },
                theme: {
                    color: '#667eea',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', function (response: any) {
                toast.error('Payment failed!');
                if (onFailure) {
                    onFailure(response.error.description);
                }
            });

            razorpay.open();
        } catch (error: any) {
            toast.error('Failed to initialize payment');
            if (onFailure) {
                onFailure(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="contained"
            size="large"
            onClick={handlePayment}
            disabled={loading}
            fullWidth
        >
            {loading ? 'Processing...' : `Pay ₹${amount}`}
        </Button>
    );
};

export default RazorpayCheckout;
