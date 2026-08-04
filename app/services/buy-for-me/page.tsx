import { Metadata } from 'next';
import { ServiceLandingLayout } from '@/modules/service-engine/components/ServiceLandingLayout';
import { ServiceRegistry } from '@/modules/service-engine/configs';

const SERVICE_ID = 'buy-for-me';

export function generateMetadata(): Metadata {
  const config = ServiceRegistry.get(SERVICE_ID);
  if (!config) return { title: 'Service Not Found' };
  return {
    title: config.seoTitle || config.title + ' | Converto',
    description: config.seoDescription || config.shortDescription,
    keywords: config.searchKeywords,
    openGraph: {
      title: config.seoTitle || config.title,
      description: config.seoDescription || config.shortDescription,
      url: 'https://converto.com/services/' + config.slug,
      siteName: 'Converto',
      images: [{ url: config.media?.socialPreview || '/default-og.png', width: 1200, height: 630, alt: config.title }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: config.seoTitle || config.title, description: config.seoDescription || config.shortDescription, images: [config.media?.socialPreview || '/default-og.png'] },
    alternates: { canonical: 'https://converto.com/services/' + config.slug }
  };
}

export default function ServiceLandingPage() {
  const config = ServiceRegistry.get(SERVICE_ID);
  if (!config) return <div className="p-20 text-center font-bold text-2xl">Service not found.</div>;
  return <div className="w-full"><ServiceLandingLayout serviceId={SERVICE_ID} /></div>;
}
