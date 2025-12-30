import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Container, Typography, Button, Card, CardContent } from '@mui/material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import './PaymentSuccess.css';

const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const appointmentId = searchParams.get('appointmentId');

    return (
        <Box className="payment-success-page" sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', py: 8 }}>
            <Container maxWidth="sm">
                <Card sx={{ textAlign: 'center', p: 4 }}>
                    <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
                    <CardContent>
                        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'success.main' }}>
                            Payment Successful!
                        </Typography>
                        <Typography variant="h6" color="text.secondary" paragraph>
                            Your appointment has been confirmed
                        </Typography>
                        {appointmentId && (
                            <Typography variant="body1" sx={{ mb: 3 }}>
                                Appointment ID: <strong>{appointmentId}</strong>
                            </Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/customer/appointments')}
                            >
                                View Appointments
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/')}
                            >
                                Go Home
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default PaymentSuccess;
