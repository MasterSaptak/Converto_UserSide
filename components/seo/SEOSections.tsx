/**
 * SEO Section Components for Service Landing Pages.
 * These render rich, crawlable content sections that target specific search intents.
 * Each section is designed to be both visually appealing and keyword-rich for search engines.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Wallet,
  Globe2,
  Landmark,
  Bitcoin,
  ArrowRight,
  MapPin,
  ShoppingBag,
  Tag,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  PaymentMethodInfo,
  CountryRoute,
  ShoppingPlatform,
  BankOffer,
  SEODrivenCTA,
} from '@/modules/service-engine/types';

/* ─── Helpers ─── */

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  card: CreditCard,
  wallet: Wallet,
  regional: Globe2,
  crypto: Bitcoin,
  bank: Landmark,
};

const CATEGORY_LABELS: Record<string, string> = {
  card: 'Cards',
  wallet: 'Wallets',
  regional: 'Bangladesh',
  crypto: 'Crypto',
  bank: 'Bank Transfer',
};

/* ═══════════════════════════════════════════════════════
   1. PAYMENT METHODS SEO SECTION
   ═══════════════════════════════════════════════════════ */

interface PaymentMethodsSEOProps {
  methods: PaymentMethodInfo[];
}

export function PaymentMethodsSEO({ methods }: PaymentMethodsSEOProps) {
  // Group by category
  const grouped = methods.reduce<Record<string, PaymentMethodInfo[]>>((acc, m) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {});

  const categoryOrder: string[] = ['card', 'wallet', 'regional', 'crypto', 'bank'];
  const sortedCategories = categoryOrder.filter((c) => grouped[c]);

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 w-full flex flex-col gap-8">
      <div className="flex flex-col gap-3 text-center items-center">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-heading">
          Supported Payment Networks
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg">
          Converto supports a wide range of payment methods to make your transactions seamless across borders.
        </p>
        <div className="w-16 h-1.5 bg-primary" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedCategories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat] || Globe2;
          return (
            <div
              key={cat}
              className="border border-foreground/10 bg-card p-5 flex flex-col gap-4 hover:border-foreground/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest">
                  {CATEGORY_LABELS[cat] || cat}
                </h3>
              </div>
              <ul className="flex flex-col gap-2">
                {grouped[cat].map((method) => (
                  <li key={method.slug} className="flex items-center justify-between text-sm">
                    <span className={cn(
                      'font-medium',
                      !method.supported && !method.comingSoon && 'text-muted-foreground line-through',
                    )}>
                      {method.name}
                    </span>
                    {method.supported && (
                      <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5">
                        Supported
                      </span>
                    )}
                    {method.comingSoon && (
                      <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5">
                        Coming Soon
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   2. COUNTRY ROUTES SEO SECTION
   ═══════════════════════════════════════════════════════ */

interface CountryRoutesSEOProps {
  routes: CountryRoute[];
}

export function CountryRoutesSEO({ routes }: CountryRoutesSEOProps) {
  // Group routes by 'from' country
  const grouped = routes.reduce<Record<string, CountryRoute[]>>((acc, r) => {
    if (!acc[r.from]) acc[r.from] = [];
    acc[r.from].push(r);
    return acc;
  }, {});

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 w-full flex flex-col gap-8">
      <div className="flex flex-col gap-3 text-center items-center">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-heading">
          Available International Routes
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg">
          Send money, pay bills, and transact across these popular international corridors.
        </p>
        <div className="w-16 h-1.5 bg-primary" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(grouped).map(([fromCountry, countryRoutes]) => (
          <div
            key={fromCountry}
            className="border border-foreground/10 bg-card p-5 flex flex-col gap-4 hover:border-foreground/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest">
                From {fromCountry}
              </h3>
            </div>
            <ul className="flex flex-wrap gap-2">
              {countryRoutes.map((route) => (
                <li key={route.slug}>
                  <Link
                    href={`/payments/corridors/${route.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-foreground/10 hover:border-primary hover:text-primary transition-colors bg-background"
                  >
                    {route.label}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   3. SHOPPING PLATFORMS SEO SECTION
   ═══════════════════════════════════════════════════════ */

interface ShoppingPlatformsSEOProps {
  platforms: ShoppingPlatform[];
}

export function ShoppingPlatformsSEO({ platforms }: ShoppingPlatformsSEOProps) {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 w-full flex flex-col gap-8">
      <div className="flex flex-col gap-3 text-center items-center">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-heading">
          Supported Shopping Platforms
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg">
          Shop smarter through Converto. Access deals, offers, and cashback across these popular platforms.
        </p>
        <div className="w-16 h-1.5 bg-primary" />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {platforms.map((platform) => (
          <Link
            key={platform.slug}
            href={`/shopping/${platform.slug}`}
            className="group flex items-center gap-2 px-5 py-3 border border-foreground/10 bg-card text-sm font-bold hover:border-primary hover:-translate-y-0.5 hover:shadow-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
            <span>{platform.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   4. BANK OFFERS SEO SECTION
   ═══════════════════════════════════════════════════════ */

interface BankOffersSEOProps {
  offers: BankOffer[];
}

export function BankOffersSEO({ offers }: BankOffersSEOProps) {
  // Group by bank
  const grouped = offers.reduce<Record<string, BankOffer[]>>((acc, o) => {
    if (!acc[o.bankName]) acc[o.bankName] = [];
    acc[o.bankName].push(o);
    return acc;
  }, {});

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 w-full flex flex-col gap-8">
      <div className="flex flex-col gap-3 text-center items-center">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-heading">
          Compatible Bank & Card Offers
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg">
          Maximize your savings with eligible credit card offers and bank discounts available through Converto.
        </p>
        <div className="w-16 h-1.5 bg-primary" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(grouped).map(([bank, bankOffers]) => (
          <div
            key={bank}
            className="border border-foreground/10 bg-card p-4 flex flex-col gap-3 hover:border-foreground/20 transition-colors"
          >
            <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Tag className="w-3.5 h-3.5" />
              {bank}
            </h3>
            <ul className="flex flex-col gap-2">
              {bankOffers.map((offer) => (
                <li key={offer.slug}>
                  <Link
                    href={`/offers/${offer.slug}`}
                    className="text-sm font-medium hover:text-primary transition-colors flex items-center justify-between"
                  >
                    <span>{offer.cardName}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   5. RELATED SEARCHES SEO SECTION
   ═══════════════════════════════════════════════════════ */

interface RelatedSearchesSEOProps {
  searches: string[];
}

export function RelatedSearchesSEO({ searches }: RelatedSearchesSEOProps) {
  if (!searches || searches.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 w-full">
      <div className="border border-foreground/10 bg-card p-6 md:p-8 flex flex-col gap-5">
        <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          Users Also Search For
        </h2>
        <div className="flex flex-wrap gap-2">
          {searches.map((term, i) => (
            <span
              key={i}
              className="px-3 py-1.5 text-xs font-bold bg-secondary text-muted-foreground border border-foreground/5 hover:border-primary/30 hover:text-primary transition-colors cursor-default"
            >
              {term}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   6. SEO-DRIVEN CTA SECTIONS
   ═══════════════════════════════════════════════════════ */

interface SEODrivenCTASectionProps {
  ctas: SEODrivenCTA[];
}

export function SEODrivenCTASection({ ctas }: SEODrivenCTASectionProps) {
  if (!ctas || ctas.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 w-full">
      <div className="flex flex-col gap-3">
        {ctas.map((cta, i) => (
          <Link
            key={i}
            href={cta.href}
            className="group flex items-center justify-between p-5 border border-foreground/10 bg-card hover:border-primary/40 hover:bg-primary/[0.02] transition-all"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold">{cta.headline}</span>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary group-hover:translate-x-0.5 transition-transform">
              {cta.buttonText}
              <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
