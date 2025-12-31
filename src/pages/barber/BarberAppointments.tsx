import React from 'react';
import { Box, Container, Typography, Card, CardContent } from '@mui/material';

const BarberAppointments: React.FC = () => {
    return (
        <Box sx={{ py: 4, minHeight: '100vh', bgcolor: '#f8f9fa' }}>
            <Container maxWidth="lg">
                <Typography variant="h1" gutterBottom>
                    My Appointments
                </Typography>

                <Card>
                    <CardContent>
                        <Typography variant="body1" color="text.secondary">
                            Your appointments will appear here. This page is under development.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default BarberAppointments;
