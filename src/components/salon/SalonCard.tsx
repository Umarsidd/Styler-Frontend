import React from 'react';
import { Card } from 'antd';
import { StarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Salon } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import './SalonCard.css';

interface SalonCardProps {
    salon: Salon;
    distance?: number;
}

const SalonCard: React.FC<SalonCardProps> = ({ salon, distance }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/salons/${salon._id}`);
    };

    const handleBookClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/booking/${salon._id}`);
    };

    return (
        <Card
            hoverable
            className="salon-card"
            onClick={handleCardClick}
            cover={
                <div className="salon-card-image">
                    <img
                        alt={salon.name}
                        src={salon.images?.[0] || '/placeholder-salon.jpg'}
                        onError={(e) => {
                            e.currentTarget.src = '/placeholder-salon.jpg';
                        }}
                    />
                    {distance !== undefined && (
                        <div className="distance-badge">
                            <EnvironmentOutlined /> {distance.toFixed(1)} km
                        </div>
                    )}
                </div>
            }
        >
            <div className="salon-card-content">
                <h3 className="salon-name">{salon.name}</h3>
                <p className="salon-address">
                    <EnvironmentOutlined /> {salon.address.city}, {salon.address.state}
                </p>

                <div className="salon-rating">
                    <StarOutlined style={{ color: '#faad14' }} />
                    <span className="rating-value">{salon.rating?.toFixed(1) || 'N/A'}</span>
                    <span className="rating-count">({salon.totalReviews || 0} reviews)</span>
                </div>

                {salon.description && (
                    <p className="salon-description">
                        {salon.description.length > 100
                            ? `${salon.description.substring(0, 100)}...`
                            : salon.description}
                    </p>
                )}

                <div className="salon-card-footer">
                    <div className="salon-hours">
                        {isOpen(salon) ? (
                            <span className="status-open">Open Now</span>
                        ) : (
                            <span className="status-closed">Closed</span>
                        )}
                    </div>
                    <button className="book-btn" onClick={handleBookClick}>
                        Book Now
                    </button>
                </div>
            </div>
        </Card>
    );
};

// Helper function to check if salon is currently open
const isOpen = (salon: Salon): boolean => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const todayHours = salon.operatingHours?.find(
        (hours) => hours.day.toLowerCase() === currentDay
    );

    if (!todayHours || !todayHours.isOpen) {
        return false;
    }

    const [openHour, openMin] = todayHours.openTime.split(':').map(Number);
    const [closeHour, closeMin] = todayHours.closeTime.split(':').map(Number);

    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;

    return currentTime >= openTime && currentTime <= closeTime;
};

export default SalonCard;
