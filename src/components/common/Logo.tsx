import React from 'react';
import { Box, Typography } from '@mui/material';
import { ContentCut as ScissorsIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './Logo.css';

interface LogoProps {
    variant?: 'default' | 'light' | 'dark' | 'image';
    size?: 'small' | 'medium' | 'large';
    clickable?: boolean;
}

const Logo: React.FC<LogoProps> = ({ variant = 'default', size = 'medium', clickable = true }) => {
    const sizeMap = {
        small: { fontSize: '1.5rem', iconSize: 24, imageHeight: 35 },
        medium: { fontSize: '1.75rem', iconSize: 28, imageHeight: 45 },
        large: { fontSize: '2.5rem', iconSize: 40, imageHeight: 60 },
    };

    const colorMap = {
        default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        light: '#ffffff',
        dark: '#212529',
    };

    // Image variant - use CSS text with scissors icon
    if (variant === 'image') {
        const logoContent = (
            <Box
                className="styler-logo-scissors"
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.3,
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontSize: sizeMap[size].fontSize,
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    color: '#6366f1',
                }}
            >
                <span>STY</span>
                <Box
                    className="scissors-icon-rotate"
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: 'rotate(-45deg)',
                        transformOrigin: 'center',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    <ScissorsIcon
                        sx={{
                            fontSize: sizeMap[size].iconSize,
                            color: '#6366f1',
                        }}
                    />
                </Box>
                <span>LER</span>
            </Box>
        );
        if (clickable) {
            return (
                <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                    {logoContent}
                </Link>
            );
        }
        return logoContent;
    }

    // Text + Icon variant (original)
    const logoContent = (
        <Box className={`styler-logo styler-logo-${variant} styler-logo-${size}`} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
                component="span"
                sx={{
                    fontSize: sizeMap[size].fontSize,
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    background: variant === 'default' ? colorMap.default : 'none',
                    color: variant === 'default' ? 'transparent' : colorMap[variant],
                    WebkitBackgroundClip: variant === 'default' ? 'text' : 'unset',
                    backgroundClip: variant === 'default' ? 'text' : 'unset',
                    WebkitTextFillColor: variant === 'default' ? 'transparent' : colorMap[variant],
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
            >
                STY
            </Typography>

            <Box
                className="logo-scissor"
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'rotate(-45deg)',
                    animation: 'scissorBounce 2s ease-in-out infinite',
                }}
            >
                <ScissorsIcon
                    sx={{
                        fontSize: sizeMap[size].iconSize,
                        background: variant === 'default' ? colorMap.default : 'none',
                        color: variant === 'default' ? 'transparent' : colorMap[variant],
                        WebkitBackgroundClip: variant === 'default' ? 'text' : 'unset',
                        backgroundClip: variant === 'default' ? 'text' : 'unset',
                        WebkitTextFillColor: variant === 'default' ? 'transparent' : colorMap[variant],
                    }}
                />
            </Box>

            <Typography
                component="span"
                sx={{
                    fontSize: sizeMap[size].fontSize,
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    background: variant === 'default' ? colorMap.default : 'none',
                    color: variant === 'default' ? 'transparent' : colorMap[variant],
                    WebkitBackgroundClip: variant === 'default' ? 'text' : 'unset',
                    backgroundClip: variant === 'default' ? 'text' : 'unset',
                    WebkitTextFillColor: variant === 'default' ? 'transparent' : colorMap[variant],
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
            >
                LER
            </Typography>
        </Box>
    );

    if (clickable) {
        return (
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                {logoContent}
            </Link>
        );
    }

    return logoContent;
};

export default Logo;
