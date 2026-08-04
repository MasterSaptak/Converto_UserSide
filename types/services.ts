import { LucideIcon } from 'lucide-react';

export interface ServiceStep {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ServiceFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceBenefit {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ServiceComparison {
  traditional: {
    title?: string;
    points: string[];
  };
  converto: {
    title?: string;
    points: string[];
  };
}

export interface ServiceTestimonial {
  name: string;
  role?: string;
  quote: string;
  avatar?: string;
}

export interface ServiceConfig {
  // Identification
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  
  // Visuals
  heroImage?: string;
  heroGradient?: string;
  icon?: LucideIcon;
  
  // Classification
  category?: string;
  
  // Actions
  actionButton: string;
  actionRoute: string;
  
  // Trust & Status
  badges?: string[];
  statistics?: { label: string; value: string }[];
  supportedCountries?: string[];
  supportedCurrencies?: string[];
  
  // Logistics
  eligibility?: string[];
  requirements?: string[];
  processingTime?: string;
  pricing?: string;
  
  // Core Content (All Optional for flexibility)
  whatItDoes?: {
    title: string;
    description: string;
  };
  whyChooseUs?: {
    title: string;
    description: string;
  };
  features?: ServiceFeature[];
  howItWorks?: ServiceStep[];
  benefits?: ServiceBenefit[];
  faqs?: ServiceFAQ[];
  comparison?: ServiceComparison;
  testimonials?: ServiceTestimonial[];
  
  // Relational
  relatedServices?: {
    id: string;
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
  }[];
}
