import { CORRIDORS } from './countries';
import { PAYMENT_METHODS } from './payment-methods';
import { SHOPPING_PLATFORMS } from './shopping-platforms';
import { BANK_CARDS } from './bank-cards';

export interface InternalLink {
  title: string;
  url: string;
  category: 'service' | 'country' | 'payment' | 'shopping' | 'offer';
}

interface LinkOptions {
  serviceSlug?: string;
  countryCode?: string;
  paymentSlug?: string;
  shoppingSlug?: string;
  offerSlug?: string;
  maxLinks?: number;
}

/**
 * The Internal Link Engine automatically generates a graph of related pages
 * based on the entities present on the current page.
 */
export function generateRelatedLinks(opts: LinkOptions): InternalLink[] {
  const links: InternalLink[] = [];
  const max = opts.maxLinks || 8;

  // Helper to add links without duplicates
  const addLink = (link: InternalLink) => {
    if (links.length < max && !links.find((l) => l.url === link.url)) {
      links.push(link);
    }
  };

  // If we're on a payment method page (e.g., PayPal)
  if (opts.paymentSlug) {
    const currentMethod = PAYMENT_METHODS.find(m => m.slug === opts.paymentSlug);
    // Link to other payment methods in the same category
    if (currentMethod) {
      PAYMENT_METHODS.filter(m => m.category === currentMethod.category && m.slug !== opts.paymentSlug)
        .forEach(m => addLink({ title: m.name, url: `/payments/${m.slug}`, category: 'payment' }));
    }
    // Link to popular corridors
    CORRIDORS.slice(0, 3).forEach(c => 
      addLink({ title: `Send money ${c.label}`, url: `/payments/corridors/${c.slug}`, category: 'country' })
    );
    // Link to main service
    addLink({ title: 'Global Payments', url: '/services/global-payments', category: 'service' });
  }

  // If we're on a country corridor page
  if (opts.countryCode) { // For simplicity, we can pass corridor slug here as a hack, but let's assume it's corridor slug
    // We can link to reverse corridor
    const [from, to] = opts.countryCode.split('-to-'); // e.g. india-to-bangladesh
    if (from && to) {
      const reverse = CORRIDORS.find(c => c.slug === `${to}-to-${from}`);
      if (reverse) {
        addLink({ title: reverse.label, url: `/payments/corridors/${reverse.slug}`, category: 'country' });
      }
    }
    // Link to top payment methods
    PAYMENT_METHODS.filter(m => m.supported).slice(0, 3).forEach(m => 
      addLink({ title: `Send via ${m.name}`, url: `/payments/${m.slug}`, category: 'payment' })
    );
  }

  // If we're on a shopping platform page
  if (opts.shoppingSlug) {
    // Link to other shopping platforms
    SHOPPING_PLATFORMS.filter(p => p.slug !== opts.shoppingSlug).slice(0, 4).forEach(p => 
      addLink({ title: `Buy from ${p.name}`, url: `/shopping/${p.slug}`, category: 'shopping' })
    );
    // Link to offers
    BANK_CARDS.slice(0, 2).forEach(c => 
      addLink({ title: `${c.cardName} Offers`, url: `/offers/${c.slug}`, category: 'offer' })
    );
    addLink({ title: 'Buy For Me Service', url: '/services/buy-for-me', category: 'service' });
  }

  // If we're on a bank offer page
  if (opts.offerSlug) {
    const currentOffer = BANK_CARDS.find(c => c.slug === opts.offerSlug);
    if (currentOffer) {
      // Link to other cards from same bank
      BANK_CARDS.filter(c => c.bankName === currentOffer.bankName && c.slug !== opts.offerSlug).forEach(c => 
        addLink({ title: c.cardName, url: `/offers/${c.slug}`, category: 'offer' })
      );
    }
    // Link to popular shopping
    SHOPPING_PLATFORMS.slice(0, 3).forEach(p => 
      addLink({ title: `Shop on ${p.name}`, url: `/shopping/${p.slug}`, category: 'shopping' })
    );
  }

  // If we are on a main service page, link to its children
  if (opts.serviceSlug) {
    if (opts.serviceSlug === 'global-payments') {
      CORRIDORS.slice(0, 4).forEach(c => 
        addLink({ title: c.label, url: `/payments/corridors/${c.slug}`, category: 'country' })
      );
      PAYMENT_METHODS.slice(0, 4).forEach(m => 
        addLink({ title: m.name, url: `/payments/${m.slug}`, category: 'payment' })
      );
    }
    if (opts.serviceSlug === 'buy-for-me') {
      SHOPPING_PLATFORMS.slice(0, 5).forEach(p => 
        addLink({ title: p.name, url: `/shopping/${p.slug}`, category: 'shopping' })
      );
    }
  }

  // Fallback links if we need more
  if (links.length < max) {
    addLink({ title: 'Global Payments', url: '/services/global-payments', category: 'service' });
    addLink({ title: 'Currency Exchange', url: '/services/exchange', category: 'service' });
    addLink({ title: 'Medical Tourism', url: '/services/medical', category: 'service' });
  }

  return links;
}
