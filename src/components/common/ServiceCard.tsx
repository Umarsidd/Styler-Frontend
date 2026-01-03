import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Service } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import './ServiceCard.css';

interface ServiceCardProps {
    service: Service;
    onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
    return (
        <Card
            className="service-card"
            onClick={onClick}
            sx={{
                cursor: onClick ? 'pointer' : 'default',
            }}
        >
            <CardContent>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
                    {service.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="service-description" sx={{ mb: 2 }}>
                    {service.description}
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="service-duration">{service.duration} min</span>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {formatCurrency(service.price)}
                    </Typography>
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ServiceCard;
