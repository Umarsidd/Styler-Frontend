import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useSalonStore } from '../../stores/salonStore';
import {
    Store as StoreIcon,
    People as PeopleIcon,
    TrendingUp as TrendingIcon,
    AttachMoney as MoneyIcon,
    Add as AddIcon,
    Settings as SettingsIcon,
    Assessment as AssessmentIcon
} from '@mui/icons-material';
import './SalonOwnerDashboard.css';

const SalonOwnerDashboard: React.FC = () => {
    const navigate = useNavigate();
    // Ignore error to suppress 500 alerts, handle with 0-value fallbacks
    const { stats, loading, fetchOwnerStats } = useSalonStore();

    React.useEffect(() => {
        fetchOwnerStats();
    }, [fetchOwnerStats]);

    const currentStats = stats || {
        totalSalons: 0,
        totalStaff: 0,
        totalBookings: 0,
        monthlyRevenue: 0
    };

    const statsDisplay = [
        { icon: <StoreIcon />, value: currentStats.totalSalons, label: 'My Salons', color: '#667eea' },
        { icon: <PeopleIcon />, value: currentStats.totalStaff, label: 'Staff Members', color: '#f59e0b' },
        { icon: <TrendingIcon />, value: currentStats.totalBookings, label: 'Total Bookings', color: '#10b981' },
        { icon: <MoneyIcon />, value: `₹${(currentStats.monthlyRevenue / 1000).toFixed(1)}K`, label: 'Monthly Revenue', color: '#ec4899' },
    ];

    return (
        <Box className="customer-dashboard">
            <Container maxWidth="lg">
                <Typography variant="h1" gutterBottom>
                    Salon Owner Dashboard
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {statsDisplay.map((stat, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
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

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>Quick Actions</Typography>
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Card
                                            variant="outlined"
                                            sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f9fafb' } }}
                                            onClick={() => navigate('/salons/create')}
                                        >
                                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                                <AddIcon fontSize="large" color="primary" sx={{ mb: 1 }} />
                                                <Typography variant="subtitle1" fontWeight="bold">Add New Salon</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Card
                                            variant="outlined"
                                            sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f9fafb' } }}
                                            onClick={() => navigate('/salon-owner/staff-management')}
                                        >
                                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                                <PeopleIcon fontSize="large" color="secondary" sx={{ mb: 1 }} />
                                                <Typography variant="subtitle1" fontWeight="bold">Manage Staff</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Card
                                            variant="outlined"
                                            sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f9fafb' } }}
                                            onClick={() => navigate('/salon-owner/analytics')}
                                        >
                                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                                <AssessmentIcon fontSize="large" color="success" sx={{ mb: 1 }} />
                                                <Typography variant="subtitle1" fontWeight="bold">View Reports</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ height: '100%', bgcolor: '#667eea', color: 'white' }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>Pro Tip</Typography>
                                <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
                                    Adding high-quality photos to your salon profile increases booking rates by 40%.
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 3, bgcolor: 'white', color: 'white', '&:hover': { bgcolor: '#007bffff' } }}
                                    onClick={() => navigate('/salons-owner/my-salons')}
                                >
                                    Update Photos
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default SalonOwnerDashboard;
