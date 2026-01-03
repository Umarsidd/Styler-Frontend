import React, { useRef } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Avatar, Chip } from '@mui/material';
import {
    EmojiEvents as TrophyIcon,
    CheckCircle as CheckIcon,
    People as PeopleIcon,
    Timer as TimerIcon,
    Star as StarIcon,
    Favorite as HeartIcon,
    Lightbulb as IdeaIcon,
    Security as SecurityIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import './About.css';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const About: React.FC = () => {
    const statsRef = useRef<HTMLDivElement>(null);
    const valuesRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const teamRef = useRef<HTMLDivElement>(null);
    const stats = [
        { value: '20+', label: 'Salon Partners', icon: <PeopleIcon />, color: '#f59e0b' },
        { value: '5K+', label: 'Happy Clients', icon: <StarIcon />, color: '#14b8a6' },
        { value: '150+', label: 'Expert Stylists', icon: <TrophyIcon />, color: '#8b5cf6' },
        { value: '10K+', label: 'Appointments', icon: <CheckIcon />, color: '#ec4899' },
    ];

    const values = [
        {
            icon: <HeartIcon />,
            title: 'Customer First',
            description: 'Your satisfaction and comfort are our top priorities',
        },
        {
            icon: <TrophyIcon />,
            title: 'Excellence',
            description: 'We strive for perfection in every service we provide',
        },
        {
            icon: <IdeaIcon />,
            title: 'Innovation',
            description: 'Always adopting latest trends and technologies',
        },
        {
            icon: <SecurityIcon />,
            title: 'Trust & Safety',
            description: 'Your safety and hygiene are never compromised',
        },
    ];

    const team = [
        {
            name: 'Rahul Sharma',
            role: 'Founder & CEO',
            avatar: 'R',
            description: '15+ years in grooming industry',
        },
        {
            name: 'Priya Patel',
            role: 'Head of Operations',
            avatar: 'P',
            description: 'Operations excellence expert',
        },
        {
            name: 'Amit Kumar',
            role: 'Technology Lead',
            avatar: 'A',
            description: 'Building seamless experiences',
        },
    ];

    const timeline = [
        { year: '2019', event: 'Styler Founded', description: 'Started with a vision to revolutionize salon bookings' },
        { year: '2020', event: '10 Salon Partners', description: 'Expanded to 10 premium salons across the city' },
        { year: '2022', event: '5000+ Appointments', description: 'Reached milestone of 5000 successful bookings' },
        { year: '2024', event: '20+ Locations', description: 'Now serving customers at 20+ locations' },
    ];

    return (
        <Box className="about-page">
            {/* Hero Section */}
            <Box className="about-hero">
                <Container maxWidth="lg">
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        sx={{ textAlign: 'center' }}
                    >
                        <Typography variant="h1" sx={{ color: 'white', mb: 2, fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.5rem' }, fontWeight: 800 }}>
                            Transforming Grooming Experiences
                        </Typography>
                        <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.95)', maxWidth: { xs: '100%', sm: 600, md: 800 }, mx: 'auto', fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }, px: { xs: 2, sm: 3 } }}>
                            We connect you with the best salons and stylists for a premium grooming experience
                        </Typography>
                    </MotionBox>
                </Container>
            </Box>

            {/* Stats Section */}
            <Container
                maxWidth={false}
                className="stats-section"
                disableGutters
                sx={{
                    mt: -8,
                    position: 'relative',
                    zIndex: 10,
                    mb: 8,
                }}
            >
                <Grid container spacing={2} sx={{ px: 1 }}>
                    {stats.map((stat, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <MotionCard
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="stat-card"
                            >
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Box className="stat-icon" sx={{ color: stat.color, mb: 2 }}>
                                        {stat.icon}
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: stat.color }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {stat.label}
                                    </Typography>
                                </CardContent>
                            </MotionCard>
                        </Grid>
                    ))}
                </Grid>
            </Container>


            {/* Mission Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <MotionBox
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <Chip label="Our Mission" color="primary" sx={{ mb: 2, fontWeight: 700 }} />
                            <Typography variant="h2" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' } }}>
                                Making Premium Grooming Accessible
                            </Typography>
                            <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' }, lineHeight: 1.8 }}>
                                At Styler, we believe everyone deserves access to premium grooming services. We're on a mission
                                to connect clients with the best salons and stylists, making it easy to book, convenient to visit,
                                and delightful to experience.
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' }, lineHeight: 1.8 }}>
                                Through our platform, we're empowering local salons while providing customers with transparency,
                                convenience, and confidence in their grooming choices.
                            </Typography>
                        </MotionBox>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                            sx={{
                                height: { xs: 250, sm: 300, md: 400 },
                                borderRadius: { xs: 2, md: 4 },
                                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: { xs: '4rem', sm: '5rem', md: '6rem' },
                                color: 'white',
                            }}
                        >
                            ✂️
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Values Section */}
            <Box sx={{ bgcolor: '#f8fafc', py: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" align="center" sx={{ mb: 2, fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' } }}>
                        Our Values
                    </Typography>
                    <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: { xs: '100%', md: 700 }, mx: 'auto', fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }, px: { xs: 2, sm: 0 } }}>
                        The principles that guide everything we do
                    </Typography>

                    <Grid container spacing={3}>
                        {values.map((value, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                <MotionCard
                                    className="value-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 3
                                    }}
                                >
                                    <CardContent sx={{
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        p: { xs: 3, sm: 3, md: 3.5 }
                                    }}>
                                        <Box
                                            sx={{
                                                width: { xs: 64, sm: 70, md: 80 },
                                                height: { xs: 64, sm: 70, md: 80 },
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mb: 2.5,
                                                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                                                color: 'white',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {value.icon}
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
                                                mb: 1.5
                                            }}
                                        >
                                            {value.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                                                lineHeight: 1.6
                                            }}
                                        >
                                            {value.description}
                                        </Typography>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Timeline Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography variant="h2" align="center" sx={{ mb: 2, fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' } }}>
                    Our Journey
                </Typography>
                <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6, fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }, px: { xs: 2, sm: 0 } }}>
                    Growing together towards excellence
                </Typography>

                <Box
                    className="timeline-container"
                    sx={{
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 4,
                            height: '100%',
                            background: 'linear-gradient(180deg, #6366f1 0%, #ec4899 100%)',
                            display: { xs: 'none', md: 'block' },
                        },
                    }}
                >
                    {timeline.map((item, index) => (
                        <MotionBox
                            key={index}
                            className="timeline-item"
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                            viewport={{ once: true }}
                            sx={{
                                display: 'flex',
                                justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
                                mb: 6,
                                position: 'relative',
                            }}
                        >
                            <Card
                                sx={{
                                    width: { xs: '100%', md: '45%' },
                                    position: 'relative',
                                }}
                            >
                                <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                                    <Chip
                                        label={item.year}
                                        color="primary"
                                        size="small"
                                        sx={{ mb: 2, fontWeight: 700, fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
                                    />
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' } }}>
                                        {item.event}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '0.9375rem' } }}>
                                        {item.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </MotionBox>
                    ))}
                </Box>
            </Container>

            {/* Team Section */}
            <Box sx={{ bgcolor: '#f8fafc', py: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" align="center" sx={{ mb: 2, fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' } }}>
                        Meet Our Leadership
                    </Typography>
                    <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6, fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }, px: { xs: 2, sm: 0 } }}>
                        Passionate people building the future of grooming
                    </Typography>

                    <Grid container spacing={4} justifyContent="center">
                        {team.map((member, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                <MotionCard
                                    className="team-card"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    sx={{ textAlign: 'center', p: { xs: 2.5, sm: 3, md: 4 } }}
                                >
                                    <Avatar
                                        sx={{
                                            width: { xs: 80, sm: 90, md: 100 },
                                            height: { xs: 80, sm: 90, md: 100 },
                                            fontSize: { xs: '2rem', sm: '2.25rem', md: '2.5rem' },
                                            bgcolor: 'primary.main',
                                            margin: '0 auto 1.5rem',
                                        }}
                                    >
                                        {member.avatar}
                                    </Avatar>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' } }}>
                                        {member.name}
                                    </Typography>
                                    <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '0.9375rem', sm: '1rem' } }}>
                                        {member.role}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '0.9375rem' } }}>
                                        {member.description}
                                    </Typography>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default About;
