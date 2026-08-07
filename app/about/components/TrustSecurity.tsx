import React from 'react';
import { Lock, ShieldAlert, EyeOff, KeyRound, Receipt, UserCheck, Activity } from 'lucide-react';

export function TrustSecurity() {
  const points = [
    { title: "Secure Authentication", icon: KeyRound },
    { title: "Protected Payments", icon: Lock },
    { title: "Privacy First", icon: EyeOff },
    { title: "Encrypted Data", icon: ShieldAlert },
    { title: "Transparent Pricing", icon: Receipt },
    { title: "Human Verification", icon: UserCheck },
    { title: "Continuous Monitoring", icon: Activity },
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-foreground text-background">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-heading mb-6">
            Trust & Security at Our Core
          </h2>
          <p className="text-lg text-zinc-400 mb-8 max-w-lg">
            When handling international payments, educational fees, and sensitive medical bookings, trust is not optional—it&apos;s foundational. We employ fintech-grade security measures across our entire ecosystem.
          </p>
          <div className="flex flex-wrap gap-3">
            {points.map((pt, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full text-sm font-bold border border-zinc-700">
                <pt.icon className="w-4 h-4 text-primary" />
                {pt.title}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          {/* Abstract Security Graphic */}
          <div className="relative w-72 h-72">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-4 border-4 border-primary/40 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-8 border-4 border-primary/60 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-24 h-24 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
