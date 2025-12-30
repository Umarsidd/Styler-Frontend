import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Row, Col, Statistic, Table, Button, Tag } from 'antd';
import {
    ShopOutlined,
    UserOutlined,
    DollarOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { salonService } from '../../services/salonService';
import { Salon } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import './SalonOwnerDashboard.css';

const SalonOwnerDashboard: React.FC = () => {
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ['my-salons'],
        queryFn: () => salonService.getMySalons(),
    });

    const salons = (data?.data as Salon[]) || [];

    const columns: ColumnsType<Salon> = [
        {
            title: 'Salon Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: 'Location',
            key: 'location',
            render: (_, record) => `${record.address.city}, ${record.address.state}`,
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => `${rating?.toFixed(1) || 'N/A'} ⭐`,
        },
        {
            title: 'Status',
            key: 'status',
            render: () => <Tag color="green">Active</Tag>,
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

    const stats = [
        {
            title: 'Total Salons',
            value: salons.length,
            icon: <ShopOutlined />,
            color: '#667eea',
        },
        {
            title: 'Total Staff',
            value: '0',
            icon: <UserOutlined />,
            color: '#764ba2',
        },
        {
            title: 'Monthly Revenue',
            value: formatCurrency(0),
            icon: <DollarOutlined />,
            color: '#10b981',
        },
        {
            title: 'Appointments',
            value: '0',
            icon: <CalendarOutlined />,
            color: '#f59e0b',
        },
    ];

    return (
        <div className="salon-owner-dashboard">
            <div className="dashboard-header">
                <h1>Salon Owner Dashboard 💼</h1>
                <Button type="primary" size="large" onClick={() => navigate('/salon-owner/salons/new')}>
                    Add New Salon
                </Button>
            </div>

            {/* Statistics */}
            <Row gutter={[24, 24]} className="stats-row">
                {stats.map((stat, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card>
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

            {/* Salons Table */}
            <Card title="My Salons" className="salons-card">
                <Table
                    columns={columns}
                    dataSource={salons}
                    loading={isLoading}
                    rowKey="_id"
                    pagination={false}
                />
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions" className="quick-actions">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Button block size="large" onClick={() => navigate('/salon-owner/staff')}>
                            Manage Staff
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button block size="large" onClick={() => navigate('/salon-owner/services')}>
                            Manage Services
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button block size="large" onClick={() => navigate('/salon-owner/analytics')}>
                            View Analytics
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button block size="large" onClick={() => navigate('/profile')}>
                            Edit Profile
                        </Button>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default SalonOwnerDashboard;
