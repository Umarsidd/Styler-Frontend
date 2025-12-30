import React from 'react';
import { Card } from 'antd';
import { Service } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import './ServiceCard.css';

interface ServiceCardProps {
    service: Service;
    onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
    return (
        <Card className="service-card" hoverable onClick={onClick}>
            <h3>{service.name}</h3>
            <p className="service-description">{service.description}</p>
            <div className="service-details">
                <span className="service-duration">{service.duration} min</span>
                <span className="service-price">{formatCurrency(service.price)}</span>
            </div>
        </Card>
    );
};

export default ServiceCard;
