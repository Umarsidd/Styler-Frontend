import React from 'react';
import { Box, Container, Typography, Card, CardContent } from '@mui/material';

const BarberSchedule: React.FC = () => {
    return (
        <Box sx={{ py: 4, minHeight: '100vh', bgcolor: '#f8f9fa' }}>
            <Container maxWidth="lg">
                <Typography variant="h1" gutterBottom>
                    My Schedule
                </Typography>

                <Card>
                    <CardContent>
                        <Typography variant="body1" color="text.secondary">
                            Manage your schedule and availability here. This page is under development.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            For now, you can use the Availability Management page to set your availability.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default BarberSchedule;
