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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Chip,
    IconButton,
    Alert,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Switch,
    FormControlLabel,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import { salonService } from '../../services/salonService';
import { Service, ServiceGender } from '../../types';

interface ServiceFormData {
    name: string;
    description: string;
    price: number;
    duration: number;
    gender: ServiceGender;
    isActive: boolean;
}

const ManageServices: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const [formData, setFormData] = useState<ServiceFormData>({
        name: '',
        description: '',
        price: 0,
        duration: 30,
        gender: ServiceGender.MALE,
        isActive: true,
    });

    useEffect(() => {
        fetchServices();
    }, [id]);

    const fetchServices = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const response = await salonService.getSalonServices(id);
            setServices(response.data || []);
        } catch (err) {
            console.error('Error fetching services:', err);
            setError('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (service?: Service) => {
        if (service) {
            setEditingService(service);
            setFormData({
                name: service.name,
                description: service.description || '',
                price: service.price,
                duration: service.duration,
                gender: service.gender,
                isActive: service.isActive,
            });
        } else {
            setEditingService(null);
            setFormData({
                name: '',
                description: '',
                price: 0,
                duration: 30,
                gender: ServiceGender.MALE,
                isActive: true,
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingService(null);
        setFormData({
            name: '',
            description: '',
            price: 0,
            duration: 30,
            gender: ServiceGender.MALE,
            isActive: true,
        });
    };

    const handleSubmit = async () => {
        if (!id) return;

        setSubmitting(true);
        setError(null);

        try {
            if (editingService) {
                // Update existing service
                await salonService.updateService(id!, editingService._id, formData);
                setSuccess('Service updated successfully!');
            } else {
                // Create new service
                await salonService.addService(id, formData);
                setSuccess('Service created successfully!');
            }

            handleCloseDialog();
            fetchServices();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save service');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (serviceId: string) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        if (!id) return;

        try {
            await salonService.removeService(id, serviceId);
            setSuccess('Service deleted successfully!');
            fetchServices();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete service');
        }
    };

    const handleToggleActive = async (service: Service) => {
        if (!id) return;

        try {
            await salonService.updateService(id, service._id, {
                ...service,
                isActive: !service.isActive,
            });
            setSuccess(`Service ${!service.isActive ? 'activated' : 'deactivated'} successfully!`);
            fetchServices();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update service');
        }
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
                        Manage Services
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            py: 1.5,
                            px: 3,
                        }}
                    >
                        Add Service
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

                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <CardContent sx={{ p: 0 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                                        <TableCell sx={{ fontWeight: 700 }}>Service Name</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {services.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                                <Typography color="text.secondary" variant="h6">
                                                    No services added yet
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<AddIcon />}
                                                    onClick={() => handleOpenDialog()}
                                                    sx={{ mt: 2 }}
                                                >
                                                    Add Your First Service
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        services.map((service) => (
                                            <TableRow key={service._id} hover>
                                                <TableCell>
                                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                        {service.name}
                                                    </Typography>
                                                    {service.description && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {service.description.substring(0, 50)}
                                                            {service.description.length > 50 && '...'}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={service.gender}
                                                        size="small"
                                                        sx={{
                                                            textTransform: 'capitalize',
                                                            bgcolor: service.gender === 'male' ? '#e3f2fd' : service.gender === 'female' ? '#fce4ec' : '#f3e5f5',
                                                            color: service.gender === 'male' ? '#1976d2' : service.gender === 'female' ? '#c2185b' : '#7b1fa2',
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#667eea' }}>
                                                        ₹{service.price}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {service.duration} min
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                checked={service.isActive}
                                                                onChange={() => handleToggleActive(service)}
                                                                color="success"
                                                            />
                                                        }
                                                        label={service.isActive ? 'Active' : 'Inactive'}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        onClick={() => handleOpenDialog(service)}
                                                        size="small"
                                                        sx={{ color: '#667eea' }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleDelete(service._id)}
                                                        size="small"
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                {/* Add/Edit Service Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
                        {editingService ? 'Edit Service' : 'Add New Service'}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                            <TextField
                                label="Service Name"
                                required
                                fullWidth
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />

                            <TextField
                                label="Description"
                                multiline
                                rows={3}
                                fullWidth
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6 }}>
                                    <TextField
                                        label="Price (₹)"
                                        required
                                        fullWidth
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                        InputProps={{ inputProps: { min: 0 } }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <TextField
                                        label="Duration (minutes)"
                                        required
                                        fullWidth
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                                        InputProps={{ inputProps: { min: 5, step: 5 } }}
                                    />
                                </Grid>
                            </Grid>

                            <TextField
                                select
                                label="Gender Category"
                                required
                                fullWidth
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value as ServiceGender })}
                            >
                                <MenuItem value={ServiceGender.MALE}>Male</MenuItem>
                                <MenuItem value={ServiceGender.FEMALE}>Female</MenuItem>
                                <MenuItem value={ServiceGender.UNISEX}>Unisex</MenuItem>
                            </TextField>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        color="success"
                                    />
                                }
                                label="Service Active"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={submitting || !formData.name || formData.price <= 0 || formData.duration <= 0}
                            startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                        >
                            {submitting ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default ManageServices;
