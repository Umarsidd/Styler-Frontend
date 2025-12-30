import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Row, Col, Statistic, Table, Empty, Button } from 'antd';
import {
    CalendarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { appointmentService } from '../../services/appointmentService';
import { barberService } from '../../services/barberService';
import { Appointment } from '../../types';
import { formatDate, formatTime } from '../../utils/helpers';
import './BarberDashboard.css';

const BarberDashboard: React.FC = () => {
    const navigate = useNavigate();

    const { data: appointmentsData, isLoading } = useQuery({
        queryKey: ['barber-appointments'],
        queryFn: () => appointmentService.getBarberAppointments({ limit: 10 }),
    });

    const { data: statsData } = useQuery({
        queryKey: ['barber-stats'],
        queryFn: () => barberService.getBarberStats(),
    });

    const todayAppointments = (appointmentsData?.data?.data as Appointment[]) || [];
    const stats = statsData?.data || {};

    const columns: ColumnsType<Appointment> = [
        {
            title: 'Time',
            dataIndex: 'scheduledTime',
            key: 'time',
            render: (time) => <strong>{time}</strong>,
        },
        {
            title: 'Customer',
            dataIndex: 'customerId',
            key: 'customer',
            render: () => 'Customer',
        },
        {
            title: 'Services',
            dataIndex: 'services',
            key: 'services',
            render: (services) => `${services?.length || 0} service(s)`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => status?.toUpperCase(),
        },
    ];

    return (
        <div className="barber-dashboard">
            <div className="dashboard-header">
                <h1>Welcome to Your Dashboard! 💈</h1>
                <p>Manage your schedule and appointments</p>
            </div>

            {/* Statistics */}
            <Row gutter={[24, 24]} className="stats-row">
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Today's Appointments"
                            value={todayAppointments.length}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#667eea' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="This Week"
                            value={stats.weeklyAppointments || 0}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#764ba2' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Completed"
                            value={stats.completedAppointments || 0}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#10b981' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Rating"
                            value={stats.rating || 0}
                            suffix="/ 5"
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#f59e0b' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Today's Schedule */}
            <Card
                title="Today's Schedule"
                className="schedule-card"
                extra={
                    <Button onClick={() => navigate('/barber/appointments')}>
                        View All
                    </Button>
                }
            >
                {todayAppointments.length === 0 ? (
                    <Empty description="No appointments scheduled for today" />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={todayAppointments}
                        loading={isLoading}
                        rowKey="_id"
                        pagination={false}
                    />
                )}
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions" className="quick-actions">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Button
                            type="primary"
                            block
                            size="large"
                            onClick={() => navigate('/barber/availability')}
                        >
                            Manage Availability
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Button
                            block
                            size="large"
                            onClick={() => navigate('/barber/appointments')}
                        >
                            View Appointments
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Button
                            block
                            size="large"
                            onClick={() => navigate('/barber/profile')}
                        >
                            Edit Profile
                        </Button>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default BarberDashboard;
