import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Grid, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    ExpandMore as ExpandMoreIcon,
    CheckCircle as CheckIcon,
    AccessTime as TimeIcon,
    AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { servicesData } from '../data/services';
import './ServiceDetails.css';

const ServiceDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const service = servicesData.find(s => s.slug === id);

    if (!service) {
        return (
            <Container sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>Service Not Found</Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/services')}>
                    Back to Services
                </Button>
            </Container>
        );
    }

    return (
        <Box className="service-details-page">
            {/* Hero Section */}
            <Box className="service-details-hero" sx={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${service.image})` }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            p: 1.5,
                            borderRadius: '50%',
                            display: 'flex',
                            backdropFilter: 'blur(4px)'
                        }}>
                            {React.cloneElement(service.icon as React.ReactElement, { sx: { fontSize: 40, color: 'white' } })}
                        </Box>
                        <Typography variant="h1" sx={{ color: 'white', fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800 }}>
                            {service.title}
                        </Typography>
                    </Box>
                    <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.9)', maxWidth: 800 }}>
                        {service.shortDescription}
                    </Typography>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={6}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        {/* Overview */}
                        <Box sx={{ mb: 6 }}>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Overview</Typography>
                            <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'text.secondary', lineHeight: 1.8 }}>
                                {service.longDescription}
                            </Typography>
                        </Box>

                        {/* Benefits */}
                        <Box sx={{ mb: 6 }}>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Benefits</Typography>
                            <Grid container spacing={2}>
                                {service.benefits.map((benefit, index) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={index}>
                                        <Box sx={{ display: 'flex', gap: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                            <CheckIcon sx={{ color: 'success.main' }} />
                                            <Typography>{benefit}</Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        {/* Process */}
                        <Box sx={{ mb: 6 }}>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Our Process</Typography>
                            <Box className="process-timeline">
                                {service.process.map((step, index) => (
                                    <Box key={index} className="process-step">
                                        <Box className="step-number">{index + 1}</Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{step.title}</Typography>
                                            <Typography color="text.secondary">{step.description}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* FAQs */}
                        <Box>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Frequently Asked Questions</Typography>
                            {service.faqs.map((faq, index) => (
                                <Accordion key={index} elevation={0} sx={{
                                    mb: 2,
                                    bgcolor: 'transparent',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    '&:before': { display: 'none' }
                                }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>{faq.question}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography color="text.secondary">{faq.answer}</Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>
                    </Grid>

                    {/* Sidebar */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{
                            position: 'sticky',
                            top: 24,
                            p: 4,
                            bgcolor: 'white',
                            borderRadius: 4,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                            border: '1px solid',
                            borderColor: 'divider'
                        }}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>Service Details</Typography>

                            <List sx={{ mb: 3 }}>
                                <ListItem disableGutters>
                                    <ListItemIcon><MoneyIcon color="primary" /></ListItemIcon>
                                    <ListItemText
                                        primary="Price"
                                        secondary={<Typography variant="h6" color="primary.main" fontWeight="700">{service.price}</Typography>}
                                    />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon><TimeIcon color="primary" /></ListItemIcon>
                                    <ListItemText
                                        primary="Duration"
                                        secondary={service.duration}
                                    />
                                </ListItem>
                            </List>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>Includes:</Typography>
                                {service.features.map((feature, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <CheckIcon sx={{ fontSize: 18, color: 'success.main' }} />
                                        <Typography variant="body2">{feature}</Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={() => navigate('/salons')}
                                sx={{ py: 2, fontSize: '1.1rem', fontWeight: 600 }}
                            >
                                Book Now
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ServiceDetails;
