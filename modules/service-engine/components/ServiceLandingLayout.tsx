'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, CheckCircle2, ShieldCheck, Globe2, Zap, X } from 'lucide-react';
import { ServiceConfig } from '@/modules/service-engine/types';
import { ServiceRegistry } from '@/modules/service-engine/configs';
import { cn } from '@/lib/utils';

// Placeholder for future analytics integration (PostHog, Mixpanel, etc.)
const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  console.log(`[Analytics] ${eventName}`, properties || {});
};

interface Props {
  serviceId: string;
}

export function ServiceLandingLayout({ serviceId }: Props) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
  const config = ServiceRegistry.get(serviceId);

  useEffect(() => {
    if (config) {
      trackEvent('Service Viewed', { service_id: config.id });
    }
  }, [config?.id]);

  if (!config) return null;

  // Generate JSON-LD Schema
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: config.title,
    description: config.seoDescription || config.shortDescription,
    provider: {
      '@type': 'Organization',
      name: 'Converto',
      url: 'https://converto.com'
    },
    areaServed: 'Worldwide',
    ...(config.faqs && config.faqs.length > 0 && {
      mainEntity: config.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    })
  };

  return (
    <div className="w-full bg-background min-h-screen text-foreground font-mono selection:bg-primary selection:text-primary-foreground relative pb-24">
      {/* Inject SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Floating Sticky CTA (Desktop: Bottom Right, Mobile: Full Width Bottom) */}
      <div className="fixed bottom-0 left-0 w-full md:w-auto md:bottom-8 md:right-8 z-50 p-4 md:p-0 animate-in slide-in-from-bottom-10 duration-700 delay-500">
        <Link href={config.actionRoute} onClick={() => trackEvent('Sticky CTA Clicked', { service_id: config.id })}>
          <button className="w-full md:w-auto group relative inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider overflow-hidden border-2 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-foreground)] transition-all">
            <span className="relative z-10 flex items-center gap-2">
              {config.actionButton}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative w-full pt-12 pb-16 px-4 md:px-8 border-b-2 border-foreground overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
          
          <div className="flex-1 w-full flex flex-col items-start gap-6 z-10">
            {config.badges && (
              <div className="flex flex-wrap gap-2 animate-in slide-in-from-left-4 duration-500">
                {config.badges.map((badge, idx) => (
                  <span key={idx} className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest border border-foreground shadow-[2px_2px_0px_var(--color-foreground)]">
                    {badge}
                  </span>
                ))}
              </div>
            )}
            
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.9] text-foreground animate-in slide-in-from-bottom-4 duration-700">
              {config.title}
            </h1>
            
            <p className="text-lg md:text-xl font-medium max-w-lg text-muted-foreground uppercase tracking-wide animate-in fade-in duration-700 delay-200">
              {config.shortDescription}
            </p>

            <Link href={config.actionRoute} onClick={() => trackEvent('Hero CTA Clicked', { service_id: config.id })}>
              <button className="mt-4 group relative inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider overflow-hidden border-2 border-foreground shadow-[6px_6px_0px_var(--color-foreground)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[0px_0px_0px_var(--color-foreground)] transition-all animate-in zoom-in duration-500 delay-300">
                <span className="relative z-10 flex items-center gap-2">
                  {config.actionButton} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
          </div>

          <div className="flex-1 w-full flex justify-center z-10 animate-in fade-in duration-1000 delay-300">
            <div className="relative w-full max-w-lg border-2 border-foreground bg-white shadow-[8px_8px_0px_var(--color-foreground)] overflow-hidden group">
              <div className="w-full h-full bg-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                 {config.media?.hero ? (
                    <img src={config.media.hero} alt={config.title} className="w-full h-auto object-cover" />
                 ) : (
                    <div className="w-full aspect-video bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                 )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="px-4 md:px-12 max-w-7xl mx-auto w-full -mt-8 md:-mt-16 relative z-20">
        <div className="bg-background border-2 border-foreground p-4 md:p-6 shadow-[4px_4px_0px_var(--color-foreground)] flex flex-wrap md:flex-nowrap justify-between gap-4 md:gap-8 items-center text-center">
          <div className="flex-1 flex flex-col md:flex-row items-center gap-2 justify-center">
               <ShieldCheck className="w-5 h-5 text-emerald-600" />
               <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Secure Payments</span>
            </div>
            <div className="hidden md:block w-0.5 h-8 bg-foreground/20" />
            <div className="flex-1 flex flex-col md:flex-row items-center gap-2 justify-center">
               <Globe2 className="w-5 h-5 text-blue-600" />
               <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Global Services</span>
            </div>
            <div className="hidden md:block w-0.5 h-8 bg-foreground/20" />
            <div className="flex-1 flex flex-col md:flex-row items-center gap-2 justify-center">
               <Zap className="w-5 h-5 text-amber-500" />
               <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Fast Processing</span>
            </div>
          </div>
        </section>

        {/* 2. What it does */}
        {config.whatItDoes && (
          <section className="px-4 md:px-12 max-w-5xl mx-auto text-center flex flex-col gap-6 animate-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter font-heading text-primary">
              {config.whatItDoes.title}
            </h2>
            <p className="text-sm md:text-base font-bold uppercase tracking-widest opacity-80 leading-relaxed max-w-3xl mx-auto">
              {config.whatItDoes.description}
            </p>
          </section>
        )}

        {/* 3. Why Choose Us / Value Prop */}
        {config.whyChooseUs && (
          <section className="px-4 md:px-12 w-full max-w-7xl mx-auto">
            <div className="border-2 border-foreground bg-card p-8 md:p-16 shadow-[8px_8px_0px_var(--color-foreground)] relative overflow-hidden group">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              <h2 className="text-3xl font-black uppercase tracking-tighter font-heading mb-6 relative z-10">
                {config.whyChooseUs.title}
              </h2>
              <p className="text-sm md:text-base font-bold uppercase tracking-widest opacity-80 max-w-3xl relative z-10 leading-loose">
                {config.whyChooseUs.description}
              </p>
            </div>
          </section>
        )}

        {/* MINI COMPARISON */}
        {config.comparison && (
          <section className="px-4 md:px-12 max-w-5xl mx-auto w-full flex flex-col gap-8">
            <div className="text-center">
              <h2 className="text-3xl font-black uppercase tracking-tighter font-heading">Why Choose Converto?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-0 border-2 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] bg-white overflow-hidden">
              <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-foreground bg-slate-50 flex flex-col gap-6">
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-500">{config.comparison.traditional.title || 'Traditional'}</h3>
                <ul className="flex flex-col gap-4">
                  {config.comparison.traditional.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-sm font-bold uppercase tracking-widest opacity-70">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 bg-primary/10 flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
                <h3 className="text-xl font-black uppercase tracking-tighter text-primary relative z-10">{config.comparison.converto.title || 'Converto'}</h3>
                <ul className="flex flex-col gap-4 relative z-10">
                  {config.comparison.converto.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-sm font-bold uppercase tracking-widest text-black">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* 4. Key Features */}
        {config.features && config.features.length > 0 && (
          <section className="px-4 md:px-12 max-w-7xl mx-auto w-full flex flex-col gap-12">
            <div className="flex flex-col gap-4 text-center items-center">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter font-heading">Key Features</h2>
              <div className="w-24 h-2 bg-primary border-2 border-foreground" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {config.features.map((feature, i) => (
                <div key={i} className="border-2 border-foreground bg-background p-8 flex flex-col gap-6 hover:-translate-y-2 transition-transform duration-300 shadow-[4px_4px_0px_var(--color-foreground)]">
                  <div className="w-14 h-14 border-2 border-foreground bg-secondary flex items-center justify-center shadow-[2px_2px_0px_var(--color-foreground)]">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-black uppercase tracking-tighter">{feature.title}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. How It Works */}
        {config.howItWorks && config.howItWorks.length > 0 && (
          <section className="px-4 md:px-12 w-full border-y-2 border-foreground bg-secondary py-16 md:py-24">
            <div className="max-w-7xl mx-auto flex flex-col gap-16">
              <div className="text-center flex flex-col items-center gap-4">
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter font-heading">How It Works</h2>
                <p className="text-xs font-bold uppercase tracking-widest opacity-60 max-w-xl">Simple, transparent, and fast. Here is our process.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-12 md:gap-12 relative mt-4">
                <div className="hidden md:block absolute top-10 left-24 right-24 h-0.5 border-t-2 border-dashed border-foreground/30 z-0" />
                
                {config.howItWorks.map((step, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center text-center gap-6 group animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: `${i * 150}ms` }}>
                    <div className="w-20 h-20 rounded-full border-2 border-foreground bg-primary flex items-center justify-center text-primary-foreground shadow-[4px_4px_0px_var(--color-foreground)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                      <step.icon className="w-10 h-10" />
                    </div>
                    <div className="flex flex-col gap-3 items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-background border-2 border-foreground px-3 py-1 shadow-[2px_2px_0px_var(--color-foreground)]">Step 0{i + 1}</span>
                      <h3 className="text-lg font-black uppercase tracking-tighter mt-2">{step.title}</h3>
                      <p className="text-xs font-bold uppercase tracking-widest opacity-70 leading-relaxed max-w-[250px]">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center pt-12">
                <Link 
                  href={config.actionRoute} 
                  onClick={() => trackEvent('How It Works CTA Clicked', { service_id: config.id })}
                  className="brutal-button bg-black text-white px-10 py-4 text-sm md:text-base shadow-[6px_6px_0px_var(--color-primary)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
                >
                  Start Now
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 6. Benefits */}
        {config.benefits && config.benefits.length > 0 && (
          <section className="px-4 md:px-12 max-w-7xl mx-auto w-full flex flex-col gap-12">
            <div className="flex flex-col items-center text-center gap-4">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter font-heading">The Converto Advantage</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {config.benefits.map((benefit, i) => (
                <div key={i} className="flex flex-col gap-4 p-6 border-2 border-foreground/10 hover:border-foreground bg-card transition-colors">
                  <div className="flex items-center gap-3 border-b-2 border-foreground/10 pb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <h4 className="text-sm font-black uppercase tracking-widest leading-tight">{benefit.title}</h4>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. FAQ */}
        {config.faqs && config.faqs.length > 0 && (
          <section className="px-4 md:px-12 max-w-4xl mx-auto w-full flex flex-col gap-10">
            <div className="flex flex-col items-center text-center gap-4">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter font-heading">Frequently Asked Questions</h2>
            </div>
            <div className="flex flex-col gap-4">
              {config.faqs.map((faq, i) => (
                <div key={i} className="border-2 border-foreground bg-card overflow-hidden shadow-[4px_4px_0px_var(--color-foreground)]">
                  <button 
                    onClick={() => {
                      setOpenFAQ(openFAQ === i ? null : i);
                      if (openFAQ !== i) trackEvent('FAQ Opened', { service_id: config.id, question: faq.question });
                    }}
                    className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-secondary transition-colors text-left focus:outline-none"
                  >
                    <span className="text-sm font-bold uppercase tracking-widest pr-4">{faq.question}</span>
                    <ChevronDown className={cn("w-5 h-5 transition-transform duration-300 shrink-0", openFAQ === i && "rotate-180 text-primary")} />
                  </button>
                  <div 
                    className={cn(
                      "px-6 overflow-hidden transition-all duration-300 ease-in-out bg-secondary/30",
                      openFAQ === i ? "max-h-96 py-6 border-t-2 border-foreground/10" : "max-h-0"
                    )}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. Related Services */}
        {config.relatedServices && config.relatedServices.length > 0 && (
          <section className="px-4 md:px-12 max-w-7xl mx-auto w-full flex flex-col gap-10 border-t-2 border-foreground pt-20 mt-10">
            <div className="flex flex-col gap-2 text-center items-center">
              <h2 className="text-3xl font-black uppercase tracking-tighter font-heading">Explore Related Services</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.relatedServices.map((service) => (
                <Link 
                  key={service.id} 
                  href={service.href} 
                  onClick={() => trackEvent('Related Service Clicked', { from_service: config.id, to_service: service.id })}
                  className="group border-2 border-foreground bg-card p-6 flex flex-col gap-5 hover:bg-secondary transition-colors shadow-[4px_4px_0px_var(--color-foreground)] hover:translate-x-1 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-foreground bg-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-[2px_2px_0px_var(--color-foreground)]">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">{service.title}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 leading-relaxed">{service.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
    </div>
  );
}
