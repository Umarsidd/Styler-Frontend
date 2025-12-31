import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    Alert,
    CircularProgress,
    Paper,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import { useSalonStore } from '../../stores/salonStore';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface OperatingHours {
    day: string;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
}

const CreateSalon: React.FC = () => {
    const navigate = useNavigate();
    const { registerSalon } = useSalonStore();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        phone: '',
        email: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: ''
    });

    const [operatingHours, setOperatingHours] = useState<OperatingHours[]>(
        daysOfWeek.map(day => ({
            day,
            openTime: '09:00',
            closeTime: '20:00',
            isOpen: day !== 'Sunday'
        }))
    );

    const steps = ['Basic Information', 'Address & Location', 'Operating Hours'];

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    };

    const handleOperatingHoursChange = (index: number, field: keyof OperatingHours, value: any) => {
        const updated = [...operatingHours];
        updated[index] = { ...updated[index], [field]: value };
        setOperatingHours(updated);
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 0:
                if (!formData.name.trim()) {
                    setError('Salon name is required');
                    return false;
                }
                if (!formData.phone.trim() || formData.phone.length < 10) {
                    setError('Valid phone number is required');
                    return false;
                }
                return true;
            case 1:
                if (!formData.street.trim() || !formData.city.trim() || !formData.state.trim() || !formData.pincode.trim()) {
                    setError('All address fields are required');
                    return false;
                }
                if (!formData.latitude || !formData.longitude) {
                    setError('Location coordinates are required');
                    return false;
                }
                return true;
            case 2:
                const hasOpenDay = operatingHours.some(h => h.isOpen);
                if (!hasOpenDay) {
                    setError('At least one day must be open');
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
        setError(null);
    };

    const handleSubmit = async () => {
        if (!validateStep(activeStep)) return;

        setLoading(true);
        setError(null);

        try {
            const payload = {
                businessName: formData.name,
                displayName: formData.name,
                description: formData.description,
                phone: formData.phone,
                email: formData.email,
                address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    location: {
                        type: 'Point' as const,
                        coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]
                    }
                },
                operatingHours: operatingHours.filter(h => h.isOpen)
            };

            await registerSalon(payload);
            navigate('/salon-owner/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create salon');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                label="Salon Name"
                                fullWidth
                                required
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Describe your salon..."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Phone Number"
                                fullWidth
                                required
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                placeholder="10-digit number"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Email (Optional)"
                                fullWidth
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                );

            case 1:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                label="Street Address"
                                fullWidth
                                required
                                value={formData.street}
                                onChange={(e) => handleChange('street', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="City"
                                fullWidth
                                required
                                value={formData.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="State"
                                fullWidth
                                required
                                value={formData.state}
                                onChange={(e) => handleChange('state', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Pincode"
                                fullWidth
                                required
                                value={formData.pincode}
                                onChange={(e) => handleChange('pincode', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom>
                                Location Coordinates
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Latitude"
                                fullWidth
                                required
                                type="number"
                                value={formData.latitude}
                                onChange={(e) => handleChange('latitude', e.target.value)}
                                placeholder="e.g., 28.6139"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Longitude"
                                fullWidth
                                required
                                type="number"
                                value={formData.longitude}
                                onChange={(e) => handleChange('longitude', e.target.value)}
                                placeholder="e.g., 77.2090"
                            />
                        </Grid>
                    </Grid>
                );

            case 2:
                return (
                    <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                            Set your salon's operating hours
                        </Typography>
                        {operatingHours.map((hours, index) => (
                            <Paper key={hours.day} sx={{ p: 2, mb: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={3}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={hours.isOpen}
                                                onChange={(e) =>
                                                    handleOperatingHoursChange(index, 'isOpen', e.target.checked)
                                                }
                                                style={{ marginRight: 8 }}
                                            />
                                            <Typography fontWeight={hours.isOpen ? 600 : 400}>
                                                {hours.day}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    {hours.isOpen && (
                                        <>
                                            <Grid item xs={6} sm={4}>
                                                <TextField
                                                    label="Opens"
                                                    type="time"
                                                    fullWidth
                                                    size="small"
                                                    value={hours.openTime}
                                                    onChange={(e) =>
                                                        handleOperatingHoursChange(index, 'openTime', e.target.value)
                                                    }
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={4}>
                                                <TextField
                                                    label="Closes"
                                                    type="time"
                                                    fullWidth
                                                    size="small"
                                                    value={hours.closeTime}
                                                    onChange={(e) =>
                                                        handleOperatingHoursChange(index, 'closeTime', e.target.value)
                                                    }
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                    {!hours.isOpen && (
                                        <Grid item xs={12} sm={8}>
                                            <Typography variant="body2" color="text.secondary">
                                                Closed
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Paper>
                        ))}
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Card>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 700 }}>
                        Create New Salon
                    </Typography>

                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ minHeight: 400 }}>
                        {renderStepContent(activeStep)}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            onClick={() => navigate('/salon-owner/dashboard')}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {activeStep > 0 && (
                                <Button onClick={handleBack} disabled={loading}>
                                    Back
                                </Button>
                            )}
                            {activeStep < steps.length - 1 ? (
                                <Button variant="contained" onClick={handleNext}>
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} /> : null}
                                >
                                    {loading ? 'Creating...' : 'Create Salon'}
                                </Button>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default CreateSalon;
