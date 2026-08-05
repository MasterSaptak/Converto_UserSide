'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { IllustrationRegistry } from '@/components/illustrations';

const RECOMMENDATIONS = [
  {
    id: 'amazon',
    title: 'Amazon US',
    category: 'Buy For Me',
    image: '/amazon-logo.png', // Fallback or assume it exists, or just use illustration
    illustration: 'buy_for_me',
    accent: '#F97316',
    href: '/services/buy-for-me/request?store=amazon'
  },
  {
    id: 'apple',
    title: 'Apple Store',
    category: 'Buy For Me',
    illustration: 'buy_for_me',
    accent: '#000000',
    href: '/services/buy-for-me/request?store=apple'
  },
  {
    id: 'harvard',
    title: 'Education Discounts',
    category: 'Education',
    illustration: 'education',
    accent: '#94A3B8',
    href: '/services/education/request'
  },
  {
    id: 'steam',
    title: 'Steam Wallet',
    category: 'Gift Cards',
    illustration: 'ticket_booking',
    accent: '#06B6D4',
    href: '/services/buy-for-me/request?type=giftcard'
  }
];

export const RecommendedServices = React.memo(function RecommendedServices() {
  return (
    <section>
      <div className="font-bold uppercase text-[10px] tracking-[0.2em] mb-4 flex items-center gap-2 opacity-80">
        <Sparkles className="w-3 h-3 text-yellow-500" />
        Recommended For You
      </div>
      <div className="text-sm font-bold opacity-60 uppercase mb-4 tracking-widest">
        Because you used Buy For Me
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {RECOMMENDATIONS.map((rec) => {
          const Illustration = IllustrationRegistry[rec.illustration as keyof typeof IllustrationRegistry];
          
          return (
            <Link key={rec.id} href={rec.href} className="block group">
              <div className="border-2 border-foreground bg-card rounded-xl shadow-brutal hover-lift p-4 flex items-center gap-4 h-full">
                <div className="w-12 h-12 rounded-lg bg-secondary border-2 border-foreground/10 shrink-0 flex items-center justify-center relative overflow-hidden">
                   {Illustration && (
                     <Illustration size={32} accent={rec.accent} animated={false} />
                   )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold uppercase text-xs md:text-sm truncate">
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
