import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, CardActions, Chip, IconButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Store as StoreIcon } from '@mui/icons-material';
import { useSalonStore } from '../../stores/salonStore';

const MySalons: React.FC = () => {
    const navigate = useNavigate();
    const { mySalons, loading, fetchMySalons } = useSalonStore();

    useEffect(() => {
        fetchMySalons();
    }, [fetchMySalons]);

    return (
        <Box>
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

            {!loading && mySalons.length === 0 ? (
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
                        <Grid xs={12} sm={6} md={4} key={salon._id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={salon.images?.[0] || 'https://images.unsplash.com/photo-1521590832898-947c13a8ba85?w=600&auto=format&fit=crop&q=60'}
                                    alt={salon.name}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                        <Typography variant="h6" gutterBottom noWrap sx={{ fontWeight: 600 }}>
                                            {salon.name}
                                        </Typography>
                                        <Chip
                                            label={salon.rating ? salon.rating.toFixed(1) : 'New'}
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
                                        <IconButton size="small" color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default MySalons;
