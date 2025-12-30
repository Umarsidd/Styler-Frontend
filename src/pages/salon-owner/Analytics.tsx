import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { DollarOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import './Analytics.css';

const Analytics: React.FC = () => {
    return (
        <div className="analytics-page">
            <div className="page-header">
                <h1>Analytics & Reports 📊</h1>
                <p>Track your salon's performance</p>
            </div>

            {/* Key Metrics */}
            <Row gutter={[24, 24]} className="metrics-row">
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Total Revenue"
                            value={0}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#10b981' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Total Appointments"
                            value={0}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#667eea' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Active Customers"
                            value={0}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#f59e0b' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts Placeholder */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card title="Revenue Trend">
                        <div className="chart-placeholder">
                            <p>Revenue chart will be displayed here</p>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Popular Services">
                        <div className="chart-placeholder">
                            <p>Popular services chart will be displayed here</p>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Analytics;
