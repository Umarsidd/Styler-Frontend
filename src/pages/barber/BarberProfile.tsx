import React, { useState } from 'react';
import {
    Box,
    Typography,
    Container,
    Avatar,
    Button,
    Grid,
    Paper,
    TextField,
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
    Person as PersonIcon,
    VerifiedUser as VerifiedIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    ContentCut as ScissorsIcon,
    Star as StarIcon,
    WorkHistory as WorkIcon,
    Close as CloseIcon,
    Verified as VerifiedBadgeIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import userService from '../../services/userService';
import CountUp from 'react-countup';

const BarberProfile: React.FC = () => {
    const { user, updateUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Mock stats for barber
    const stats = [
        { label: 'Total Clients', value: 142, icon: <PersonIcon /> },
        { label: 'Avg Rating', value: 4.8, icon: <StarIcon />, isDecimals: true },
        { label: 'Years Exp.', value: 3, icon: <WorkIcon /> },
    ];

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const updates = {
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
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
                background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                pb: 6,
                overflow: 'hidden'
            }}>
                {/* Decorative circles */}
                <Box sx={{ position: 'absolute', top: -100, right: -50, width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />
                <Box sx={{ position: 'absolute', bottom: -30, left: 100, width: 150, height: 150, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.02)' }} />

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
                                        bgcolor: '#475569',
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
                                        {user?.name || 'Stylist'}
                                    </Typography>
                                    <Tooltip title="Verified Stylist">
                                        <VerifiedBadgeIcon sx={{ color: '#4ade80', fontSize: 28 }} />
                                    </Tooltip>
                                </Box>
                                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {user?.email}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                    <Chip
                                        icon={<ScissorsIcon sx={{ fontSize: '1.2rem !important' }} />}
                                        label="Professional Barber"
                                        sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 600, '& .MuiChip-icon': { color: 'white' } }}
                                    />
                                    <Chip
                                        label="Top Rated"
                                        sx={{ bgcolor: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', fontWeight: 600, border: '1px solid rgba(251, 191, 36, 0.3)' }}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 2 }}>
                {/* Stats Cards */}
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
                                    border: '1px solid rgba(0,0,0,0.02)',
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'translateY(-4px)' }
                                }}
                            >
                                <Box sx={{ p: 2, bgcolor: '#f1f5f9', borderRadius: '16px', color: '#334155' }}>
                                    {stat.icon}
                                </Box>
                                <Box>
                                    <Typography variant="h4" fontWeight={800} color="#1e293b">
                                        <CountUp end={stat.value} duration={2} decimals={stat.isDecimals ? 1 : 0} />
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

                {/* Edit Profile Section */}
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
                                Personal Details
                            </Typography>
                            <Typography variant="body2" color="#64748b">
                                Manage your profile information
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
                            {isEditing ? 'Cancel' : 'Edit Details'}
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

export default BarberProfile;
