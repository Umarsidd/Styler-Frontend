import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, Button, Descriptions, Tag, Image, Rate, Tabs, Spin, Empty } from 'antd';
import {
    EnvironmentOutlined,
    ClockCircleOutlined,
    PhoneOutlined,
    MailOutlined,
    StarFilled,
} from '@ant-design/icons';
import { salonService } from '../../services/salonService';
import { Salon, Service } from '../../types';
import { formatCurrency, formatTime } from '../../utils/helpers';
import './SalonDetails.css';

const { TabPane } = Tabs;

const SalonDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: salonData, isLoading: loadingSalon } = useQuery({
        queryKey: ['salon', id],
        queryFn: () => salonService.getSalonById(id!),
        enabled: !!id,
    });

    const { data: servicesData, isLoading: loadingServices } = useQuery({
        queryKey: ['salon-services', id],
        queryFn: () => salonService.getSalonServices(id!),
        enabled: !!id,
    });

    const salon = salonData?.data as Salon | undefined;
    const services = servicesData?.data as Service[] | undefined;

    const handleBookNow = () => {
        navigate(`/booking/${id}`);
    };

    if (loadingSalon) {
        return (
            <div className="salon-details-loading">
                <Spin size="large" tip="Loading salon details..." />
            </div>
        );
    }

    if (!salon) {
        return (
            <div className="salon-details-error">
                <Empty description="Salon not found" />
                <Button type="primary" onClick={() => navigate('/salons')}>
                    Browse Salons
                </Button>
            </div>
        );
    }

    return (
        <div className="salon-details-page">
            {/* Hero Section */}
            <div className="salon-hero">
                <div className="salon-images">
                    <Image.PreviewGroup>
                        {salon.images && salon.images.length > 0 ? (
                            salon.images.map((image, index) => (
                                <Image
                                    key={index}
                                    src={image}
                                    alt={`${salon.name} - ${index + 1}`}
                                    className="salon-image"
                                    fallback="/placeholder-salon.jpg"
                                />
                            ))
                        ) : (
                            <Image src="/placeholder-salon.jpg" alt={salon.name} />
                        )}
                    </Image.PreviewGroup>
                </div>
            </div>

            {/* Main Content */}
            <div className="salon-content">
                <div className="salon-header">
                    <div className="salon-title-section">
                        <h1>{salon.name}</h1>
                        <div className="salon-rating">
                            <Rate disabled value={salon.rating || 0} allowHalf />
                            <span className="rating-text">
                                {salon.rating?.toFixed(1) || 'N/A'} ({salon.totalReviews || 0} reviews)
                            </span>
                        </div>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleBookNow}
                        className="book-now-btn"
                    >
                        Book Appointment
                    </Button>
                </div>

                <Tabs defaultActiveKey="overview" className="salon-tabs">
                    <TabPane tab="Overview" key="overview">
                        <Card>
                            <p className="salon-description">{salon.description}</p>

                            <Descriptions title="Contact Information" column={1} bordered>
                                <Descriptions.Item label={<><EnvironmentOutlined /> Address</>}>
                                    {salon.address.street}, {salon.address.city}, {salon.address.state} - {salon.address.pincode}
                                </Descriptions.Item>
                                {salon.phone && (
                                    <Descriptions.Item label={<><PhoneOutlined /> Phone</>}>
                                        {salon.phone}
                                    </Descriptions.Item>
                                )}
                                {salon.email && (
                                    <Descriptions.Item label={<><MailOutlined /> Email</>}>
                                        {salon.email}
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        </Card>
                    </TabPane>

                    <TabPane tab="Services" key="services">
                        {loadingServices ? (
                            <Spin />
                        ) : services && services.length > 0 ? (
                            <div className="services-grid">
                                {services.map((service) => (
                                    <Card key={service._id} className="service-card">
                                        <div className="service-header">
                                            <h3>{service.name}</h3>
                                            <span className="service-price">{formatCurrency(service.price)}</span>
                                        </div>
                                        <p className="service-description">{service.description}</p>
                                        <div className="service-details">
                                            <Tag color="blue">{service.duration} min</Tag>
                                            <Tag color={service.gender === 'unisex' ? 'green' : 'purple'}>
                                                {service.gender}
                                            </Tag>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Empty description="No services available" />
                        )}
                    </TabPane>

                    <TabPane tab="Operating Hours" key="hours">
                        <Card>
                            <div className="operating-hours">
                                {salon.operatingHours && salon.operatingHours.length > 0 ? (
                                    salon.operatingHours.map((hours) => (
                                        <div key={hours.day} className="hours-row">
                                            <span className="day-name">
                                                {hours.day.charAt(0).toUpperCase() + hours.day.slice(1)}
                                            </span>
                                            {hours.isOpen ? (
                                                <span className="hours-time">
                                                    <ClockCircleOutlined /> {formatTime(hours.openTime)} - {formatTime(hours.closeTime)}
                                                </span>
                                            ) : (
                                                <Tag color="red">Closed</Tag>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <Empty description="Operating hours not available" />
                                )}
                            </div>
                        </Card>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default SalonDetails;
