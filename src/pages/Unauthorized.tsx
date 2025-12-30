import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box
            className="unauthorized-page"
            sx={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
            }}
        >
            <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
                <LockIcon sx={{ fontSize: 72, color: 'error.main', mb: 3 }} />
                <Typography variant="h2" gutterBottom>
                    403 — Unauthorized Access
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph>
                    Sorry, you don't have permission to access this page.
                </Typography>
                <Button variant="contained" size="large" onClick={() => navigate('/')} sx={{ mt: 3 }}>
                    Go Home
                </Button>
            </Container>
        </Box>
    );
};

export default Unauthorized;
