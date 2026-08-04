import { RefreshCcw, Globe2, ShieldCheck, Zap, ArrowRightLeft, TrendingUp, DollarSign, Lock } from 'lucide-react';
import { ServiceConfig, ServiceCategory, ServiceStatus } from '../types';
import { ServiceMediaAssets } from '../media';

export const exchangeConfig: ServiceConfig = {
  id: 'exchange',
  slug: 'exchange',
  title: 'Currency Exchange',
  titleKey: 'service.exchange.title',
  shortDescription: 'Exchange currencies at real market rates instantly.',
  shortDescriptionKey: 'service.exchange.shortDesc',
  
  category: ServiceCategory.FINANCIAL,
  status: ServiceStatus.ACTIVE,
  order: 3,
  
  seoTitle: 'Currency Exchange | Converto',
  seoDescription: 'Fast, secure, and low-cost currency exchange.',
  searchKeywords: ['currency exchange', 'forex', 'money exchange', 'best rates'],
  
  media: ServiceMediaAssets.exchange,
  
  capabilities: {
    supportsTracking: true, supportsPayments: true, supportsDocuments: true,
    supportsChat: true, supportsRealtimeUpdates: true, supportsScheduling: false,
  },
  
  permissions: { customer: true, staff: true, admin: true },
  
  featureFlags: {
    enableReviews: true, enableFAQ: true, enableCalculator: true,
    enableLiveTracking: true, enableChat: true, enableCoupons: false,
  },
  
  lifecycle: { createdAt: '2026-08-01', updatedAt: '2026-08-04', version: '2.0.0', author: 'Converto Core' },
  
  actionButton: 'Exchange Now',
  actionButtonKey: 'service.exchange.cta',
  actionRoute: '/services/exchange/request',
  
  badges: ['Best Rates', 'Instant'],
  statistics: [
    { label: 'Supported Currencies', value: '40+' },
    { label: 'Average Exchange Time', value: '< 5 Mins' },
  ],
  
  whatItDoes: { 
    title: 'Borderless Money', 
    description: 'Convert your money into 40+ currencies at the mid-market rate. No hidden markups, no weekend surcharges, just transparent exchanges.' 
  },
  whyChooseUs: { 
    title: 'Stop Paying Bank Fees', 
    description: 'Traditional banks charge up to 5% in hidden spread fees. We give you the real exchange rate.' 
  },
  
  comparison: {
    traditional: { title: 'Traditional Banks', points: ['Hidden Exchange Markups', 'Slow Processing', 'High Transfer Fees', 'Limited Currencies'] },
    converto: { title: 'Converto Exchange', points: ['Real Mid-Market Rate', 'Instant Conversion', 'Low Transparent Fee', '40+ Global Currencies'] }
  },
  
  features: [
    { title: 'Real Rates', description: 'Get the exchange rate you see on Google.', icon: TrendingUp },
    { title: 'Bank-grade Security', description: 'Your funds are safeguarded at all times.', icon: ShieldCheck },
    { title: 'Lightning Fast', description: 'Most exchanges settle instantly in your wallet.', icon: Zap },
  ],
  
  howItWorks: [
    { title: 'Check Rate', description: 'Use our calculator to see the exact amount.', icon: DollarSign },
    { title: 'Fund Account', description: 'Deposit funds using local payment methods.', icon: Lock },
    { title: 'Convert', description: 'Exchange instantly and hold or send.', icon: ArrowRightLeft },
  ],
  
  faqs: [
    { question: 'What is the mid-market rate?', answer: 'It\'s the real exchange rate without any secret bank markups.' },
    { question: 'Are there limits on how much I can exchange?', answer: 'Limits depend on your account verification tier.' },
  ]
};
