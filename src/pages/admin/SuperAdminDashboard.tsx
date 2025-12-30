import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
    UserOutlined,
    ShopOutlined,
    CalendarOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import './SuperAdminDashboard.css';

const SuperAdminDashboard: React.FC = () => {
    const stats = [
        {
            title: 'Total Users',
            value: 0,
            icon: <UserOutlined />,
            color: '#667eea',
        },
        {
            title: 'Total Salons',
            value: 0,
            icon: <ShopOutlined />,
            color: '#764ba2',
        },
        {
            title: 'Total Appointments',
            value: 0,
            icon: <CalendarOutlined />,
            color: '#10b981',
        },
        {
            title: 'Platform Revenue',
            value: '₹0',
            icon: <DollarOutlined />,
            color: '#f59e0b',
        },
    ];

    return (
        <div className="superadmin-dashboard">
            <div className="dashboard-header">
                <h1>Super Admin Dashboard 👑</h1>
                <p>Monitor and manage the entire platform</p>
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

            {/* Recent Activity */}
            <Card title="Recent Activity" className="activity-card">
                <p>No recent activity</p>
            </Card>

            {/* System Health */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card title="System Health">
                        <Statistic title="Server Status" value="Healthy" valueStyle={{ color: '#10b981' }} />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Database Status">
                        <Statistic title="Connection" value="Active" valueStyle={{ color: '#10b981' }} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SuperAdminDashboard;
