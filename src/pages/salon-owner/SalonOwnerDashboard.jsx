import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Statistic, Button, Table, Tag } from 'antd';
import {
    ShopOutlined, DollarOutlined, CalendarOutlined, TeamOutlined,
    PlusOutlined, StarOutlined
} from '@ant-design/icons';
import { salonService } from '../../services/salonService';
import './SalonOwnerDashboard.css';

const SalonOwnerDashboard = () => {
    const navigate = useNavigate();

    // Fetch salon owner's salons
    const { data: salonsData } = useQuery({
        queryKey: ['my-salons'],
        queryFn: () => salonService.getMySalons(),
    });

    // Fetch stats
    const { data: statsData } = useQuery({
        queryKey: ['salon-owner-stats'],
        queryFn: () => salon Service.getOwnerStats(),
    });

    const salons = salonsData?.data || [];
    const stats = statsData?.data || {};

    const salonColumns = [
        {
            title: 'Salon Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Location',
            dataIndex: 'address',
            key: 'address',
            render: (address) => `${address?.city || 'N/A'}`,
        },
        {
            title: 'Staff',
            dataIndex: 'staffCount',
            key: 'staffCount',
            render: (count) => count || 0,
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => (
                <span>
                    <StarOutlined style={{ color: '#faad14' }} /> {rating?.toFixed(1) || 'N/A'}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="link" onClick={() => navigate(`/salon-owner/salons/${record._id}`)}>
                    Manage
                </Button>
            ),
        },
    ];

    return (
        <div className="salon-owner-dashboard">
            <div className="dashboard-header">
                <h1>Salon Owner Dashboard</h1>
                <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/salon-owner/salons/new')}
                >
                    Add New Salon
                </Button>
            </div>

            {/* Stats Row */}
            <Row gutter={[24, 24]} className="stats-row">
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Salons"
                            value={salons.length}
                            prefix={<ShopOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Revenue"
                            value={stats.totalRevenue || 0}
                            prefix="₹"
                            precision={0}
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
                            title="Total Staff"
                            value={stats.totalStaff || 0}
                            prefix={<TeamOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Salons Table */}
            <Card title="My Salons" className="salons-table-card">
                <Table
                    columns={salonColumns}
                    dataSource={salons}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            {/* Quick Actions */}
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col xs={24} md={8}>
                    <Card
                        hoverable
                        className="action-card"
                        onClick={() => navigate('/salon-owner/staff')}
                    >
                        <TeamOutlined className="action-icon" />
                        <h3>Manage Staff</h3>
                        <p>Approve barbers and manage team</p>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card
                        hoverable
                        className="action-card"
                        onClick={() => navigate('/salon-owner/services')}
                    >
                        <CalendarOutlined className="action-icon" />
                        <h3>Manage Services</h3>
                        <p>Add and update services</p>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card
                        hoverable
                        className="action-card"
                        onClick={() => navigate('/salon-owner/analytics')}
                    >
                        <DollarOutlined className="action-icon" />
                        <h3>View Analytics</h3>
                        <p>Revenue and performance insights</p>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SalonOwnerDashboard;
