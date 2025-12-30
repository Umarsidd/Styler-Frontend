import React, { ReactNode } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import './StatCard.css';

interface StatCardProps {
    title: string;
    value: number | string;
    icon?: ReactNode;
    prefix?: ReactNode;
    suffix?: string;
    color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, prefix, suffix, color = '#667eea' }) => {
    return (
        <Card className="stat-card" sx={{ height: '100%', display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
            {icon && (
                <Box
                    className="stat-icon"
                    sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.75rem',
                        background: `${color}15`,
                        color: color,
                    }}
                >
                    {icon}
                </Box>
            )}
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, flex: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: color }}>
                    {prefix}
                    {value}
                    {suffix}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default StatCard;
