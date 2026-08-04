import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SEOPageLayout } from '@/components/seo/SEOPageLayout';
import { BANK_CARDS, generateKeywordCluster, generateRelatedLinks } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return BANK_CARDS.map((offer) => ({
    slug: offer.slug,
  }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const offer = BANK_CARDS.find((o) => o.slug === params.slug);
  if (!offer) return {};

  const keywordCluster = generateKeywordCluster({ paymentMethod: offer.cardName, brand: offer.bankName });

  return {
    title: `${offer.cardName} Deals & Cashback | Converto Offers`,
    description: `Maximize your savings with ${offer.cardName}. Find the latest cashback deals, discounts, and rewards when using your card through Converto.`,
    keywords: [
      ...keywordCluster.primary,
      ...keywordCluster.secondary,
      ...keywordCluster.commercial,
    ],
    alternates: {
      canonical: `https://converto.saptech.online/offers/${offer.slug}`,
    }
  };
}

export default async function BankOfferPage(props: Props) {
  const params = await props.params;
  const offer = BANK_CARDS.find((o) => o.slug === params.slug);
  if (!offer) notFound();

  // Since generateFAQs doesn't natively handle offers perfectly, we manually keep the offer specific faqs 
  // and append generated ones if needed, or just keep them manual here since offers are highly specific.
  const faqs = [
    {
      question: `How do I claim the ${offer.cardName} offer?`,
      answer: `To claim the ${offer.cardName} offer, simply select this card as your payment method during checkout on Converto. The discount or cashback will be automatically applied if the transaction meets the offer criteria.`,
    },
    {
      question: `Is the ${offer.cardName} offer valid on international transactions?`,
      answer: `Many of our bank offers, including ${offer.cardName}, apply to specific services like international transfers, buy-for-me orders, or education payments. Check the specific terms during checkout.`,
    },
    {
      question: `When will I receive the cashback for the ${offer.cardName}?`,
      answer: `If the offer is an instant discount, it is applied immediately. If it is cashback, it will typically be credited to your Converto wallet or bank account within 3-7 business days.`,
    },
  ];

  const relatedLinks = generateRelatedLinks({ offerSlug: offer.slug });

  const breadcrumbs = [
    { name: 'Home', url: 'https://converto.saptech.online' },
    { name: 'Offers', url: 'https://converto.saptech.online/offers' },
    { name: offer.cardName, url: `https://converto.saptech.online/offers/${offer.slug}` },
  ];

  return (
    <SEOPageLayout
      title={`${offer.cardName} Offers & Cashback`}
      description={`Unlock exclusive rewards. Use your ${offer.cardName} through Converto to enjoy instant discounts and cashback on global payments and shopping.`}
      category="Bank Offers"
      categoryLink="/services"
      breadcrumbs={breadcrumbs}
      faqs={faqs}
      relatedLinks={relatedLinks}
      ctaText="View Eligible Services"
      ctaLink="/services"
    >
      <div className="prose prose-zinc max-w-none">
        <h2>Maximize your savings with {offer.bankName}</h2>
        <p>
          We&apos;ve partnered with leading financial institutions to bring you the best deals. When you use your 
          <strong> {offer.cardName}</strong> on Converto, you stack our great rates with exclusive bank rewards.
        </p>

        <div className="my-8 p-8 border-2 border-primary/20 rounded-xl bg-primary/5 text-center">
          <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            Active Offer
          </span>
          <h3 className="text-2xl font-black mt-0">Exclusive savings with {offer.cardName}</h3>
          <p className="text-muted-foreground mb-0">Applicable on selected Converto services.</p>
        </div>

        {/* Handle optional comingSoon field if added in the future */}
        {('comingSoon' in offer && offer.comingSoon) ? (
          <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="text-amber-900 mt-0">Offer Coming Soon</h3>
            <p className="text-amber-800 mb-0">
              We are finalizing the integration with {offer.bankName} for this specific card offer. Stay tuned!
            </p>
          </div>
        ) : (
          <>
            <h3>How to redeem</h3>
            <ol>
              <li>Log in to your Converto account.</li>
              <li>Select a service (e.g., Global Payments or Buy For Me).</li>
              <li>At checkout, choose Card Payment and enter your {offer.cardName} details.</li>
              <li>The offer will be automatically evaluated and applied to your transaction.</li>
            </ol>
            
            <h3>Terms and Conditions</h3>
            <ul>
              <li>Offer valid for registered Converto users only.</li>
              <li>Minimum transaction value may apply.</li>
              <li>Maximum discount/cashback limits apply per transaction.</li>
              <li>Converto reserves the right to modify or withdraw this offer at any time.</li>
            </ul>
          </>
        )}
      </div>
    </SEOPageLayout>
  );
}
