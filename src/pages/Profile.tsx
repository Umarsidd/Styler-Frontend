import React from 'react';
import { Box, Card, CardContent, TextField, Button, Avatar, Typography } from '@mui/material';
import { Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import './Profile.css';

const Profile: React.FC = () => {
    const user = useAuthStore((state) => state.user);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        console.log('Profile update:', Object.fromEntries(formData));
        // TODO: Implement profile update
    };

    return (
        <Box className="profile-page">
            <Card className="profile-card" sx={{ maxWidth: 600, mx: 'auto' }}>
                <Box className="profile-header" sx={{ textAlign: 'center', p: 4 }}>
                    <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}>
                        <PersonIcon sx={{ fontSize: 60 }} />
                    </Avatar>
                    <Typography variant="h4">{user?.name}</Typography>
                    <Typography variant="body1" color="text.secondary">
                        {user?.email}
                    </Typography>
                </Box>

                <CardContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="Name"
                            name="name"
                            defaultValue={user?.name}
                            fullWidth
                            InputProps={{
                                startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />,
                            }}
                        />

                        <TextField
                            label="Email"
                            name="email"
                            defaultValue={user?.email}
                            fullWidth
                            disabled
                            InputProps={{
                                startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
                            }}
                        />

                        <TextField
                            label="Phone"
                            name="phone"
                            defaultValue={user?.phone}
                            fullWidth
                            InputProps={{
                                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />,
                            }}
                        />

                        <Button type="submit" variant="contained" size="large" fullWidth>
                            Update Profile
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Profile;
