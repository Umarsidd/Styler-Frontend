import React from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink, IconButton, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import {
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    Instagram as InstagramIcon,
    LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import './Footer.css';

const Footer: React.FC = () => {
    const footerLinks = {
        'Quick Links': [
            { label: 'Home', path: '/' },
            { label: 'Services', path: '/services' },
            { label: 'About Us', path: '/about' },
        ],
        'Services': [
            { label: 'Hair Styling', path: '/services' },
            { label: 'Beard Grooming', path: '/services' },
            { label: 'Hair Coloring', path: '/services' },
        ],
    };

    return (
        <Box
            component="footer"
            sx={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                color: '#e9ecef',
                pt: 8,
                pb: 4,
                mt: 12,
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} sx={{ mb: 6 }}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffffff', mb: 2 }}>
                            Styler
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#adb5bd', lineHeight: 1.8, mb: 2 }}>
                            Your premium salon booking platform
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                            {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, index) => (
                                <IconButton
                                    key={index}
                                    size="small"
                                    sx={{
                                        color: '#ffffff',
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        '&:hover': {
                                            bgcolor: 'primary.main',
                                            transform: 'translateY(-3px)',
                                        },
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    <Icon fontSize="small" />
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>

                    {Object.entries(footerLinks).map(([title, links]) => (
                        <Grid item xs={6} md={2} key={title}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff', mb: 2, fontSize: '1.1rem' }}>
                                {title}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {links.map((link) => (
                                    <MuiLink
                                        key={link.label}
                                        component={Link}
                                        to={link.path}
                                        sx={{
                                            color: '#adb5bd',
                                            textDecoration: 'none',
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                color: '#f59e0b',
                                                pl: 1,
                                            },
                                        }}
                                    >
                                        {link.label}
                                    </MuiLink>
                                ))}
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

                <Typography variant="body2" align="center" sx={{ color: '#6c757d' }}>
                    © {new Date().getFullYear()} Styler. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
