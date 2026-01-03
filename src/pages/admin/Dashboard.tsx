import React from 'react';
import { Box, Container, Typography, Card, CardContent, Grid } from '@mui/material';
import { People as PeopleIcon, Store as StoreIcon, CalendarMonth as CalendarIcon, TrendingUp as TrendingIcon } from '@mui/icons-material';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const stats = [
        { icon: <PeopleIcon />, value: '1,234', label: 'Total Users', color: '#667eea' },
        { icon: <StoreIcon />, value: '45', label: 'Salons', color: '#f59e0b' },
        { icon: <CalendarIcon />, value: '892', label: 'Appointments', color: '#10b981' },
        { icon: <TrendingIcon />, value: '₹1.2L', label: 'Revenue', color: '#ec4899' },
    ];

    return (
        <Box className="admin-dashboard">
            <Container maxWidth="lg">
                <Typography variant="h1" gutterBottom>
                    Admin Dashboard
                </Typography>

                <Grid container spacing={3}>
                    {stats.map((stat, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Box sx={{ fontSize: 48, color: stat.color, mb: 1 }}>
                                        {stat.icon}
                                    </Box>
                                    <Typography variant="h4" sx={{ color: stat.color, fontWeight: 800 }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {stat.label}
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

export default Dashboard;
