import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { useAdminStore } from '../../stores/adminStore';
import adminService from '../../services/adminService';

const UsersManagement: React.FC = () => {
    const { users, usersTotal, loading, error, fetchUsers, clearError } = useAdminStore();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [newRole, setNewRole] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadUsers();
    }, [page, rowsPerPage, roleFilter]);

    const loadUsers = () => {
        fetchUsers({
            page: page + 1,
            limit: rowsPerPage,
            search,
            role: roleFilter || undefined,
        });
    };

    const handleSearch = () => {
        setPage(0);
        loadUsers();
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleChangeRole = () => {
        setNewRole(selectedUser?.role || '');
        setRoleDialogOpen(true);
        handleMenuClose();
    };

    const handleToggleStatus = async () => {
        if (!selectedUser) return;

        setActionLoading(true);
        try {
            await adminService.toggleUserStatus(selectedUser._id, !selectedUser.isActive);
            loadUsers();
            handleMenuClose();
        } catch (err: any) {
            console.error('Error toggling user status:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser || !window.confirm('Are you sure you want to delete this user?')) return;

        setActionLoading(true);
        try {
            await adminService.deleteUser(selectedUser._id);
            loadUsers();
            handleMenuClose();
        } catch (err: any) {
            console.error('Error deleting user:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleSaveRole = async () => {
        if (!selectedUser || !newRole) return;

        setActionLoading(true);
        try {
            await adminService.updateUserRole(selectedUser._id, newRole);
            loadUsers();
            setRoleDialogOpen(false);
        } catch (err: any) {
            console.error('Error updating user role:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'superadmin':
                return 'error';
            case 'salon_owner':
                return 'primary';
            case 'customer':
                return 'success';
            default:
                return 'default';
        }
    };

    return (
        <Box>
            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Users Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage all users on the platform
                </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Filters */}
            <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            sx={{ flexGrow: 1, minWidth: 200 }}
                            size="small"
                        />

                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={roleFilter}
                                label="Role"
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="customer">Customer</MenuItem>
                                <MenuItem value="salon_owner">Salon Owner</MenuItem>
                                <MenuItem value="superadmin">Super Admin</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            startIcon={<SearchIcon />}
                            onClick={handleSearch}
                        >
                            Search
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">No users found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user._id} hover>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role.replace('_', ' ')}
                                                color={getRoleBadgeColor(user.role)}
                                                size="small"
                                                sx={{ textTransform: 'capitalize' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.isActive ? 'Active' : 'Inactive'}
                                                color={user.isActive ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                onClick={(e) => handleMenuOpen(e, user)}
                                                size="small"
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={usersTotal}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </Card>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleChangeRole}>Change Role</MenuItem>
                <MenuItem onClick={handleToggleStatus}>
                    {selectedUser?.isActive ? 'Deactivate' : 'Activate'}
                </MenuItem>
                <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
                    Delete User
                </MenuItem>
            </Menu>

            {/* Change Role Dialog */}
            <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)}>
                <DialogTitle>Change User Role</DialogTitle>
                <DialogContent sx={{ minWidth: 300, pt: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={newRole}
                            label="Role"
                            onChange={(e) => setNewRole(e.target.value)}
                        >
                            <MenuItem value="customer">Customer</MenuItem>
                            <MenuItem value="salon_owner">Salon Owner</MenuItem>
                            <MenuItem value="superadmin">Super Admin</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleSaveRole}
                        variant="contained"
                        disabled={actionLoading || !newRole}
                    >
                        {actionLoading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UsersManagement;
