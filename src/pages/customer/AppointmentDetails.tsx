import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, Descriptions, Tag, Button, Spin, Empty, Modal } from 'antd';
import { ArrowLeftOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { appointmentService } from '../../services/appointmentService';
import { Appointment, AppointmentStatus } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';
import './AppointmentDetails.css';

const AppointmentDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['appointment', id],
        queryFn: () => appointmentService.getAppointmentById(id!),
        enabled: !!id,
    });

    const cancelMutation = useMutation({
        mutationFn: (appointmentId: string) => appointmentService.cancelAppointment(appointmentId),
        onSuccess: () => {
            toast.success('Appointment cancelled successfully');
            refetch();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to cancel appointment');
        },
    });

    const appointment = data?.data as Appointment | undefined;

    const handleCancel = () => {
        Modal.confirm({
            title: 'Cancel Appointment',
            content: 'Are you sure you want to cancel this appointment?',
            okText: 'Yes, Cancel',
            okType: 'danger',
            onOk: () => {
                if (id) {
                    cancelMutation.mutate(id);
                }
            },
        });
    };

    const getStatusColor = (status: AppointmentStatus): string => {
        const colorMap: Record<AppointmentStatus, string> = {
            pending: 'orange',
            confirmed: 'blue',
            in_progress: 'cyan',
            completed: 'green',
            cancelled: 'red',
            no_show: 'volcano',
        };
        return colorMap[status] || 'default';
    };

    if (isLoading) {
        return (
            <div className="appointment-details-loading">
                <Spin size="large" tip="Loading appointment details..." />
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="appointment-details-error">
                <Empty description="Appointment not found" />
                <Button type="primary" onClick={() => navigate('/customer/appointments')}>
                    Back to Appointments
                </Button>
            </div>
        );
    }

    const canCancel = appointment.status === 'pending' || appointment.status === 'confirmed';

    return (
        <div className="appointment-details-page">
            <div className="page-header">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/customer/appointments')}
                >
                    Back
                </Button>
                <h1>Appointment Details</h1>
            </div>

            <Card>
                <Descriptions title="Appointment Information" bordered column={1}>
                    <Descriptions.Item label="Appointment Number">
                        <strong>{appointment.appointmentNumber}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={getStatusColor(appointment.status)}>
                            {appointment.status.replace('_', ' ').toUpperCase()}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Date">
                        {formatDate(appointment.scheduledDate, 'long')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Time">
                        {appointment.scheduledTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="Services">
                        {appointment.services.length} service(s) selected
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Amount">
                        <strong style={{ fontSize: '18px', color: '#667eea' }}>
                            {formatCurrency(appointment.totalAmount)}
                        </strong>
                    </Descriptions.Item>
                    {appointment.notes && (
                        <Descriptions.Item label="Notes">
                            {appointment.notes}
                        </Descriptions.Item>
                    )}
                    <Descriptions.Item label="Created At">
                        {formatDate(appointment.createdAt, 'long')}
                    </Descriptions.Item>
                </Descriptions>

                {canCancel && (
                    <div className="appointment-actions">
                        <Button
                            danger
                            size="large"
                            icon={<CloseCircleOutlined />}
                            onClick={handleCancel}
                            loading={cancelMutation.isPending}
                        >
                            Cancel Appointment
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AppointmentDetails;
