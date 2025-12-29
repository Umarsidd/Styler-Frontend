import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Empty, Spin, Statistic, Tag } from 'antd';
import {
    CalendarOutlined, ClockCircleOutlined, ShopOutlined,
    StarOutlined, DollarOutlined
} from '@ant-design/icons';
import { appointmentService } from '../../services/appointmentService';
import { motion } from 'framer-motion';
import './Dashboard.css';

const CustomerDashboard = () => {
    const navigate = useNavigate();

    // Fetch upcoming appointments
    const { data: upcomingData, isLoading } = useQuery({
        queryKey: ['upcoming-appointments'],
        queryFn: () => appointmentService.getUpcomingAppointments(),
    });

    // Fetch all appointments for stats
    const { data: allAppointmentsData } = useQuery({
        queryKey: ['all-appointments'],
        queryFn: () => appointmentService.getMyAppointments({ limit: 100 }),
    });

    const upcomingAppointments = upcomingData?.data || [];
    const allAppointments = allAppointmentsData?.data?.data || [];

    // Calculate stats
    const totalBookings = allAppointments.length;
    const completedBookings = allAppointments.filter(a => a.status === 'completed').length;
    const totalSpent = allAppointments
        .filter(a => a.status === 'completed')
        .reduce((sum, a) => sum + (a.totalAmount || 0), 0);

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

    if (isLoading) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div className="customer-dashboard">
            <div className="dashboard-header">
                <h1>My Dashboard</h1>
                <Button
                    type="primary"
                    size="large"
                    icon={<CalendarOutlined />}
                    onClick={() => navigate('/salons')}
                >
                    Book New Appointment
                </Button>
            </div>

            {/* Stats Cards */}
            <Row gutter={[24, 24]} className="stats-row">
                <Col xs={24} sm={12} lg={6}>
                    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                        <Card className="stat-card">
                            <Statistic
                                title="Total Bookings"
                                value={totalBookings}
                                prefix={<CalendarOutlined />}
                            />
                        </Card>
                    </motion.div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                        <Card className="stat-card">
                            <Statistic
                                title="Completed"
                                value={completedBookings}
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </motion.div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                        <Card className="stat-card">
                            <Statistic
                                title="Total Spent"
                                value={totalSpent}
                                prefix={<DollarOutlined />}
                                precision={0}
                                valueStyle={{ color: '#667eea' }}
                            />
                        </Card>
                    </motion.div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                        <Card className="stat-card">
                            <Statistic
                                title="Reviews Written"
                                value={0}
                                prefix={<StarOutlined />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </motion.div>
                </Col>
            </Row>

            {/* Upcoming Appointments */}
            <div className="section-header">
                <h2>Upcoming Appointments</h2>
                <Button type="link" onClick={() => navigate('/customer/appointments')}>
                    View All
                </Button>
            </div>

            {upcomingAppointments.length === 0 ? (
                <Card>
                    <Empty
                        description="No upcoming appointments"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                        <Button type="primary" onClick={() => navigate('/salons')}>
                            Book Your First Appointment
                        </Button>
                    </Empty>
                </Card>
            ) : (
                <Row gutter={[24, 24]}>
                    {upcomingAppointments.slice(0, 3).map((appointment) => (
                        <Col xs={24} lg={8} key={appointment._id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card
                                    hoverable
                                    className="appointment-card"
                                    onClick={() => navigate(`/customer/appointments/${appointment._id}`)}
                                >
                                    <div className="appointment-card-header">
                                        <Tag color={getStatusColor(appointment.status)}>
                                            {appointment.status.toUpperCase()}
                                        </Tag>
                                        <span className="appointment-id">#{appointment._id.slice(-6)}</span>
                                    </div>

                                    <div className="appointment-salon">
                                        <ShopOutlined />
                                        <h3>{appointment.salonId?.name || 'Salon'}</h3>
                                    </div>

                                    <div className="appointment-details">
                                        <div className="detail-item">
                                            <CalendarOutlined />
                                            <span>
                                                {new Date(appointment.scheduledDate).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <ClockCircleOutlined />
                                            <span>{appointment.scheduledTime}</span>
                                        </div>
                                    </div>

                                    <div className="appointment-services">
                                        <strong>Services:</strong>
                                        <span>
                                            {appointment.services?.map(s => s.name).join(', ') || 'N/A'}
                                        </span>
                                    </div>

                                    <div className="appointment-footer">
                                        <span className="amount">₹{appointment.totalAmount}</span>
                                        <Button type="link" size="small">
                                            View Details →
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Quick Actions */}
            <div className="section-header">
                <h2>Quick Actions</h2>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        hoverable
                        className="action-card"
                        onClick={() => navigate('/customer/appointments')}
                    >
                        <CalendarOutlined className="action-icon" />
                        <h3>My Appointments</h3>
                        <p>View and manage all bookings</p>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        hoverable
                        className="action-card"
                        onClick={() => navigate('/salons')}
                    >
                        <ShopOutlined className="action-icon" />
                        <h3>Find Salons</h3>
                        <p>Discover new salons near you</p>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        hoverable
                        className="action-card"
                        onClick={() => navigate('/customer/reviews')}
                    >
                        <StarOutlined className="action-icon" />
                        <h3>My Reviews</h3>
                        <p>See your past reviews</p>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        hoverable
                        className="action-card"
                        onClick={() => navigate('/profile')}
                    >
                        <DollarOutlined className="action-icon" />
                        <h3>Profile</h3>
                        <p>Manage your account</p>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CustomerDashboard;
