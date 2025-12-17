import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://your-secret-santa-app.vercel.app' // Update this after deployment

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/group/*/reveal/*', // Prevent crawling of reveal pages
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
