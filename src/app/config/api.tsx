export const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.summitcodeworks.com',
    endpoints: {
        contact: '/api/contact',
        policy: '/app-policy',
        terms: '/app-terms'
    }
} as const;
