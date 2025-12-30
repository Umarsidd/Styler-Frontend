import React from 'react';
import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import { TrendingUp as TrendingIcon } from '@mui/icons-material';
import './Analytics.css';

const Analytics: React.FC = () => {
    return (
        <Box className="customer-dashboard">
            <Container maxWidth="lg">
                <Typography variant="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingIcon /> Analytics
                </Typography>

                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>Revenue Overview</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Analytics charts and data visualization will appear here
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default Analytics;
