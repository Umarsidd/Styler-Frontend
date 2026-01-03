import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    CircularProgress,
    Alert,
    Divider,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Star as StarIcon,
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    CalendarToday as CalendarIcon,
    AttachMoney as MoneyIcon,
    Store as StoreIcon,
    AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { salonService } from '../../services/salonService';
import { barberService } from '../../services/barberService';
import { Salon, Service, Barber } from '../../types';

const SalonOwnerSalonDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [salon, setSalon] = useState<Salon | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [staff, setStaff] = useState<Barber[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSalonDetails = async () => {
            if (!id) return;

            setLoading(true);
            try {
                // Fetch salon details
                const salonResponse = await salonService.getSalonById(id);
                setSalon(salonResponse.data as Salon);

                // Fetch services
                try {
                    const servicesResponse = await salonService.getSalonServices(id);
                    setServices(servicesResponse.data || []);
                } catch (err) {
                    console.error('Error fetching services:', err);
                    setServices([]);
                }

                // Fetch staff
                try {
                    const staffResponse = await barberService.getSalonBarbers(id);
                    setStaff(staffResponse.data || []);
                } catch (err) {
                    console.error('Error fetching staff:', err);
                    setStaff([]);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load salon details');
            } finally {
                setLoading(false);
            }
        };

        fetchSalonDetails();
    }, [id]);

    // Helper function to check if salon is currently open
    const isSalonOpen = (): boolean => {
        if (!salon?.operatingHours || salon.operatingHours.length === 0) return false;

        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const todayHours = salon.operatingHours.find((hours) =>
            hours.day.toLowerCase() === currentDay.toLowerCase()
        );

        if (!todayHours || !todayHours.isOpen) return false;

        const [openHour, openMin] = todayHours.openTime.split(':').map(Number);
        const [closeHour, closeMin] = todayHours.closeTime.split(':').map(Number);

        const openingTime = openHour * 60 + openMin;
        const closingTime = closeHour * 60 + closeMin;

        return currentTime >= openingTime && currentTime <= closingTime;
    };

    // Helper function to safely format rating
    const formatRating = (rating: any): string => {
        if (!rating) return 'N/A';
        if (typeof rating === 'number') return rating.toFixed(1);
        if (typeof rating === 'object' && rating.average && typeof rating.average === 'number') {
            return rating.average.toFixed(1);
        }
        return 'N/A';
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !salon) {
        return (
            <Container sx={{ py: 4 }}>
                <Alert severity="error">{error || 'Salon not found'}</Alert>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                    Back to Salons
                </Button>
            </Container>
        );
    }

    const activeStaff = staff.filter(s => s.isActive && s.status === 'approved');
    const activeServices = services.filter(s => s.isActive);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header with back button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="outlined">
                    Back to Salons
                </Button>
                <Button
                    startIcon={<EditIcon />}
                    variant="contained"
                    onClick={() => navigate(`/salons/${id}/edit`)}
                >
                    Edit Salon
                </Button>
            </Box>

            {/* Salon Overview Section */}
            <Card sx={{ mb: 4, boxShadow: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {salon.name}
                                </Typography>
                                <Chip
                                    label={isSalonOpen() ? 'Open Now' : 'Closed'}
                                    size="medium"
                                    sx={{
                                        bgcolor: isSalonOpen() ? '#10b981' : '#ef4444',
                                        color: 'white',
                                        fontWeight: 600,
                                    }}
                                />
                            </Box>
                            {salon.description && (
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                    {salon.description}
                                </Typography>
                            )}
                        </Box>
                        {(() => {
                            const ratingValue = formatRating(salon.rating);
                            if (ratingValue && ratingValue !== 'N/A') {
                                return (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <StarIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                            {ratingValue}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ({salon.totalReviews || 0} reviews)
                                        </Typography>
                                    </Box>
                                );
                            }
                            return null;
                        })()}
                    </Box>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                                <LocationIcon color="action" />
                                <Box>
                                    <Typography variant="body1">
                                        {salon.address?.street}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {salon.address?.city}, {salon.address?.state} - {salon.address?.pincode}
                                    </Typography>
                                </Box>
                            </Box>

                            {salon.phone && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                    <PhoneIcon color="action" />
                                    <Typography variant="body1">{salon.phone}</Typography>
                                </Box>
                            )}

                            {salon.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <EmailIcon color="action" />
                                    <Typography variant="body1">{salon.email}</Typography>
                                </Box>
                            )}
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <Card sx={{ bgcolor: '#f0f9ff', p: 2, textAlign: 'center' }}>
                                        <PeopleIcon sx={{ fontSize: 40, color: '#0284c7', mb: 1 }} />
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0284c7' }}>
                                            {activeStaff.length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Active Staff
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid size={6}>
                                    <Card sx={{ bgcolor: '#f0fdf4', p: 2, textAlign: 'center' }}>
                                        <StoreIcon sx={{ fontSize: 40, color: '#16a34a', mb: 1 }} />
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#16a34a' }}>
                                            {activeServices.length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Active Services
                                        </Typography>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Grid container spacing={4}>
                {/* Services Section */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card sx={{ height: '100%', boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    Services ({services.length})
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => navigate(`/salons/${id}/services`)}
                                >
                                    Manage Services
                                </Button>
                            </Box>

                            {services.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <StoreIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                                    <Typography color="text.secondary">
                                        No services added yet
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600 }}>Duration</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 600 }}>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {services.map((service) => (
                                                <TableRow key={service._id} hover>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            {service.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {service.gender}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            ₹{service.price}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2">
                                                            {service.duration} min
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={service.isActive ? 'Active' : 'Inactive'}
                                                            size="small"
                                                            color={service.isActive ? 'success' : 'default'}
                                                            sx={{ fontSize: '0.7rem' }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Staff Section */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card sx={{ height: '100%', boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    Staff ({staff.length})
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => navigate('/salon-owner/staff-management')}
                                >
                                    Manage Staff
                                </Button>
                            </Box>

                            {staff.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <PeopleIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                                    <Typography color="text.secondary">
                                        No staff members added yet
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {staff.map((barber) => (
                                        <Card key={barber._id} variant="outlined" sx={{ p: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: '#6366f1', width: 48, height: 48 }}>
                                                        {(barber.userId as any)?.name?.charAt(0) || 'B'}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                            {(barber.userId as any)?.name || 'Barber'}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                                                            <Typography variant="body2" color="text.secondary">
                                                                {formatRating(barber.rating)} • {barber.experience} yrs exp
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                                                    <Chip
                                                        label={barber.status}
                                                        size="small"
                                                        color={barber.status === 'approved' ? 'success' : 'warning'}
                                                        sx={{ fontSize: '0.7rem', textTransform: 'capitalize' }}
                                                    />
                                                    {barber.isActive && (
                                                        <Chip
                                                            label="Active"
                                                            size="small"
                                                            color="primary"
                                                            sx={{ fontSize: '0.7rem' }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                            {barber.specialties && barber.specialties.length > 0 && (
                                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1.5 }}>
                                                    {barber.specialties.slice(0, 3).map((specialty, idx) => (
                                                        <Chip
                                                            key={idx}
                                                            label={specialty}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontSize: '0.65rem' }}
                                                        />
                                                    ))}
                                                    {barber.specialties.length > 3 && (
                                                        <Chip
                                                            label={`+${barber.specialties.length - 3}`}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontSize: '0.65rem' }}
                                                        />
                                                    )}
                                                </Box>
                                            )}
                                        </Card>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Operating Hours Section */}
                <Grid size={12}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    Operating Hours
                                </Typography>
                                <AccessTimeIcon sx={{ color: 'text.secondary' }} />
                            </Box>

                            {!salon.operatingHours || salon.operatingHours.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <AccessTimeIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                                    <Typography color="text.secondary">
                                        Operating hours not set
                                    </Typography>
                                </Box>
                            ) : (
                                <Grid container spacing={2}>
                                    {salon.operatingHours.map((hours, index) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                            <Card variant="outlined" sx={{ p: 2, bgcolor: hours.isOpen ? 'background.paper' : '#f5f5f5' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                                                    {hours.day}
                                                </Typography>
                                                {hours.isOpen ? (
                                                    <Typography variant="body2" color="text.secondary">
                                                        {hours.openTime} - {hours.closeTime}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="body2" color="error">
                                                        Closed
                                                    </Typography>
                                                )}
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quick Actions */}
                <Grid size={12}>
                    <Card sx={{ boxShadow: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                                Quick Actions
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ bgcolor: 'white', color: '#667eea', '&:hover': { bgcolor: '#f5f5f5' } }}
                                        startIcon={<TrendingUpIcon />}
                                        onClick={() => navigate('/salon-owner/analytics')}
                                    >
                                        View Analytics
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ bgcolor: 'white', color: '#667eea', '&:hover': { bgcolor: '#f5f5f5' } }}
                                        startIcon={<CalendarIcon />}
                                        onClick={() => navigate('/salon-owner/dashboard')}
                                    >
                                        View Appointments
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ bgcolor: 'white', color: '#667eea', '&:hover': { bgcolor: '#f5f5f5' } }}
                                        startIcon={<PeopleIcon />}
                                        onClick={() => navigate('/salon-owner/staff-management')}
                                    >
                                        Manage Staff
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ bgcolor: 'white', color: '#667eea', '&:hover': { bgcolor: '#f5f5f5' } }}
                                        startIcon={<EditIcon />}
                                        onClick={() => navigate(`/salons/${id}/edit`)}
                                    >
                                        Edit Salon
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default SalonOwnerSalonDetails;
