import React, { useState, useEffect } from 'react';
import { BarberStatus } from '../../types';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Chip,
    Avatar,
    IconButton,
    Tabs,
    Tab,
    Alert,
    CircularProgress,
    Autocomplete,
    Stack,
    TableContainer,
    Paper
} from '@mui/material';
import {
    Add as AddIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Edit as EditIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { useBarberStore } from '../../stores/barberStore';
import { useSalonStore } from '../../stores/salonStore';
import './StaffManagement.css';

interface AddStaffFormData {
    name: string;
    email: string;
    phone: string;
    salonId: string;
    specialties: string[];
    experience: number;
}

const StaffManagement: React.FC = () => {
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [filterTab, setFilterTab] = useState(0); // 0: All, 1: Pending, 2: Approved
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { mySalons: salons, fetchMySalons } = useSalonStore();
    const {
        barbers: salonBarbers,
        fetchSalonBarbers,
        approveBarber,
        rejectBarber,
        registerBarber
    } = useBarberStore();

    const [formData, setFormData] = useState<AddStaffFormData>({
        name: '',
        email: '',
        phone: '',
        salonId: '',
        specialties: [],
        experience: 0
    });

    const specializationOptions = [
        'Hair Cutting',
        'Hair Styling',
        'Hair Coloring',
        'Beard Trimming',
        'Shaving',
        'Facial',
        'Hair Treatment',
        'Massage'
    ];

    useEffect(() => {
        fetchMySalons();
    }, [fetchMySalons]);

    useEffect(() => {
        if (salons.length > 0 && !formData.salonId) {
            setFormData(prev => ({ ...prev, salonId: salons[0]._id }));
            fetchSalonBarbers(salons[0]._id);
        }
    }, [salons, formData.salonId, fetchSalonBarbers]);

    const handleAddStaff = async () => {
        setLoading(true);
        setError(null);

        try {
            // First, check if the user exists in Styler
            const userService = (await import('../../services/userService')).userService;
            const checkResult = await userService.checkUserExists(formData.email, formData.phone);

            if (!checkResult.success || !checkResult.data?.exists) {
                setError('This barber is not registered in Styler. Please ask them to create an account first.');
                setLoading(false);
                return;
            }

            // If user exists and is a barber, proceed with registration
            const userData = checkResult.data?.user;
            if (userData && userData.role !== 'barber') {
                setError(`This user is registered as ${userData.role}, not as a barber. Only barbers canbe added as staff.`);
                setLoading(false);
                return;
            }

            // User exists and is a barber, proceed with adding to salon
            await registerBarber({
                salonId: formData.salonId,
                displayName: formData.name,
                specializations: formData.specialties,
                experience: formData.experience
            });

            setSuccess('Staff member added successfully!');
            setOpenAddDialog(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                salonId: salons[0]?._id || '',
                specialties: [],
                experience: 0
            });

            // Refresh staff list
            if (formData.salonId) {
                fetchSalonBarbers(formData.salonId);
            }

            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add staff member');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (barberId: string) => {
        try {
            await approveBarber(barberId);
            setSuccess('Staff member approved successfully!');
            if (formData.salonId) {
                fetchSalonBarbers(formData.salonId);
            }
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to approve staff member');
        }
    };

    const handleReject = async (barberId: string) => {
        try {
            await rejectBarber(barberId, 'Rejected by salon owner');
            setSuccess('Staff member rejected');
            if (formData.salonId) {
                fetchSalonBarbers(formData.salonId);
            }
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reject staff member');
        }
    };

    const filteredStaff = salonBarbers.filter(barber => {
        if (filterTab === 0) return true; // All
        if (filterTab === 1) return barber.status === BarberStatus.PENDING; // Pending
        if (filterTab === 2) return barber.status === BarberStatus.APPROVED; // Approved
        return true;
    });

    const getStatusColor = (status: BarberStatus) => {
        switch (status) {
            case BarberStatus.APPROVED:
                return 'success';
            case BarberStatus.PENDING:
                return 'warning';
            case BarberStatus.REJECTED:
                return 'error';
            case BarberStatus.SUSPENDED:
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Box className="customer-dashboard">
            <Container maxWidth="lg">
                <Typography variant="h1" gutterBottom>
                    Staff Management
                </Typography>

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                        {success}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h5">Team Members</Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setOpenAddDialog(true)}
                            >
                                Add Staff
                            </Button>
                        </Box>

                        <Tabs value={filterTab} onChange={(e, newValue) => setFilterTab(newValue)} sx={{ mb: 3 }}>
                            <Tab label={`All (${salonBarbers.length})`} />
                            <Tab label={`Pending (${salonBarbers.filter(b => b.status === BarberStatus.PENDING).length})`} />
                            <Tab label={`Approved (${salonBarbers.filter(b => b.status === BarberStatus.APPROVED).length})`} />
                        </Tabs>

                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Staff Member</TableCell>
                                        <TableCell>Contact</TableCell>
                                        <TableCell>Specializations</TableCell>
                                        <TableCell>Experience</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredStaff.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                                                    No staff members found
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredStaff.map((barber) => (
                                            <TableRow key={barber._id}>
                                                <TableCell>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Avatar>
                                                            {barber._id.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            Barber #{barber._id.slice(-6)}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">-</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        -
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                                        {barber.specialties?.slice(0, 3).map((spec: string, idx: number) => (
                                                            <Chip key={idx} label={spec} size="small" sx={{ mb: 0.5 }} />
                                                        ))}
                                                        {barber.specialties?.length > 3 && (
                                                            <Chip label={`+${barber.specialties.length - 3}`} size="small" />
                                                        )}
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {barber.experience} years
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={barber.status}
                                                        color={getStatusColor(barber.status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Stack direction="row" spacing={1} justifyContent="center">
                                                        {barber.status === BarberStatus.PENDING && (
                                                            <>
                                                                <IconButton
                                                                    color="success"
                                                                    size="small"
                                                                    onClick={() => handleApprove(barber._id)}
                                                                    title="Approve"
                                                                >
                                                                    <CheckIcon />
                                                                </IconButton>
                                                                <IconButton
                                                                    color="error"
                                                                    size="small"
                                                                    onClick={() => handleReject(barber._id)}
                                                                    title="Reject"
                                                                >
                                                                    <CloseIcon />
                                                                </IconButton>
                                                            </>
                                                        )}
                                                        <IconButton size="small" title="View Details">
                                                            <ViewIcon />
                                                        </IconButton>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                {/* Add Staff Dialog */}
                <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Add New Staff Member</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <TextField
                                label="Full Name"
                                required
                                fullWidth
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <TextField
                                label="Email"
                                required
                                fullWidth
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <TextField
                                label="Phone"
                                required
                                fullWidth
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <TextField
                                select
                                label="Salon"
                                required
                                fullWidth
                                value={formData.salonId}
                                onChange={(e) => setFormData({ ...formData, salonId: e.target.value })}
                            >
                                {salons.map((salon: any) => (
                                    <MenuItem key={salon._id} value={salon._id}>
                                        {salon.displayName || salon.businessName}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Autocomplete
                                multiple
                                options={specializationOptions}
                                value={formData.specialties}
                                onChange={(e, newValue) => setFormData({ ...formData, specialties: newValue })}
                                renderInput={(params) => (
                                    <TextField {...params} label="Specializations" placeholder="Select specializations" />
                                )}
                            />
                            <TextField
                                label="Years of Experience"
                                type="number"
                                fullWidth
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                                InputProps={{ inputProps: { min: 0, max: 50 } }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleAddStaff}
                            disabled={loading || !formData.name || !formData.email || !formData.phone || !formData.salonId}
                            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                        >
                            {loading ? 'Adding...' : 'Add Staff'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default StaffManagement;
