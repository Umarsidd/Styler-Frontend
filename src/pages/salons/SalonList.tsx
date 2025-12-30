import React, { useState, useMemo } from 'react';
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
    Button,
    Chip,
    InputAdornment,
    ToggleButtonGroup,
    ToggleButton,
    Alert,
    Snackbar,
} from '@mui/material';
import {
    Search as SearchIcon,
    MyLocation as MyLocationIcon,
    Clear as ClearIcon,
    GridView as GridViewIcon,
    ViewList as ViewListIcon,
    Sort as SortIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { salonService } from '../../services/salonService';
import SalonCard from '../../components/salon/SalonCard';
import SalonCardSkeleton from '../../components/common/SalonCardSkeleton';
import { Salon } from '../../types';
import { useGeolocation, calculateDistance, formatDistance } from '../../hooks/useGeolocation';
import './SalonList.css';

const MotionBox = motion(Box);

type SortOption = 'nearest' | 'rating' | 'reviews' | 'name';
type ViewMode = 'grid' | 'list';

interface SalonWithDistance extends Salon {
    distance?: number;
}

const SalonList: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('rating');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [showLocationAlert, setShowLocationAlert] = useState(false);

    const { coordinates, error: locationError, loading: locationLoading, getCurrentPosition } = useGeolocation();

    const { data, isLoading } = useQuery({
        queryKey: ['salons', searchQuery, cityFilter],
        queryFn: () => salonService.searchSalons({ name: searchQuery, city: cityFilter }),
    });

    const salons = (data?.data as Salon[]) || [];

    // Add distance to salons and sort
    const processedSalons = useMemo(() => {
        let processed: SalonWithDistance[] = salons.map(salon => ({
            ...salon,
            distance: coordinates
                ? calculateDistance(
                    coordinates.latitude,
                    coordinates.longitude,
                    salon.address.location?.coordinates[1] || 0, // latitude
                    salon.address.location?.coordinates[0] || 0  // longitude
                )
                : undefined,
        }));

        // Sort salons
        switch (sortBy) {
            case 'nearest':
                if (coordinates) {
                    processed = processed.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
                }
                break;
            case 'rating':
                processed = processed.sort((a, b) => b.rating - a.rating);
                break;
            case 'reviews':
                processed = processed.sort((a, b) => b.totalReviews - a.totalReviews);
                break;
            case 'name':
                processed = processed.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        return processed;
    }, [salons, coordinates, sortBy]);

    const handleFindNearest = () => {
        getCurrentPosition();
        if (coordinates) {
            setSortBy('nearest');
            setShowLocationAlert(true);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setCityFilter('');
    };

    const hasActiveFilters = searchQuery || cityFilter;

    return (
        <Box className="salon-list-page">
            {/* Hero Section */}
            <Box className="salon-list-hero">
                <Container maxWidth="lg">
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant="h1" className="salon-list-title" gutterBottom>
                            Find Your Perfect Salon
                        </Typography>
                        <Typography variant="h6" className="salon-list-subtitle" sx={{ textAlign: 'center' }}>
                            Discover top-rated salons near you and book your next appointment
                        </Typography>
                    </MotionBox>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 2 }}>
                {/* Search & Filters Card */}
                <Box className="filters-card">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <TextField
                                fullWidth
                                placeholder="Search salons, services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchQuery && (
                                        <InputAdornment position="end">
                                            <ClearIcon
                                                sx={{ cursor: 'pointer' }}
                                                onClick={() => setSearchQuery('')}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={2.5}>
                            <FormControl fullWidth sx={{ minWidth: 150 }}>
                                <InputLabel>City</InputLabel>
                                <Select
                                    value={cityFilter}
                                    onChange={(e) => setCityFilter(e.target.value)}
                                    label="City"
                                >
                                    <MenuItem value="">All Cities</MenuItem>
                                    <MenuItem value="Mumbai">Mumbai</MenuItem>
                                    <MenuItem value="Delhi">Delhi</MenuItem>
                                    <MenuItem value="Bangalore">Bangalore</MenuItem>
                                    <MenuItem value="Pune">Pune</MenuItem>
                                    <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={1.5}>
                            <FormControl fullWidth>
                                <InputLabel>Sort By</InputLabel>
                                <Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    label="Sort By"
                                    startAdornment={<SortIcon sx={{ mr: 1, fontSize: 20 }} />}
                                >
                                    <MenuItem value="rating">Highest Rated</MenuItem>
                                    <MenuItem value="reviews">Most Reviews</MenuItem>
                                    <MenuItem value="name">Name (A-Z)</MenuItem>
                                    {coordinates && <MenuItem value="nearest">Nearest First</MenuItem>}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={1.5}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<MyLocationIcon />}
                                onClick={handleFindNearest}
                                disabled={locationLoading}
                                sx={{
                                    height: 56,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                                    },
                                }}
                            >
                                {locationLoading ? 'Locating...' : 'Near Me'}
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Active Filters */}
                    {hasActiveFilters && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Active filters:
                            </Typography>
                            {searchQuery && (
                                <Chip
                                    label={`Search: "${searchQuery}"`}
                                    onDelete={() => setSearchQuery('')}
                                    size="small"
                                />
                            )}
                            {cityFilter && (
                                <Chip
                                    label={`City: ${cityFilter}`}
                                    onDelete={() => setCityFilter('')}
                                    size="small"
                                />
                            )}
                            <Button
                                size="small"
                                onClick={handleClearSearch}
                                sx={{ ml: 1 }}
                            >
                                Clear All
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* Results Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 3 }}>
                    <Typography variant="h6" color="text.secondary">
                        {isLoading ? 'Loading...' : `${processedSalons.length} salon${processedSalons.length !== 1 ? 's' : ''} found`}
                    </Typography>

                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(_, newMode) => newMode && setViewMode(newMode)}
                        size="small"
                    >
                        <ToggleButton value="grid">
                            <GridViewIcon />
                        </ToggleButton>
                        <ToggleButton value="list">
                            <ViewListIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* Salon Grid/List */}
                {isLoading ? (
                    <Grid container spacing={3}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Grid item xs={12} sm={6} md={viewMode === 'grid' ? 4 : 12} key={i}>
                                <SalonCardSkeleton />
                            </Grid>
                        ))}
                    </Grid>
                ) : processedSalons.length === 0 ? (
                    <Box className="empty-state">
                        <Typography variant="h4" gutterBottom>
                            😔 No Salons Found
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            {hasActiveFilters
                                ? "We couldn't find any salons matching your criteria. Try adjusting your filters."
                                : "No salons available at the moment."}
                        </Typography>
                        {hasActiveFilters && (
                            <Button variant="contained" onClick={handleClearSearch}>
                                Clear Filters
                            </Button>
                        )}
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {processedSalons.map((salon, index) => (
                            <Grid item xs={12} sm={6} md={viewMode === 'grid' ? 4 : 12} key={salon._id}>
                                <MotionBox
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <Box className="salon-card-wrapper" sx={{ position: 'relative' }}>
                                        {salon.distance !== undefined && (
                                            <Chip
                                                label={formatDistance(salon.distance)}
                                                size="small"
                                                color="primary"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 16,
                                                    right: 16,
                                                    zIndex: 2,
                                                    fontWeight: 600,
                                                }}
                                            />
                                        )}
                                        <SalonCard
                                            salon={salon}
                                            onClick={() => navigate(`/salons/${salon._id}`)}
                                        />
                                    </Box>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Location Alerts */}
            <Snackbar
                open={showLocationAlert}
                autoHideDuration={4000}
                onClose={() => setShowLocationAlert(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" onClose={() => setShowLocationAlert(false)}>
                    📍 Showing salons nearest to your location
                </Alert>
            </Snackbar>

            {locationError && (
                <Snackbar
                    open={!!locationError}
                    autoHideDuration={6000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="error">
                        {locationError}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
};

export default SalonList;
