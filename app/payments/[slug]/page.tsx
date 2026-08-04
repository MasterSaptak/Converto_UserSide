import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SEOPageLayout } from '@/components/seo/SEOPageLayout';
import { PAYMENT_METHODS, generateKeywordCluster, generateFAQs, generateRelatedLinks } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return PAYMENT_METHODS.map((method) => ({
    slug: method.slug,
  }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const method = PAYMENT_METHODS.find((m) => m.slug === params.slug);
  if (!method) return {};

  const keywordCluster = generateKeywordCluster({ paymentMethod: method.name, service: 'global-payments' });

  return {
    title: `Send Money via ${method.name} | International Transfer`,
    description: `Learn how to send money internationally using ${method.name}. Compare rates, fees, and delivery times for cross-border transfers through Converto.`,
    keywords: [
      ...keywordCluster.primary,
      ...keywordCluster.secondary,
      ...keywordCluster.commercial,
    ],
    alternates: {
      canonical: `https://converto.saptech.online/payments/${method.slug}`,
    }
  };
}

export default async function PaymentMethodPage(props: Props) {
  const params = await props.params;
  const method = PAYMENT_METHODS.find((m) => m.slug === params.slug);
  if (!method) notFound();

  const faqs = generateFAQs({ paymentMethod: method.name, service: 'global-payments' });
  const relatedLinks = generateRelatedLinks({ paymentSlug: method.slug, serviceSlug: 'global-payments' });

  const breadcrumbs = [
    { name: 'Home', url: 'https://converto.saptech.online' },
    { name: 'Services', url: 'https://converto.saptech.online/services' },
    { name: 'Global Payments', url: 'https://converto.saptech.online/services/global-payments' },
    { name: method.name, url: `https://converto.saptech.online/payments/${method.slug}` },
  ];

  return (
    <SEOPageLayout
      title={`Send Money with ${method.name}`}
      description={`Fast, secure, and transparent international money transfers powered by ${method.name}. Say goodbye to hidden bank fees and terrible exchange rates.`}
      category="Global Payments"
      categoryLink="/services/global-payments"
      breadcrumbs={breadcrumbs}
      faqs={faqs}
      relatedLinks={relatedLinks}
      ctaText={`Transfer with ${method.name}`}
      ctaLink="/services/global-payments/request"
    >
      <div className="prose prose-zinc max-w-none">
        <h2>Why use {method.name} for international transfers?</h2>
        <p>
          Sending money across borders shouldn&apos;t be complicated or expensive. By using {method.name} through Converto, 
          you get the convenience of a payment method you already trust, combined with Converto&apos;s unbeatable exchange rates.
        </p>
        <p>
          Traditional banks often hide fees in the exchange rate. We believe in transparency. What you see is exactly 
          what the recipient gets.
        </p>

        {method.comingSoon ? (
          <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="text-amber-900 mt-0">Coming Soon!</h3>
            <p className="text-amber-800 mb-0">
              We are currently integrating {method.name} into our network. Check back soon for seamless transfers.
            </p>
          </div>
        ) : (
          <>
            <h3>How to send money</h3>
            <ol>
              <li>Create a free Converto account or log in.</li>
              <li>Select your destination country and amount.</li>
              <li>Choose <strong>{method.name}</strong> as your payment method.</li>
              <li>Confirm the transfer and track it in real-time.</li>
            </ol>
          </>
        )}
      </div>
    </SEOPageLayout>
  );
}
