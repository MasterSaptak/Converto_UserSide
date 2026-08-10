import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe2, ShieldCheck, Zap } from 'lucide-react';
import { JsonLd } from './JsonLd';
import { InternalLink } from '@/lib/seo';

interface SEOPageLayoutProps {
  title: string;
  description: string;
  category: string;
  categoryLink: string;
  breadcrumbs: { name: string; url: string }[];
  features?: { title: string; description: string; icon: React.ElementType }[];
  faqs?: { question: string; answer: string }[];
  ctaText?: string;
  ctaLink?: string;
  relatedLinks?: InternalLink[];
  children?: React.ReactNode;
}

export function SEOPageLayout({
  title,
  description,
  category,
  categoryLink,
  breadcrumbs,
  features = [
    { title: 'Global Network', description: 'Reach over 100 countries effortlessly.', icon: Globe2 },
    { title: 'Secure & Reliable', description: 'Bank-grade encryption for all transactions.', icon: ShieldCheck },
    { title: 'Lightning Fast', description: 'Experience near-instant processing.', icon: Zap },
  ],
  faqs,
  ctaText = 'Get Started',
  ctaLink = '/',
  relatedLinks,
  children
}: SEOPageLayoutProps) {
  // Base Breadcrumb Schema
  const breadcrumbSchema = {
    type: 'BreadcrumbList' as const,
    items: breadcrumbs,
  };

  // Base FAQ Schema
  const faqSchema = faqs && faqs.length > 0 ? {
    type: 'FAQPage' as const,
    questions: faqs,
  } : null;

  return (
    <div className="w-full bg-background min-h-screen text-foreground pb-20">
      <JsonLd data={breadcrumbSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      
      {/* Header / Hero */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-8 border-b border-foreground/10 bg-zinc-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col gap-6 items-start">
          <Link 
            href={categoryLink}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {category}
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight font-heading leading-[0.9]">
            {title}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>
          
          <Link 
            href={ctaLink}
            className="mt-4 px-8 py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[4px_4px_0px_var(--color-foreground)] hover:shadow-[6px_6px_0px_var(--color-foreground)] border-2 border-foreground"
          >
            {ctaText}
          </Link>
        </div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none" />
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col gap-16">
        {children}

        {/* Features */}
        {features.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-8 pt-10 border-t border-foreground/10">
            {features.map((feature, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* FAQs */}
        {faqs && faqs.length > 0 && (
          <div className="flex flex-col gap-8 pt-10 border-t border-foreground/10">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-heading">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-foreground/10 p-5 bg-card">
                  <h3 className="font-bold text-base mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Searches / Internal Links */}
        {relatedLinks && relatedLinks.length > 0 && (
          <div className="flex flex-col gap-6 pt-10 border-t border-foreground/10">
            <h2 className="text-xl font-black uppercase tracking-tight font-heading">
              People Also Search For
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.url}
                  className="px-4 py-2 bg-secondary/50 hover:bg-secondary text-sm font-bold border border-foreground/10 hover:border-foreground/30 transition-colors rounded-full"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
