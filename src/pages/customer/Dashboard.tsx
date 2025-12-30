import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, Row, Col, Button, Empty, Spin, Statistic } from 'antd';
import {
    CalendarOutlined,
    ShopOutlined,
    StarOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { appointmentService } from '../../services/appointmentService';
import { useAuthStore } from '../../stores/authStore';
import { Appointment } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';
import './Dashboard.css';

const CustomerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    const { data: appointmentsData, isLoading } = useQuery({
        queryKey: ['upcoming-appointments'],
        queryFn: () => appointmentService.getUpcomingAppointments(),
    });

    const upcomingAppointments = (appointmentsData?.data as Appointment[]) || [];

    const stats = [
        {
            title: 'Upcoming',
            value: upcomingAppointments.length,
            icon: <CalendarOutlined />,
            color: '#667eea',
        },
        {
            title: 'Total Bookings',
            value: '0',
            icon: <ClockCircleOutlined />,
            color: '#764ba2',
        },
        {
            title: 'Favorite Salons',
            value: '0',
            icon: <ShopOutlined />,
            color: '#f59e0b',
        },
        {
            title: 'Reviews',
            value: '0',
            icon: <StarOutlined />,
            color: '#10b981',
        },
    ];

    return (
        <div className="customer-dashboard">
            <div className="dashboard-header">
                <h1>Welcome back, {user?.name}! 👋</h1>
                <p>Manage your appointments and discover new salons</p>
            </div>

            {/* Statistics */}
            <Row gutter={[24, 24]} className="stats-row">
                {stats.map((stat, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card className="stat-card">
                            <div className="stat-icon" style={{ background: stat.color }}>
                                {stat.icon}
                            </div>
                            <Statistic
                                title={stat.title}
                                value={stat.value}
                                valueStyle={{ color: stat.color }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Upcoming Appointments */}
            <Card
                title="Upcoming Appointments"
                className="appointments-card"
                extra={
                    <Button type="link" onClick={() => navigate('/customer/appointments')}>
                        View All
                    </Button>
                }
            >
                {isLoading ? (
                    <Spin />
                ) : upcomingAppointments.length === 0 ? (
                    <Empty
                        description="No upcoming appointments"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                        <Button type="primary" onClick={() => navigate('/salons')}>
                            Book Appointment
                        </Button>
                    </Empty>
                ) : (
                    <div className="appointments-list">
                        {upcomingAppointments.slice(0, 3).map((appointment) => (
                            <Card
                                key={appointment._id}
                                className="appointment-card"
                                hoverable
                                onClick={() => navigate(`/customer/appointments/${appointment._id}`)}
                            >
                                <Row gutter={16} align="middle">
                                    <Col flex="auto">
                                        <h3>Appointment #{appointment.appointmentNumber}</h3>
                                        <p>
                                            <CalendarOutlined /> {formatDate(appointment.scheduledDate, 'long')} at{' '}
                                            {appointment.scheduledTime}
                                        </p>
                                        <p className="appointment-amount">
                                            {formatCurrency(appointment.totalAmount)}
                                        </p>
                                    </Col>
                                    <Col>
                                        <Button type="primary">View Details</Button>
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                    </div>
                )}
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions" className="quick-actions-card">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Button
                            type="primary"
                            block
                            size="large"
                            icon={<ShopOutlined />}
                            onClick={() => navigate('/salons')}
                        >
                            Browse Salons
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button
                            block
                            size="large"
                            icon={<CalendarOutlined />}
                            onClick={() => navigate('/customer/appointments')}
                        >
                            My Appointments
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button
                            block
                            size="large"
                            icon={<StarOutlined />}
                            onClick={() => navigate('/customer/reviews')}
                        >
                            My Reviews
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button
                            block
                            size="large"
                            onClick={() => navigate('/profile')}
                        >
                            Edit Profile
                        </Button>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default CustomerDashboard;
