import { useQuery } from '@tanstack/react-query';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import { UserOutlined, ShopOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
    // Fetch system-wide statistics
    const { data: statsData } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            // This would call an admin stats endpoint
            return {
                data: {
                    totalUsers: 150,
                    totalSalons: 25,
                    totalAppointments: 500,
                    totalRevenue: 250000,
                    recentUsers: [],
                    recentSalons: [],
                }
            };
        },
    });

    const stats = statsData?.data || {};

    return (
        <div className="superadmin-dashboard">
            <div className="dashboard-header">
                <h1>Super Admin Dashboard</h1>
            </div>

            {/* System Stats */}
            <Row gutter={[24, 24]} className="stats-row">
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Users"
                            value={stats.totalUsers || 0}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Salons"
                            value={stats.totalSalons || 0}
                            prefix={<ShopOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Appointments"
                            value={stats.totalAppointments || 0}
                            prefix={<CalendarOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Platform Revenue"
                            value={stats.totalRevenue || 0}
                            prefix="₹"
                            precision={0}
                            valueStyle={{ color: '#fa ad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Recent Activity */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card title="Recent User Registrations" className="activity-card">
                        <p style={{ textAlign: 'center', color: '#999', padding: 20 }}>
                            User activity table would go here
                        </p>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Recent Salon Registrations" className="activity-card">
                        <p style={{ textAlign: 'center', color: '#999', padding: 20 }}>
                            Salon activity table would go here
                        </p>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SuperAdminDashboard;
