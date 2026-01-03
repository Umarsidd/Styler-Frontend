import React from 'react';
import { Box, Typography } from '@mui/material';
import { ContentCut as ScissorsIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import './Logo.css';

interface LogoProps {
    variant?: 'default' | 'light' | 'dark';
    size?: 'small' | 'medium' | 'large';
    clickable?: boolean;
}

const Logo: React.FC<LogoProps> = ({ variant = 'default', size = 'medium', clickable = true }) => {
    // Size configuration
    const sizeMap = {
        small: {
            fontSize: '1.25rem',
            iconSize: 20
        },
        medium: {
            fontSize: '1.75rem',
            iconSize: 28
        },
        large: {
            fontSize: '2.5rem',
            iconSize: 40
        },
    };

    // Color definitions
    const colorMap = {
        default: {
            text: 'transparent',
            bg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            icon: '#6366f1' // Fallback/base color
        },
        light: {
            text: '#ffffff',
            bg: 'none',
            icon: '#ffffff'
        },
        dark: {
            text: '#1e293b', // Slate 800
            bg: 'none',
            icon: '#1e293b'
        },
    };

    const currentSize = sizeMap[size];
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const getHomeLink = () => {
        if (!isAuthenticated || !user) return '/';
        switch (user.role) {
            case 'barber': return '/barber/dashboard';
            case 'salon_owner': return '/salon-owner/dashboard';
            case 'superadmin': return '/admin/superadmin';
            case 'customer': return '/customer/dashboard';
            default: return '/';
        }
    };

    // Typography styles based on variant
    const textStyle = {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontWeight: 800,
        fontSize: currentSize.fontSize,
        letterSpacing: '-0.03em',
        lineHeight: 1,
        // Gradient handling
        background: variant === 'default' ? colorMap.default.bg : 'none',
        WebkitBackgroundClip: variant === 'default' ? 'text' : 'unset',
        backgroundClip: variant === 'default' ? 'text' : 'unset',
        color: variant === 'default' ? 'transparent' : colorMap[variant].text,
        WebkitTextFillColor: variant === 'default' ? 'transparent' : colorMap[variant].text,
    };

    const logoContent = (
        <Box
            className={`styler-logo styler-logo-${variant} styler-logo-${size}`}
            aria-label="Styler Logo"
        >
            {/* "STY" Part */}
            <Typography component="span" sx={textStyle}>
                STY
            </Typography>

            {/* Scissors Icon */}
            <Box className="logo-scissor-container">
                <ScissorsIcon
                    className="logo-scissor-icon"
                    sx={{
                        fontSize: currentSize.iconSize,
                        color: variant === 'default' ? 'url(#logo-gradient)' : colorMap[variant].icon,
                        // If gradient is needed for icon specifically
                        fill: variant === 'default' ? 'url(#styler_gradient)' : undefined
                    }}
                />

                {/* 
                   SVG Defs for Gradient Icon 
                   Only rendered once if variant is default 
                */}
                {variant === 'default' && (
                    <svg width={0} height={0} style={{ position: 'absolute', visibility: 'hidden' }}>
                        <linearGradient id="styler_gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4f46e5" />
                            <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                    </svg>
                )}
            </Box>

            {/* "LER" Part */}
            <Typography component="span" sx={textStyle}>
                LER
            </Typography>
        </Box>
    );

    if (clickable) {
        return (
            <Link to={getHomeLink()} style={{ textDecoration: 'none', display: 'inline-flex' }}>
                {logoContent}
            </Link>
        );
    }

    return logoContent;
};

export default Logo;
