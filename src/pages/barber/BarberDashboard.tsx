import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, CircularProgress, Alert } from '@mui/material';
import { ContentCut as ScissorsIcon, Schedule as ScheduleIcon, People as PeopleIcon, Star as StarIcon } from '@mui/icons-material';
import { useBarberStore } from '../../stores/barberStore';
import './BarberDashboard.css';

const BarberDashboard: React.FC = () => {
    // Note: fetchBarberStats removed as backend doesn't have this endpoint
    // Using default stats values until proper endpoint is implemented
    const { stats, loading } = useBarberStore();

    // Use default 0 values if stats is null (API not yet implemented)
    const currentStats = stats || {
        todaysAppointments: 0,
        totalClients: 0,
        averageRating: 0,
        servicesDone: 0
    };

    const statsDisplay = [
        { icon: <ScheduleIcon />, value: currentStats.todaysAppointments, label: "Today's Appointments", color: '#667eea' },
        { icon: <PeopleIcon />, value: currentStats.totalClients, label: 'Total Clients', color: '#f59e0b' },
        { icon: <StarIcon />, value: currentStats.averageRating.toFixed(1), label: 'Average Rating', color: '#10b981' },
        { icon: <ScissorsIcon />, value: currentStats.servicesDone, label: 'Services Done', color: '#ec4899' },
    ];

    return (
        <Box className="customer-dashboard">
            <Container maxWidth="lg">
                <Typography variant="h1" gutterBottom>
                    Barber Dashboard
                </Typography>

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                {/* Always show stats grid (using 0 defaults if API failed) */}
                {!loading && (
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {statsDisplay.map((stat, index) => (
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
                )}

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
