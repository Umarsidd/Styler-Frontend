import React from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Stepper, Step, StepLabel } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import './BookingFlow.css';

const BookingFlow: React.FC = () => {
    const { salonId } = useParams<{ salonId: string }>();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = React.useState(0);

    const steps = ['Select Service', 'Choose Barber', 'Pick Date & Time', 'Confirm'];

    return (
        <Box className="customer-dashboard">
            <Container maxWidth="md">
                <Typography variant="h1" gutterBottom>
                    Book Appointment
                </Typography>

                <Card>
                    <CardContent>
                        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body1" color="text.secondary">
                                Booking flow for salon {salonId}
                            </Typography>

                            <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate(`/salons/${salonId}`)}>
                                Back to Salon
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default BookingFlow;
