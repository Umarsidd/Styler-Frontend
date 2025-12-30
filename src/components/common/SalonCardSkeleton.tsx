import React from 'react';
import { Card, CardContent, Skeleton, Box } from '@mui/material';
import './SalonCardSkeleton.css';

const SalonCardSkeleton: React.FC = () => {
    return (
        <Card className="salon-card-skeleton">
            <Skeleton variant="rectangular" height={200} animation="wave" />
            <CardContent>
                <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="80%" />
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
                </Box>
            </CardContent>
        </Card>
    );
};

export default SalonCardSkeleton;
