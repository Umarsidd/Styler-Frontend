import { Card, Tag, Button, Rate } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './SalonCard.css';

const { Meta } = Card;

const SalonCard = ({ salon, showDistance = false, distance }) => {
    const navigate = useNavigate();

    const handleBookNow = () => {
        navigate(`/salons/${salon._id}`);
    };

    const getTodayHours = () => {
        const today = new Date().toLocaleLString('en-US', { weekday: 'lowercase' });
        const todayHours = salon.operatingHours?.find(h => h.day === today);

        if (!todayHours || !todayHours.isOpen) {
            return <Tag color="red">Closed Today</Tag>;
        }

        return (
            <span className="salon-hours">
                <ClockCircleOutlined /> {todayHours.openTime} - {todayHours.closeTime}
            </span>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
        >
            <Card
                hoverable
                className="salon-card"
                cover={
                    <div className="salon-card-image-wrapper">
                        <img
                            alt={salon.name}
                            src={salon.images?.[0] || '/placeholder-salon.jpg'}
                            className="salon-card-image"
                        />
                        {salon.rating > 0 && (
                            <div className="salon-rating-badge">
                                <StarFilled /> {salon.rating.toFixed(1)}
                            </div>
                        )}
                    </div>
                }
                actions={[
                    <Button type="primary" onClick={handleBookNow} block>
                        Book Now
                    </Button>,
                ]}
            >
                <Meta
                    title={<h3 className="salon-card-title">{salon.name}</h3>}
                    description={
                        <div className="salon-card-details">
                            <p className="salon-description">
                                {salon.description?.slice(0, 100)}
                                {salon.description?.length > 100 ? '...' : ''}
                            </p>

                            <div className="salon-info">
                                <div className="salon-info-item">
                                    <EnvironmentOutlined />
                                    <span>{salon.address?.city}, {salon.address?.state}</span>
                                    {showDistance && distance && (
                                        <Tag color="blue">{distance.toFixed(1)} km</Tag>
                                    )}
                                </div>

                                <div className="salon-info-item">
                                    {getTodayHours()}
                                </div>

                                {salon.totalReviews > 0 && (
                                    <div className="salon-reviews">
                                        <Rate disabled value={salon.rating} allowHalf />
                                        <span className="review-count">({salon.totalReviews} reviews)</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                />
            </Card>
        </motion.div>
    );
};

export default SalonCard;
