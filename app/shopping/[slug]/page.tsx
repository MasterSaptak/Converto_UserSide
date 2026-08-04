import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SEOPageLayout } from '@/components/seo/SEOPageLayout';
import { SHOPPING_PLATFORMS, generateKeywordCluster, generateFAQs, generateRelatedLinks } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return SHOPPING_PLATFORMS.map((platform) => ({
    slug: platform.slug,
  }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const platform = SHOPPING_PLATFORMS.find((p) => p.slug === params.slug);
  if (!platform) return {};

  const keywordCluster = generateKeywordCluster({ brand: platform.name, service: 'buy-for-me' });

  return {
    title: `Buy from ${platform.name} & Ship Internationally | Converto`,
    description: `Shop on ${platform.name} and get your items delivered anywhere with Converto's Buy For Me service. We handle the purchase, shipping, and customs.`,
    keywords: [
      ...keywordCluster.primary,
      ...keywordCluster.secondary,
      ...keywordCluster.commercial,
    ],
    alternates: {
      canonical: `https://converto.saptech.online/shopping/${platform.slug}`,
    }
  };
}

export default async function ShoppingPlatformPage(props: Props) {
  const params = await props.params;
  const platform = SHOPPING_PLATFORMS.find((p) => p.slug === params.slug);
  if (!platform) notFound();

  const faqs = generateFAQs({ brand: platform.name, service: 'buy-for-me' });
  const relatedLinks = generateRelatedLinks({ shoppingSlug: platform.slug, serviceSlug: 'buy-for-me' });

  const breadcrumbs = [
    { name: 'Home', url: 'https://converto.saptech.online' },
    { name: 'Services', url: 'https://converto.saptech.online/services' },
    { name: 'Buy For Me', url: 'https://converto.saptech.online/services/buy-for-me' },
    { name: platform.name, url: `https://converto.saptech.online/shopping/${platform.slug}` },
  ];

  return (
    <SEOPageLayout
      title={`Shop on ${platform.name} Internationally`}
      description={`Overcome shipping restrictions and missing payment methods. Let Converto buy and ship your favorite items from ${platform.name} directly to your doorstep.`}
      category="Buy For Me"
      categoryLink="/services/buy-for-me"
      breadcrumbs={breadcrumbs}
      faqs={faqs}
      relatedLinks={relatedLinks}
      ctaText={`Start ${platform.name} Order`}
      ctaLink="/services/buy-for-me/request"
    >
      <div className="prose prose-zinc max-w-none">
        <h2>Your Personal Shopper for {platform.name}</h2>
        <p>
          Love shopping on {platform.name} but frustrated by international shipping limits or rejected credit cards? 
          Converto bridges the gap.
        </p>
        <p>
          Our &quot;Buy For Me&quot; service acts as your proxy. You tell us what you want from {platform.name}, pay us in your 
          local currency, and we handle the rest—from purchasing to international forwarding.
        </p>

        {('comingSoon' in platform && platform.comingSoon) ? (
          <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="text-amber-900 mt-0">Integration In Progress</h3>
            <p className="text-amber-800 mb-0">
              We are currently optimizing our procurement pipeline for {platform.name}. Support for this platform will be rolling out soon.
            </p>
          </div>
        ) : (
          <>
            <h3>How it works</h3>
            <ol>
              <li>Find the product you want on <strong>{platform.name}</strong>.</li>
              <li>Copy the product link and paste it into Converto&apos;s Buy For Me form.</li>
              <li>Review the total cost (including shipping and our small service fee).</li>
              <li>Pay using your local payment methods.</li>
              <li>We buy the item, receive it, and ship it to you internationally!</li>
            </ol>
            
            <h3>Why use Converto for {platform.name}?</h3>
            <ul>
              <li><strong>No Local Card Needed:</strong> Pay with methods available in your country.</li>
              <li><strong>Consolidation:</strong> Buy from multiple stores and ship them together to save on shipping.</li>
              <li><strong>Customs Handling:</strong> We manage export/import paperwork for a smoother delivery.</li>
            </ul>
          </>
        )}
      </div>
    </SEOPageLayout>
  );
}
