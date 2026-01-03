import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    ListItemIcon
} from '@mui/material';
import {
    Menu as MenuIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    Settings as SettingsIcon,
    ContentCut as ContentCutIcon,
    LocationOn as LocationOnIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import Logo from './Logo';
import './Navbar.css';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user, isAuthenticated, clearAuth } = useAuthStore();

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
                { label: 'Find Salons', path: '/salons', icon: <LocationOnIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
                { label: 'Services', path: '/services', icon: <ContentCutIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
                { label: 'About', path: '/about', icon: <InfoIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
            ];
        }

        switch (user.role) {
            case 'barber':
                return [
                    { label: 'Dashboard', path: '/barber/dashboard', icon: <PersonIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
                    { label: 'My Appointments', path: '/barber/appointments', icon: <SettingsIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
                    { label: 'My Schedule', path: '/barber/schedule', icon: <InfoIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
                ];
            case 'salon_owner':
                return [
                    { label: 'Dashboard', path: '/salon-owner/dashboard', icon: <PersonIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
                    { label: 'My Salons', path: '/salons-owner/my-salons', icon: <LocationOnIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
                    { label: 'Barbers', path: '/salon-owner/barbers', icon: <ContentCutIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
                ];
            case 'customer':
            default:
                return [
                    { label: 'Find Salons', path: '/salons', icon: <LocationOnIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
                    { label: 'Services', path: '/services', icon: <ContentCutIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
                    { label: 'About', path: '/about', icon: <InfoIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
                ];
        }
    };

    const navLinks = getNavLinksForRole();

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Logo size="medium" variant="image" clickable={false} />
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
                <List>
                    {navLinks.map((item) => (
                        <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                sx={{
                                    mx: 2,
                                    borderRadius: 2,
                                    '&.active': { bgcolor: 'primary.lighter', color: 'primary.main' },
                                    '&:hover': { bgcolor: 'action.hover' }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
                {isAuthenticated && user ? (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 1.5, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                            <Avatar
                                src={user.profilePicture}
                                alt={user.name}
                                sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontWeight: 700 }}
                            >
                                {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box sx={{ textAlign: 'left', overflow: 'hidden' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {user.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {user.email}
                                </Typography>
                            </Box>
                        </Box>
                        <List disablePadding>
                            <ListItem disablePadding sx={{ mb: 1 }}>
                                <ListItemButton component={Link} to="/profile" sx={{ borderRadius: 2 }}>
                                    <ListItemIcon sx={{ minWidth: 40 }}><PersonIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText primary="Profile" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding sx={{ mb: 1 }}>
                                <ListItemButton component={Link} to="/settings" sx={{ borderRadius: 2 }}>
                                    <ListItemIcon sx={{ minWidth: 40 }}><SettingsIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText primary="Settings" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={handleLogout}
                                    sx={{
                                        borderRadius: 2,
                                        color: 'error.main',
                                        '&:hover': { bgcolor: 'error.lighter' },
                                        '& .MuiListItemIcon-root': { color: 'error.main' }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}><LogoutIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText primary="Logout" primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </>
                ) : (
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/login')}
                        sx={{ py: 1.5, fontWeight: 700, borderRadius: 2 }}
                    >
                        Login / Sign Up
                    </Button>
                )}
            </Box>
        </Box>
    );

    return (
        <>
            <AppBar position="sticky" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', boxShadow: '0 2px 20px rgba(0, 0, 0, 0.08)', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                <Toolbar sx={{ maxWidth: 1400, width: '100%', mx: 'auto', px: { xs: 2, md: 3 } }}>
                    <Logo size="medium" variant="image" />

                    {isMobile ? (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ ml: 'auto', color: '#495057' }}
                        >
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <>
                            <Box sx={{ display: 'flex', gap: 3, flex: 1, justifyContent: 'center' }}>
                                {navLinks.map((item) => (
                                    <Button
                                        key={item.path}
                                        component={Link}
                                        to={item.path}
                                        disableRipple
                                        startIcon={item.icon}
                                        sx={{
                                            color: '#495057',
                                            fontWeight: 600,
                                            position: 'relative',
                                            textTransform: 'none',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                width: 0,
                                                height: 2,
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                transition: 'width 0.3s',
                                            },
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                                color: '#667eea',
                                                border: 'none',
                                                outline: 'none',
                                                boxShadow: 'none',
                                                '&::after': { width: '100%' },
                                            },
                                            '&:focus': {
                                                outline: 'none',
                                                boxShadow: 'none',
                                            },
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {isAuthenticated ? (
                                    <>
                                        <IconButton onClick={handleMenu}>
                                            <Avatar
                                                src={user?.profilePicture}
                                                alt={user?.name}
                                                sx={{ width: 36, height: 36, bgcolor: '#f59e0b' }}
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
                                                    mt: 1,
                                                    minWidth: 240,
                                                    borderRadius: 3,
                                                    overflow: 'hidden',
                                                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                },
                                            }}
                                        >
                                            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                    {user?.name || 'User'}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    {user?.email || ''}
                                                </Typography>
                                            </Box>
                                            <MenuItem
                                                onClick={() => { navigate('/profile'); handleClose(); }}
                                                sx={{
                                                    py: 1.5,
                                                    px: 2,
                                                    '&:hover': {
                                                        bgcolor: 'primary.lighter',
                                                        '& .MuiSvgIcon-root': { color: 'primary.main' },
                                                    },
                                                }}
                                            >
                                                <PersonIcon sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} />
                                                <Typography variant="body2">Profile</Typography>
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => { navigate('/settings'); handleClose(); }}
                                                sx={{
                                                    py: 1.5,
                                                    px: 2,
                                                    '&:hover': {
                                                        bgcolor: 'primary.lighter',
                                                        '& .MuiSvgIcon-root': { color: 'primary.main' },
                                                    },
                                                }}
                                            >
                                                <SettingsIcon sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} />
                                                <Typography variant="body2">Settings</Typography>
                                            </MenuItem>
                                            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 0.5 }} />
                                            <MenuItem
                                                onClick={handleLogout}
                                                sx={{
                                                    py: 1.5,
                                                    px: 2,
                                                    color: 'error.main',
                                                    '&:hover': {
                                                        bgcolor: 'error.lighter',
                                                        '& .MuiSvgIcon-root': { color: 'error.dark' },
                                                    },
                                                }}
                                            >
                                                <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                                                <Typography variant="body2">Logout</Typography>
                                            </MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="contained" onClick={() => navigate('/login')}>
                                            Get Started
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar;
