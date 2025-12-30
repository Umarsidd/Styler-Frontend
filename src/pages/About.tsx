import React from 'react';
import { Container, Typography, Card, CardContent, Grid, Box } from '@mui/material';
import { Favorite as HeartIcon, EmojiEvents as TrophyIcon, People as TeamIcon } from '@mui/icons-material';
import './About.css';

const About: React.FC = () => {
    const values = [
        {
            icon: <HeartIcon />,
            title: 'Customer First',
            description: 'Your satisfaction is our priority',
        },
        {
            icon: <TrophyIcon />,
            title: 'Excellence',
            description: 'We strive for perfection in every service',
        },
        {
            icon: <TeamIcon />,
            title: 'Expert Team',
            description: 'Highly trained professionals',
        },
    ];

    return (
        <Box className="about-page">
            <Box className="about-hero">
                <Typography variant="h1">About Styler</Typography>
                <Typography variant="h5" sx={{ mt: 2, color: 'text.secondary' }}>
                    We're revolutionizing the salon booking experience
                </Typography>
            </Box>

            <Container maxWidth="lg" className="about-content">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h2" gutterBottom>Our Story</Typography>
                        <Typography variant="body1" paragraph>
                            Founded with a vision to make premium salon services accessible to everyone, Styler has grown
                            to become the leading salon booking platform with over 20+ locations nationwide.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h2" gutterBottom>Our Mission</Typography>
                        <Typography variant="body1" paragraph>
                            To provide a seamless booking experience while connecting customers with the best stylists
                            and salons in their area.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>

            <Box className="values-section">
                <Container maxWidth="lg">
                    <Typography variant="h2" align="center" sx={{ mb: 6 }}>
                        Our Values
                    </Typography>
                    <Grid container spacing={3}>
                        {values.map((value, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card className="value-card" sx={{ height: '100%' }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Box className="value-icon" sx={{ mb: 2 }}>
                                            {value.icon}
                                        </Box>
                                        <Typography variant="h4" gutterBottom>
                                            {value.title}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {value.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default About;
