import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Typography,
    useMediaQuery,
    useTheme,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Divider,
    Container
} from '@mui/material';
import {
    Menu as MenuIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    Settings as SettingsIcon,
    ContentCut as ContentCutIcon,
    LocationOn as LocationOnIcon,
    Info as InfoIcon,
    Dashboard as DashboardIcon,
    CalendarMonth as CalendarIcon,
    Store as StoreIcon,
    ChevronRight as ChevronRightIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import Logo from './Logo';
import './Navbar.css';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user, isAuthenticated, clearAuth } = useAuthStore();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        clearAuth();
        handleClose();
        navigate('/login');
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Role-based navigation links
    const getNavLinksForRole = () => {
        if (!isAuthenticated || !user) {
            return [
                { label: 'Find Salons', path: '/salons', icon: <LocationOnIcon /> },
                { label: 'Services', path: '/services', icon: <ContentCutIcon /> },
                { label: 'About', path: '/about', icon: <InfoIcon /> },
            ];
        }

        switch (user.role) {
            case 'barber':
                return [
                    { label: 'Dashboard', path: '/barber/dashboard', icon: <DashboardIcon /> },
                    { label: 'Appointments', path: '/barber/appointments', icon: <CalendarIcon /> },
                    { label: 'Schedule', path: '/barber/schedule', icon: <InfoIcon /> },
                ];
            case 'salon_owner':
                return [
                    { label: 'Dashboard', path: '/salon-owner/dashboard', icon: <DashboardIcon /> },
                    { label: 'My Salons', path: '/salons-owner/my-salons', icon: <StoreIcon /> },
                    { label: 'Barbers', path: '/salon-owner/barbers', icon: <ContentCutIcon /> },
                ];
            case 'customer':
            default:
                return [
                    { label: 'Find Salons', path: '/salons', icon: <LocationOnIcon /> },
                    { label: 'Services', path: '/services', icon: <ContentCutIcon /> },
                    { label: 'About', path: '/about', icon: <InfoIcon /> },
                ];
        }
    };

    const navLinks = getNavLinksForRole();

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Logo size="medium" variant="image" clickable={false} />
                <IconButton onClick={handleDrawerToggle} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
                <List sx={{ px: 2 }}>
                    {navLinks.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    onClick={handleDrawerToggle}
                                    sx={{
                                        borderRadius: 3,
                                        bgcolor: isActive ? 'primary.lighter' : 'transparent',
                                        color: isActive ? 'primary.main' : 'text.primary',
                                        '&:hover': { bgcolor: isActive ? 'primary.lighter' : 'rgba(0,0,0,0.04)' },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'primary.main' : 'text.secondary' }}>
                                        {React.cloneElement(item.icon as React.ReactElement, { fontSize: 'small' })}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }}
                                    />
                                    {isActive && <ChevronRightIcon sx={{ fontSize: 16 }} />}
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            <Box sx={{ p: 3, bgcolor: 'background.default', borderTop: '1px solid', borderColor: 'divider' }}>
                {isAuthenticated && user ? (
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Avatar
                                src={user.profilePicture}
                                alt={user.name}
                                sx={{ width: 48, height: 48, bgcolor: 'primary.main', fontWeight: 700, boxShadow: 2 }}
                            >
                                {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box sx={{ overflow: 'hidden' }}>
                                <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
                                    {user.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                                    {user.email}
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="inherit"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            sx={{ borderRadius: 2, borderColor: 'divider', textTransform: 'none' }}
                        >
                            Log Out
                        </Button>
                    </Box>
                ) : (
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={() => { navigate('/login'); handleDrawerToggle(); }}
                        sx={{
                            py: 1.5,
                            fontWeight: 700,
                            borderRadius: '50px',
                            boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)'
                        }}
                    >
                        Login / Sign Up
                    </Button>
                )}
            </Box>
        </Box>
    );

    return (
        <>
            <AppBar
                position="fixed"
                color="inherit"
                className={scrolled ? 'navbar scrolled' : 'navbar'}
                elevation={0}
                sx={{
                    bgcolor: scrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px)' : 'none',
                    borderBottom: scrolled ? '1px solid' : '1px solid',
                    borderColor: scrolled ? 'rgba(0,0,0,0.05)' : 'transparent',
                    transition: 'all 0.3s ease',
                    width: '100%',
                }}
            >
                <Container maxWidth={false} sx={{ maxWidth: 1400 }}>
                    <Toolbar disableGutters sx={{ height: scrolled ? 70 : 80, transition: 'all 0.3s ease' }}>
                        <Logo size={isMobile ? "small" : "medium"} variant="image" />

                        {isMobile ? (
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="end"
                                onClick={handleDrawerToggle}
                                sx={{ ml: 'auto', color: 'text.primary' }}
                            >
                                <MenuIcon />
                            </IconButton>
                        ) : (
                            <>
                                <Box sx={{ display: 'flex', gap: 1, mx: 'auto', p: 0.5, bgcolor: scrolled ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    {navLinks.map((item) => {
                                        const isActive = location.pathname === item.path;
                                        return (
                                            <Button
                                                key={item.path}
                                                component={Link}
                                                to={item.path}
                                                disableRipple
                                                startIcon={item.icon}
                                                sx={{
                                                    color: isActive ? 'white' : (scrolled ? 'text.secondary' : 'rgba(255,255,255,0.9)'), // Adjust link color for dark/light bg if needed, simplified here
                                                    fontWeight: 600,
                                                    px: 3,
                                                    py: 1,
                                                    borderRadius: '30px',
                                                    textTransform: 'none',
                                                    bgcolor: isActive ? 'primary.main' : 'transparent',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        bgcolor: isActive ? 'primary.dark' : 'rgba(255,255,255,0.1)',
                                                        color: isActive ? 'white' : 'primary.main'
                                                    },
                                                    // Quick fix for when navbar is transparent over dark hero -> text should be white if not ignored by scroll
                                                    // But here we set color dynamically based on use case. For now simplifying.
                                                    // Better logic: if simple scrolled, dark text. If header transparent, depends on page.
                                                    // For this snippet, assuming mostly light theme except hero.
                                                }}
                                                className={`nav-item ${isActive ? 'active' : ''}`}
                                            >
                                                {item.label}
                                            </Button>
                                        );
                                    })}
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    {isAuthenticated ? (
                                        <>
                                            <IconButton
                                                onClick={handleMenu}
                                                sx={{
                                                    p: 0.5,
                                                    border: '2px solid',
                                                    borderColor: 'rgba(255,255,255,0.2)',
                                                    transition: 'all 0.2s',
                                                    '&:hover': { borderColor: 'primary.main' }
                                                }}
                                            >
                                                <Avatar
                                                    src={user?.profilePicture}
                                                    alt={user?.name}
                                                    sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontWeight: 700 }}
                                                >
                                                    {user?.name?.charAt(0).toUpperCase()}
                                                </Avatar>
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={handleClose}
                                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                                PaperProps={{
                                                    elevation: 0,
                                                    sx: {
                                                        mt: 1.5,
                                                        width: 320,
                                                        borderRadius: '32px',
                                                        overflow: 'hidden',
                                                        boxShadow: '0 20px 60px -10px rgba(0,0,0,0.15)',
                                                        border: '1px solid',
                                                        borderColor: 'rgba(0,0,0,0.05)',
                                                    },
                                                }}
                                            >
                                                <Box sx={{ px: 4, pt: 4, pb: 3, bgcolor: '#f8fafc' }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1.25rem' }}>
                                                        {user?.name || 'John Doe'}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500 }}>
                                                        {user?.email || 'customer@example.com'}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ p: 2, bgcolor: 'white' }}>
                                                    <MenuItem
                                                        onClick={() => { navigate('/profile'); handleClose(); }}
                                                        sx={{
                                                            py: 2,
                                                            px: 2,
                                                            borderRadius: '16px',
                                                            mb: 0.5,
                                                            '&:hover': {
                                                                bgcolor: '#f1f5f9',
                                                                '& .MuiSvgIcon-root': { color: '#6366f1' },
                                                            },
                                                            transition: 'all 0.2s',
                                                        }}
                                                    >
                                                        <PersonIcon sx={{ mr: 2, color: '#64748b', transition: 'color 0.2s' }} />
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155' }}>Profile</Typography>
                                                    </MenuItem>

                                                    <MenuItem
                                                        onClick={() => { navigate('/settings'); handleClose(); }}
                                                        sx={{
                                                            py: 2,
                                                            px: 2,
                                                            borderRadius: '16px',
                                                            mb: 2,
                                                            '&:hover': {
                                                                bgcolor: '#f1f5f9',
                                                                '& .MuiSvgIcon-root': { color: '#6366f1' },
                                                            },
                                                            transition: 'all 0.2s',
                                                        }}
                                                    >
                                                        <SettingsIcon sx={{ mr: 2, color: '#64748b', transition: 'color 0.2s' }} />
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155' }}>Settings</Typography>
                                                    </MenuItem>

                                                    <MenuItem
                                                        onClick={handleLogout}
                                                        sx={{
                                                            py: 2,
                                                            px: 2,
                                                            borderRadius: '16px',
                                                            '&:hover': {
                                                                bgcolor: '#fef2f2',
                                                            },
                                                            transition: 'all 0.2s',
                                                        }}
                                                    >
                                                        <LogoutIcon sx={{ mr: 2, color: '#ef4444' }} />
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#ef4444' }}>Logout</Typography>
                                                    </MenuItem>
                                                </Box>
                                            </Menu>
                                        </>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            onClick={() => navigate('/login')}
                                            sx={{
                                                px: 4,
                                                py: 1.2,
                                                borderRadius: '50px',
                                                fontWeight: 700,
                                                textTransform: 'none',
                                                boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.5)',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 12px 24px -4px rgba(99, 102, 241, 0.6)',
                                                }
                                            }}
                                        >
                                            Get Started
                                        </Button>
                                    )}
                                </Box>
                            </>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                variant="temporary"
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar;
