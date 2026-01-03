import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { strapiService } from '../services/strapiService';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';

const MotionCard = motion(Card);

const Blog: React.FC = () => {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await strapiService.getArticles();
                if (data && data.data) {
                    setArticles(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch articles', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    return (
        <Box className="blog-page" sx={{ py: 8 }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
                        OUR BLOG
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: 800, mt: 1, mb: 2 }}>
                        Latest News & Tips
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                        Stay updated with the latest grooming trends, style guides, and salon news.
                    </Typography>
                </Box>

                {loading ? (
                    <Typography variant="body1" align="center">Loading articles...</Typography>
                ) : articles.length === 0 ? (
                    <Typography variant="body1" align="center">No articles found.</Typography>
                ) : (
                    <Grid container spacing={4}>
                        {articles.map((article: any, index: number) => {
                            const { title, description, publishedAt, coverImage, category } = article.attributes;
                            const imageUrl = strapiService.getImageUrl(coverImage);
                            const categoryName = category?.data?.attributes?.name || 'Grooming';

                            return (
                                <Grid size={{ xs: 12, md: 4 }} key={article.id}>
                                    <MotionCard
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        elevation={0}
                                        sx={{ height: '100%', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}
                                    >
                                        {imageUrl && (
                                            <Box
                                                sx={{
                                                    height: 240,
                                                    backgroundImage: `url(${imageUrl})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            />
                                        )}
                                        <CardContent sx={{ p: 3, flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Chip label={categoryName} size="small" color="primary" sx={{ borderRadius: '8px' }} />
                                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                                    <CalendarIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                    <Typography variant="caption">
                                                        {new Date(publishedAt).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                                                {title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                            }}>
                                                {description || 'Read more about this topic...'}
                                            </Typography>
                                        </CardContent>
                                    </MotionCard>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default Blog;
