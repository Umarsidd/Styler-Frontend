import React from 'react';
import { Typography, Card, Row, Col } from 'antd';
import { TeamOutlined, TrophyOutlined, HeartOutlined } from '@ant-design/icons';
import './About.css';

const { Title, Paragraph } = Typography;

const About: React.FC = () => {
    const values = [
        {
            icon: <HeartOutlined />,
            title: 'Customer First',
            description: 'Your satisfaction is our priority',
        },
        {
            icon: <TrophyOutlined />,
            title: 'Excellence',
            description: 'We strive for perfection in every service',
        },
        {
            icon: <TeamOutlined />,
            title: 'Expert Team',
            description: 'Highly trained professionals',
        },
    ];

    return (
        <div className="about-page">
            <section className="about-hero">
                <Title level={1}>About Styler</Title>
                <Paragraph>We're revolutionizing the salon booking experience</Paragraph>
            </section>

            <section className="about-content">
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={12}>
                        <Title level={2}>Our Story</Title>
                        <Paragraph>
                            Founded with a vision to make premium salon services accessible to everyone, Styler has grown
                            to become the leading salon booking platform with over 20+ locations nationwide.
                        </Paragraph>
                    </Col>
                    <Col xs={24} md={12}>
                        <Title level={2}>Our Mission</Title>
                        <Paragraph>
                            To provide a seamless booking experience while connecting customers with the best stylists
                            and salons in their area.
                        </Paragraph>
                    </Col>
                </Row>
            </section>

            <section className="values-section">
                <Title level={2}>Our Values</Title>
                <Row gutter={[24, 24]}>
                    {values.map((value, index) => (
                        <Col xs={24} md={8} key={index}>
                            <Card className="value-card">
                                <div className="value-icon">{value.icon}</div>
                                <Title level={4}>{value.title}</Title>
                                <Paragraph>{value.description}</Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>
        </div>
    );
};

export default About;
