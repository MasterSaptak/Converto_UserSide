'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  ShieldCheck,
  Globe2,
  Zap,
  Star,
  X,
} from 'lucide-react';
import { ServiceConfig } from '@/modules/service-engine/types';
import { ServiceRegistry } from '@/modules/service-engine/configs';
import { cn } from '@/lib/utils';

// Placeholder for future analytics integration
const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  console.log(`[Analytics] ${eventName}`, properties || {});
};

/* ─── Intersection Observer hook for scroll-reveal ─── */
function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── Small reusable reveal wrapper ─── */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN LAYOUT
   ═══════════════════════════════════════════════════════ */

interface Props {
  serviceId: string;
}

export function ServiceLandingLayout({ serviceId }: Props) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const config = ServiceRegistry.get(serviceId);

  useEffect(() => {
    if (config) trackEvent('Service Viewed', { service_id: config.id });
  }, [config?.id]);

  if (!config) return null;

  // JSON-LD Schema
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: config.title,
    description: config.seoDescription || config.shortDescription,
    provider: { '@type': 'Organization', name: 'Converto', url: 'https://converto.com' },
    areaServed: 'Worldwide',
    ...(config.faqs &&
      config.faqs.length > 0 && {
        mainEntity: config.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }),
  };

  return (
    <div className="w-full bg-background min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground relative pb-28">
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ─── Floating Sticky CTA (mobile full-width, desktop bottom-right) ─── */}
      <div className="fixed bottom-0 left-0 w-full md:w-auto md:bottom-6 md:right-6 md:left-auto z-50 animate-in slide-in-from-bottom-8 duration-700 delay-700">
        <div className="md:backdrop-blur-md md:bg-card/80 md:border md:border-foreground/10 md:shadow-lg p-3 md:p-3">
          <Link
            href={config.actionRoute}
            onClick={() => trackEvent('Sticky CTA Clicked', { service_id: config.id })}
          >
            <button className="w-full md:w-auto group relative inline-flex items-center justify-center px-8 py-3.5 bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm border-2 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-foreground)] transition-all">
              <span className="relative z-10 flex items-center gap-2">
                {config.actionButton}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          1. HERO SECTION — Balanced 2-column
         ══════════════════════════════════════════════════ */}
      <section className="relative w-full pt-8 pb-12 md:pt-12 md:pb-16 overflow-hidden">
        {/* Subtle gradient backdrop instead of harsh border */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
          {/* Left — Content */}
          <div className="flex flex-col gap-5 order-2 md:order-1">
            {/* Badges */}
            {config.badges && config.badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {config.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest border-2 border-foreground shadow-[2px_2px_0px_var(--color-foreground)]"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-[0.95] font-heading text-foreground">
              {config.title}
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
              {config.shortDescription}
            </p>

            {/* CTA + Micro-trust */}
            <div className="flex flex-col gap-3 mt-1">
              <Link
                href={config.actionRoute}
                onClick={() => trackEvent('Hero CTA Clicked', { service_id: config.id })}
              >
                <button className="group relative inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm border-2 border-foreground shadow-[6px_6px_0px_var(--color-foreground)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[0px_0px_0px_var(--color-foreground)] transition-all">
                  <span className="relative z-10 flex items-center gap-2">
                    {config.actionButton}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
              <p className="text-[11px] text-muted-foreground flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> No hidden fees</span>
                <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Guaranteed service</span>
                <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> 24/7 support</span>
              </p>
            </div>

            {/* Quick Statistics */}
            {config.statistics && config.statistics.length > 0 && (
              <div className="flex gap-6 mt-2 pt-4 border-t border-foreground/10">
                {config.statistics.map((stat, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-2xl md:text-3xl font-black font-heading text-foreground">{stat.value}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — Hero Image */}
          <div className="flex justify-center order-1 md:order-2">
            <div className="relative w-full max-w-md">
              {/* Decorative offset shape behind */}
              <div className="absolute -bottom-3 -right-3 w-full h-full bg-primary/10 border-2 border-foreground/10" />
              <div className="relative bg-white border-2 border-foreground shadow-[6px_6px_0px_var(--color-foreground)] overflow-hidden group">
                <div className="w-full h-full bg-primary/[0.03] flex items-center justify-center group-hover:scale-[1.03] transition-transform duration-500">
                  {config.media?.hero ? (
                    <img
                      src={config.media.hero}
                      alt={config.title}
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-video bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. SLIM CONFIDENCE BAR
         ══════════════════════════════════════════════════ */}
      <Reveal>
        <section className="max-w-6xl mx-auto px-4 md:px-8 -mt-2 mb-12 relative z-20">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4 px-6 border border-foreground/10 bg-card/60 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Secure Payments</span>
            </div>
            <span className="hidden sm:block text-foreground/15">•</span>
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Global Access</span>
            </div>
            <span className="hidden sm:block text-foreground/15">•</span>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Fast Processing</span>
            </div>
            <span className="hidden sm:block text-foreground/15">•</span>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Verified Partners</span>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ Content Wrapper — consistent max-width & spacing ═══ */}
      <div className="flex flex-col gap-16 md:gap-20">

        {/* ══════════════════════════════════════════════════
            3. WHAT IT DOES — Text block, integrated heading
           ══════════════════════════════════════════════════ */}
        {config.whatItDoes && (
          <Reveal>
            <section className="max-w-4xl mx-auto px-4 md:px-8 text-center flex flex-col gap-4">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-heading text-primary leading-tight">
                {config.whatItDoes.title}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {config.whatItDoes.description}
              </p>
            </section>
          </Reveal>
        )}

        {/* ══════════════════════════════════════════════════
            4. WHY CHOOSE US — Card with personality
           ══════════════════════════════════════════════════ */}
        {config.whyChooseUs && (
          <Reveal>
            <section className="max-w-5xl mx-auto px-4 md:px-8 w-full">
              <div className="relative bg-card border-2 border-foreground p-8 md:p-12 shadow-[6px_6px_0px_var(--color-foreground)] overflow-hidden group">
                {/* Decorative blob */}
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                <div className="relative z-10 flex flex-col gap-4 max-w-3xl">
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-heading">
                    {config.whyChooseUs.title}
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {config.whyChooseUs.description}
                  </p>
                </div>
              </div>
            </section>
          </Reveal>
        )}

        {/* ══════════════════════════════════════════════════
            5. KEY FEATURES — 3-column grid with icon cards
           ══════════════════════════════════════════════════ */}
        {config.features && config.features.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 md:px-8 w-full flex flex-col gap-10">
            <Reveal>
              <div className="flex flex-col gap-3 text-center items-center">
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-heading">
                  Key Features
                </h2>
                <div className="w-16 h-1.5 bg-primary" />
              </div>
            </Reveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.features.map((feature, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="bg-card border border-foreground/10 p-6 md:p-8 flex flex-col gap-5 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-md transition-all duration-300 h-full">
                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center border border-primary/20">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-base font-black uppercase tracking-tight">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════
            6. HOW IT WORKS — Numbered timeline steps
           ══════════════════════════════════════════════════ */}
        {config.howItWorks && config.howItWorks.length > 0 && (
          <section className="w-full bg-secondary/50 py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col gap-12">
              <Reveal>
                <div className="text-center flex flex-col items-center gap-3">
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-heading">
                    How It Works
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Simple, transparent, and fast. Here&apos;s our process.
                  </p>
                </div>
              </Reveal>

              <div className="grid md:grid-cols-3 gap-8 md:gap-10 relative">
                {/* Connecting line (desktop only) */}
                <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-px border-t-2 border-dashed border-foreground/15 z-0" />

                {config.howItWorks.map((step, i) => (
                  <Reveal key={i} delay={i * 150}>
                    <div className="relative z-10 flex flex-col items-center text-center gap-5 group">
                      <div className="w-20 h-20 bg-primary flex items-center justify-center text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-300">
                        <step.icon className="w-9 h-9" />
                      </div>
                      <div className="flex flex-col gap-2 items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-background border border-foreground/20 px-3 py-1">
                          Step 0{i + 1}
                        </span>
                        <h3 className="text-base font-black uppercase tracking-tight mt-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={300}>
                <div className="flex justify-center pt-4">
                  <Link
                    href={config.actionRoute}
                    onClick={() => trackEvent('How It Works CTA Clicked', { service_id: config.id })}
                    className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 text-sm font-bold uppercase tracking-wider border-2 border-foreground shadow-[4px_4px_0px_var(--color-primary)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-primary)] transition-all"
                  >
                    Start Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════
            7. COMPARISON — Traditional vs. Converto
           ══════════════════════════════════════════════════ */}
        {config.comparison && (
          <section className="max-w-5xl mx-auto px-4 md:px-8 w-full flex flex-col gap-8">
            <Reveal>
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-heading">
                  Why Choose Converto?
                </h2>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="grid md:grid-cols-2 gap-0 border-2 border-foreground shadow-[6px_6px_0px_var(--color-foreground)] bg-card overflow-hidden">
                {/* Traditional */}
                <div className="p-6 md:p-8 border-b-2 md:border-b-0 md:border-r-2 border-foreground bg-secondary/40 flex flex-col gap-5">
                  <h3 className="text-lg font-black uppercase tracking-tight text-muted-foreground">
                    {config.comparison.traditional.title || 'Traditional'}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {config.comparison.traditional.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Converto */}
                <div className="p-6 md:p-8 bg-primary/[0.06] flex flex-col gap-5 relative overflow-hidden">
                  <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                  <h3 className="text-lg font-black uppercase tracking-tight text-primary relative z-10">
                    {config.comparison.converto.title || 'Converto'}
                  </h3>
                  <ul className="flex flex-col gap-3 relative z-10">
                    {config.comparison.converto.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* ══════════════════════════════════════════════════
            8. BENEFITS — Horizontal card strip
           ══════════════════════════════════════════════════ */}
        {config.benefits && config.benefits.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 md:px-8 w-full flex flex-col gap-10">
            <Reveal>
              <div className="flex flex-col items-center text-center gap-3">
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-heading">
                  The Converto Advantage
                </h2>
              </div>
            </Reveal>
            <div className={cn(
              'grid gap-5',
              config.benefits.length <= 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'
            )}>
              {config.benefits.map((benefit, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="flex flex-col gap-3 p-5 border border-foreground/10 bg-card hover:border-foreground/25 transition-colors h-full">
                    <div className="flex items-center gap-3 pb-3 border-b border-foreground/8">
                      <div className="w-8 h-8 bg-emerald-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-widest leading-tight">{benefit.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════
            9. FAQ — Clean accordion
           ══════════════════════════════════════════════════ */}
        {config.faqs && config.faqs.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 md:px-8 w-full flex flex-col gap-8">
            <Reveal>
              <div className="flex flex-col items-center text-center gap-3">
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-heading">
                  Frequently Asked Questions
                </h2>
              </div>
            </Reveal>
            <div className="flex flex-col gap-3">
              {config.faqs.map((faq, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="border border-foreground/10 bg-card overflow-hidden hover:border-foreground/20 transition-colors">
                    <button
                      onClick={() => {
                        setOpenFAQ(openFAQ === i ? null : i);
                        if (openFAQ !== i)
                          trackEvent('FAQ Opened', { service_id: config.id, question: faq.question });
                      }}
                      className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none hover:bg-secondary/40 transition-colors"
                    >
                      <span className="text-sm font-bold pr-4">{faq.question}</span>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform duration-300 shrink-0 text-muted-foreground',
                          openFAQ === i && 'rotate-180 text-primary',
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        'px-5 overflow-hidden transition-all duration-300 ease-in-out',
                        openFAQ === i
                          ? 'max-h-96 py-4 border-t border-foreground/8'
                          : 'max-h-0',
                      )}
                    >
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════
            10. RELATED SERVICES
           ══════════════════════════════════════════════════ */}
        {config.relatedServices && config.relatedServices.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 md:px-8 w-full flex flex-col gap-8 pt-8 border-t border-foreground/10">
            <Reveal>
              <div className="flex flex-col gap-2 text-center items-center">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-heading">
                  Explore Related Services
                </h2>
              </div>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {config.relatedServices.map((service) => (
                <Reveal key={service.id} delay={100}>
                  <Link
                    href={service.href}
                    onClick={() =>
                      trackEvent('Related Service Clicked', {
                        from_service: config.id,
                        to_service: service.id,
                      })
                    }
                    className="group border border-foreground/10 bg-card p-5 flex flex-col gap-4 hover:border-foreground/25 hover:shadow-sm transition-all"
                  >
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <service.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">
                        {service.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════
            11. NEED HELP CTA
           ══════════════════════════════════════════════════ */}
        <Reveal>
          <section className="max-w-5xl mx-auto px-4 md:px-8 w-full">
            <div className="bg-foreground text-background p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-2 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-heading">
                  Still have questions?
                </h2>
                <p className="text-sm opacity-70">
                  Our team is here to help you 24/7. Get in touch and we&apos;ll respond within minutes.
                </p>
              </div>
              <Link
                href="/support"
                className="shrink-0 inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-sm font-bold uppercase tracking-wider border-2 border-primary-foreground/20 hover:bg-primary/90 transition-colors"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
