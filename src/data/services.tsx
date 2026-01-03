import React from 'react';
import {
    ContentCut as ScissorsIcon,
    Face as FaceIcon,
    Spa as SpaIcon,
    Palette as PaletteIcon,
} from '@mui/icons-material';

export interface ServiceData {
    id: string;
    slug: string;
    icon: React.ReactNode;
    title: string;
    shortDescription: string;
    longDescription: string;
    price: string;
    duration: string;
    popular: boolean;
    features: string[];
    benefits: string[];
    process: { title: string; description: string }[];
    faqs: { question: string; answer: string }[];
    image: string;
}

export const servicesData: ServiceData[] = [
    {
        id: '1',
        slug: 'hair-cutting-styling',
        icon: <ScissorsIcon />,
        title: 'Hair Cutting & Styling',
        shortDescription: 'Expert cuts and modern styles tailored to your personality',
        longDescription: 'Our expert stylists are trained in the latest techniques to provide you with a haircut that perfectly suits your face shape and lifestyle. We begin with a thorough consultation to understand your preferences, followed by a relaxing wash, precision cut, and professional styling.',
        price: 'From ₹500',
        duration: '45 min',
        popular: true,
        features: ['Consultation', 'Wash & Dry', 'Styling', 'Product Recommendations'],
        benefits: [
            'Look your best with a style that suits you',
            'Maintain healthy hair with regular trims',
            'Relax and unwind in our comfortable chairs',
            'Get expert advice on hair care'
        ],
        process: [
            { title: 'Consultation', description: 'Brief discussion about your desired look' },
            { title: 'Wash', description: 'Refreshing shampoo and conditioning' },
            { title: 'Cut', description: 'Precision cutting using advanced techniques' },
            { title: 'Style', description: 'Blow-dry and styling with premium products' }
        ],
        faqs: [
            { question: 'How often should I get a haircut?', answer: 'We recommend every 3-4 weeks to maintain your style.' },
            { question: 'Do you wash hair before cutting?', answer: 'Yes, a wash is included to ensure a clean and precise cut.' }
        ],
        image: '/images/mens-haircut.png' // You might need to adjust this path based on available images
    },
    {
        id: '2',
        slug: 'beard-grooming',
        icon: <FaceIcon />,
        title: 'Beard Grooming',
        shortDescription: 'Professional beard trimming, shaping, and grooming',
        longDescription: 'Maintain a sharp and well-groomed beard with our professional services. Whether you want a simple trim or a complete reshape, our barbers use hot towels, precise trimmers, and premium beard oils to leave your beard looking and feeling its best.',
        price: 'From ₹300',
        duration: '30 min',
        popular: true,
        features: ['Trim & Shape', 'Hot Towel', 'Aftercare', 'Beard Oil Application'],
        benefits: [
            'Tame unruly facial hair',
            'Define your jawline',
            'Hydrate your skin and beard',
            'Experience a classic barber shop ritual'
        ],
        process: [
            { title: 'Consultation', description: 'Assess your beard growth and desired shape' },
            { title: 'Trim', description: 'Length reduction and shaping' },
            { title: 'Hot Towel', description: 'To open pores and soften hair' },
            { title: 'Detailing', description: 'Razor line-up for sharp edges' }
        ],
        faqs: [
            { question: 'Does this include a shave?', answer: 'This service focuses on the beard itself. A full shave is a separate service.' },
            { question: 'What products do you use?', answer: 'We use high-quality beard oils and balms to nourish your beard.' }
        ],
        image: '/images/beard-grooming.png'
    },
    {
        id: '3',
        slug: 'hair-coloring',
        icon: <PaletteIcon />,
        title: 'Hair Coloring',
        shortDescription: 'Premium coloring with top-quality products',
        longDescription: 'Transform your look with our professional hair coloring services. From covering greys to a complete color change, we use premium, ammonia-free products that protect your hair while delivering vibrant, long-lasting color.',
        price: 'From ₹2000',
        duration: '120 min',
        popular: false,
        features: ['Color Consultation', 'Application', 'Treatment', 'Styling'],
        benefits: [
            'Refresh your look completely',
            'Cover grey hairs effectively',
            'Add depth and dimension to your hair',
            'Use safe and high-quality colors'
        ],
        process: [
            { title: 'Consultation', description: 'Color selection and skin test' },
            { title: 'Protection', description: 'Protecting your skin and clothing' },
            { title: 'Application', description: 'Careful application of color' },
            { title: 'Rinse & Style', description: 'Washing out color and final styling' }
        ],
        faqs: [
            { question: 'Is the color permanent?', answer: 'We offer both permanent and semi-permanent options based on your preference.' },
            { question: 'Will it damage my hair?', answer: 'We use high-quality products with conditioning agents to minimize damage.' }
        ],
        image: '/images/womens-styling.png'
    },
    {
        id: '4',
        slug: 'spa-facial',
        icon: <SpaIcon />,
        title: 'Spa & Facial',
        shortDescription: 'Relaxing spa treatments for glowing skin',
        longDescription: 'Rejuvenate your skin and relax your mind with our spa and facial treatments. We customized our facials to suit your skin type, using gentle yet effective products to cleanse, exfoliate, and hydrate.',
        price: 'From ₹1500',
        duration: '60 min',
        popular: false,
        features: ['Deep Cleanse', 'Massage', 'Mask', 'Steam'],
        benefits: [
            'Deeply cleanse and unclog pores',
            'Improve skin texture and tone',
            'Relax facial muscles',
            'Reduce stress and anxiety'
        ],
        process: [
            { title: 'Analysis', description: 'Skin type assessment' },
            { title: 'Cleanse', description: 'Removal of dirt and oil' },
            { title: 'Exfoliate', description: 'Removal of dead skin cells' },
            { title: 'Mask & Massage', description: 'Nourish skin and relax muscles' }
        ],
        faqs: [
            { question: 'Is this suitable for sensitive skin?', answer: 'Yes, we have specific products designed for sensitive skin.' },
            { question: 'How long do the results last?', answer: 'You will see immediate results, which can last for several days to a week.' }
        ],
        image: '/images/spa-facial.png'
    },
];
