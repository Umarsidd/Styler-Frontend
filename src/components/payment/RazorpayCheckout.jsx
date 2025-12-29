import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button, message } from 'antd';
import { paymentService } from '../../services/paymentService';
import { RAZORPAY_KEY_ID } from '../../utils/constants';

const RazorpayCheckout = ({ appointmentId, amount, onSuccess, onFailure }) => {
    const [loading, setLoading] = useState(false);

    // Load Razorpay script
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // Initiate payment mutation
    const initiatePaymentMutation = useMutation({
        mutationFn: (method) => paymentService.initiatePayment(appointmentId, method),
        onSuccess: async (response) => {
            const paymentData = response.data;

            // Check if Razorpay is available
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                message.error('Failed to load payment gateway');
                setLoading(false);
                return;
            }

            // Configure Razorpay options
            const options = {
                key: RAZORPAY_KEY_ID || 'your_razorpay_test_key',
                amount: paymentData.amount * 100, // Convert to paise
                currency: paymentData.currency || 'INR',
                name: 'Styler',
                description: `Appointment Payment #${appointmentId.slice(-8)}`,
                order_id: paymentData.razorpayOrderId,
                handler: async (razorpayResponse) => {
                    // Payment successful, verify on backend
                    try {
                        const verifyResponse = await paymentService.verifyPayment(
                            paymentData.orderId,
                            razorpayResponse.razorpay_payment_id,
                            razorpayResponse.razorpay_signature
                        );

                        if (verifyResponse.success) {
                            message.success('Payment successful!');
                            onSuccess && onSuccess(verifyResponse.data);
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (error) {
                        message.error('Payment verification failed');
                        onFailure && onFailure(error);
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: '',
                },
                notes: {
                    appointmentId,
                },
                theme: {
                    color: '#667eea',
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        message.info('Payment cancelled');
                    },
                },
            };

            // Open Razorpay checkout
            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', (response) => {
                message.error(`Payment failed: ${response.error.description}`);
                onFailure && onFailure(response.error);
                setLoading(false);
            });
            razorpay.open();
        },
        onError: (error) => {
            message.error(error.response?.data?.error?.message || 'Failed to initiate payment');
            setLoading(false);
            onFailure && onFailure(error);
        },
    });

    const handlePayment = (method = 'upi') => {
        setLoading(true);
        initiatePaymentMutation.mutate(method);
    };

    return (
        <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={() => handlePayment('upi')}
        >
            {loading ? 'Processing...' : `Pay ₹${amount}`}
        </Button>
    );
};

export default RazorpayCheckout;
