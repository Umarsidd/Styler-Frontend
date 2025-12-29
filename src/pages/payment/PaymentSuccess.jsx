import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Result, Button, Card, Descriptions } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const appointmentId = searchParams.get('appointmentId');
    const amount = searchParams.get('amount');
    const paymentId = searchParams.get('paymentId');

    useEffect(() => {
        // Confetti or celebration animation can be added here
    }, []);

    return (
        <div className="payment-success-page">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="success-container"
            >
                <Result
                    icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    status="success"
                    title="Payment Successful!"
                    subTitle={`Your appointment has been confirmed. Payment ID: ${paymentId || 'N/A'}`}
                    extra={[
                        <Button type="primary" size="large" key="appointments" onClick={() => navigate('/customer/appointments')}>
                            View My Appointments
                        </Button>,
                        <Button size="large" key="home" onClick={() => navigate('/salons')}>
                            Browse More Salons
                        </Button>,
                    ]}
                />

                {appointmentId && (
                    <Card className="payment-details-card">
                        <Descriptions title="Payment Details" bordered column={1}>
                            <Descriptions.Item label="Appointment ID">
                                {appointmentId}
                            </Descriptions.Item>
                            <Descriptions.Item label="Amount Paid">
                                ₹{amount}
                            </Descriptions.Item>
                            <Descriptions.Item label="Payment ID">
                                {paymentId || 'Processing...'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <span style={{ color: '#52c41a', fontWeight: 600 }}>Confirmed</span>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                )}

                <div className="success-message">
                    <p>🎉 Thank you for your booking!</p>
                    <p>You will receive a confirmation email and SMS shortly.</p>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
