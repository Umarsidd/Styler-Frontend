import axios, { AxiosInstance } from 'axios';

class StrapiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: import.meta.env.VITE_STRAPI_URL!,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000,
        });
    }

    /**
     * Get Home Page data (Hero, Featured sections)
     */
    async getHomePageData() {
        try {
            // Populate=* ensures we get media fields like images
            const response = await this.api.get('/home-page?populate=*');
            return response.data;
        } catch (error) {
            console.error('Error fetching home page data from Strapi:', error);
            return null;
        }
    }

    /**
     * Get all Articles (Blogs)
     */
    async getArticles() {
        try {
            const response = await this.api.get('/articles?populate=*&sort=publishedAt:desc');
            return response.data;
        } catch (error) {
            console.error('Error fetching articles from Strapi:', error);
            return [];
        }
    }

    /**
     * Get a single Article by Slug
     */
    async getArticleBySlug(slug: string) {
        try {
            const response = await this.api.get(`/articles?filters[slug][$eq]=${slug}&populate=*`);
            if (response.data.data && response.data.data.length > 0) {
                return response.data.data[0];
            }
            return null;
        } catch (error) {
            console.error(`Error fetching article with slug ${slug}:`, error);
            return null;
        }
    }

    /**
     * Helper to get full image URL from Strapi response
     */
    getImageUrl(image: any) {
        if (!image || !image.data || !image.data.attributes) return null;
        const url = image.data.attributes.url;
        const baseUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
        return url.startsWith('http') ? url : `${baseUrl}${url}`;
    }
}

export const strapiService = new StrapiService();
