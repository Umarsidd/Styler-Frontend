import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Result, Button, Card, Alert } from 'antd';
import { CloseCircleOutlined, HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import './PaymentFailed.css';

const PaymentFailed: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const error = searchParams.get('error') || 'Payment failed. Please try again.';
    const appointmentId = searchParams.get('appointmentId');

    const handleRetry = () => {
        if (appointmentId) {
            navigate(`/customer/appointments/${appointmentId}`);
        } else {
            navigate('/salons');
        }
    };

    return (
        <div className="payment-failed-page">
            <Card className="failed-card">
                <Result
                    status="error"
                    icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                    title="Payment Failed"
                    subTitle="We couldn't process your payment. Please try again."
                    extra={[
                        <Button
                            type="primary"
                            danger
                            key="retry"
                            icon={<ReloadOutlined />}
                            onClick={handleRetry}
                        >
                            Try Again
                        </Button>,
                        <Button
                            key="home"
                            icon={<HomeOutlined />}
                            onClick={() => navigate('/')}
                        >
                            Back to Home
                        </Button>,
                    ]}
                >
                    <Alert
                        message="Error Details"
                        description={error}
                        type="error"
                        showIcon
                        style={{ marginTop: 24 }}
                    />

                    <div className="help-section">
                        <h4>Need Help?</h4>
                        <p>If you continue to face issues, please contact our support team:</p>
                        <ul>
                            <li>Email: support@styler.com</li>
                            <li>Phone: +91 1800-XXX-XXXX</li>
                        </ul>
                    </div>
                </Result>
            </Card>
        </div>
    );
};

export default PaymentFailed;
