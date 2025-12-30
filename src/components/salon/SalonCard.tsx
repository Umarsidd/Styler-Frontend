import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Chip, Box } from '@mui/material';
import { LocationOn as LocationIcon, Star as StarIcon } from '@mui/icons-material';
import { Salon } from '../../types';
import './SalonCard.css';

interface SalonCardProps {
    salon: Salon;
    onClick?: () => void;
}

const SalonCard: React.FC<SalonCardProps> = ({ salon, onClick }) => {
    const isOpen = salon.isOpen !== undefined ? salon.isOpen : true;

    return (
        <Card
            className="salon-card"
            onClick={onClick}
            sx={{
                cursor: onClick ? 'pointer' : 'default',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s',
                '&:hover': {
                    transform: onClick ? 'translateY(-4px)' : 'none',
                    boxShadow: onClick ? 8 : 2,
                },
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image={salon.images?.[0] || '/placeholder-salon.jpg'}
                alt={salon.name}
            />
            <CardContent sx={{ flex: 1 }}>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 700 }}>
                    {salon.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                        {salon.address?.city}
                    </Typography>
                </Box>

                {salon.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <StarIcon fontSize="small" sx={{ color: '#f59e0b' }} />
                        <Typography variant="body2">
                            {salon.rating.toFixed(1)} ({salon.totalReviews || 0} reviews)
                        </Typography>
                    </Box>
                )}

                {salon.specialties && salon.specialties.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                        {salon.specialties.slice(0, 3).map((specialty, index) => (
                            <Chip key={index} label={specialty} size="small" variant="outlined" />
                        ))}
                    </Box>
                )}
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2 }}>
                <Chip
                    label={isOpen ? 'Open' : 'Closed'}
                    size="small"
                    color={isOpen ? 'success' : 'default'}
                    sx={{ fontWeight: 600 }}
                />
            </CardActions>
        </Card>
    );
};

export default SalonCard;
