import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Button,
    Alert,
    CircularProgress,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Store as StoreIcon } from '@mui/icons-material';
import { useSalonStore } from '../../stores/salonStore';

const MySalons: React.FC = () => {
    const navigate = useNavigate();
    const { mySalons, loading, error, fetchMySalons, deleteSalon } = useSalonStore();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [salonToDelete, setSalonToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchMySalons();
    }, [fetchMySalons]);

    const handleDeleteClick = (salonId: string) => {
        setSalonToDelete(salonId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!salonToDelete) return;

        setDeleting(true);
        try {
            await deleteSalon(salonToDelete);
            setDeleteDialogOpen(false);
            setSalonToDelete(null);
        } catch (error) {
            // Error is already in the store
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSalonToDelete(null);
    };

    // Helper function to check if salon is currently open
    const isSalonOpen = (salon: any): boolean => {
        if (!salon.operatingHours || salon.operatingHours.length === 0) return false;

        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

        const todayHours = salon.operatingHours.find((hours: any) =>
            hours.day.toLowerCase() === currentDay.toLowerCase()
        );

        if (!todayHours || !todayHours.isOpen) return false;

        // Parse opening and closing times (format: "HH:MM")
        const [openHour, openMin] = todayHours.openTime.split(':').map(Number);
        const [closeHour, closeMin] = todayHours.closeTime.split(':').map(Number);

        const openingTime = openHour * 60 + openMin;
        const closingTime = closeHour * 60 + closeMin;

        return currentTime >= openingTime && currentTime <= closingTime;
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    My Salons
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/salons/create')}
                >
                    Add New Salon
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {loading && mySalons.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : !loading && mySalons.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <StoreIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No salons found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Get started by registering your first salon.
                    </Typography>
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={() => navigate('/salons/create')}>
                        Register Salon
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {mySalons.map((salon) => (
                        <Grid item xs={12} sm={6} md={4} key={salon._id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ position: 'relative' }}>
                                    {salon.images && salon.images.length > 0 ? (
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={salon.images[0]}
                                            alt={salon.name}
                                            sx={{
                                                objectFit: 'cover',
                                                bgcolor: '#f5f5f5'
                                            }}
                                            onError={(e: any) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.style.backgroundColor = '#f0f0f0';
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                height: 200,
                                                bgcolor: '#f5f5f5',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexDirection: 'column',
                                                gap: 1
                                            }}
                                        >
                                            <StoreIcon sx={{ fontSize: 48, color: '#ccc' }} />
                                            <Typography variant="caption" color="text.secondary">
                                                No image
                                            </Typography>
                                        </Box>
                                    )}
                                    <Chip
                                        label={isSalonOpen(salon) ? 'Open' : 'Closed'}
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            bgcolor: isSalonOpen(salon) ? '#10b981' : '#ef4444',
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }}
                                    />
                                </Box>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                        <Typography variant="h6" gutterBottom noWrap sx={{ fontWeight: 600 }}>
                                            {salon.name}
                                        </Typography>
                                        <Chip
                                            label={salon.rating?.average ? salon.rating.average.toFixed(1) : 'New'}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {salon.address ? `${salon.address.street}, ${salon.address.city}` : 'No address'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {(salon as any).services?.slice(0, 3).map((service: any, index: number) => (
                                            <Chip
                                                key={index}
                                                label={typeof service === 'string' ? service : service.name || 'Service'}
                                                size="small"
                                                sx={{ fontSize: '0.7rem' }}
                                            />
                                        ))}
                                        {(salon as any).services?.length > 3 && (
                                            <Chip label={`+${(salon as any).services.length - 3}`} size="small" sx={{ fontSize: '0.7rem' }} />
                                        )}
                                    </Box>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                    <Button size="small" onClick={() => navigate(`/salons/${salon._id}`)}>
                                        View Page
                                    </Button>
                                    <Box>
                                        <IconButton size="small" onClick={() => navigate(`/salons/${salon._id}/edit`)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteClick(salon._id)}
                                            disabled={loading || deleting}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">Delete Salon?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this salon? This action cannot be undone.
                        All associated data including services, barbers, and appointments will be permanently removed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} disabled={deleting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        disabled={deleting}
                        startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MySalons;
