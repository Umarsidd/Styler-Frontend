import React from 'react';
import { Box, Container, Typography, Card, CardContent, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import './AvailabilityManagement.css';

const AvailabilityManagement: React.FC = () => {
    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs());

    return (
        <Box className="customer-dashboard">
            <Container maxWidth="lg">
                <Typography variant="h1" gutterBottom>
                    Availability Management
                </Typography>

                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>Set Your Availability</Typography>

                        <Box sx={{ mb: 3 }}>
                            <DatePicker
                                label="Select Date"
                                value={selectedDate}
                                onChange={(newValue) => setSelectedDate(newValue)}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Box>

                        <Typography variant="body2" color="text.secondary" paragraph>
                            Configure your working hours and break times for the selected date
                        </Typography>

                        <Button variant="contained">Save Availability</Button>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default AvailabilityManagement;
