import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { Visibility as EyeIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { appointmentService } from '../../services/appointmentService';
import { Appointment, AppointmentStatus, PaginatedResponse } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';
import './MyAppointments.css';

const MyAppointments: React.FC = () => {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [dateFilter, setDateFilter] = useState<Dayjs | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['my-appointments', statusFilter, dateFilter],
        queryFn: () =>
            appointmentService.getMyAppointments({
                status: statusFilter as AppointmentStatus,
                date: dateFilter?.format('YYYY-MM-DD'),
            }),
    });

    const appointments = (data?.data as PaginatedResponse<Appointment>)?.data || [];

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

    return (
        <Box className="my-appointments-page">
            <Container maxWidth="lg">
                <Typography variant="h1" gutterBottom>
                    My Appointments
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Status</InputLabel>
                        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="confirmed">Confirmed</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                    </FormControl>

                    <DatePicker
                        label="Filter by Date"
                        value={dateFilter}
                        onChange={(newValue) => setDateFilter(newValue)}
                        slotProps={{ textField: { sx: { minWidth: 200 } } }}
                    />
                </Box>

                <Card>
                    <CardContent>
                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : appointments.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h6" color="text.secondary">No appointments found</Typography>
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Appointment #</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Time</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {appointments.map((appointment) => (
                                            <TableRow key={appointment._id} hover>
                                                <TableCell>{appointment.appointmentNumber}</TableCell>
                                                <TableCell>{formatDate(appointment.scheduledDate)}</TableCell>
                                                <TableCell>{appointment.scheduledTime}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={appointment.status.toUpperCase()}
                                                        color={getStatusColor(appointment.status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>{formatCurrency(appointment.totalAmount)}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => navigate(`/customer/appointments/${appointment._id}`)}
                                                    >
                                                        <EyeIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default MyAppointments;
