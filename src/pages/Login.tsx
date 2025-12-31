import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Tabs,
    Tab,
    ToggleButtonGroup,
    ToggleButton,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Phone as PhoneIcon,
    Login as LoginIcon,
    PersonAdd as PersonAddIcon,
    ContentCut as ScissorsIcon,
    CalendarMonth as CalendarIcon,
    Store as StoreIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { UserRole } from '../types';
import Logo from '../components/common/Logo';
import './Login.css';

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

interface LoginProps {
    isRegisterMode?: boolean;
}

const Login: React.FC<LoginProps> = ({ isRegisterMode = false }) => {
    const [activeTab, setActiveTab] = useState(isRegisterMode ? 1 : 0);
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);

    const [loginData, setLoginData] = useState<LoginFormValues>({ email: '', password: '' });
    const [registerData, setRegisterData] = useState<RegisterFormValues>({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const { isAuthenticated, user } = useAuthStore();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            const dashboardPath = getDashboardPath(user.role);
            navigate(dashboardPath, { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const getDashboardPath = (role: string) => {
        switch (role) {
            case 'barber': return '/barber/dashboard';
            case 'salon_owner': return '/salon-owner/dashboard';
            case 'superadmin': return '/admin/superadmin';
            case 'customer':
            default: return '/customer/dashboard';
        }
    };

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
                toast.success('Login successful! Welcome back.');

                switch (user.role) {
                    case UserRole.BARBER:
                        setTimeout(() => navigate('/barber/dashboard'), 500);
                        break;
                    case UserRole.SALON_OWNER:
                        setTimeout(() => navigate('/salon-owner/dashboard'), 500);
                        break;
                    case UserRole.SUPER_ADMIN:
                        setTimeout(() => navigate('/admin/superadmin'), 500);
                        break;
                    case UserRole.CUSTOMER:
                    default:
                        setTimeout(() => navigate('/customer/dashboard'), 500);
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
                toast.success('Account created successfully! Welcome aboard.');

                switch (selectedRole) {
                    case UserRole.BARBER:
                        setTimeout(() => navigate('/barber/dashboard'), 500);
                        break;
                    case UserRole.SALON_OWNER:
                        setTimeout(() => navigate('/salon-owner/dashboard'), 500);
                        break;
                    case UserRole.CUSTOMER:
                    default:
                        setTimeout(() => navigate('/customer/dashboard'), 500);
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
        <Box className="login-page">
            {/* Left Side - Branding */}
            <Box className="login-left">
                <MotionBox
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="login-branding"
                >
                    <Box sx={{ mb: 3 }}>
                        <Logo variant="light" size="large" clickable={false} />
                    </Box>
                    <Typography className="login-tagline">
                        Your premium salon booking platform
                    </Typography>
                    <Box className="login-features">
                        <Box className="login-feature">
                            <Box className="login-feature-icon"><ScissorsIcon /></Box>
                            <Typography>Expert Stylists</Typography>
                        </Box>
                        <Box className="login-feature">
                            <Box className="login-feature-icon"><CalendarIcon /></Box>
                            <Typography>Easy Booking</Typography>
                        </Box>
                        <Box className="login-feature">
                            <Box className="login-feature-icon"><StoreIcon /></Box>
                            <Typography>20+ Locations</Typography>
                        </Box>
                    </Box>
                </MotionBox>
            </Box>

            {/* Right Side - Form */}
            <Box className="login-right">
                <MotionBox
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="login-form-container"
                >
                    <Box className="login-form-header">
                        <Typography variant="h1">Welcome</Typography>
                        <Typography variant="body1">Sign in to continue to Styler</Typography>
                    </Box>

                    <Card sx={{ boxShadow: 0 }}>
                        <Tabs
                            value={activeTab}
                            onChange={(_, newValue) => setActiveTab(newValue)}
                            variant="fullWidth"
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab icon={<LoginIcon />} label="Login" iconPosition="start" />
                            <Tab icon={<PersonAddIcon />} label="Sign Up" iconPosition="start" />
                        </Tabs>

                        <CardContent sx={{ p: 0, pt: 3, px: { xs: 2, sm: 3 } }}>
                            {/* Login Tab */}
                            {activeTab === 0 && (
                                <Box component="form" onSubmit={handleLoginSubmit} className="login-form">
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 2 }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 3 }}
                                    />

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                                    >
                                        {loading ? 'Logging in...' : 'Login'}
                                    </Button>
                                </Box>
                            )}

                            {/* Signup Tab */}
                            {activeTab === 1 && (
                                <Box component="form" onSubmit={handleRegisterSubmit} className="login-form">
                                    {/* Role Selection */}
                                    <Box className="role-selection" sx={{ mb: 3 }}>
                                        <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                                            I am a:
                                        </Typography>
                                        <ToggleButtonGroup
                                            value={selectedRole}
                                            exclusive
                                            onChange={(_, newRole) => newRole && setSelectedRole(newRole)}
                                            fullWidth
                                            sx={{ mb: 2 }}
                                        >
                                            <ToggleButton value={UserRole.CUSTOMER}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                                    <CalendarIcon />
                                                    <Typography variant="caption">Customer</Typography>
                                                </Box>
                                            </ToggleButton>
                                            <ToggleButton value={UserRole.BARBER}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                                    <ScissorsIcon />
                                                    <Typography variant="caption">Barber</Typography>
                                                </Box>
                                            </ToggleButton>
                                            <ToggleButton value={UserRole.SALON_OWNER}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                                    <StoreIcon />
                                                    <Typography variant="caption">Owner</Typography>
                                                </Box>
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                    </Box>

                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        value={registerData.name}
                                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 2 }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 2 }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        value={registerData.phone}
                                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                                        required
                                        inputProps={{ maxLength: 10 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PhoneIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 2 }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 2 }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Confirm Password"
                                        type="password"
                                        value={registerData.confirmPassword}
                                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 3 }}
                                    />

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={20} /> : <PersonAddIcon />}
                                    >
                                        {loading ? 'Creating Account...' : 'Create Account'}
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                    <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 3, display: 'block' }}>
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </Typography>
                </MotionBox>
            </Box>
        </Box>
    );
};

export default Login;
