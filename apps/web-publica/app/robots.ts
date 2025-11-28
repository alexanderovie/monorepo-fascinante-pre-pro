import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://fascinantedigital.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Only block API routes, allow all Next.js resources (_next/) for proper rendering
      disallow: ['/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

