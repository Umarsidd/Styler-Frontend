import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { ContentCut as ScissorsIcon, Schedule as ScheduleIcon, People as PeopleIcon, Star as StarIcon } from '@mui/icons-material';
import './BarberDashboard.css';

const BarberDashboard: React.FC = () => {
    const stats = [
        { icon: <ScheduleIcon />, value: '8', label: "Today's Appointments", color: '#667eea' },
        { icon: <PeopleIcon />, value: '45', label: 'Total Clients', color: '#f59e0b' },
        { icon: <StarIcon />, value: '4.8', label: 'Average Rating', color: '#10b981' },
        { icon: <ScissorsIcon />, value: '120', label: 'Services Done', color: '#ec4899' },
    ];

    return (
        <Box className="customer-dashboard">
            <Container maxWidth="lg">
                <Typography variant="h1" gutterBottom>
                    Barber Dashboard
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ fontSize: 40, color: stat.color, bgcolor: `${stat.color}15`, p: 1.5, borderRadius: 2 }}>
                                        {stat.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 800 }}>{stat.value}</Typography>
                                        <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>Today's Schedule</Typography>
                        <Typography variant="body2" color="text.secondary">
                            No appointments scheduled for today
                        </Typography>
                        <Button variant="contained" sx={{ mt: 2 }}>
                            View All Appointments
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default BarberDashboard;
