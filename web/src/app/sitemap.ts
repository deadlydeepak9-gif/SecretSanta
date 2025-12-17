import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://your-secret-santa-app.vercel.app' // Update this after deployment

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        // We intentionally do not list dynamic group pages in the sitemap 
        // to avoid search engines crawling private groups.
    ]
}
