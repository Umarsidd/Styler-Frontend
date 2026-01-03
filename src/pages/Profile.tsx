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

        // Build address object from form fields
        const street = formData.get('street') as string;
        const city = formData.get('city') as string;
        const state = formData.get('state') as string;
        const pincode = formData.get('pincode') as string;
        const country = formData.get('country') as string;

        // Only include address if at least one field is filled
        const address = (street || city || state || pincode) ? {
            street: street || '',
            city: city || '',
            state: state || '',
            pincode: pincode || '',
            country: country || 'India',
        } : undefined;

        try {
            setLoading(true);
            const response = await userService.updateProfile({ name, phone, address });

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

                {/* Main Content - Combined Contact & Profile Details */}
                <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                            Profile & Contact Information
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit}>
                            <Grid container spacing={3}>

                                {/* Email - Read Only (No Icon) */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Email Address"
                                        name="email"
                                        value={user?.email}
                                        fullWidth
                                        disabled
                                        variant="filled"
                                        helperText="Email cannot be changed"
                                    />
                                </Grid>

                                {/* Full Name - Editable */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Full Name"
                                        name="name"
                                        defaultValue={user?.name}
                                        fullWidth
                                        disabled={!isEditing}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                                            ),
                                        }}
                                    />
                                </Grid>

                                {/* Phone Number - Editable */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Phone Number"
                                        name="phone"
                                        defaultValue={user?.phone}
                                        fullWidth
                                        disabled={!isEditing}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                                            ),
                                        }}
                                    />
                                </Grid>

                                {/* Street Address */}
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        label="Street Address"
                                        name="street"
                                        defaultValue={user?.addresses?.[0]?.street || ''}
                                        fullWidth
                                        disabled={!isEditing}
                                        variant="outlined"
                                        placeholder="Enter your street address"
                                    />
                                </Grid>

                                {/* City */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="City"
                                        name="city"
                                        defaultValue={user?.addresses?.[0]?.city || ''}
                                        fullWidth
                                        disabled={!isEditing}
                                        variant="outlined"
                                        placeholder="Enter city"
                                    />
                                </Grid>

                                {/* State */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="State"
                                        name="state"
                                        defaultValue={user?.addresses?.[0]?.state || ''}
                                        fullWidth
                                        disabled={!isEditing}
                                        variant="outlined"
                                        placeholder="Enter state"
                                    />
                                </Grid>

                                {/* Pincode */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Pincode"
                                        name="pincode"
                                        defaultValue={user?.addresses?.[0]?.pincode || ''}
                                        fullWidth
                                        disabled={!isEditing}
                                        variant="outlined"
                                        placeholder="Enter pincode"
                                    />
                                </Grid>

                                {/* Country */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Country"
                                        name="country"
                                        defaultValue={user?.addresses?.[0]?.country || 'India'}
                                        fullWidth
                                        disabled={!isEditing}
                                        variant="outlined"
                                        placeholder="Enter country"
                                    />
                                </Grid>

                            </Grid>

                            {/* Action Buttons - Outside Grid, Bottom Right */}
                            {isEditing && (
                                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
                                </Box>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default Profile;
