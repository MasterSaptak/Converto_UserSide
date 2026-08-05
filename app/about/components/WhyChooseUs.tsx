import React from 'react';
import { Check } from 'lucide-react';

export function WhyChooseUs() {
  const reasons = [
    "Everything in One Place",
    "Time Saving",
    "Best Offers",
    "Transparent Process",
    "Personalized Support",
    "Secure Payments",
    "Live Tracking"
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-heading mb-16">
          Why People Choose Us
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {reasons.map((reason, i) => (
            <div key={i} className="flex flex-col items-center gap-3 p-6 bg-zinc-50 border border-foreground/10 hover:border-primary transition-colors">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-full text-primary">
                <Check className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm tracking-tight">{reason}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
