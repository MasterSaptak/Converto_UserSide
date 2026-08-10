import { MetadataRoute } from 'next';

const SITE_URL = 'https://converto.saptech.online';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/services/',
          '/services/*',
          '/payments/',
          '/payments/*',
          '/offers/',
          '/offers/*',
          '/exchange/',
          '/exchange/*',
          '/buy-for-me/',
          '/buy-for-me/*',
          '/education/',
          '/education/*',
          '/medical/',
          '/medical/*',
          '/tickets/',
          '/tickets/*',
          '/guides/',
          '/guides/*',
          '/support/',
        ],
        disallow: [
          '/dashboard',
          '/profile',
          '/profile/*',
          '/history',
          '/history/*',
          '/checkout',
          '/checkout/*',
          '/admin',
          '/admin/*',
          '/api',
          '/api/*',
          '/auth',
          '/auth/*',
          '/login',
          '/signup',
          '/forgot-password',
          '/reset-password',
          '/insta-order',
          '/insta-order/*',
          '/user',
          '/user/*',
          '/track',
          '/track/*',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
