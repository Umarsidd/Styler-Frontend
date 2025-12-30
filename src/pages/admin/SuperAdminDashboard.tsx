import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { AdminPanelSettings as AdminIcon, People as PeopleIcon, Store as StoreIcon, AttachMoney as MoneyIcon } from '@mui/icons-material';
import './SuperAdminDashboard.css';

const SuperAdminDashboard: React.FC = () => {
    const stats = [
        { icon: <PeopleIcon />, value: '5,234', label: 'Total Users', color: '#667eea' },
        { icon: <StoreIcon />, value: '156', label: 'Salons', color: '#f59e0b' },
        { icon: <AdminIcon />, value: '23', label: 'Admins', color: '#10b981' },
        { icon: <MoneyIcon />, value: '₹5.6L', label: 'Total Revenue', color: '#ec4899' },
    ];

    return (
        <Box className="admin-dashboard">
            <Container maxWidth="lg">
                <Typography variant="h1" gutterBottom>
                    Super Admin Dashboard
                </Typography>

                <Grid container spacing={3}>
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
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

export default SuperAdminDashboard;
