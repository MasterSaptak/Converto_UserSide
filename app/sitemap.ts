import { MetadataRoute } from 'next';
import { PAYMENT_METHODS, CORRIDORS, SHOPPING_PLATFORMS, BANK_CARDS, SERVICES } from '@/lib/seo';

const SITE_URL = 'https://converto.saptech.online';

// All static public routes
const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changeFrequency: 'daily' as const },
  { path: '/about', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/services', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/support', priority: 0.6, changeFrequency: 'monthly' as const },
];

// Service landing pages
const SERVICE_ROUTES = Object.keys(SERVICES);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Static routes
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Service landing pages
  const serviceEntries: MetadataRoute.Sitemap = SERVICE_ROUTES.map((slug) => ({
    url: `${SITE_URL}/services/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Payment method pages
  const paymentEntries: MetadataRoute.Sitemap = PAYMENT_METHODS.map((method) => ({
    url: `${SITE_URL}/payments/${method.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Country corridor pages
  const countryEntries: MetadataRoute.Sitemap = CORRIDORS.map((route) => ({
    url: `${SITE_URL}/payments/corridors/${route.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Shopping pages
  const shoppingEntries: MetadataRoute.Sitemap = SHOPPING_PLATFORMS.map((platform) => ({
    url: `${SITE_URL}/shopping/${platform.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Offer pages (from bank offers)
  const offerEntries: MetadataRoute.Sitemap = BANK_CARDS.map((offer) => ({
    url: `${SITE_URL}/offers/${offer.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...serviceEntries,
    ...paymentEntries,
    ...countryEntries,
    ...shoppingEntries,
    ...offerEntries,
  ];
}
