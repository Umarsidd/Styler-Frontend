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
    ListItemText
} from '@mui/material';
import {
    Menu as MenuIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import Logo from './Logo';
import './Navbar.css';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user, isAuthenticated, logout } = useAuthStore();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
        navigate('/login');
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navLinks = [
        { label: 'Find Salons', path: '/salons' },
        { label: 'Services', path: '/services' },
        { label: 'About', path: '/about' },
    ];

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', pt: 2 }}>
            <Box sx={{ my: 2 }}>
                <Logo size="medium" variant="image" clickable={false} />
            </Box>
            <List>
                {navLinks.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton component={Link} to={item.path} sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
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
                                        sx={{
                                            color: '#495057',
                                            fontWeight: 600,
                                            position: 'relative',
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
                                                '&::after': { width: '100%' },
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
                                            <Avatar sx={{ width: 36, height: 36, bgcolor: '#f59e0b' }}>
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </Avatar>
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                        >
                                            <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                                                <PersonIcon sx={{ mr: 1 }} fontSize="small" /> Profile
                                            </MenuItem>
                                            <MenuItem onClick={() => { navigate('/settings'); handleClose(); }}>
                                                <SettingsIcon sx={{ mr: 1 }} fontSize="small" /> Settings
                                            </MenuItem>
                                            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                                <LogoutIcon sx={{ mr: 1 }} fontSize="small" /> Logout
                                            </MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => navigate('/login')} sx={{ color: '#495057' }}>
                                            Login
                                        </Button>
                                        <Button variant="contained" onClick={() => navigate('/login')}>
                                            Sign Up
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
