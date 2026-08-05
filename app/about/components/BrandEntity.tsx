import React from 'react';

export function BrandEntity() {
  return (
    <section className="py-24 px-4 md:px-8 bg-zinc-50 border-t border-foreground/10">
      <div className="max-w-4xl mx-auto flex flex-col gap-6 text-center">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-heading">
          What is Converto?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Converto is a global services platform that helps individuals access international payments, overseas shopping, education services, visa assistance, travel bookings, medical tourism, and other cross-border solutions through one secure and unified platform.
        </p>
      </div>
    </section>
  );
}
