import React, { useEffect, useRef } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Button, Chip } from '@mui/material';
import {
    ContentCut as ScissorsIcon,
    Face as FaceIcon,
    Spa as SpaIcon,
    Palette as PaletteIcon,
    StarRate as StarIcon,
    CheckCircle as CheckIcon,
    Schedule as TimeIcon,
    EmojiEvents as TrophyIcon,
    LocalOffer as OfferIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Services.css';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const Services: React.FC = () => {
    const navigate = useNavigate();

    const services = [
        {
            icon: <ScissorsIcon />,
            title: 'Hair Cutting & Styling',
            description: 'Expert cuts and modern styles tailored to your personality',
            price: 'From ₹500',
            duration: '45 min',
            popular: true,
            features: ['Consultation', 'Wash & Dry', 'Styling'],
        },
        {
            icon: <FaceIcon />,
            title: 'Beard Grooming',
            description: 'Professional beard trimming, shaping, and grooming',
            price: 'From ₹300',
            duration: '30 min',
            popular: true,
            features: ['Trim & Shape', 'Hot Towel', 'Aftercare'],
        },
        {
            icon: <PaletteIcon />,
            title: 'Hair Coloring',
            description: 'Premium coloring with top-quality products',
            price: 'From ₹2000',
            duration: '120 min',
            popular: false,
            features: ['Color Consultation', 'Application', 'Treatment'],
        },
        {
            icon: <SpaIcon />,
            title: 'Spa & Facial',
            description: 'Relaxing spa treatments for glowing skin',
            price: 'From ₹1500',
            duration: '60 min',
            popular: false,
            features: ['Deep Cleanse', 'Massage', 'Mask'],
        },
    ];

    const benefits = [
        { icon: <StarIcon />, title: 'Expert Professionals', description: 'Certified stylists with 5+ years experience' },
        { icon: <TimeIcon />, title: 'Flexible Timing', description: 'Book at your convenience, 7 days a week' },
        { icon: <TrophyIcon />, title: 'Premium Products', description: 'Only the best brands and equipment' },
        { icon: <OfferIcon />, title: 'Special Offers', description: 'Regular discounts and loyalty rewards' },
    ];

    const packages = [
        {
            name: 'Basic Grooming',
            price: '₹799',
            original: '₹1000',
            services: ['Haircut', 'Beard Trim', 'Head Massage'],
            popular: false,
        },
        {
            name: 'Premium Package',
            price: '₹1499',
            original: '₹2000',
            services: ['Haircut', 'Beard Styling', 'Facial', 'Hair Spa'],
            popular: true,
        },
        {
            name: 'Luxury Experience',
            price: '₹2999',
            original: '₹4000',
            services: ['Premium Haircut', 'Beard Design', 'Facial', 'Hair Spa', 'Color Touch-up'],
            popular: false,
        },
    ];

    // Animations now handled by Framer Motion whileInView prop on individual components

    return (
        <Box className="services-page">
            {/* Hero Section */}
            <Box className="services-hero">
                <Container maxWidth="lg">
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        sx={{ textAlign: 'center' }}
                    >
                        <Typography variant="h1" sx={{ color: 'white', mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                            Premium Grooming Services
                        </Typography>
                        <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.95)', mb: 4, maxWidth: 700, mx: 'auto' }}>
                            Experience world-class grooming with our expert stylists
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/salons')}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                bgcolor: 'white',
                                color: 'primary.main',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                            }}
                        >
                            Book Now
                        </Button>
                    </MotionBox>
                </Container>
            </Box>

            {/* Services Grid */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography variant="h2" align="center" sx={{ mb: 2 }}>
                    Our Services
                </Typography>
                <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}>
                    Choose from our wide range of professional grooming services
                </Typography>

                <Grid container spacing={4}>
                    {services.map((service, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                className="service-detail-card"
                                sx={{
                                    height: '100%',
                                    position: 'relative',
                                    overflow: 'visible',
                                }}
                            >
                                {service.popular && (
                                    <Chip
                                        label="Popular"
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: -12,
                                            right: 16,
                                            bgcolor: '#ec4899',
                                            color: 'white',
                                            fontWeight: 700,
                                        }}
                                    />
                                )}
                                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                    <Box
                                        className="service-icon-large"
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 1.5rem',
                                            fontSize: '2.5rem',
                                            color: 'white',
                                        }}
                                    >
                                        {service.icon}
                                    </Box>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                                        {service.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {service.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                            {service.price}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {service.duration}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'left' }}>
                                        {service.features.map((feature, idx) => (
                                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                                <Typography variant="body2">{feature}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Packages Section */}
            <Box sx={{ bgcolor: '#f8fafc', py: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" align="center" sx={{ mb: 2 }}>
                        Value Packages
                    </Typography>
                    <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
                        Save more with our combo packages
                    </Typography>

                    <Grid container spacing={4}>
                        {packages.map((pkg, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card
                                    className="package-card"
                                    sx={{
                                        height: '100%',
                                        position: 'relative',
                                        border: pkg.popular ? '3px solid' : '2px solid',
                                        borderColor: pkg.popular ? 'primary.main' : 'divider',
                                        transform: pkg.popular ? 'scale(1.05)' : 'none',
                                    }}
                                >
                                    {pkg.popular && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: -16,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                px: 3,
                                                py: 0.5,
                                                borderRadius: 2,
                                                fontWeight: 700,
                                            }}
                                        >
                                            Most Popular
                                        </Box>
                                    )}
                                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, mt: pkg.popular ? 2 : 0 }}>
                                            {pkg.name}
                                        </Typography>
                                        <Box sx={{ my: 3 }}>
                                            <Typography
                                                variant="h3"
                                                sx={{ fontWeight: 800, color: 'primary.main', display: 'inline' }}
                                            >
                                                {pkg.price}
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                sx={{ color: 'text.secondary', textDecoration: 'line-through', ml: 2, display: 'inline' }}
                                            >
                                                {pkg.original}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'left', mb: 3 }}>
                                            {pkg.services.map((service, idx) => (
                                                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <CheckIcon sx={{ color: 'success.main' }} />
                                                    <Typography variant="body1">{service}</Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                        <Button
                                            variant={pkg.popular ? 'contained' : 'outlined'}
                                            fullWidth
                                            size="large"
                                            onClick={() => navigate('/salons')}
                                        >
                                            Book Package
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Benefits Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography variant="h2" align="center" sx={{ mb: 6 }}>
                    Why Choose Us
                </Typography>

                <Grid container spacing={4}>
                    {benefits.map((benefit, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Box className="benefit-item" sx={{ textAlign: 'center' }}>
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1.5rem',
                                        fontSize: '2.5rem',
                                        color: '#6366f1',
                                    }}
                                >
                                    {benefit.icon}
                                </Box>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                                    {benefit.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {benefit.description}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box className="services-cta">
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ mb: 3, color: 'white' }}>
                        Ready to Look Your Best?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255,255,255,0.9)' }}>
                        Book your appointment now and experience premium grooming
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/salons')}
                        sx={{
                            px: 5,
                            py: 1.5,
                            fontSize: '1.1rem',
                            bgcolor: 'white',
                            color: 'primary.main',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                        }}
                    >
                        Find a Salon
                    </Button>
                </Container>
            </Box>
        </Box>
    );
};

export default Services;
