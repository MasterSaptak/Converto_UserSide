import React from 'react';
import { X, Check } from 'lucide-react';

export function WhyWeExist() {
  const problems = [
    "Multiple websites",
    "Hidden fees",
    "Payment restrictions",
    "Currency confusion",
    "Endless paperwork"
  ];

  const solutions = [
    "One Account",
    "One Dashboard",
    "One Support Team",
    "One Secure Platform"
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-zinc-50 border-y border-foreground/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-heading">Why We Exist</h2>
          <p className="text-muted-foreground mt-4 text-lg">Fixing the fragmented global ecosystem.</p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-16">
          {/* The Old Way */}
          <div className="flex-1 bg-background p-8 border-2 border-foreground/10 shadow-[4px_4px_0px_var(--color-foreground)] opacity-75">
            <h3 className="text-xl font-bold uppercase tracking-widest mb-8 text-muted-foreground">The Old Way</h3>
            <ul className="space-y-6">
              {problems.map((prob, i) => (
                <li key={i} className="flex items-center gap-4 text-lg text-muted-foreground">
                  <X className="text-red-500 w-6 h-6 flex-shrink-0" />
                  {prob}
                </li>
              ))}
            </ul>
          </div>

          {/* Arrow indicating change */}
          <div className="hidden md:flex items-center justify-center">
            <div className="w-16 h-2 bg-primary rounded-full relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-primary w-0 h-0" />
            </div>
          </div>

          {/* The Converto Way */}
          <div className="flex-1 bg-primary/5 p-8 border-2 border-primary shadow-[8px_8px_0px_var(--color-primary)]">
            <h3 className="text-xl font-black uppercase tracking-widest mb-8 text-primary">The Converto Way</h3>
            <ul className="space-y-6">
              {solutions.map((sol, i) => (
                <li key={i} className="flex items-center gap-4 text-xl font-bold">
                  <Check className="text-green-500 w-8 h-8 flex-shrink-0" />
                  {sol}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
