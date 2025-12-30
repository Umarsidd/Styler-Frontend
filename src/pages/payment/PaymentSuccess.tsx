import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Result, Button, Card, Descriptions, Spin } from 'antd';
import { CheckCircleOutlined, HomeOutlined, CalendarOutlined } from '@ant-design/icons';
import { appointmentService } from '../../services/appointmentService';
import { Appointment } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import './PaymentSuccess.css';

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);

    const appointmentId = searchParams.get('appointmentId');
    const paymentId = searchParams.get('paymentId');

    useEffect(() => {
        const fetchAppointment = async () => {
            if (appointmentId) {
                try {
                    const response = await appointmentService.getAppointmentById(appointmentId);
                    if (response.success && response.data) {
                        setAppointment(response.data);
                    }
                } catch (error) {
                    console.error('Failed to fetch appointment:', error);
                }
            }
            setLoading(false);
        };

        fetchAppointment();
    }, [appointmentId]);

    if (loading) {
        return (
            <div className="payment-success-page">
                <Card className="success-card">
                    <Spin size="large" />
                </Card>
            </div>
        );
    }

    return (
        <div className="payment-success-page">
            <Card className="success-card">
                <Result
                    status="success"
                    icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    title="Payment Successful!"
                    subTitle={`Your appointment has been confirmed. Payment ID: ${paymentId || 'N/A'}`}
                    extra={[
                        <Button
                            type="primary"
                            key="appointments"
                            icon={<CalendarOutlined />}
                            onClick={() => navigate('/customer/appointments')}
                        >
                            View My Appointments
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
                    {appointment && (
                        <Card className="appointment-details-card" title="Appointment Details">
                            <Descriptions column={1} bordered>
                                <Descriptions.Item label="Appointment Number">
                                    {appointment.appointmentNumber}
                                </Descriptions.Item>
                                <Descriptions.Item label="Date">
                                    {formatDate(appointment.scheduledDate, 'long')}
                                </Descriptions.Item>
                                <Descriptions.Item label="Time">
                                    {appointment.scheduledTime}
                                </Descriptions.Item>
                                <Descriptions.Item label="Total Amount">
                                    {formatCurrency(appointment.totalAmount)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Status">
                                    <span style={{ color: '#52c41a', fontWeight: 600 }}>
                                        {appointment.status.toUpperCase()}
                                    </span>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    )}
                </Result>
            </Card>
        </div>
    );
};

export default PaymentSuccess;
