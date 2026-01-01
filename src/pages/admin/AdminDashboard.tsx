import React, { useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    People as PeopleIcon,
    Store as StoreIcon,
    ContentCut as ContentCutIcon,
    Event as EventIcon,
    TrendingUp as TrendingUpIcon,
    AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useAdminStore } from '../../stores/adminStore';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactElement;
    color: string;
    subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => {
    return (
        <Card sx={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: `${color}20`,
                            color: color,
                            p: 1.5,
                            borderRadius: 2,
                            display: 'flex',
                        }}
                    >
                        {React.cloneElement(icon, { fontSize: 'large' })}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

const AdminDashboard: React.FC = () => {
    const { stats, loading, error, fetchDashboardStats, clearError } = useAdminStore();

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    if (loading && !stats) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Dashboard Overview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Welcome back! Here's what's happening on your platform.
                </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Users"
                        value={stats?.overview.totalUsers || 0}
                        icon={<PeopleIcon />}
                        color="#1976d2"
                        subtitle="Registered users"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Salons"
                        value={stats?.overview.totalSalons || 0}
                        icon={<StoreIcon />}
                        color="#9c27b0"
                        subtitle="Active salons"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Barbers"
                        value={stats?.overview.totalBarbers || 0}
                        icon={<ContentCutIcon />}
                        color="#ff9800"
                        subtitle="Registered barbers"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Appointments"
                        value={stats?.overview.totalAppointments || 0}
                        icon={<EventIcon />}
                        color="#4caf50"
                        subtitle="All time bookings"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Active Appointments"
                        value={stats?.overview.activeAppointments || 0}
                        icon={<TrendingUpIcon />}
                        color="#00bcd4"
                        subtitle="Confirmed bookings"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Revenue"
                        value={`₹${(stats?.overview.totalRevenue || 0).toLocaleString()}`}
                        icon={<MoneyIcon />}
                        color="#f44336"
                        subtitle="All time earnings"
                    />
                </Grid>
            </Grid>

            {/* Users by Role */}
            {stats?.usersByRole && (
                <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Users by Role
                        </Typography>
                        <Grid container spacing={2}>
                            {Object.entries(stats.usersByRole).map(([role, count]) => (
                                <Grid item xs={6} sm={4} md={3} key={role}>
                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                            {count as number}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                            {role.replace('_', ' ')}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* Appointments by Status */}
            {stats?.appointmentsByStatus && (
                <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Appointments by Status
                        </Typography>
                        <Grid container spacing={2}>
                            {Object.entries(stats.appointmentsByStatus).map(([status, count]) => (
                                <Grid item xs={6} sm={4} md={3} key={status}>
                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                                            {count as number}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                            {status.replace('_', ' ')}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default AdminDashboard;
