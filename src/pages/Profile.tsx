import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Avatar,
    Typography,
    Grid,
    Divider,
    Chip,
    IconButton,
    Tabs,
    Tab
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Edit as EditIcon,
    PhotoCamera as PhotoCameraIcon,
    Security as SecurityIcon,
    Notifications as NotificationsIcon,
    CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import './Profile.css';

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
            id={`profile-tabpanel-${index}`}
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

const Profile: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const [tabValue, setTabValue] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        console.log('Profile update:', Object.fromEntries(formData));
        setIsEditing(false);
        // TODO: Implement profile update
    };

    return (
        <Box className="profile-page" sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, pb: 4 }}>
            {/* Header Card */}
            <Card sx={{ mb: 3, borderRadius: 3, overflow: 'visible', position: 'relative' }}>
                <Box sx={{
                    height: 200,
                    background: 'linear-gradient(120deg, #667eea 0%, #764ba2 100%)',
                }} />

                <Box sx={{
                    px: { xs: 2, md: 4 },
                    pb: 3,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'center', md: 'flex-end' },
                    mt: -8
                }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            sx={{
                                width: 140,
                                height: 140,
                                border: '4px solid white',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                bgcolor: '#ff9800',
                                fontSize: '3.5rem',
                                color: 'white'
                            }}
                        >
                            {user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <IconButton
                            sx={{
                                position: 'absolute',
                                bottom: 5,
                                right: 5,
                                bgcolor: 'white',
                                boxShadow: 2,
                                '&:hover': { bgcolor: 'grey.100' }
                            }}
                            size="small"
                        >
                            <PhotoCameraIcon fontSize="small" color="primary" />
                        </IconButton>
                    </Box>

                    <Box sx={{
                        ml: { md: 3 },
                        mt: { xs: 2, md: 0 },
                        textAlign: { xs: 'center', md: 'left' },
                        flexGrow: 1,
                        mb: 1
                    }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: { xs: 'text.primary', md: 'white' }, textShadow: { md: '0 2px 4px rgba(0,0,0,0.3)' } }}>
                            {user?.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            <Chip
                                label={user?.role === 'salon_owner' ? 'Salon Owner' : user?.role?.toUpperCase()}
                                color="primary"
                                size="small"
                                variant="filled"
                                sx={{ textTransform: 'capitalize', fontWeight: 600, boxShadow: 1 }}
                            />
                            <Typography variant="body2" sx={{ color: { xs: 'text.secondary', md: 'rgba(255,255,255,0.9)' }, fontWeight: 500 }}>
                                Member since {new Date().getFullYear()}
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant={isEditing ? "outlined" : "contained"}
                        startIcon={<EditIcon />}
                        onClick={() => setIsEditing(!isEditing)}
                        sx={{ mt: { xs: 2, md: 0 }, minWidth: 120, borderRadius: 2 }}
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                </Box>
            </Card>

            {/* Content Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
                    <Tab label="Personal Info" icon={<PersonIcon />} iconPosition="start" />
                    <Tab label="Security" icon={<SecurityIcon />} iconPosition="start" />
                    <Tab label="Preferences" icon={<NotificationsIcon />} iconPosition="start" />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                {/* Replaced Grid with Flex Box for layout stability */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>

                    {/* Left Column: Summary */}
                    <Box sx={{ width: { xs: '100%', md: '350px' }, flexShrink: 0 }}>
                        <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    Contact Information
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 3 }}>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Box sx={{ bgcolor: 'primary.lighter', p: 1.5, borderRadius: 2, color: 'primary.main', display: 'flex' }}>
                                            <EmailIcon />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Email Address</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.email}</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Box sx={{ bgcolor: 'secondary.lighter', p: 1.5, borderRadius: 2, color: 'secondary.main', display: 'flex' }}>
                                            <PhoneIcon />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Phone Number</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.phone || 'Not provided'}</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Box sx={{ bgcolor: 'success.lighter', p: 1.5, borderRadius: 2, color: 'success.main', display: 'flex' }}>
                                            <CalendarIcon />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Joined Date</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {new Date().toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Right Column: Edit Form */}
                    <Box sx={{ flex: 1 }}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Details
                                    </Typography>
                                </Box>

                                <Box component="form" onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Full Name"
                                                name="name"
                                                defaultValue={user?.name}
                                                fullWidth
                                                disabled={!isEditing}
                                                variant="outlined"
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Email Address"
                                                name="email"
                                                defaultValue={user?.email}
                                                fullWidth
                                                disabled
                                                variant="filled"
                                                sx={{ '& .MuiFilledInput-root': { borderRadius: 2 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Phone Number"
                                                name="phone"
                                                defaultValue={user?.phone}
                                                fullWidth
                                                disabled={!isEditing}
                                                variant="outlined"
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="User Role"
                                                defaultValue={user?.role}
                                                fullWidth
                                                disabled
                                                variant="filled"
                                                InputProps={{ style: { textTransform: 'capitalize' } }}
                                                sx={{ '& .MuiFilledInput-root': { borderRadius: 2 } }}
                                            />
                                        </Grid>

                                        {isEditing && (
                                            <Grid item xs={12}>
                                                <Divider sx={{ my: 2 }} />
                                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => setIsEditing(false)}
                                                        sx={{ borderRadius: 2, px: 3 }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        sx={{ borderRadius: 2, px: 4 }}
                                                    >
                                                        Save Changes
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <SecurityIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>Security Settings</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Password change and 2FA settings would go here.
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <NotificationsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>Preferences</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Notification and customization settings would go here.
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </TabPanel>
        </Box>
    );
};

export default Profile;
