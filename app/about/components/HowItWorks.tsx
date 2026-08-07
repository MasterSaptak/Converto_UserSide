import React from 'react';

export function HowItWorks() {
  const steps = [
    { title: "Choose Service", description: "Select from our wide range of global services." },
    { title: "Submit Request", description: "Provide necessary details via our simple forms." },
    { title: "Secure Payment", description: "Pay easily using optimized local or global methods." },
    { title: "Track Progress", description: "Monitor your request in real-time from your dashboard." },
    { title: "Completion", description: "Receive your service seamlessly." },
    { title: "Support Anytime", description: "Our team is here 24/7 if you need assistance." },
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-zinc-50 border-b border-foreground/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-heading text-center mb-16">
          How Converto Works
        </h2>

        <div className="relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-foreground/10 -translate-y-1/2 hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-4 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-primary text-primary-foreground font-black flex items-center justify-center rounded-full mb-6 border-4 border-zinc-50">
                  {i + 1}
                </div>
                <h3 className="font-bold text-sm uppercase tracking-widest mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
