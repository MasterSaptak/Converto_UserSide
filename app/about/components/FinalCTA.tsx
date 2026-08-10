import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-32 px-4 md:px-8 bg-primary text-primary-foreground text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight font-heading leading-[0.9]">
          Ready to Experience Smarter Global Services?
        </h2>
        
        <p className="text-lg md:text-xl opacity-90 max-w-2xl">
          Join thousands of users who have simplified their international payments, shopping, and travel with Converto.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link 
            href="/auth/register"
            className="px-8 py-4 bg-background text-foreground font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[4px_4px_0px_rgba(0,0,0,0.2)] border-2 border-transparent hover:border-foreground flex items-center gap-2"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/services"
            className="px-8 py-4 bg-transparent text-primary-foreground border-2 border-primary-foreground font-black uppercase tracking-widest text-sm hover:bg-primary-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            Explore Services
          </Link>
          <Link 
            href="/support"
            className="px-8 py-4 bg-transparent text-primary-foreground border-2 border-primary-foreground font-black uppercase tracking-widest text-sm hover:bg-primary-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
