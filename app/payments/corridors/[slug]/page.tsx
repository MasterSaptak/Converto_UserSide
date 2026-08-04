import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SEOPageLayout } from '@/components/seo/SEOPageLayout';
import { CORRIDORS, generateKeywordCluster, generateFAQs, generateRelatedLinks } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return CORRIDORS.map((route) => ({
    slug: route.slug,
  }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const route = CORRIDORS.find((r) => r.slug === params.slug);
  if (!route) return {};

  const keywordCluster = generateKeywordCluster({ country: route.from, destination: route.to, service: 'global-payments' });

  return {
    title: `Send Money from ${route.from} to ${route.to} | Fast & Secure`,
    description: `Transfer money from ${route.from} to ${route.to} with Converto. Compare exchange rates, fees, and transfer times. Zero hidden markups.`,
    keywords: [
      ...keywordCluster.primary,
      ...keywordCluster.secondary,
      ...keywordCluster.commercial,
    ],
    alternates: {
      canonical: `https://converto.saptech.online/payments/corridors/${route.slug}`,
    }
  };
}

export default async function CountryCorridorPage(props: Props) {
  const params = await props.params;
  const route = CORRIDORS.find((r) => r.slug === params.slug);
  if (!route) notFound();

  const faqs = generateFAQs({ country: route.from, destination: route.to, service: 'global-payments' });
  const relatedLinks = generateRelatedLinks({ countryCode: route.slug, serviceSlug: 'global-payments' });

  const breadcrumbs = [
    { name: 'Home', url: 'https://converto.saptech.online' },
    { name: 'Services', url: 'https://converto.saptech.online/services' },
    { name: 'Global Payments', url: 'https://converto.saptech.online/services/global-payments' },
    { name: `${route.from} to ${route.to}`, url: `https://converto.saptech.online/payments/corridors/${route.slug}` },
  ];

  return (
    <SEOPageLayout
      title={`Send Money: ${route.from} to ${route.to}`}
      description={`Experience seamless cross-border transfers from ${route.from} to ${route.to}. Lock in the best exchange rates with zero hidden bank fees.`}
      category="Global Payments"
      categoryLink="/services/global-payments"
      breadcrumbs={breadcrumbs}
      faqs={faqs}
      relatedLinks={relatedLinks}
      ctaText={`Transfer to ${route.to}`}
      ctaLink="/services/global-payments/request"
    >
      <div className="prose prose-zinc max-w-none">
        <h2>Your Trusted Partner for Transfers to {route.to}</h2>
        <p>
          Whether you are supporting family back home, paying overseas suppliers, or handling international real estate, 
          sending money from {route.from} to {route.to} should be fast, affordable, and secure.
        </p>
        <p>
          Unlike traditional banks that hide hefty markups in their exchange rates, Converto uses the mid-market rate 
          (the one you see on Google). You pay a small upfront fee and that&apos;s it.
        </p>

        <h3>Available Payout Options in {route.to}</h3>
        <ul>
          <li><strong>Direct Bank Transfer:</strong> Funds deposited directly into local bank accounts.</li>
          <li><strong>Mobile Wallets:</strong> Instant transfers to popular regional wallets.</li>
          <li><strong>Cash Pickup:</strong> Available at thousands of partner locations (where applicable).</li>
        </ul>

        <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
          <h4 className="text-primary mt-0 mb-2 font-bold">Ready to send?</h4>
          <p className="text-sm text-foreground/80 mb-0">
            Create an account in minutes and initiate your first transfer from {route.from} to {route.to} today.
          </p>
        </div>
      </div>
    </SEOPageLayout>
  );
}
