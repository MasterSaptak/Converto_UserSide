'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 px-4 md:px-8 bg-zinc-50 border-b border-foreground/10">
      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center gap-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter font-heading leading-[0.9]"
        >
          Building a Better Way <br />
          To Access <span className="text-primary">Global Services</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed"
        >
          Converto is redefining how people access global services—bringing international payments, shopping, education, travel, healthcare, and everyday digital assistance together in one intelligent platform.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-4"
        >
          <Link 
            href="/services"
            className="px-8 py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[4px_4px_0px_var(--color-foreground)] hover:shadow-[6px_6px_0px_var(--color-foreground)] border-2 border-foreground"
          >
            Explore Services
          </Link>
          <Link 
            href="/support"
            className="px-8 py-4 bg-background text-foreground font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[4px_4px_0px_var(--color-foreground)] hover:shadow-[6px_6px_0px_var(--color-foreground)] border-2 border-foreground"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>

      {/* Decorative Animated Globe Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.05] pointer-events-none overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
          className="w-[800px] h-[800px] rounded-full border-[1px] border-foreground border-dashed flex items-center justify-center"
        >
          <div className="w-[600px] h-[600px] rounded-full border-[1px] border-foreground border-dotted flex items-center justify-center">
            <div className="w-[400px] h-[400px] rounded-full border-[1px] border-foreground opacity-50 flex items-center justify-center">
              <div className="w-[200px] h-[200px] rounded-full border-[1px] border-foreground opacity-25" />
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none" />
    </section>
  );
}
