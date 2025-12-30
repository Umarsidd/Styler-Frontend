import React from 'react';
import { Typography, Card, Row, Col } from 'antd';
import { ScissorOutlined, SkinOutlined, BgColorsOutlined } from '@ant-design/icons';
import { formatCurrency } from '../utils/helpers';
import './Services.css';

const { Title, Paragraph } = Typography;

interface ServiceItem {
    icon: React.ReactNode;
    title: string;
    description: string;
    price: number;
}

const Services: React.FC = () => {
    const services: ServiceItem[] = [
        {
            icon: <ScissorOutlined />,
            title: 'Haircut & Styling',
            description: 'Professional haircuts and styling by expert stylists',
            price: 500,
        },
        {
            icon: <SkinOutlined />,
            title: 'Beard Grooming',
            description: 'Complete beard trimming and shaping services',
            price: 300,
        },
        {
            icon: <BgColorsOutlined />,
            title: 'Hair Coloring',
            description: 'Premium hair coloring and highlights',
            price: 2000,
        },
    ];

    return (
        <div className="services-page">
            <section className="services-hero">
                <Title level={1}>Our Services</Title>
                <Paragraph>Premium grooming services for the modern gentleman</Paragraph>
            </section>

            <section className="services-grid">
                <Row gutter={[24, 24]}>
                    {services.map((service, index) => (
                        <Col xs={24} md={8} key={index}>
                            <Card className="service-card" hoverable>
                                <div className="service-icon">{service.icon}</div>
                                <Title level={3}>{service.title}</Title>
                                <Paragraph>{service.description}</Paragraph>
                                <div className="service-price">Starting from {formatCurrency(service.price)}</div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>
        </div>
    );
};

export default Services;
