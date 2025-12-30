import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Container, Typography, Button, Card, CardContent, Alert } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import './PaymentFailed.css';

const PaymentFailed: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const error = searchParams.get('error') || 'Payment processing failed';

    return (
        <Box className="payment-failed-page" sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', py: 8 }}>
            <Container maxWidth="sm">
                <Card sx={{ textAlign: 'center', p: 4 }}>
                    <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
                    <CardContent>
                        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'error.main' }}>
                            Payment Failed
                        </Typography>
                        <Typography variant="h6" color="text.secondary" paragraph>
                            We couldn't process your payment
                        </Typography>

                        <Alert severity="error" sx={{ mb: 4, textAlign: 'left' }}>
                            {error}
                        </Alert>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate(-1)}
                            >
                                Try Again
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

export default PaymentFailed;
