import React, { useEffect, useRef } from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Chip, Grid } from '@mui/material';

import {
    StarRate as StarIcon,
    CheckCircle as CheckIcon,
    Schedule as TimeIcon,
    EmojiEvents as TrophyIcon,
    LocalOffer as OfferIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { servicesData } from '../data/services';
import './Services.css';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const Services: React.FC = () => {
    const navigate = useNavigate();



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
            <Box className="services-hero" sx={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(/images/beard-grooming.png)` }}>
                <Container maxWidth="lg">
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}
                    >
                        <Chip
                            label="Professional Care"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                backdropFilter: 'blur(10px)',
                                mb: 3,
                                px: 1,
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}
                        />
                        <Typography variant="h1" sx={{
                            color: 'white',
                            mb: 3,
                            fontSize: { xs: '2.5rem', md: '4.5rem' },
                            fontWeight: 800,
                            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                        }}>
                            Premium Grooming Services
                        </Typography>
                        <Typography variant="h5" sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            mb: 5,
                            maxWidth: 800,
                            mx: 'auto',
                            lineHeight: 1.6,
                            fontSize: { xs: '1.1rem', md: '1.4rem' }
                        }}>
                            Experience world-class grooming with our expert stylists, using premium products for the perfect look.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/salons')}
                            sx={{
                                px: 5,
                                py: 1.8,
                                fontSize: '1.1rem',
                                borderRadius: '50px',
                                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                textTransform: 'none',
                                fontWeight: 700,
                                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 15px 35px rgba(99, 102, 241, 0.5)',
                                }
                            }}
                        >
                            Book an Appointment
                        </Button>
                    </MotionBox>
                </Container>
            </Box>

            {/* Services Grid */}
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
                        OUR SERVICES
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
                        Expert Styling for Everyone
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                        Browse our comprehensive list of services designed to help you look and feel your absolute best.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {servicesData.map((service, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                            <MotionBox
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card
                                    className="service-detail-card"
                                    onClick={() => navigate(`/services/${service.slug}`)}
                                >
                                    {service.popular && (
                                        <div className="popular-badge">Popular</div>
                                    )}
                                    <CardContent sx={{ p: 0 }}>
                                        <Box className="service-icon-wrapper">
                                            {React.cloneElement(service.icon as React.ReactElement, { sx: { fontSize: 40, color: 'white' } })}
                                        </Box>
                                        <Box sx={{ p: 4, pt: 6 }}>
                                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, textAlign: 'center' }}>
                                                {service.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center', minHeight: 40 }}>
                                                {service.shortDescription}
                                            </Typography>

                                            <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary" display="block">Starting at</Typography>
                                                    <Typography variant="h6" color="primary" fontWeight={700}>{service.price}</Typography>
                                                </Box>
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography variant="caption" color="text.secondary" display="block">Duration</Typography>
                                                    <Typography variant="body2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <TimeIcon sx={{ fontSize: 14 }} /> {service.duration}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                endIcon={<CheckIcon />}
                                                sx={{
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    borderWidth: '2px',
                                                    '&:hover': { borderWidth: '2px' }
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/services/${service.slug}`);
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </MotionBox>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Packages Section */}
            <Box sx={{ bgcolor: '#fff', py: 10, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', opacity: 0.5, pointerEvents: 'none', background: 'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.05) 0%, transparent 50%)' }} />
                <Container maxWidth="lg" sx={{ position: 'relative' }}>
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="overline" color="secondary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
                            VALUE BUNDLES
                        </Typography>
                        <Typography variant="h2" sx={{ mb: 2, fontWeight: 800 }}>
                            Curated Packages
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Get the complete experience and save with our exclusive combos
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {packages.map((pkg, index) => (
                            <Grid size={{ xs: 12, md: 4 }} key={index}>
                                <Card
                                    className={`package-card ${pkg.popular ? 'popular' : ''}`}
                                    elevation={0}
                                >
                                    {pkg.popular && (
                                        <Box className="package-popular-badge">
                                            Most Popular
                                        </Box>
                                    )}
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, fontSize: '1.75rem' }}>
                                            {pkg.name}
                                        </Typography>
                                        <Box sx={{ my: 4, display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                            <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                                {pkg.price}
                                            </Typography>
                                            <Typography variant="h6" sx={{ color: 'text.secondary', textDecoration: 'line-through' }}>
                                                {pkg.original}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mb: 4 }}>
                                            {pkg.services.map((service, idx) => (
                                                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                                    <Box sx={{ bgcolor: 'success.light', borderRadius: '50%', p: 0.5, display: 'flex' }}>
                                                        <CheckIcon sx={{ color: 'white', fontSize: 14 }} />
                                                    </Box>
                                                    <Typography variant="body1" fontWeight={500}>{service}</Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                        <Button
                                            variant={pkg.popular ? 'contained' : 'outlined'}
                                            fullWidth
                                            size="large"
                                            onClick={() => navigate('/salons')}
                                            sx={{
                                                py: 1.5,
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                boxShadow: pkg.popular ? '0 8px 20px rgba(99, 102, 241, 0.3)' : 'none'
                                            }}
                                        >
                                            Choose Plan
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Benefits Section */}
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Grid container spacing={6}>
                    {benefits.map((benefit, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <Box className="benefit-item" sx={{ textAlign: 'center' }}>
                                <Box
                                    sx={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: '20px',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1.5rem',
                                        color: 'primary.main',
                                        transform: 'rotate(0deg)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    className="benefit-icon"
                                >
                                    {React.cloneElement(benefit.icon as React.ReactElement, { sx: { fontSize: 32 } })}
                                </Box>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                                    {benefit.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                    {benefit.description}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box className="services-cta" sx={{ py: 0 }}>
                <Container maxWidth="lg">
                    <Box sx={{
                        bgcolor: 'primary.main',
                        borderRadius: { xs: 0, md: '30px' },
                        p: { xs: 6, md: 8 },
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        boxShadow: '0 20px 60px rgba(79, 70, 229, 0.4)'
                    }}>
                        <Box sx={{ position: 'relative', zIndex: 2 }}>
                            <Typography variant="h2" sx={{ mb: 3, color: 'white', fontWeight: 800 }}>
                                Ready to Transform Your Look?
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 5, color: 'rgba(255,255,255,0.9)', maxWidth: 600, mx: 'auto' }}>
                                Book your appointment today and experience the distinct difference of our premium services.
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/salons')}
                                sx={{
                                    px: 6,
                                    py: 2,
                                    fontSize: '1.1rem',
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    fontWeight: 700,
                                    borderRadius: '50px',
                                    '&:hover': { bgcolor: '#f8fafc', transform: 'translateY(-2px)' },
                                }}
                            >
                                Find Nearest Salon
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Box sx={{ height: 80 }} /> {/* Spacer */}
        </Box>
    );
};

export default Services;
