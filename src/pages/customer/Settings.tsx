
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Avatar,
    Tabs,
    Tab,
    IconButton,
    InputAdornment,
    Divider,
    Switch,
    FormControlLabel,
    CircularProgress,
    Grid
} from '@mui/material';
import {
    Person as PersonIcon,
    Lock as LockIcon,
    Notifications as NotificationsIcon,
    CloudUpload as CloudUploadIcon,
    Visibility,
    VisibilityOff,
    Save as SaveIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`settings-tabpanel-${index}`}
            aria-labelledby={`settings-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const Settings: React.FC = () => {
    const { user, updateUser } = useAuthStore();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);

    // Profile State
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: '',
            country: ''
        }
    });

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        if (user) {
            const userAddress = user.addresses && user.addresses.length > 0 ? user.addresses[0] : null;
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: {
                    street: userAddress?.street || '',
                    city: userAddress?.city || '',
                    state: userAddress?.state || '',
                    pincode: userAddress?.pincode || '',
                    country: userAddress?.country || ''
                }
            });
        }
    }, [user]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            if (parent === 'address') {
                setProfileData(prev => ({
                    ...prev,
                    address: {
                        ...prev.address,
                        [child]: value
                    }
                }));
            }
        } else {
            setProfileData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLoading(true);
            try {
                const response = await userService.uploadProfilePicture(file);
                if (response.success && response.data) {
                    // Update user store with new avatar
                    if (user) {
                        updateUser({ profilePicture: response.data.profilePicture });
                    }
                    toast.success('Profile picture updated successfully');
                }
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to upload profile picture');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Construct payload compatible with UpdateProfileRequest
            // Note: UpdateProfileRequest expects nested address object, not array.
            // We need to check userService type definition again.
            // Looking at previous Step 239:
            // address?: { street: string; city: string; ... }
            // So passing profileData.address is correct for the API request.
            const response = await userService.updateProfile({
                name: profileData.name,
                phone: profileData.phone,
                // Email usually not updatable or requires verification
                address: profileData.address
            });

            if (response.success && response.data) {
                updateUser(response.data);
                toast.success('Profile updated successfully');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await authService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password changed successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h2" gutterBottom sx={{ mb: 4, fontWeight: 800 }}>
                Settings
            </Typography>

            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="settings tabs"
                sx={{
                    mb: 4,
                    '& .MuiTabs-indicator': {
                        height: 3,
                        borderRadius: '3px 3px 0 0'
                    }
                }}
            >
                <Tab icon={<PersonIcon />} iconPosition="start" label="Profile" />
                <Tab icon={<LockIcon />} iconPosition="start" label="Security" />
                <Tab icon={<NotificationsIcon />} iconPosition="start" label="Preferences" />
            </Tabs>

            {/* Profile Tab */}
            <TabPanel value={activeTab} index={0}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ textAlign: 'center', p: 3 }}>
                            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                                <Avatar
                                    src={user?.profilePicture}
                                    sx={{ width: 120, height: 120, mx: 'auto', border: '4px solid #f8fafc', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                                />
                                <IconButton
                                    component="label"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'primary.dark' },
                                        boxShadow: 2
                                    }}
                                >
                                    <CloudUploadIcon />
                                    <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} />
                                </IconButton>
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                {user?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user?.role}
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                                    Personal Information
                                </Typography>
                                <form onSubmit={handleProfileUpdate}>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                name="name"
                                                value={profileData.name}
                                                onChange={handleProfileChange}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                name="email"
                                                value={profileData.email}
                                                disabled
                                                helperText="Email cannot be changed"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Phone Number"
                                                name="phone"
                                                value={profileData.phone}
                                                onChange={handleProfileChange}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 4 }} />

                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                                        Address
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                fullWidth
                                                label="Street Address"
                                                name="address.street"
                                                value={profileData.address.street}
                                                onChange={handleProfileChange}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <TextField
                                                fullWidth
                                                label="City"
                                                name="address.city"
                                                value={profileData.address.city}
                                                onChange={handleProfileChange}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <TextField
                                                fullWidth
                                                label="State"
                                                name="address.state"
                                                value={profileData.address.state}
                                                onChange={handleProfileChange}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <TextField
                                                fullWidth
                                                label="Pincode"
                                                name="address.pincode"
                                                value={profileData.address.pincode}
                                                onChange={handleProfileChange}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                            disabled={loading}
                                        >
                                            Save Changes
                                        </Button>
                                    </Box>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={activeTab} index={1}>
                <Card sx={{ maxWidth: 600, mx: 'auto' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                            Change Password
                        </Typography>
                        <form onSubmit={handlePasswordUpdate}>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        label="Current Password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        type={showNewPassword ? 'text' : 'password'}
                                        label="New Password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        type={showNewPassword ? 'text' : 'password'}
                                        label="Confirm New Password"
                                        name="confirmNewPassword"
                                        value={passwordData.confirmNewPassword}
                                        onChange={handlePasswordChange}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        disabled={loading}
                                    >
                                        Update Password
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </TabPanel>

            {/* Preferences Tab */}
            <TabPanel value={activeTab} index={2}>
                <Card>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                            Notifications
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <FormControlLabel
                                    control={<Switch defaultChecked />}
                                    label="Email Notifications"
                                />
                                <Typography variant="caption" display="block" color="text.secondary" sx={{ ml: 4 }}>
                                    Receive emails about your appointments and promotions.
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <FormControlLabel
                                    control={<Switch defaultChecked />}
                                    label="SMS/WhatsApp Notifications"
                                />
                                <Typography variant="caption" display="block" color="text.secondary" sx={{ ml: 4 }}>
                                    Get instant updates about your booking status.
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </TabPanel>
        </Container>
    );
};

export default Settings;
