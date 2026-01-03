import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Cancel as CancelIcon,
    CalendarMonth as CalendarIcon,
    Schedule as ScheduleIcon,
    AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { appointmentService } from '../../services/appointmentService';
import { Appointment, AppointmentStatus } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';
import './AppointmentDetails.css';

const AppointmentDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['appointment', id],
        queryFn: () => appointmentService.getAppointmentById(id!),
        enabled: !!id,
    });

    const cancelMutation = useMutation({
        mutationFn: (appointmentId: string) => appointmentService.cancelAppointment(appointmentId),
        onSuccess: () => {
            toast.success('Appointment cancelled successfully');
            setCancelDialogOpen(false);
            refetch();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to cancel appointment');
        },
    });

    const appointment = data?.data as Appointment | undefined;

    const getStatusColor = (status: AppointmentStatus): 'success' | 'warning' | 'error' | 'info' | 'default' => {
        const colorMap: Record<AppointmentStatus, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
            pending: 'warning',
            confirmed: 'info',
            in_progress: 'info',
            completed: 'success',
            cancelled: 'error',
            no_show: 'error',
        };
        return colorMap[status] || 'default';
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!appointment) {
        return (
            <Container>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h5" gutterBottom>Appointment not found</Typography>
                    <Button variant="contained" onClick={() => navigate('/customer/appointments')} sx={{ mt: 2 }}>
                        Back to Appointments
                    </Button>
                </Box>
            </Container>
        );
    }

    const canCancel = appointment.status === 'pending' || appointment.status === 'confirmed';

    return (
        <Box className="appointment-details-page">
            <Container maxWidth="md">
                <Box className="page-header" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/customer/appointments')}>
                        Back
                    </Button>
                    <Typography variant="h1" sx={{ flex: 1 }}>Appointment Details</Typography>
                </Box>

                <Card>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h5">#{appointment.appointmentNumber}</Typography>
                                    <Chip
                                        label={appointment.status.replace('_', ' ').toUpperCase()}
                                        color={getStatusColor(appointment.status)}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <CalendarIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Date</Typography>
                                            <Typography variant="body1">{formatDate(appointment.scheduledDate, 'long')}</Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <ScheduleIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Time</Typography>
                                            <Typography variant="body1">{appointment.scheduledTime}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <MoneyIcon color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Total Amount</Typography>
                                        <Typography variant="h5" color="primary">{formatCurrency(appointment.totalAmount)}</Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {appointment.notes && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Notes</Typography>
                                    <Typography variant="body1">{appointment.notes}</Typography>
                                </Box>
                            )}
                        </Box>

                        {canCancel && (
                            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<CancelIcon />}
                                    onClick={() => setCancelDialogOpen(true)}
                                    disabled={cancelMutation.isPending}
                                >
                                    Cancel Appointment
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
                    <DialogTitle>Cancel Appointment</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to cancel this appointment?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCancelDialogOpen(false)}>No, Keep It</Button>
                        <Button
                            onClick={() => id && cancelMutation.mutate(id)}
                            color="error"
                            variant="contained"
                            disabled={cancelMutation.isPending}
                        >
                            Yes, Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default AppointmentDetails;
