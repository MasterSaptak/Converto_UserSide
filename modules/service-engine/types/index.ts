import { LucideIcon } from 'lucide-react';

export enum ServiceCategory {
  FINANCIAL = 'financial',
  TRAVEL = 'travel',
  EDUCATION = 'education',
  HEALTHCARE = 'healthcare',
  LOGISTICS = 'logistics',
  SHOPPING = 'shopping'
}

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  BETA = 'BETA',
  COMING_SOON = 'COMING_SOON',
  MAINTENANCE = 'MAINTENANCE',
  HIDDEN = 'HIDDEN'
}

export interface ServiceMedia {
  icon?: string;
  thumbnail?: string;
  card?: string;
  hero?: string;
  banner?: string;
  cover?: string;
  socialPreview?: string;
  logo?: string;
  favicon?: string;
  gallery?: string[];
}

export interface ServiceCapabilities {
  supportsTracking: boolean;
  supportsPayments: boolean;
  supportsDocuments: boolean;
  supportsChat: boolean;
  supportsRealtimeUpdates: boolean;
  supportsScheduling: boolean;
}

export interface ServicePermissions {
  customer: boolean;
  staff: boolean;
  admin: boolean;
}

export interface ServiceFeatureFlags {
  enableReviews: boolean;
  enableFAQ: boolean;
  enableCalculator: boolean;
  enableLiveTracking: boolean;
  enableChat: boolean;
  enableCoupons: boolean;
}

export interface ServiceLifecycle {
  createdAt: string;
  updatedAt: string;
  version: string;
  author: string;
}

/* ─── SEO-Specific Types ─── */

export interface SEOKeywords {
  primary: string[];
  secondary: string[];
  longTail: string[];
}

export interface PaymentMethodInfo {
  name: string;
  slug: string;
  category: 'card' | 'wallet' | 'regional' | 'crypto' | 'bank';
  supported: boolean;
  /** If true, the feature is planned but not live */
  comingSoon?: boolean;
}

export interface CountryRoute {
  from: string;
  to: string;
  slug: string;
  /** e.g. "India → Bangladesh" */
  label: string;
}

export interface ShoppingPlatform {
  name: string;
  slug: string;
  supported: boolean;
}

export interface BankOffer {
  bankName: string;
  cardName: string;
  slug: string;
  supported: boolean;
}

export interface SEODrivenCTA {
  /** Displayed text, e.g. "Need to send money to Bangladesh?" */
  headline: string;
  /** CTA button text */
  buttonText: string;
  /** Link target */
  href: string;
}

export interface ServiceSEO {
  title: string;
  description: string;
  keywords: SEOKeywords;
  relatedSearches: string[];
  paymentMethods?: PaymentMethodInfo[];
  countryRoutes?: CountryRoute[];
  shoppingPlatforms?: ShoppingPlatform[];
  bankOffers?: BankOffer[];
  ctaSections?: SEODrivenCTA[];
}

/* ─── Main ServiceConfig ─── */

export interface ServiceConfig {
  id: string;
  slug: string;
  title: string;
  titleKey?: string;
  shortDescription: string;
  shortDescriptionKey?: string;
  
  category: ServiceCategory;
  status: ServiceStatus;
  order: number;
  
  seoTitle: string;
  seoDescription: string;
  searchKeywords: string[];
  
  /** Extended SEO data for Phase 2.5 discoverability */
  seo?: ServiceSEO;
  
  media: ServiceMedia;
  
  capabilities: ServiceCapabilities;
  permissions: ServicePermissions;
  featureFlags: ServiceFeatureFlags;
  lifecycle: ServiceLifecycle;
  
  actionButton: string;
  actionButtonKey?: string;
  actionRoute: string;
  
  badges?: string[];
  statistics?: { label: string; value: string }[];
  
  whatItDoes: {
    title: string;
    description: string;
  };
  
  whyChooseUs?: {
    title: string;
    description: string;
  };
  
  comparison?: {
    traditional: { title: string; points: string[] };
    converto: { title: string; points: string[] };
  };
  
  features: {
    title: string;
    description: string;
    icon: LucideIcon;
  }[];
  
  howItWorks?: {
    title: string;
    description: string;
    icon: LucideIcon;
  }[];
  
  benefits?: {
    title: string;
    description: string;
    icon: LucideIcon;
  }[];
  
  faqs?: {
    question: string;
    answer: string;
  }[];
  
  relatedServices?: {
    id: string;
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
  }[];
}

