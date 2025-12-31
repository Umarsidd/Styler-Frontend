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
    Stack,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Edit as EditIcon,
    PhotoCamera as PhotoCameraIcon,
    Badge as BadgeIcon,
    CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import userService from '../services/userService';
import './Profile.css';

const Profile: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const updateUser = useAuthStore((state) => state.updateUser);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccess(false);

        const formData = new FormData(event.currentTarget);
        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;

        try {
            setLoading(true);
            const response = await userService.updateProfile({ name, phone });

            if (response.success && response.data) {
                updateUser(response.data);
                setSuccess(true);
                setIsEditing(false);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return;
        }

        try {
            setUploading(true);
            setError(null);
            const response = await userService.uploadProfilePicture(file);

            if (response.success && response.data) {
                updateUser({ profilePicture: response.data.profilePicture });
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upload profile picture');
        } finally {
            setUploading(false);
            // Reset file input
            event.target.value = '';
        }
    };

    const handleCoverImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return;
        }

        try {
            setUploading(true);
            setError(null);
            const response = await userService.uploadCoverImage(file);

            if (response.success && response.data) {
                updateUser({ coverImage: response.data.coverImage });
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upload cover image');
        } finally {
            setUploading(false);
            // Reset file input
            event.target.value = '';
        }
    };

    const getRoleDisplay = (role: string | undefined) => {
        if (!role) return 'User';
        if (role === 'salon_owner') return 'Salon Owner';
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
            <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 3 } }}>

                {/* Success/Error Alerts */}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Profile updated successfully!
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Header Card with Banner */}
                <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    {/* Banner */}
                    <Box sx={{
                        height: 180,
                        background: user?.coverImage
                            ? `url(${user.coverImage}) center/cover no-repeat`
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        position: 'relative'
                    }}>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            id="cover-image-upload"
                            onChange={handleCoverImageSelect}
                        />
                        <IconButton
                            component="label"
                            htmlFor="cover-image-upload"
                            disabled={uploading}
                            sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                bgcolor: 'rgba(0,0,0,0.3)',
                                color: 'white',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
                                backdropFilter: 'blur(4px)'
                            }}
                        >
                            {uploading ? <CircularProgress size={24} color="inherit" /> : <PhotoCameraIcon />}
                        </IconButton>
                    </Box>

                    {/* Profile Info */}
                    <Box sx={{ px: { xs: 2, md: 4 }, pb: 3, mt: -9 }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'center', sm: 'flex-end' },
                            gap: 3
                        }}>
                            {/* Avatar */}
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={user?.profilePicture}
                                    sx={{
                                        width: 150,
                                        height: 150,
                                        border: '5px solid white',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        bgcolor: '#ff9800',
                                        fontSize: '4rem',
                                        fontWeight: 700
                                    }}
                                >
                                    {!user?.profilePicture && user?.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    id="profile-picture-upload"
                                    onChange={handleFileSelect}
                                />
                                <IconButton
                                    component="label"
                                    htmlFor="profile-picture-upload"
                                    disabled={uploading}
                                    sx={{
                                        position: 'absolute',
                                        bottom: 8,
                                        right: 8,
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'primary.dark' },
                                        boxShadow: 2
                                    }}
                                    size="small"
                                >
                                    {uploading ? <CircularProgress size={20} color="inherit" /> : <PhotoCameraIcon fontSize="small" />}
                                </IconButton>
                            </Box>

                            {/* Name and Info */}
                            <Box sx={{
                                flex: 1,
                                textAlign: { xs: 'center', sm: 'left' },
                                pb: 1
                            }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                    {user?.name}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: 'center', sm: 'flex-start' }, mb: 1 }}>
                                    <Chip
                                        icon={<BadgeIcon />}
                                        label={getRoleDisplay(user?.role)}
                                        color="primary"
                                        size="small"
                                        sx={{ fontWeight: 600 }}
                                    />
                                    <Chip
                                        icon={<CalendarIcon />}
                                        label={`Joined ${new Date().getFullYear()}`}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    {user?.email}
                                </Typography>
                            </Box>

                            {/* Edit Button */}
                            <Button
                                variant={isEditing ? "outlined" : "contained"}
                                startIcon={<EditIcon />}
                                onClick={() => setIsEditing(!isEditing)}
                                size="large"
                                sx={{
                                    minWidth: 140,
                                    borderRadius: 2,
                                    mb: 1
                                }}
                            >
                                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                            </Button>
                        </Box>
                    </Box>
                </Card>

                {/* Main Content */}
                <Grid container spacing={3}>

                    {/* Left Sidebar - Contact Info */}
                    <Grid item xs={12} sm={4} md={4}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                    Contact Information
                                </Typography>

                                <Stack spacing={3}>
                                    {/* Email */}
                                    <Box>
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                                            <Box sx={{
                                                bgcolor: 'primary.lighter',
                                                color: 'primary.main',
                                                p: 1,
                                                borderRadius: 1.5,
                                                display: 'flex'
                                            }}>
                                                <EmailIcon fontSize="small" />
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                EMAIL ADDRESS
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ pl: 5, fontWeight: 500 }}>
                                            {user?.email}
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    {/* Phone */}
                                    <Box>
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                                            <Box sx={{
                                                bgcolor: 'success.lighter',
                                                color: 'success.main',
                                                p: 1,
                                                borderRadius: 1.5,
                                                display: 'flex'
                                            }}>
                                                <PhoneIcon fontSize="small" />
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                PHONE NUMBER
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ pl: 5, fontWeight: 500 }}>
                                            {user?.phone || 'Not provided'}
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    {/* Role */}
                                    <Box>
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                                            <Box sx={{
                                                bgcolor: 'warning.lighter',
                                                color: 'warning.main',
                                                p: 1,
                                                borderRadius: 1.5,
                                                display: 'flex'
                                            }}>
                                                <BadgeIcon fontSize="small" />
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                USER ROLE
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ pl: 5, fontWeight: 500, textTransform: 'capitalize' }}>
                                            {getRoleDisplay(user?.role)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right Content - Profile Details */}
                    <Grid item xs={12} sm={8} md={8}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                    Profile Details
                                </Typography>

                                <Box component="form" onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Full Name"
                                                name="name"
                                                defaultValue={user?.name}
                                                fullWidth
                                                disabled={!isEditing}
                                                variant="outlined"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Email Address"
                                                name="email"
                                                defaultValue={user?.email}
                                                fullWidth
                                                disabled
                                                variant="filled"
                                                helperText="Email cannot be changed"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Phone Number"
                                                name="phone"
                                                defaultValue={user?.phone}
                                                fullWidth
                                                disabled={!isEditing}
                                                variant="outlined"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="User Role"
                                                defaultValue={getRoleDisplay(user?.role)}
                                                fullWidth
                                                disabled
                                                variant="filled"
                                            />
                                        </Grid>

                                        {isEditing && (
                                            <Grid item xs={12}>
                                                <Divider sx={{ my: 1 }} />
                                                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => setIsEditing(false)}
                                                        size="large"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        size="large"
                                                        disabled={loading}
                                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
                                                    >
                                                        {loading ? 'Saving...' : 'Save Changes'}
                                                    </Button>
                                                </Stack>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Profile;
