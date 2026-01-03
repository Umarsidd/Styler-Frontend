import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    CardContent,
    Typography,
    Tabs,
    Tab,
    ToggleButtonGroup,
    ToggleButton,
    InputAdornment,
    CircularProgress,
    IconButton,
    Dialog,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Phone as PhoneIcon,
    ContentCut as ScissorsIcon,
    CalendarMonth as CalendarIcon,
    Store as StoreIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    ArrowForward as ArrowForwardIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import toast from 'react-hot-toast';
import { UserRole } from '../../types';
import Logo from '../common/Logo';
import '../../pages/Login.css'; // Reuse existing styles

const MotionBox = motion(Box);

interface LoginFormValues {
    email: string;
    password: string;
}

interface RegisterFormValues {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

const AuthModal: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    // Store State
    const { isLoginModalOpen, closeLoginModal } = useUIStore();
    const setAuth = useAuthStore((state) => state.setAuth);

    // Form State
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loginData, setLoginData] = useState<LoginFormValues>({ email: '', password: '' });
    const [registerData, setRegisterData] = useState<RegisterFormValues>({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authService.login({
                emailOrPhone: loginData.email,
                password: loginData.password,
            });

            if (response.success && response.data) {
                const { user, tokens } = response.data;
                setAuth(user, tokens.accessToken, tokens.refreshToken);
                toast.success('Login successful!');
                closeLoginModal();

                // Navigation logic based on role
                switch (user.role) {
                    case UserRole.BARBER:
                        navigate('/barber/dashboard');
                        break;
                    case UserRole.SALON_OWNER:
                        navigate('/salon-owner/dashboard');
                        break;
                    case UserRole.SUPER_ADMIN:
                        navigate('/admin/superadmin');
                        break;
                    case UserRole.CUSTOMER:
                    default:
                        navigate('/customer/dashboard');
                }
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || 'Login failed';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (registerData.password !== registerData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.register({
                name: registerData.name,
                email: registerData.email,
                password: registerData.password,
                phone: registerData.phone,
                role: selectedRole,
            });

            if (response.success && response.data && response.data.tokens) {
                const { user, tokens } = response.data;
                setAuth(user, tokens.accessToken, tokens.refreshToken);
                toast.success('Account created successfully!');
                closeLoginModal();

                switch (selectedRole) {
                    case UserRole.BARBER:
                        navigate('/barber/dashboard');
                        break;
                    case UserRole.SALON_OWNER:
                        navigate('/salon-owner/dashboard');
                        break;
                    case UserRole.CUSTOMER:
                    default:
                        navigate('/customer/dashboard');
                }
            } else {
                setActiveTab(0);
                toast.success('Registration successful! Please login.');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || 'Registration failed';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={isLoginModalOpen}
            onClose={closeLoginModal}
            maxWidth="lg"
            fullScreen={true}
            PaperProps={{
                sx: {
                    borderRadius: 0,
                    overflow: 'hidden',
                    maxHeight: '100%',
                    margin: 0
                }
            }}
        >
            <Box className="login-page" sx={{ minHeight: '100vh', background: '#f8fafc' }}>

                {/* Close Button */}
                <IconButton
                    onClick={closeLoginModal}
                    sx={{
                        position: 'absolute',
                        right: 20,
                        top: 20,
                        zIndex: 1000,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(4px)',
                        color: '#64748b',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: '#ef4444'
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Left Side - Branding (Hidden on mobile if needed, but keeping for design consistency) */}
                {!isMobile && (
                    <Box className="login-left" sx={{ width: '45%' }}>
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="login-branding"
                        >
                            <Box sx={{ mb: 4 }}>
                                <Logo variant="light" size="large" clickable={false} />
                            </Box>
                            <Typography className="login-tagline">
                                Experience the art of grooming.
                            </Typography>
                            <Box className="login-features">
                                <Box className="login-feature">
                                    <Box className="login-feature-icon"><ScissorsIcon /></Box>
                                    <Box>
                                        <Typography fontWeight={700}>Expert Stylists</Typography>
                                    </Box>
                                </Box>
                                <Box className="login-feature">
                                    <Box className="login-feature-icon"><CalendarIcon /></Box>
                                    <Box>
                                        <Typography fontWeight={700}>Easy Booking</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </MotionBox>
                    </Box>
                )}

                {/* Right Side - Form */}
                <Box className="login-right" sx={{ flex: 1, padding: isMobile ? 3 : 6, width: isMobile ? '100%' : '55%' }}>
                    <MotionBox
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="login-form-container"
                        sx={{ maxWidth: '450px !important', margin: '0 auto' }}
                    >
                        {/* Mobile Logo Show only if mobile */}
                        {isMobile && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                <Logo variant="default" size="medium" clickable={false} />
                            </Box>
                        )}

                        <Box className="login-form-header" sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                                {activeTab === 0 ? 'Welcome Back' : 'Create Account'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                {activeTab === 0 ? 'Please enter your details to sign in' : 'Join us to book your next appointment'}
                            </Typography>
                        </Box>

                        <Tabs
                            value={activeTab}
                            onChange={(_, newValue) => setActiveTab(newValue)}
                            variant="fullWidth"
                            className="login-tabs"
                            sx={{ mb: 4 }}
                        >
                            <Tab label="Login" />
                            <Tab label="Sign Up" />
                        </Tabs>

                        <CardContent sx={{ p: 0 }}>
                            {activeTab === 0 && (
                                <Box component="form" onSubmit={handleLoginSubmit}>
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        required
                                        sx={{ mb: 2.5 }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        required
                                        sx={{ mb: 4 }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={loading}
                                        endIcon={!loading && <ArrowForwardIcon />}
                                        sx={{
                                            height: 50,
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                                    </Button>
                                </Box>
                            )}

                            {activeTab === 1 && (
                                <Box component="form" onSubmit={handleRegisterSubmit}>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700, color: '#64748b', textAlign: 'center' }}>
                                            I AM A:
                                        </Typography>
                                        <ToggleButtonGroup
                                            value={selectedRole}
                                            exclusive
                                            onChange={(_, newRole) => newRole && setSelectedRole(newRole)}
                                            fullWidth
                                            className="role-selection-group"
                                        >
                                            <ToggleButton value={UserRole.CUSTOMER} className="role-card-btn">Customer</ToggleButton>
                                            <ToggleButton value={UserRole.BARBER} className="role-card-btn">Barber</ToggleButton>
                                            <ToggleButton value={UserRole.SALON_OWNER} className="role-card-btn">Owner</ToggleButton>
                                        </ToggleButtonGroup>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            size="small"
                                            value={registerData.name}
                                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                            required
                                        />
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            size="small"
                                            value={registerData.email}
                                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                            required
                                        />
                                        <TextField
                                            fullWidth
                                            label="Phone"
                                            size="small"
                                            value={registerData.phone}
                                            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                                            required
                                        />
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <TextField
                                                fullWidth
                                                label="Password"
                                                type="password"
                                                size="small"
                                                value={registerData.password}
                                                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                                required
                                            />
                                            <TextField
                                                fullWidth
                                                label="Confirm"
                                                type="password"
                                                size="small"
                                                value={registerData.confirmPassword}
                                                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                                required
                                            />
                                        </Box>
                                    </Box>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={loading}
                                        sx={{
                                            mt: 3,
                                            height: 50,
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </MotionBox>
                </Box>
            </Box>
        </Dialog>
    );
};

export default AuthModal;
