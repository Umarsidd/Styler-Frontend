import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Avatar,
    Button,
    Grid,
    Paper,
    TextField,
    Divider,
    IconButton,
    InputAdornment,
    CircularProgress,
    Alert,
    Tooltip,
    Chip
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    PhotoCamera as PhotoCameraIcon,
    Store as StoreIcon,
    Group as GroupIcon,
    CalendarMonth as CalendarIcon,
    VerifiedUser as VerifiedIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { useSalonStore } from '../../stores/salonStore';
import userService from '../../services/userService';
import CountUp from 'react-countup';

const SalonOwnerProfile: React.FC = () => {
    const { user, updateUser } = useAuthStore();
    const { mySalons, fetchMySalons } = useSalonStore();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMySalons();
    }, [fetchMySalons]);

    const stats = [
        { label: 'Total Salons', value: mySalons.length, icon: <StoreIcon /> },
        { label: 'Total Staff', value: 12, icon: <GroupIcon /> }, // Mocked for now, or aggregate from salons
        { label: 'Years Active', value: 2, icon: <CalendarIcon /> },
    ];

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const updates = {
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            // Add business specific fields if backend supports
        };

        try {
            const response = await userService.updateProfile(updates);
            if (response.success && response.data) {
                updateUser(response.data);
                setSuccess('Profile updated successfully!');
                setIsEditing(false);
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const response = await userService.uploadProfilePicture(file);
            if (response.success && response.data) {
                updateUser({ profilePicture: response.data.profilePicture });
                setSuccess('Profile picture updated!');
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            setError('Failed to upload image');
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 8 }}>
            {/* Premium Header / Cover */}
            <Box sx={{
                height: 320,
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                pb: 6
            }}>
                {/* Decorative circles */}
                <Box sx={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />
                <Box sx={{ position: 'absolute', top: 50, left: 100, width: 100, height: 100, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.02)' }} />

                <Container maxWidth="lg">
                    <Grid container alignItems="flex-end" spacing={4}>
                        <Grid>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={user?.profilePicture}
                                    sx={{
                                        width: 160,
                                        height: 160,
                                        border: '6px solid white',
                                        boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
                                        bgcolor: '#334155',
                                        fontSize: '4rem',
                                        fontWeight: 700
                                    }}
                                >
                                    {user?.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    id="avatar-upload"
                                    onChange={handleAvatarUpload}
                                />
                                <Tooltip title="Change Photo">
                                    <IconButton
                                        component="label"
                                        htmlFor="avatar-upload"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            right: 8,
                                            bgcolor: 'white',
                                            color: '#1e293b',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            '&:hover': { bgcolor: '#f1f5f9' }
                                        }}
                                    >
                                        <PhotoCameraIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                        <Grid size="grow">
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Typography variant="h3" fontWeight={800} sx={{ color: 'white' }}>
                                        {user?.name || 'Salon Owner'}
                                    </Typography>
                                    <Tooltip title="Verified Owner">
                                        <VerifiedIcon sx={{ color: '#4ade80', fontSize: 28 }} />
                                    </Tooltip>
                                </Box>
                                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                                    {user?.email}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                    <Chip label="Salon Partner" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 600 }} />
                                    <Chip label="Premium Member" sx={{ bgcolor: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', fontWeight: 600, border: '1px solid rgba(251, 191, 36, 0.3)' }} />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 2 }}>
                {/* Business Stats */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {stats.map((stat, index) => (
                        <Grid size={{ xs: 12, sm: 4 }} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: '20px',
                                    bgcolor: 'white',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 3,
                                    border: '1px solid rgba(0,0,0,0.02)'
                                }}
                            >
                                <Box sx={{ p: 2, bgcolor: '#f1f5f9', borderRadius: '16px', color: '#334155' }}>
                                    {stat.icon}
                                </Box>
                                <Box>
                                    <Typography variant="h4" fontWeight={800} color="#1e293b">
                                        <CountUp end={stat.value} duration={2} />
                                    </Typography>
                                    <Typography variant="body2" color="#64748b" fontWeight={600}>
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {(success || error) && (
                    <Alert
                        severity={success ? "success" : "error"}
                        sx={{ mb: 3, borderRadius: '12px' }}
                        onClose={() => { setSuccess(null); setError(null); }}
                    >
                        {success || error}
                    </Alert>
                )}

                {/* Edit Section */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: '24px',
                        bgcolor: 'white',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box>
                            <Typography variant="h5" fontWeight={800} color="#1e293b">
                                Profile Details
                            </Typography>
                            <Typography variant="body2" color="#64748b">
                                Manage your personal information and contact details
                            </Typography>
                        </Box>
                        <Button
                            variant={isEditing ? 'outlined' : 'contained'}
                            color={isEditing ? 'error' : 'primary'}
                            startIcon={isEditing ? <CloseIcon /> : <EditIcon />}
                            onClick={() => setIsEditing(!isEditing)}
                            sx={{
                                borderRadius: '12px',
                                px: 3,
                                py: 1,
                                fontWeight: 700,
                                textTransform: 'none',
                                bgcolor: isEditing ? 'white' : '#1e293b',
                                color: isEditing ? '#ef4444' : 'white',
                                borderColor: '#ef4444',
                                '&:hover': {
                                    bgcolor: isEditing ? '#fef2f2' : '#334155'
                                }
                            }}
                        >
                            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                        </Button>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#64748b' }}>
                                    Full Name
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="name"
                                    defaultValue={user?.name}
                                    disabled={!isEditing}
                                    placeholder="Enter your name"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>,
                                        sx: { borderRadius: '12px', bgcolor: isEditing ? 'white' : '#f8fafc' }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#64748b' }}>
                                    Email Address
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="email"
                                    value={user?.email}
                                    disabled
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>,
                                        sx: { borderRadius: '12px', bgcolor: '#f8fafc' } // Always disabled style
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#64748b' }}>
                                    Phone Number
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="phone"
                                    defaultValue={user?.phone}
                                    disabled={!isEditing}
                                    placeholder="+91 00000 00000"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><PhoneIcon color="action" /></InputAdornment>,
                                        sx: { borderRadius: '12px', bgcolor: isEditing ? 'white' : '#f8fafc' }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#64748b' }}>
                                    Primary Business Location
                                </Typography>
                                <TextField
                                    fullWidth
                                    disabled
                                    value={mySalons[0]?.address?.city || 'No Location Set'}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><BusinessIcon color="action" /></InputAdornment>,
                                        sx: { borderRadius: '12px', bgcolor: '#f8fafc' }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        {isEditing && (
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                    sx={{
                                        borderRadius: '12px',
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 700,
                                        bgcolor: '#1e293b',
                                        '&:hover': { bgcolor: '#334155' }
                                    }}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Box>
                        )}
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default SalonOwnerProfile;
