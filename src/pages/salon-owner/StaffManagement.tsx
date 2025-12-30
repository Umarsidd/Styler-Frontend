import React from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import './StaffManagement.css';

const StaffManagement: React.FC = () => {
    return (
        <Box className="customer-dashboard">
            <Container maxWidth="lg">
                <Typography variant="h1" gutterBottom>
                    Staff Management
                </Typography>

                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h5">Team Members</Typography>
                            <Button variant="contained">Add Staff</Button>
                        </Box>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            No staff members found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default StaffManagement;
