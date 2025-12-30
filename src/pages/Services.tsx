import React from 'react';
import { Container, Typography, Card, CardContent, Grid, Box } from '@mui/material';
import { ContentCut as ScissorsIcon, Face as SkinIcon, Palette as ColorsIcon } from '@mui/icons-material';
import { formatCurrency } from '../utils/helpers';
import './Services.css';

interface ServiceItem {
    icon: React.ReactNode;
    title: string;
    description: string;
    price: number;
}

const Services: React.FC = () => {
    const services: ServiceItem[] = [
        {
            icon: <ScissorsIcon />,
            title: 'Haircut & Styling',
            description: 'Professional haircuts and styling by expert stylists',
            price: 500,
        },
        {
            icon: <SkinIcon />,
            title: 'Beard Grooming',
            description: 'Complete beard trimming and shaping services',
            price: 300,
        },
        {
            icon: <ColorsIcon />,
            title: 'Hair Coloring',
            description: 'Premium hair coloring and highlights',
            price: 2000,
        },
    ];

    return (
        <Box className="services-page">
            <Box className="services-hero">
                <Typography variant="h1">Our Services</Typography>
                <Typography variant="h5" sx={{ mt: 2, color: 'text.secondary' }}>
                    Premium grooming services for the modern gentleman
                </Typography>
            </Box>

            <Container maxWidth="lg" className="services-grid">
                <Grid container spacing={3}>
                    {services.map((service, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card className="service-card" sx={{ height: '100%', cursor: 'pointer' }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Box className="service-icon" sx={{ mb: 2 }}>
                                        {service.icon}
                                    </Box>
                                    <Typography variant="h3" gutterBottom>
                                        {service.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        {service.description}
                                    </Typography>
                                    <Typography variant="h6" className="service-price" sx={{ mt: 2 }}>
                                        Starting from {formatCurrency(service.price)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Services;
