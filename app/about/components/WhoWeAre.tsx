import React from 'react';

export function WhoWeAre() {
  return (
    <section className="py-24 px-4 md:px-8 bg-background">
      <div className="max-w-4xl mx-auto flex flex-col gap-8 text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-heading">
          Converto was created with one simple belief:
        </h2>
        
        <div className="text-xl md:text-3xl font-bold text-primary leading-tight">
          Global services shouldn&apos;t be complicated.
        </div>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Whether you&apos;re paying tuition overseas, purchasing products from another country, applying for a visa, booking flights, or accessing medical care abroad, the process is often fragmented across multiple websites, agencies, and payment systems.
        </p>
        
        <p className="text-xl md:text-2xl font-bold leading-relaxed border-l-4 border-primary pl-6 py-2">
          Converto brings everything together into one seamless experience.
        </p>
      </div>
    </section>
  );
}
