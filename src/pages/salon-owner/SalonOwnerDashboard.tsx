import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { Store as StoreIcon, People as PeopleIcon, TrendingUp as TrendingIcon, AttachMoney as MoneyIcon } from '@mui/icons-material';
import './SalonOwnerDashboard.css';

const SalonOwnerDashboard: React.FC = () => {
    const stats = [
        { icon: <StoreIcon />, value: '3', label: 'My Salons', color: '#667eea' },
        { icon: <PeopleIcon />, value: '24', label: 'Staff Members', color: '#f59e0b' },
        { icon: <TrendingIcon />, value: '156', label: 'Total Bookings', color: '#10b981' },
        { icon: <MoneyIcon />, value: '₹45K', label: 'Monthly Revenue', color: '#ec4899' },
    ];

    return (
        <Box className="customer-dashboard">
            <Container maxWidth="lg">
                <Typography variant="h1" gutterBottom>
                    Salon Owner Dashboard
                </Typography>

                <Grid container spacing={3}>
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
            </Container>
        </Box>
    );
};

export default SalonOwnerDashboard;
