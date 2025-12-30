import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Statistic, Calendar, Badge, Button, List, Tag, Empty } from 'antd';
import {
    CalendarOutlined, ClockCircleOutlined, DollarOutlined,
    CheckCircleOutlined, UserOutlined
} from '@ant-design/icons';
import { appointmentService } from '../../services/appointmentService';
import { barberService } from '../../services/barberService';
import dayjs from 'dayjs';
import './BarberDashboard.css';

const BarberDashboard = () => {
    const navigate = useNavigate();

    // Fetch today's appointments
    const { data: todayData, isLoading } = useQuery({
        queryKey: ['barber-today-appointments'],
        queryFn: () => appointmentService.getBarberAppointments({
            date: dayjs().format('YYYY-MM-DD'),
        }),
    });

    // Fetch barber stats
    const { data: statsData } = useQuery({
        queryKey: ['barber-stats'],
        queryFn: () => barberService.getBarberStats(),
    });

    const todayAppointments = todayData?.data || [];
    const stats = statsData?.data || {};

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

    const getDateDisplay = (date) => {
        const aptDate = dayjs(date?.scheduledDate);
        return {
            badge: aptDate.isSame(dayjs(), 'day') ? 'processing' : 'default',
            color: aptDate.isSame(dayjs(), 'day') ? '#1890ff' : '#d9d9d9',
        };
    };

    return (
        <div className="barber-dashboard">
            <div className="dashboard-header">
                <h1>Barber Dashboard</h1>
                <Button type="primary" onClick={() => navigate('/barber/availability')}>
                    Manage Availability
                </Button>
            </div>

            {/* Stats Row */}
            <Row gutter={[24, 24]} className="stats-row">
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Today's Appointments"
                            value={todayAppointments.length}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="This Week"
                            value={stats.weeklyAppointments || 0}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Completed Today"
                            value={todayAppointments.filter(a => a.status === 'completed').length}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Today's Earnings"
                            value={stats.todayEarnings || 0}
                            prefix="₹"
                            precision={0}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Today's Schedule */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card title="Today's Schedule" className="schedule-card">
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : todayAppointments.length === 0 ? (
                            <Empty description="No appointments scheduled for today" />
                        ) : (
                            <List
                                dataSource={todayAppointments}
                                renderItem={(appointment) => (
                                    <List.Item
                                        key={appointment._id}
                                        actions={[
                                            <Button
                                                type="link"
                                                onClick={() => navigate(`/barber/appointments/${appointment._id}`)}
                                            >
                                                View Details
                                            </Button>,
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={<ClockCircleOutlined style={{ fontSize: 24 }} />}
                                            title={
                                                <div className="appointment-title">
                                                    <span>{appointment.scheduledTime}</span>
                                                    <Tag color={getStatusColor(appointment.status)}>
                                                        {appointment.status.toUpperCase()}
                                                    </Tag>
                                                </div>
                                            }
                                            description={
                                                <div>
                                                    <div><UserOutlined /> {appointment.customerId?.name || 'Customer'}</div>
                                                    <div>Services: {appointment.services?.map(s => s.name).join(', ')}</div>
                                                    <div>Duration: {appointment.estimatedDuration} mins | Amount: ₹{appointment.totalAmount}</div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                    </Card>
                </Col>

                {/* Quick Actions */}
                <Col xs={24} lg={8}>
                    <Card title="Quick Actions" className="actions-card">
                        <div className="action-buttons">
                            <Button
                                block
                                size="large"
                                icon={<CalendarOutlined />}
                                onClick={() => navigate('/barber/appointments')}
                            >
                                All Appointments
                            </Button>
                            <Button
                                block
                                size="large"
                                icon={<ClockCircleOutlined />}
                                onClick={() => navigate('/barber/availability')}
                            >
                                Set Availability
                            </Button>
                            <Button
                                block
                                size="large"
                                icon={<UserOutlined />}
                                onClick={() => navigate('/barber/profile')}
                            >
                                My Profile
                            </Button>
                            <Button
                                block
                                size="large"
                                icon={<DollarOutlined />}
                                onClick={() => navigate('/barber/earnings')}
                            >
                                View Earnings
                            </Button>
                        </div>
                    </Card>

                    <Card title="This Week Summary" style={{ marginTop: 24 }}>
                        <Statistic
                            title="Total Appointments"
                            value={stats.weeklyAppointments || 0}
                            suffix={`/ ${stats.weeklySlots || 0} slots`}
                        />
                        <Statistic
                            title="Weekly Revenue"
                            value={stats.weeklyEarnings || 0}
                            prefix="₹"
                            style={{ marginTop: 16 }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default BarberDashboard;
