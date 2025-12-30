import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { paymentService } from '../../services/paymentService';
import { useNavigate } from 'react-router-dom';
import { PaymentMethod } from '../../types';

interface RazorpayCheckoutProps {
    appointmentId: string;
    amount: number;
    onSuccess?: () => void;
    onFailure?: (error: string) => void;
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
    appointmentId,
    amount,
    onSuccess,
    onFailure,
}) => {
    const [loading, setLoading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        script.onerror = () => {
            message.error('Failed to load payment gateway');
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        if (!scriptLoaded) {
            message.error('Payment gateway is loading. Please wait...');
            return;
        }

        setLoading(true);

        try {
            // Step 1: Initiate payment
            const initiateResponse = await paymentService.initiatePayment({
                appointmentId,
                method: PaymentMethod.UPI,
            });

            if (!initiateResponse.success || !initiateResponse.data) {
                throw new Error('Failed to initiate payment');
            }

            const { razorpayOrderId, amount: orderAmount, currency } = initiateResponse.data;

            // Step 2: Open Razorpay checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
                amount: orderAmount * 100, // Convert to paise
                currency: currency || 'INR',
                name: 'Styler',
                description: 'Appointment Payment',
                order_id: razorpayOrderId,
                handler: async (response: RazorpayResponse) => {
                    try {
                        // Step 3: Verify payment
                        const verifyResponse = await paymentService.verifyPayment(
                            initiateResponse.data!.orderId,
                            response.razorpay_payment_id,
                            response.razorpay_signature
                        );

                        if (verifyResponse.success) {
                            message.success('Payment successful!');
                            if (onSuccess) {
                                onSuccess();
                            } else {
                                navigate(`/payment/success?appointmentId=${appointmentId}&paymentId=${response.razorpay_payment_id}`);
                            }
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (error: any) {
                        const errorMsg = error.message || 'Payment verification failed';
                        message.error(errorMsg);
                        if (onFailure) {
                            onFailure(errorMsg);
                        } else {
                            navigate(`/payment/failed?appointmentId=${appointmentId}&error=${errorMsg}`);
                        }
                    }
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        message.warning('Payment cancelled');
                    },
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: '',
                },
                theme: {
                    color: '#667eea',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', (response: any) => {
                const errorMsg = response.error?.description || 'Payment failed';
                message.error(errorMsg);
                if (onFailure) {
                    onFailure(errorMsg);
                } else {
                    navigate(`/payment/failed?appointmentId=${appointmentId}&error=${errorMsg}`);
                }
                setLoading(false);
            });

            razorpay.open();
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || 'Payment initiation failed';
            message.error(errorMsg);
            if (onFailure) {
                onFailure(errorMsg);
            }
            setLoading(false);
        }
    };

    return (
        <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handlePayment}
            disabled={!scriptLoaded}
            block
        >
            {loading ? 'Processing...' : 'Pay Now'}
        </Button>
    );
};

export default RazorpayCheckout;
