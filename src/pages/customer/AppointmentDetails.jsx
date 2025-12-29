import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Card, Descriptions, Tag, Button, Space, Modal, Input, message, Spin, Empty, Divider
} from 'antd';
import {
    ShopOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined,
    DollarOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { appointmentService } from '../../services/appointmentService';
import RazorpayCheckout from '../../components/payment/RazorpayCheckout';
import './AppointmentDetails.css';

const { TextArea } = Input;

const AppointmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const [cancelModalVisible, setCancelModalVisible] = useState(searchParams.get('action') === 'cancel');
    const [cancelReason, setCancelReason] = useState('');

    // Fetch appointment details
    const { data, isLoading } = useQuery({
        queryKey: ['appointment', id],
        queryFn: () => appointmentService.getAppointmentById(id),
    });

    // Cancel mutation
    const cancelMutation = useMutation({
        mutationFn: (reason) => appointmentService.cancelAppointment(id, reason),
        onSuccess: () => {
            message.success('Appointment cancelled successfully');
            setCancelModalVisible(false);
            queryClient.invalidateQueries(['appointment', id]);
            queryClient.invalidateQueries(['my-appointments']);
            queryClient.invalidateQueries(['upcoming-appointments']);
        },
        onError: (error) => {
            message.error(error.response?.data?.error?.message || 'Failed to cancel appointment');
        },
    });

    const appointment = data?.data;

    const getStatusColor = (status) => {
        const colors = {
            pending: 'orange',
            confirmed: 'blue',
            'in-progress': 'cyan',
            completed: 'green',
            cancelled: 'red',
            'no-show': 'gray',
        };
        return colors[status] || 'default';
    };

    const handleCancelConfirm = () => {
        if (!cancelReason.trim()) {
            message.warning('Please provide a reason for cancellation');
            return;
        }
        cancelMutation.mutate(cancelReason);
    };

    const handlePaymentSuccess = (data) => {
        message.success('Payment completed successfully!');
        queryClient.invalidateQueries(['appointment', id]);
        navigate(`/payment/success?appointmentId=${id}&amount=${appointment.totalAmount}`);
    };

    const handlePaymentFailure = () => {
        navigate(`/payment/failed?appointmentId=${id}`);
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Loading appointment details..." />
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="error-container">
                <Empty description="Appointment not found" />
                <Button type="primary" onClick={() => navigate('/customer/appointments')}>
                    Back to Appointments
                </Button>
            </div>
        );
    }

    const canCancel = appointment.status === 'pending' || appointment.status === 'confirmed';
    const canPay = appointment.status === 'pending' && appointment.paymentStatus === 'pending';
    const canReview = appointment.status === 'completed' && !appointment.reviewId;

    return (
        <div className="appointment-details-page">
            <div className="details-header">
                <div>
                    <h1>Appointment Details</h1>
                    <p className="appointment-id">ID: #{appointment._id}</p>
                </div>
                <Tag color={getStatusColor(appointment.status)} className="status-tag">
                    {appointment.status.toUpperCase()}
                </Tag>
            </div>

            <div className="details-container">
                {/* Main Details Card */}
                <Card className="details-card" title="Appointment Information">
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Salon">
                            <Space>
                                <ShopOutlined />
                                <span className="salon-name">{appointment.salonId?.name || 'N/A'}</span>
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Date">
                            <Space>
                                <CalendarOutlined />
                                {new Date(appointment.scheduledDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Time">
                            <Space>
                                <ClockCircleOutlined />
                                {appointment.scheduledTime}
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Barber">
                            <Space>
                                <UserOutlined />
                                {appointment.barberId?.userId?.name || 'Any Available'}
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Duration">
                            {appointment.estimatedDuration} minutes
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Services Card */}
                <Card className="details-card" title="Services">
                    {appointment.services?.map((service, index) => (
                        <div key={index} className="service-item">
                            <div>
                                <h4>{service.name}</h4>
                                <p>{service.description}</p>
                            </div>
                            <div className="service-price">
                                <span>{service.duration} mins</span>
                                <strong>₹{service.price}</strong>
                            </div>
                        </div>
                    ))}
                    <Divider />
                    <div className="service-total">
                        <strong>Total Amount:</strong>
                        <strong className="total-amount">₹{appointment.totalAmount}</strong>
                    </div>
                </Card>

                {/* Payment Status Card */}
                <Card className="details-card" title="Payment Status">
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Status">
                            <Tag color={appointment.paymentStatus === 'completed' ? 'green' : 'orange'}>
                                {appointment.paymentStatus?.toUpperCase()}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Method">
                            {appointment.paymentMethod || 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Amount">
                            ₹{appointment.totalAmount}
                        </Descriptions.Item>
                    </Descriptions>

                    {canPay && (
                        <div className="payment-action">
                            <RazorpayCheckout
                                appointmentId={appointment._id}
                                amount={appointment.totalAmount}
                                onSuccess={handlePaymentSuccess}
                                onFailure={handlePaymentFailure}
                            />
                        </div>
                    )}
                </Card>

                {/* Actions */}
                <Card className="details-card actions-card">
                    <Space wrap>
                        <Button onClick={() => navigate('/customer/appointments')}>
                            Back to Appointments
                        </Button>

                        {canCancel && (
                            <Button
                                danger
                                icon={<ExclamationCircleOutlined />}
                                onClick={() => setCancelModalVisible(true)}
                            >
                                Cancel Appointment
                            </Button>
                        )}

                        {canReview && (
                            <Button
                                type="primary"
                                onClick={() => navigate(`/customer/reviews/write?appointmentId=${id}`)}
                            >
                                Write Review
                            </Button>
                        )}

                        <Button onClick={() => navigate(`/salons/${appointment.salonId?._id}`)}>
                            View Salon
                        </Button>
                    </Space>
                </Card>
            </div>

            {/* Cancel Modal */}
            <Modal
                title="Cancel Appointment"
                open={cancelModalVisible}
                onOk={handleCancelConfirm}
                onCancel={() => setCancelModalVisible(false)}
                confirmLoading={cancelMutation.isLoading}
                okText="Confirm Cancellation"
                okButtonProps={{ danger: true }}
            >
                <p>Are you sure you want to cancel this appointment?</p>
                <p>Please provide a reason:</p>
                <TextArea
                    rows={4}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Enter cancellation reason..."
                />
            </Modal>
        </div>
    );
};

export default AppointmentDetails;
