import React from 'react';

export function MissionVision() {
  return (
    <section className="py-24 px-4 md:px-8 bg-foreground text-background">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
        
        {/* Mission */}
        <div className="flex flex-col gap-6">
          <div className="inline-block px-4 py-2 bg-background text-foreground text-xs font-bold uppercase tracking-widest self-start rounded-full">
            Our Mission
          </div>
          <p className="text-2xl md:text-4xl font-bold leading-tight font-heading">
            To make global opportunities accessible to everyone by simplifying international services through technology, transparency, and exceptional customer support.
          </p>
        </div>

        {/* Vision */}
        <div className="flex flex-col gap-6">
          <div className="inline-block px-4 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest self-start rounded-full">
            Our Vision
          </div>
          <p className="text-3xl md:text-5xl font-black uppercase leading-[0.9] font-heading text-zinc-300">
            To become the world&apos;s most trusted digital gateway for <span className="text-white">global services.</span>
          </p>
        </div>

      </div>
    </section>
  );
}
