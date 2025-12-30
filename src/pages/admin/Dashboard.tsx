import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, ShopOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="Total Users" value={0} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="Total Salons" value={0} prefix={<ShopOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="Appointments" value={0} prefix={<CalendarOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="Revenue" value={0} prefix={<DollarOutlined />} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
