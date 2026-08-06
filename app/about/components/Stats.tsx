'use client';

import React from 'react';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

export function Stats() {
  const stats = [
    { value: 12, suffix: '+', label: "Integrated Services" },
    { value: 100, suffix: '%', label: "Transparent Pricing" },
    { value: 24, suffix: '/7', label: "Support System" },
    { value: 1, suffix: '', label: "Unified Platform" }
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-background border-b border-foreground/10">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center justify-center">
            <div className="text-4xl md:text-6xl font-black font-heading tracking-tighter mb-2">
              <AnimatedNumber value={stat.value} />
              {stat.suffix}
            </div>
            <div className="text-sm md:text-base font-bold uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
