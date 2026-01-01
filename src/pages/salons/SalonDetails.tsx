import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Container,
    Typography,
    Button,
    CircularProgress,
    Card,
    CardContent,
    Grid,
    Chip,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, LocationOn as LocationIcon, Phone as PhoneIcon, Star as StarIcon } from '@mui/icons-material';
import { salonService } from '../../services/salonService';
import { Salon } from '../../types';
import './SalonDetails.css';

const SalonDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ['salon', id],
        queryFn: () => salonService.getSalonById(id!),
        enabled: !!id,
    });

    const salon = data?.data as Salon | undefined;

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!salon) {
        return (
            <Container>
                <Typography variant="h5">Salon not found</Typography>
            </Container>
        );
    }

    return (
        <Box className="customer-dashboard">
            <Container maxWidth="lg">
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/salons')} sx={{ mb: 3 }}>
                    Back to Salons
                </Button>

                <Typography variant="h1" gutterBottom>
                    {salon.name}
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>About</Typography>
                                <Typography variant="body1" paragraph>
                                    {salon.description || 'Premium salon services'}
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocationIcon color="action" />
                                        <Typography variant="body1">
                                            {salon.address?.street}, {salon.address?.city}, {salon.address?.state} - {salon.address?.zipCode}
                                        </Typography>
                                    </Box>

                                    {salon.contactNumber && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PhoneIcon color="action" />
                                            <Typography variant="body1">{salon.contactNumber}</Typography>
                                        </Box>
                                    )}

                                    {salon.rating && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <StarIcon sx={{ color: '#f59e0b' }} />
                                            <Typography variant="body1">
                                                {typeof salon.rating === 'object' && salon.rating.average
                                                    ? `${salon.rating.average.toFixed(1)} (${salon.rating.count || 0} reviews)`
                                                    : typeof salon.rating === 'number'
                                                        ? `${salon.rating.toFixed(1)} (${salon.totalReviews || 0} reviews)`
                                                        : 'No rating'}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                {salon.specialties && salon.specialties.length > 0 && (
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="h6" gutterBottom>Specialties</Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {salon.specialties.map((specialty, index) => (
                                                <Chip key={index} label={specialty} />
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Button variant="contained" fullWidth size="large" onClick={() => navigate(`/booking/${salon._id}`)}>
                                    Book Appointment
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default SalonDetails;
