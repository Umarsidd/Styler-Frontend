import { useQuery } from '@tanstack/react-query';
import { Card, Row, Col, Statistic } from 'antd';
import { Line, Column } from '@ant-design/plots';
import { DollarOutlined, CalendarOutlined, TeamOutlined, StarOutlined } from '@ant-design/icons';
import { salonService } from '../../services/salonService';
import './Analytics.css';

const Analytics = () => {
    // Fetch analytics data
    const { data: analyticsData } = useQuery({
        queryKey: ['salon-analytics'],
        queryFn: () => salonService.getAnalytics(),
    });

    const analytics = analyticsData?.data || {};
    const monthlyRevenue = analytics.monthlyRevenue || [];
    const popularServices = analytics.popularServices || [];

    const revenueConfig = {
        data: monthlyRevenue,
        xField: 'month',
        yField: 'revenue',
        point: {
            size: 5,
            shape: 'diamond',
        },
        label: {
            style: {
                fill: '#aaa',
            },
        },
    };

    const servicesConfig = {
        data: popularServices,
        xField: 'name',
        yField: 'bookings',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
    };

    return (
        <div className="analytics-page">
            <div className="page-header">
                <h1>Analytics & Insights</h1>
            </div>

            {/* Key Metrics */}
            <Row gutter={[24, 24]} className="metrics-row">
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Revenue (This Month)"
                            value={analytics.monthRevenue || 0}
                            prefix="₹"
                            precision={0}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Appointments (This Month)"
                            value={analytics.monthAppointments || 0}
                            prefix={<CalendarOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Average Rating"
                            value={analytics.averageRating || 0}
                            precision={1}
                            prefix={<StarOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Active Barbers"
                            value={analytics.activeBarbers || 0}
                            prefix={<TeamOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Revenue Chart */}
            <Card title="Revenue Trend (Last 6 Months)" className="chart-card">
                {monthlyRevenue.length > 0 ? (
                    <Line {...revenueConfig} />
                ) : (
                    <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                        No revenue data available
                    </div>
                )}
            </Card>

            {/* Popular Services */}
            <Card title="Popular Services" className="chart-card" style={{ marginTop: 24 }}>
                {popularServices.length > 0 ? (
                    <Column {...servicesConfig} />
                ) : (
                    <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                        No services data available
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Analytics;
