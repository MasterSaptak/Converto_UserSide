'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Mock server data for now - this will be manageable from the admin panel later
const PROMOS = [
  {
    id: '1',
    title: 'Zero Fees on First Transfer',
    description: 'Send money globally with zero hidden charges on your first transaction. Limited time offer.',
    icon: Zap,
    color: 'bg-emerald-400',
    textColor: 'text-emerald-950',
    href: '/services/exchange',
    tag: 'Special Offer'
  },
  {
    id: '2',
    title: 'Premium VIP Support 24/7',
    description: 'Upgrade to VIP for dedicated account managers and priority routing on all your orders.',
    icon: Sparkles,
    color: 'bg-primary',
    textColor: 'text-primary-foreground',
    href: '/support',
    tag: 'Upgrade'
  },
  {
    id: '3',
    title: 'Bank-Grade Security',
    description: 'Your funds are protected by military-grade encryption and top-tier insurance policies.',
    icon: ShieldCheck,
    color: 'bg-blue-400',
    textColor: 'text-blue-950',
    href: '/security',
    tag: 'Security'
  }
];

export const PromoCarousel = React.memo(function PromoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMOS.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative border-2 border-foreground bg-card overflow-hidden w-full group/carousel flex flex-col justify-center">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/[0.03] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none z-0"></div>
      
      <div 
        className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {PROMOS.map((promo) => (
          <div 
            key={promo.id} 
            className="w-full shrink-0 grow-0 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 lg:gap-12 relative z-10 pb-12 md:pb-8"
          >
            <div className="flex items-start gap-4 md:gap-6 w-full md:w-auto">
              <div className={cn("p-3 md:p-4 border-2 border-foreground shrink-0 shadow-[4px_4px_0px_var(--color-foreground)]", promo.color, promo.textColor)}>
                <promo.icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse"></span>
                  {promo.tag}
                </span>
                <h3 className="text-lg md:text-2xl lg:text-3xl font-heading font-bold uppercase tracking-wide leading-none">{promo.title}</h3>
                <p className="text-xs md:text-sm opacity-80 max-w-md mt-1 font-medium">{promo.description}</p>
              </div>
            </div>
            
            <Link 
              href={promo.href}
              className="group flex items-center gap-2 border-2 border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-all shrink-0 font-bold uppercase text-xs tracking-widest shadow-[4px_4px_0px_var(--color-foreground)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 w-full md:w-auto justify-center"
            >
              Learn More
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
      
      {/* Pagination indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {PROMOS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "w-2 h-2 rounded-full border-2 border-foreground transition-all duration-300",
              idx === currentIndex ? "bg-foreground scale-125" : "bg-transparent hover:bg-foreground/20"
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
});
