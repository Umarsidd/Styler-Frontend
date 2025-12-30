import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { ContentCut as ScissorsIcon } from '@mui/icons-material';
import './Loader.css';

const Loader: React.FC = () => {
    return (
        <Box
            className="loader-container"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px',
                position: 'relative',
            }}
        >
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main' }} />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <ScissorsIcon sx={{ fontSize: 28, color: 'primary.main' }} className="loader-icon" />
                </Box>
            </Box>
        </Box>
    );
};

export default Loader;
