import { useNavigate, useSearchParams } from 'react-router-dom';
import { Result, Button, Card } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import './PaymentFailed.css';

const PaymentFailed = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const appointmentId = searchParams.get('appointmentId');
    const errorMessage = searchParams.get('error') || 'Payment could not be processed';

    const handleRetry = () => {
        if (appointmentId) {
            // Navigate back to appointment to retry payment
            navigate(`/customer/appointments/${appointmentId}`);
        } else {
            navigate('/salons');
        }
    };

    return (
        <div className="payment-failed-page">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="failed-container"
            >
                <Result
                    icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                    status="error"
                    title="Payment Failed"
                    subTitle={errorMessage}
                    extra={[
                        <Button type="primary" size="large" key="retry" onClick={handleRetry}>
                            {appointmentId ? 'Retry Payment' : 'Browse Salons'}
                        </Button>,
                        <Button size="large" key="home" onClick={() => navigate('/')}>
                            Go Home
                        </Button>,
                    ]}
                />

                <Card className="failed-info-card">
                    <h3>What happened?</h3>
                    <p>Your payment could not be completed. This could be due to:</p>
                    <ul>
                        <li>Insufficient funds in your account</li>
                        <li>Network connectivity issues</li>
                        <li>Payment gateway timeout</li>
                        <li>Incorrect payment details</li>
                    </ul>
                    <p className="help-text">
                        Don't worry! Your appointment is still reserved. You can try paying again.
                    </p>
                </Card>

                <div className="support-message">
                    <p>Need help? Contact our support team:</p>
                    <p><strong>Email:</strong> support@styler.com</p>
                    <p><strong>Phone:</strong> +91-1234567890</p>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentFailed;
