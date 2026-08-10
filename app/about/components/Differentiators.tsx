import React from 'react';
import { Globe2, ShieldCheck, Zap, HeartHandshake, CreditCard, LayoutDashboard } from 'lucide-react';

export function Differentiators() {
  const points = [
    {
      title: "Global",
      description: "Worldwide services in one ecosystem.",
      icon: Globe2
    },
    {
      title: "Secure",
      description: "Enterprise-grade security and protected transactions.",
      icon: ShieldCheck
    },
    {
      title: "Fast",
      description: "Digital-first workflows that eliminate unnecessary delays.",
      icon: Zap
    },
    {
      title: "Human Support",
      description: "Real people ready to help whenever you need assistance.",
      icon: HeartHandshake
    },
    {
      title: "Smart Payments",
      description: "Optimized payment methods designed to maximize savings.",
      icon: CreditCard
    },
    {
      title: "One Platform",
      description: "Everything managed from a single dashboard.",
      icon: LayoutDashboard
    }
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-zinc-50 border-b border-foreground/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-heading text-center mb-16">
          What Makes Converto Different
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {points.map((pt, i) => (
            <div key={i} className="flex flex-col gap-4 p-8 bg-background border border-foreground/10">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-xl text-primary">
                <pt.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-widest">{pt.title}</h3>
              <p className="text-muted-foreground">{pt.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
