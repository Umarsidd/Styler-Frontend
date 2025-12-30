import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { salonService } from '../../services/salonService';
import SalonCard from '../../components/salon/SalonCard';
import SalonCardSkeleton from '../../components/common/SalonCardSkeleton';
import { Salon } from '../../types';
import './SalonList.css';

const SalonList: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [cityFilter, setCityFilter] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['salons', searchQuery, cityFilter],
        queryFn: () => salonService.getSalons({ search: searchQuery, city: cityFilter }),
    });

    const salons = (data?.data as Salon[]) || [];

    return (
        <Box className="customer-dashboard">
            <Container maxWidth="lg">
                <Typography variant="h1" gutterBottom>
                    Find Salons
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                    <TextField
                        label="Search salons..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ flex: 1, minWidth: 250 }}
                    />
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>City</InputLabel>
                        <Select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} label="City">
                            <MenuItem value="">All Cities</MenuItem>
                            <MenuItem value="Mumbai">Mumbai</MenuItem>
                            <MenuItem value="Delhi">Delhi</MenuItem>
                            <MenuItem value="Bangalore">Bangalore</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {isLoading ? (
                    <Grid container spacing={3}>
                        {[1, 2, 3, 4].map((i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <SalonCardSkeleton />
                            </Grid>
                        ))}
                    </Grid>
                ) : salons.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                            No salons found
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {salons.map((salon) => (
                            <Grid item xs={12} sm={6} md={4} key={salon._id}>
                                <SalonCard salon={salon} onClick={() => navigate(`/salons/${salon._id}`)} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default SalonList;
