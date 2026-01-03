import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    TextField,
    Alert,
    CircularProgress,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
    Divider,
    Paper,
    Switch,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { salonService } from '../../services/salonService';
import { Salon, OperatingHours } from '../../types';

interface SalonFormData {
    name: string;
    description: string;
    phone: string;
    email: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
    operatingHours: OperatingHours[];
    isActive: boolean;
    images: string[];
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EditSalon: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [newImage, setNewImage] = useState('');

    const [formData, setFormData] = useState<SalonFormData>({
        name: '',
        description: '',
        phone: '',
        email: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: '',
        },
        operatingHours: daysOfWeek.map(day => ({
            day,
            isOpen: true,
            openTime: '09:00',
            closeTime: '18:00',
        })),
        isActive: true,
        images: [],
    });

    useEffect(() => {
        fetchSalon();
    }, [id]);

    const fetchSalon = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const response = await salonService.getSalonById(id);
            const salon = response.data as Salon;

            setFormData({
                name: salon.name || '',
                description: salon.description || '',
                phone: salon.phone || '',
                email: salon.email || '',
                address: salon.address || {
                    street: '',
                    city: '',
                    state: '',
                    pincode: '',
                },
                operatingHours: salon.operatingHours?.length > 0
                    ? salon.operatingHours
                    : daysOfWeek.map(day => ({
                        day,
                        isOpen: true,
                        openTime: '09:00',
                        closeTime: '18:00',
                    })),
                isActive: salon.isActive !== undefined ? salon.isActive : true,
                images: salon.images || [],
            });
        } catch (err) {
            console.error('Error fetching salon:', err);
            setError('Failed to load salon details');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!id) return;

        setSubmitting(true);
        setError(null);

        try {
            // Add location coordinates to the address
            // TODO: Replace with actual geocoding or map picker for accurate coordinates
            const updateData = {
                ...formData,
                address: {
                    ...formData.address,
                    location: {
                        type: 'Point' as const,
                        coordinates: [0, 0] as [number, number], // [longitude, latitude] - default values
                    },
                },
            };

            await salonService.updateSalon(id, updateData);
            setSuccess('Salon updated successfully!');
            setTimeout(() => {
                navigate(-1);
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update salon');
        } finally {
            setSubmitting(false);
        }
    };

    const handleOperatingHoursChange = (index: number, field: keyof OperatingHours, value: any) => {
        const updated = [...formData.operatingHours];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, operatingHours: updated });
    };

    const handleAddImage = () => {
        if (newImage.trim()) {
            setFormData({
                ...formData,
                images: [...formData.images, newImage.trim()]
            });
            setNewImage('');
        }
    };

    const handleRemoveImage = (index: number) => {
        const updated = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: updated });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress size={60} sx={{ color: '#667eea' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 3 }}
                >
                    Back
                </Button>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
                        Edit Salon Details
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                        onClick={handleSubmit}
                        disabled={submitting}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            py: 1.5,
                            px: 4,
                        }}
                    >
                        {submitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
                        {success}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {/* Basic Information */}
                    <Grid size={{ xs: 12 }}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                            <Box
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    p: 2.5,
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Basic Information
                                </Typography>
                            </Box>
                            <CardContent sx={{ p: 4 }}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            label="Salon Name"
                                            required
                                            fullWidth
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            label="Description"
                                            multiline
                                            rows={4}
                                            fullWidth
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="Phone"
                                            required
                                            fullWidth
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="Email"
                                            type="email"
                                            fullWidth
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData.isActive}
                                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                    color="success"
                                                />
                                            }
                                            label="Salon Active"
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Address */}
                    <Grid size={{ xs: 12 }}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                            <Box
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    p: 2.5,
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Address
                                </Typography>
                            </Box>
                            <CardContent sx={{ p: 4 }}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            label="Street Address"
                                            required
                                            fullWidth
                                            value={formData.address.street}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                address: { ...formData.address, street: e.target.value }
                                            })}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <TextField
                                            label="City"
                                            required
                                            fullWidth
                                            value={formData.address.city}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                address: { ...formData.address, city: e.target.value }
                                            })}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <TextField
                                            label="State"
                                            required
                                            fullWidth
                                            value={formData.address.state}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                address: { ...formData.address, state: e.target.value }
                                            })}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <TextField
                                            label="Pincode"
                                            required
                                            fullWidth
                                            value={formData.address.pincode}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                address: { ...formData.address, pincode: e.target.value }
                                            })}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Operating Hours */}
                    <Grid size={{ xs: 12 }}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                            <Box
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    p: 2.5,
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Operating Hours
                                </Typography>
                            </Box>
                            <CardContent sx={{ p: 4 }}>
                                <Grid container spacing={2}>
                                    {formData.operatingHours.map((hours, index) => (
                                        <Grid size={{ xs: 12 }} key={hours.day}>
                                            <Paper variant="outlined" sx={{ p: 2 }}>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid size={{ xs: 12, sm: 3 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                            {hours.day}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 2 }}>
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    checked={hours.isOpen}
                                                                    onChange={(e) => handleOperatingHoursChange(index, 'isOpen', e.target.checked)}
                                                                    color="success"
                                                                />
                                                            }
                                                            label={hours.isOpen ? 'Open' : 'Closed'}
                                                        />
                                                    </Grid>
                                                    {hours.isOpen && (
                                                        <>
                                                            <Grid size={{ xs: 6, sm: 3 }}>
                                                                <TextField
                                                                    label="Open Time"
                                                                    type="time"
                                                                    fullWidth
                                                                    value={hours.openTime}
                                                                    onChange={(e) => handleOperatingHoursChange(index, 'openTime', e.target.value)}
                                                                    InputLabelProps={{ shrink: true }}
                                                                />
                                                            </Grid>
                                                            <Grid size={{ xs: 6, sm: 3 }}>
                                                                <TextField
                                                                    label="Close Time"
                                                                    type="time"
                                                                    fullWidth
                                                                    value={hours.closeTime}
                                                                    onChange={(e) => handleOperatingHoursChange(index, 'closeTime', e.target.value)}
                                                                    InputLabelProps={{ shrink: true }}
                                                                />
                                                            </Grid>
                                                        </>
                                                    )}
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Images */}
                    <Grid size={{ xs: 12 }}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                            <Box
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    p: 2.5,
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Salon Images
                                </Typography>
                            </Box>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ mb: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid size="grow">
                                            <TextField
                                                label="Image URL"
                                                fullWidth
                                                value={newImage}
                                                onChange={(e) => setNewImage(e.target.value)}
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </Grid>
                                        <Grid size="auto">
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={handleAddImage}
                                                sx={{ height: '56px' }}
                                            >
                                                Add Image
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Grid container spacing={2}>
                                    {formData.images.map((img, index) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                            <Paper
                                                sx={{
                                                    position: 'relative',
                                                    pt: '75%',
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={img}
                                                    alt={`Salon ${index + 1}`}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <IconButton
                                                    onClick={() => handleRemoveImage(index)}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                        '&:hover': {
                                                            bgcolor: 'white',
                                                        },
                                                    }}
                                                    size="small"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>

                                {formData.images.length === 0 && (
                                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                                        No images added yet. Add image URLs to showcase your salon.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Save Button at Bottom */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(-1)}
                        sx={{ mr: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                        onClick={handleSubmit}
                        disabled={submitting}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            py: 1.5,
                            px: 4,
                        }}
                    >
                        {submitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default EditSalon;
