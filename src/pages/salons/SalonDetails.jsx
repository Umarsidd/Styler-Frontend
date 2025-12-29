import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Row, Col, Button, Tag, Rate, Tabs, Card, Empty, Spin, Descriptions,
    Image, Divider
} from 'antd';
import {
    EnvironmentOutlined, PhoneOutlined, MailOutlined,
    ClockCircleOutlined, StarFilled
} from '@ant-design/icons';
import { salonService } from '../../services/salonService';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import './SalonDetails.css';

const { TabPane } = Tabs;

const SalonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Fetch salon details
    const { data: salonData, isLoading: salonLoading } = useQuery({
        queryKey: ['salon', id],
        queryFn: () => salonService.getSalonById(id),
    });

    // Fetch salon services
    const { data: servicesData, isLoading: servicesLoading } = useQuery({
        queryKey: ['salon-services', id],
        queryFn: () => salonService.getSalonServices(id),
    });

    // Fetch salon reviews
    const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
        queryKey: ['salon-reviews', id],
        queryFn: () => reviewService.getSalonReviews(id, { page: 1, limit: 10 }),
    });

    const salon = salonData?.data;
    const services = servicesData?.data || [];
    const reviews = reviewsData?.data?.data || [];

    const handleBookNow = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate(`/booking/${id}`);
    };

    if (salonLoading) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Loading salon details..." />
            </div>
        );
    }

    if (!salon) {
        return (
            <div className="error-container">
                <Empty description="Salon not found" />
                <Button type="primary" onClick={() => navigate('/salons')}>
                    Browse Salons
                </Button>
            </div>
        );
    }

    const getOperatingHoursDisplay = () => {
        const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        return daysOfWeek.map(day => {
            const hours = salon.operatingHours?.find(h => h.day === day);
            const isToday = new Date().toLocaleDateString('en-US', { weekday: 'lowercase' }) === day;

            return (
                <div key={day} className={`hours-row ${isToday ? 'today' : ''}`}>
                    <span className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                    {hours && hours.isOpen ? (
                        <span className="hours-time">{hours.openTime} - {hours.closeTime}</span>
                    ) : (
                        <Tag color="red">Closed</Tag>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="salon-details-page">
            {/* Image Gallery */}
            <div className="salon-gallery">
                <Image.PreviewGroup>
                    <Row gutter={[8, 8]}>
                        <Col span={16}>
                            <Image
                                src={salon.images?.[0] || '/placeholder-salon.jpg'}
                                alt={salon.name}
                                className="main-image"
                                height={400}
                                style={{ objectFit: 'cover', borderRadius: '12px' }}
                            />
                        </Col>
                        <Col span={8}>
                            <Row gutter={[8, 8]}>
                                {salon.images?.slice(1, 5).map((img, idx) => (
                                    <Col span={12} key={idx}>
                                        <Image
                                            src={img}
                                            alt={`${salon.name} ${idx + 2}`}
                                            height={196}
                                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </Image.PreviewGroup>
            </div>

            <div className="salon-details-container">
                <Row gutter={[32, 32]}>
                    {/* Main Content */}
                    <Col xs={24} lg={16}>
                        {/* Header */}
                        <div className="salon-header">
                            <div className="header-main">
                                <h1 className="salon-name">{salon.name}</h1>
                                <div className="salon-rating-display">
                                    <Rate disabled value={salon.rating} allowHalf />
                                    <span className="rating-text">
                                        {salon.rating.toFixed(1)} ({salon.totalReviews} reviews)
                                    </span>
                                </div>
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleBookNow}
                                className="book-btn-main"
                            >
                                Book Appointment
                            </Button>
                        </div>

                        <Divider />

                        {/* About */}
                        <section className="salon-section">
                            <h2>About</h2>
                            <p className="salon-description">{salon.description}</p>
                        </section>

                        {/* Contact Info */}
                        <section className="salon-section">
                            <h2>Contact Information</h2>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <EnvironmentOutlined />
                                    <div>
                                        <strong>Address</strong>
                                        <p>
                                            {salon.address.street}, {salon.address.city}, {salon.address.state} - {salon.address.pincode}
                                        </p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <PhoneOutlined />
                                    <div>
                                        <strong>Phone</strong>
                                        <p>{salon.phone}</p>
                                    </div>
                                </div>
                                {salon.email && (
                                    <div className="contact-item">
                                        <MailOutlined />
                                        <div>
                                            <strong>Email</strong>
                                            <p>{salon.email}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Tabs for Services and Reviews */}
                        <section className="salon-section">
                            <Tabs defaultActiveKey="services" size="large">
                                <TabPane tab="Services" key="services">
                                    {servicesLoading ? (
                                        <Spin />
                                    ) : services.length === 0 ? (
                                        <Empty description="No services available" />
                                    ) : (
                                        <Row gutter={[16, 16]}>
                                            {services.map((service) => (
                                                <Col xs={24} sm={12} key={service._id}>
                                                    <Card className="service-card" hoverable>
                                                        <div className="service-header">
                                                            <h3>{service.name}</h3>
                                                            <Tag color="blue">{service.gender}</Tag>
                                                        </div>
                                                        <p className="service-description">{service.description}</p>
                                                        <div className="service-footer">
                                                            <div className="service-duration">
                                                                <ClockCircleOutlined /> {service.duration} mins
                                                            </div>
                                                            <div className="service-price">₹{service.price}</div>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    )}
                                </TabPane>

                                <TabPane tab={`Reviews (${reviews.length})`} key="reviews">
                                    {reviewsLoading ? (
                                        <Spin />
                                    ) : reviews.length === 0 ? (
                                        <Empty description="No reviews yet" />
                                    ) : (
                                        <div className="reviews-list">
                                            {reviews.map((review) => (
                                                <Card key={review._id} className="review-card">
                                                    <div className="review-header">
                                                        <div>
                                                            <strong>{review.customerId?.name || 'Customer'}</strong>
                                                            <Rate disabled value={review.rating} style={{ fontSize: 14, marginLeft: 12 }} />
                                                        </div>
                                                        <span className="review-date">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="review-comment">{review.comment}</p>
                                                    {review.images && review.images.length > 0 && (
                                                        <div className="review-images">
                                                            <Image.PreviewGroup>
                                                                {review.images.map((img, idx) => (
                                                                    <Image key={idx} src={img} width={80} height={80} style={{ objectFit: 'cover', borderRadius: 8, marginRight: 8 }} />
                                                                ))}
                                                            </Image.PreviewGroup>
                                                        </div>
                                                    )}
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </TabPane>
                            </Tabs>
                        </section>
                    </Col>

                    {/* Sidebar */}
                    <Col xs={24} lg={8}>
                        <div className="salon-sidebar">
                            {/* Operating Hours */}
                            <Card title="Operating Hours" className="sidebar-card">
                                <div className="operating-hours">
                                    {getOperatingHoursDisplay()}
                                </div>
                            </Card>

                            {/* Map Placeholder */}
                            <Card title="Location" className="sidebar-card">
                                <div className="map-placeholder">
                                    <p>
                                        <EnvironmentOutlined style={{ fontSize: 24, color: '#667eea' }} />
                                    </p>
                                    <p>Google Maps integration coming soon</p>
                                    <p className="location-coords">
                                        Lat: {salon.address.location.coordinates[1].toFixed(6)}
                                        <br />
                                        Lng: {salon.address.location.coordinates[0].toFixed(6)}
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default SalonDetails;
