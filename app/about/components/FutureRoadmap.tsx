import React from 'react';

export function FutureRoadmap() {
  const current = ["Payments", "Shopping", "Education", "Medical", "Travel"];
  const future = ["AI Assistant", "Business Services", "Global Marketplace", "Financial Products", "Travel Ecosystem", "Worldwide Expansion"];

  return (
    <section className="py-24 px-4 md:px-8 bg-zinc-50 border-y border-foreground/10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-heading">Our Roadmap</h2>
          <p className="text-muted-foreground mt-4 text-lg">Converto is continuously evolving to bring you more.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          {/* Current */}
          <div className="flex-1">
            <h3 className="text-xl font-bold uppercase tracking-widest mb-6 border-b-2 border-foreground/10 pb-4">Current Ecosystem</h3>
            <ul className="space-y-3">
              {current.map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-lg">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Future */}
          <div className="flex-1">
            <h3 className="text-xl font-bold uppercase tracking-widest mb-6 border-b-2 border-primary/20 pb-4 text-primary">Future Horizons</h3>
            <ul className="space-y-3">
              {future.map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-lg text-muted-foreground opacity-70">
                  <div className="w-2 h-2 border-2 border-primary/50 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
