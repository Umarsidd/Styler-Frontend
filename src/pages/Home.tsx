import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Button, Row, Col, Card, Space } from 'antd';
import {
    ArrowRightOutlined,
    EnvironmentOutlined,
    StarOutlined,
    ScissorOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import CountUp from 'react-countup';
import './Home.css';

const { Title, Paragraph } = Typography;
const MotionDiv = motion.div;

interface Stat {
    count: number;
    suffix: string;
    title: string;
    color: string;
    icon: React.ReactNode;
}

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats] = useState<Stat[]>([
        { count: 20, suffix: '+', title: 'Branches', color: '#f59e0b', icon: <EnvironmentOutlined /> },
        { count: 5000, suffix: '+', title: 'Happy Clients', color: '#14b8a6', icon: <StarOutlined /> },
        { count: 150, suffix: '+', title: 'Expert Stylists', color: '#8b5cf6', icon: <ScissorOutlined /> },
        { count: 10, suffix: 'K+', title: 'Total Appointments', color: '#ec4899', icon: <CalendarOutlined /> },
    ]);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hero-content"
                >
                    <Title level={1}>Welcome to Styler</Title>
                    <Paragraph>Your premium salon booking platform</Paragraph>
                    <Space size="large">
                        <Button type="primary" size="large" onClick={() => navigate('/salons')}>
                            Book Now <ArrowRightOutlined />
                        </Button>
                        <Button size="large" onClick={() => navigate('/services')}>
                            Our Services
                        </Button>
                    </Space>
                </MotionDiv>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <Row gutter={[24, 24]}>
                    {stats.map((stat, index) => (
                        <Col xs={24} sm={12} md={6} key={index}>
                            <Card className="stat-card">
                                <div className="stat-icon" style={{ color: stat.color }}>
                                    {stat.icon}
                                </div>
                                <Title level={2}>
                                    <CountUp end={stat.count} duration={2.5} />
                                    {stat.suffix}
                                </Title>
                                <p>{stat.title}</p>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <Title level={2}>Ready to Transform Your Look?</Title>
                <Button type="primary" size="large" onClick={() => navigate(user ? '/salons' : '/login')}>
                    Get Started
                </Button>
            </section>
        </div>
    );
};

export default Home;
