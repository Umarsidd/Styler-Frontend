import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardContent, Box } from '@mui/material';
import {
    ArrowForward as ArrowForwardIcon,
    LocationOn as LocationOnIcon,
    Star as StarIcon,
    ContentCut as ScissorsIcon,
    CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import CountUp from 'react-countup';
import './Home.css';

const MotionBox = motion(Box);

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
    const [stats] = useState<Stat[]>([
        { count: 20, suffix: '+', title: 'Branches', color: '#f59e0b', icon: <LocationOnIcon /> },
        { count: 5000, suffix: '+', title: 'Happy Clients', color: '#14b8a6', icon: <StarIcon /> },
        { count: 150, suffix: '+', title: 'Expert Stylists', color: '#8b5cf6', icon: <ScissorsIcon /> },
        { count: 10, suffix: 'K+', title: 'Total Appointments', color: '#ec4899', icon: <CalendarIcon /> },
    ]);

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
                        Welcome to Styler
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.95)', mb: 4 }}>
                        Your premium salon booking platform
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => navigate('/salons')}
                            sx={{ px: 4 }}
                        >
                            Book Now
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/services')}
                            sx={{ px: 4, color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                        >
                            Our Services
                        </Button>
                    </Box>
                </MotionBox>
            </Box>

            {/* Stats Section */}
            <Container maxWidth="lg" className="stats-section">
                <Grid container spacing={3}>
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card className="stat-card">
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
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box className="cta-section">
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ mb: 3 }}>
                        Ready to Transform Your Look?
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate(user ? '/salons' : '/login')}
                        sx={{ px: 5, py: 1.5 }}
                    >
                        Get Started
                    </Button>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;
