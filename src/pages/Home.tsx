import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardContent, Box, Avatar } from '@mui/material';
import {
    ArrowForward as ArrowForwardIcon,
    LocationOn as LocationOnIcon,
    Star as StarIcon,
    ContentCut as ScissorsIcon,
    CalendarToday as CalendarIcon,
    CheckCircle as CheckIcon,
    Schedule as ScheduleIcon,
    Smartphone as SmartphoneIcon,
    AutoAwesome as SparklesIcon,
    EmojiEvents as TrophyIcon,
    Face as FaceIcon,
    Spa as SpaIcon,
    Security as SecurityIcon,
    LocalOffer as OfferIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAuthStore } from '../stores/authStore';
import CountUp from 'react-countup';
import './Home.css';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface Stat {
    count: number;
    suffix: string;
    title: string;
    color: string;
    icon: React.ReactNode;
}

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isAuthenticated, user: authUser } = useAuthStore();

    // Redirect professionals to their dashboard
    useEffect(() => {
        if (isAuthenticated && authUser) {
            const role = authUser.role;
            if (role === 'barber') {
                navigate('/barber/dashboard', { replace: true });
            } else if (role === 'salon_owner') {
                navigate('/salon-owner/dashboard', { replace: true });
            }
        }
    }, [isAuthenticated, authUser, navigate]);

    const [stats] = useState<Stat[]>([
        { count: 20, suffix: '+', title: 'Branches', color: '#f59e0b', icon: <LocationOnIcon /> },
        { count: 5000, suffix: '+', title: 'Happy Clients', color: '#14b8a6', icon: <StarIcon /> },
        { count: 150, suffix: '+', title: 'Expert Stylists', color: '#8b5cf6', icon: <ScissorsIcon /> },
        { count: 10, suffix: 'K+', title: 'Total Appointments', color: '#ec4899', icon: <CalendarIcon /> },
    ]);

    const features = [
        {
            icon: <CalendarIcon />,
            title: 'Easy Booking',
            description: 'Book appointments 24/7 through our platform with instant confirmation',
        },
        {
            icon: <ScissorsIcon />,
            title: 'Expert Stylists',
            description: 'Certified professionals with years of experience in latest trends',
        },
        {
            icon: <StarIcon />,
            title: 'Top Rated Service',
            description: 'Consistently rated 4.8+ stars by thousands of satisfied customers',
        },
        {
            icon: <ScheduleIcon />,
            title: 'Flexible Scheduling',
            description: 'Choose from morning, afternoon, or evening slots that fit your schedule',
        },
    ];

    const services = [
        {
            icon: <ScissorsIcon />,
            title: 'Haircut & Styling',
            price: '₹500',
            image: '/images/mens-haircut.png',
        },
        {
            icon: <FaceIcon />,
            title: 'Beard Grooming',
            price: '₹300',
            image: '/images/beard-grooming.png',
        },
        {
            icon: <SparklesIcon />,
            title: 'Hair Coloring',
            price: '₹2000',
            image: '/images/womens-styling.png',
        },
        {
            icon: <SpaIcon />,
            title: 'Spa & Facial',
            price: '₹1500',
            image: '/images/spa-facial.png',
        },
    ];

    const testimonials = [
        {
            name: 'Rahul Sharma',
            rating: 5,
            comment: 'Best salon experience! The staff is professional and the ambiance is amazing.',
            avatar: 'R',
        },
        {
            name: 'Priya Patel',
            rating: 5,
            comment: 'Love the convenience of booking online. My stylist always does an excellent job!',
            avatar: 'P',
        },
        {
            name: 'Amit Kumar',
            rating: 5,
            comment: 'Premium quality service at reasonable prices. Highly recommended!',
            avatar: 'A',
        },
    ];

    const howItWorks = [
        { step: '1', title: 'Browse Salons', description: 'Find top-rated salons near you' },
        { step: '2', title: 'Choose Service', description: 'Select from various grooming services' },
        { step: '3', title: 'Pick Time Slot', description: 'Book at your convenient time' },
        { step: '4', title: 'Get Styled', description: 'Enjoy premium grooming experience' },
    ];

    return (
        <Box className="home-page">
            {/* Hero Section */}
            <Box className="hero-section">
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hero-content"
                >
                    <Typography variant="h1" sx={{ color: 'white', mb: 2 }}>
                        Premium Grooming,
                        <br />
                        Just a Click Away
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.95)', mb: 4, maxWidth: 600, mx: 'auto' }}>
                        Book appointments with top salons and experienced stylists across 20+ locations
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => navigate('/salons')}
                            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                        >
                            Book Now
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/services')}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                            }}
                        >
                            Our Services
                        </Button>
                    </Box>
                </MotionBox>
            </Box >

            {/* Stats Section */}
            < Container maxWidth={false} className="stats-section" disableGutters >
                <Grid container spacing={2} sx={{ px: 1 }}>
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <MotionCard
                                className="stat-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Box className="stat-icon" sx={{ color: stat.color, mb: 2 }}>
                                        {stat.icon}
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: stat.color }}>
                                        <CountUp end={stat.count} duration={2.5} />
                                        {stat.suffix}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {stat.title}
                                    </Typography>
                                </CardContent>
                            </MotionCard>
                        </Grid>
                    ))}
                </Grid>
            </Container >

            {/* Features Section */}
            < Box className="features-section" >
                <Container maxWidth="lg">
                    <Typography variant="h2" align="center" sx={{ mb: 2 }}>
                        Why Choose Styler?
                    </Typography>
                    <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}>
                        We make grooming simple, convenient, and luxurious with our comprehensive platform
                    </Typography>
                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <MotionCard
                                    className="feature-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    sx={{ height: '100%', textAlign: 'center' }}
                                >
                                    <CardContent>
                                        <Box className="feature-icon" sx={{ mb: 2 }}>
                                            {feature.icon}
                                        </Box>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box >

            {/* Services Showcase */}
            < Box className="services-showcase" >
                <Container maxWidth="lg">
                    <Typography variant="h2" align="center" sx={{ mb: 2 }}>
                        Our Popular Services
                    </Typography>
                    <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
                        Professional grooming services for everyone
                    </Typography>
                    <Grid container spacing={3}>
                        {services.map((service, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <MotionCard
                                    className="service-showcase-card"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    onClick={() => navigate('/services')}
                                >
                                    <Box
                                        sx={{
                                            height: 200,
                                            background: `linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%), url(${service.image}) center/cover`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '3rem',
                                        }}
                                    >
                                        {service.icon}
                                    </Box>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                                            {service.title}
                                        </Typography>
                                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                            Starting from {service.price}
                                        </Typography>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box >

            {/* How It Works */}
            < Box className="how-it-works" >
                <Container maxWidth="lg">
                    <Typography variant="h2" align="center" sx={{ mb: 6 }}>
                        How It Works
                    </Typography>
                    <Grid container spacing={4}>
                        {howItWorks.map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <MotionBox
                                    className="step-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    sx={{ textAlign: 'center' }}
                                >
                                    <Box className="step-number">{item.step}</Box>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mt: 2 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.description}
                                    </Typography>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box >

            {/* Testimonials */}
            < Box className="testimonials-section" >
                <Container maxWidth="lg">
                    <Typography variant="h2" align="center" sx={{ mb: 2 }}>
                        What Our Clients Say
                    </Typography>
                    <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
                        Trusted by thousands of happy customers
                    </Typography>
                    <Grid container spacing={3}>
                        {testimonials.map((testimonial, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <MotionCard
                                    className="testimonial-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    sx={{ height: '100%' }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar sx={{ width: 50, height: 50, bgcolor: 'primary.main', mr: 2 }}>
                                                {testimonial.avatar}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                    {testimonial.name}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <StarIcon key={i} sx={{ color: '#f59e0b', fontSize: 18 }} />
                                                    ))}
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                            "{testimonial.comment}"
                                        </Typography>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box >

            {/* CTA Section */}
            < Box className="cta-section" >
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <TrophyIcon sx={{ fontSize: 60, color: 'white', mb: 2 }} />
                    <Typography variant="h2" sx={{ mb: 3, color: 'white' }}>
                        Ready to Transform Your Look?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255,255,255,0.9)' }}>
                        Join thousands of satisfied customers and book your appointment today
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate(user ? '/salons' : '/login')}
                        sx={{
                            px: 5,
                            py: 1.5,
                            fontSize: '1.1rem',
                            bgcolor: 'white',
                            color: '#6366f1',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                        }}
                        endIcon={<ArrowForwardIcon />}
                    >
                        {user ? 'Browse Salons' : 'Get Started'}
                    </Button>
                </Container>
            </Box >
        </Box >
    );
};

export default Home;
