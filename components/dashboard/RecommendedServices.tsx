'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { IllustrationRegistry } from '@/components/illustrations';
import { supabase } from '@/lib/supabase';

interface CatalogSubscription {
  id: string;
  name: string;
  category: string;
  accent_color: string;
  logo_url: string | null;
}

interface Recommendation {
  id: string;
  title: string;
  category: string;
  illustration: keyof typeof IllustrationRegistry;
  accent: string;
  logoUrl?: string | null;
  href: string;
}

const SUBSCRIPTIONS_FALLBACK: Recommendation = {
  id: 'app-subscriptions',
  title: 'App Subscriptions',
  category: 'Digital Services',
  illustration: 'digital_content',
  accent: '#EC4899',
  href: '/services/subscriptions'
};

function safeAccent(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#EC4899';
}

export const RecommendedServices = React.memo(function RecommendedServices() {
  const [subscriptions, setSubscriptions] = useState<CatalogSubscription[]>([]);

  useEffect(() => {
    let active = true;

    async function loadSubscriptions() {
      const { data, error } = await supabase
        .from('app_subscriptions')
        .select('id, name, category, accent_color, logo_url')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })
        .limit(8);

      if (active && !error) {
        setSubscriptions((data ?? []) as CatalogSubscription[]);
      }
    }

    void loadSubscriptions();
    return () => {
      active = false;
    };
  }, []);

  const recommendations = useMemo<Recommendation[]>(() => {
    const subscriptionRecommendations = subscriptions.map((subscription) => ({
      id: `subscription-${subscription.id}`,
      title: subscription.name,
      category: subscription.category,
      illustration: 'digital_content' as const,
      accent: safeAccent(subscription.accent_color),
      logoUrl: subscription.logo_url,
      href: `/services/buy-for-me/request?type=subscription&app=${encodeURIComponent(subscription.id)}`
    }));

    return subscriptionRecommendations.length > 0
      ? subscriptionRecommendations
      : [SUBSCRIPTIONS_FALLBACK];
  }, [subscriptions]);

  return (
    <section>
      <div className="font-bold uppercase text-[10px] tracking-[0.2em] mb-4 flex items-center gap-2 opacity-80">
        <Sparkles className="w-3 h-3 text-yellow-500" />
        Recommended Subscriptions
      </div>
      <div className="text-sm font-bold opacity-60 uppercase mb-4 tracking-widest">
        Popular apps and digital subscriptions
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
        {recommendations.map((rec) => {
          const Illustration = IllustrationRegistry[rec.illustration];
          
          return (
            <Link key={rec.id} href={rec.href} className="block group">
              <div className="border-2 border-foreground bg-card rounded-xl shadow-brutal hover-lift p-4 flex items-center gap-4 h-full">
                <div className="w-12 h-12 rounded-lg bg-secondary border-2 border-foreground/10 shrink-0 flex items-center justify-center relative overflow-hidden">
                   {Illustration && (
                     <Illustration size={32} accent={rec.accent} animated={false} />
                   )}
                   {rec.logoUrl && (
                     <img
                       src={rec.logoUrl}
                       alt={`${rec.title} logo`}
                       className="absolute inset-0 w-full h-full object-contain p-2 bg-white"
                     />
                   )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold uppercase text-xs md:text-sm leading-tight">
                    {rec.title}
                  </div>
                  <div className="text-[9px] font-bold opacity-60 uppercase tracking-widest mt-1">
                    {rec.category}
                  </div>
                </div>
                <div className="shrink-0 bg-secondary p-1.5 rounded-lg border border-foreground/10 group-hover:bg-foreground group-hover:text-background transition-colors hidden sm:block">
                  <ArrowRight size={14} className="transition-transform group-hover:-rotate-45" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
});
