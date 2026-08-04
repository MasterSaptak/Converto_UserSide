import { RefreshCcw, Globe2, ShieldCheck, Zap, ArrowRightLeft, TrendingUp, DollarSign, Lock } from 'lucide-react';
import { ServiceConfig, ServiceCategory, ServiceStatus } from '../types';
import { ServiceMediaAssets } from '../media';
import { PAYMENT_METHODS, CORRIDORS as COUNTRY_ROUTES } from '@/lib/seo';

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
  
  seoTitle: 'Currency Exchange | Best Forex Rates & Live Exchange Rate',
  seoDescription: 'Exchange currencies at real mid-market rates with zero hidden markup. Convert USD, INR, BDT, AED, GBP and 40+ currencies instantly through Converto.',
  searchKeywords: ['currency exchange', 'forex', 'exchange rate', 'best rates', 'USD to INR', 'USD to BDT', 'AED to INR', 'AED to BDT', 'live exchange rate'],

  seo: {
    title: 'Currency Exchange | Best Forex Rates & Live Exchange Rate',
    description: 'Exchange currencies at real mid-market rates with zero hidden markup. Convert USD, INR, BDT, AED, GBP and 40+ currencies instantly. No weekend surcharges, transparent fees.',
    keywords: {
      primary: ['currency exchange', 'forex', 'exchange rate', 'money exchange'],
      secondary: ['USD to INR', 'USD to BDT', 'AED to INR', 'AED to BDT', 'live exchange rate', 'best forex rates'],
      longTail: [
        'best currency exchange rate today',
        'USD to BDT exchange rate',
        'USD to INR best rate',
        'AED to BDT exchange rate',
        'how to get best forex rates',
        'cheapest currency exchange online',
        'real-time exchange rate calculator',
      ],
    },
    relatedSearches: [
      'Currency converter',
      'Forex rates today',
      'USD to INR',
      'USD to BDT',
      'AED to INR',
      'AED to BDT',
      'Best exchange rate',
      'Live forex',
      'Money exchange online',
      'International currency exchange',
    ],
    paymentMethods: PAYMENT_METHODS,
    countryRoutes: COUNTRY_ROUTES,
    ctaSections: [
      { headline: 'Need to exchange currencies?', buttonText: 'Exchange now', href: '/services/exchange/request' },
      { headline: 'Want to send money abroad at these rates?', buttonText: 'Global Payments', href: '/services/global-payments' },
      { headline: 'Paying tuition with the best exchange rate?', buttonText: 'Education Payments', href: '/services/education' },
    ],
  },
  
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
    description: 'Convert your money into 40+ currencies at the mid-market rate — the same rate you see on Google. No hidden markups, no weekend surcharges, just transparent exchanges. Track USD to INR, USD to BDT, AED to INR, and more in real-time.' 
  },
  whyChooseUs: { 
    title: 'Stop Paying Bank Fees', 
    description: 'Traditional banks charge up to 5% in hidden spread fees on currency exchange. Converto gives you the real exchange rate with a small transparent fee — saving you thousands on every conversion.' 
  },
  
  comparison: {
    traditional: { title: 'Traditional Banks', points: ['Hidden Exchange Markups', 'Slow Processing', 'High Transfer Fees', 'Limited Currencies'] },
    converto: { title: 'Converto Exchange', points: ['Real Mid-Market Rate', 'Instant Conversion', 'Low Transparent Fee', '40+ Global Currencies'] }
  },
  
  features: [
    { title: 'Real Rates', description: 'Get the exchange rate you see on Google — the true mid-market rate.', icon: TrendingUp },
    { title: 'Bank-grade Security', description: 'Your funds are safeguarded at all times with bank-level encryption.', icon: ShieldCheck },
    { title: 'Lightning Fast', description: 'Most exchanges settle instantly in your Converto wallet.', icon: Zap },
  ],
  
  howItWorks: [
    { title: 'Check Rate', description: 'Use our calculator to see the exact exchange rate and fees.', icon: DollarSign },
    { title: 'Fund Account', description: 'Deposit funds using local payment methods, bKash, Nagad, or bank transfer.', icon: Lock },
    { title: 'Convert', description: 'Exchange instantly and hold in your wallet or send abroad.', icon: ArrowRightLeft },
  ],
  
  faqs: [
    { question: 'What is the mid-market rate?', answer: 'It\'s the real exchange rate without any secret bank markups. The same rate you see on Google or XE.' },
    { question: 'Are there limits on how much I can exchange?', answer: 'Limits depend on your account verification tier. Verified accounts have higher limits.' },
    { question: 'What currencies do you support?', answer: 'We support 40+ currencies including USD, EUR, GBP, INR, BDT, AED, CAD, AUD, SGD, MYR, and more.' },
    { question: 'How fast is the exchange?', answer: 'Most exchanges are instant. The converted amount appears in your wallet within seconds.' },
    { question: 'Are there any hidden fees?', answer: 'No. We charge a small, transparent percentage fee that is shown before you confirm the exchange.' },
    { question: 'Can I hold multiple currencies?', answer: 'Yes! Your Converto wallet supports multiple currency balances.' },
    { question: 'What is the USD to BDT rate today?', answer: 'Check our live exchange rate calculator for the latest USD to BDT rate with zero markup.' },
    { question: 'What is the USD to INR rate today?', answer: 'Our exchange rate page shows real-time USD to INR rates at the mid-market rate.' },
    { question: 'Is there a weekend surcharge?', answer: 'No. Unlike some competitors, Converto does not charge weekend or holiday surcharges.' },
    { question: 'Can I use the exchanged funds to send money?', answer: 'Yes! You can hold funds or immediately use them to send money internationally via Global Payments.' },
    { question: 'How is Converto cheaper than banks?', answer: 'Banks hide fees in the exchange rate spread (typically 3-5%). Converto uses the real rate and charges a small transparent fee.' },
    { question: 'Is my money safe during exchange?', answer: 'Yes. All exchanges are processed through regulated channels with bank-grade security.' },
    { question: 'Can I set rate alerts?', answer: 'Rate alert functionality is coming soon. You\'ll be able to set alerts for your preferred exchange rates.' },
    { question: 'Do you offer forward contracts?', answer: 'Forward contracts for business accounts are planned. Contact us for enterprise currency needs.' },
    { question: 'Can I exchange from BDT to INR?', answer: 'Yes, we support BDT to INR and many other currency pairs across our 40+ supported currencies.' },
  ],

  relatedServices: [
    { id: 'global-payments', title: 'Global Payments', description: 'Send money internationally.', href: '/services/global-payments', icon: Globe2 },
    { id: 'education', title: 'Education Payments', description: 'Pay tuition at the best exchange rate.', href: '/services/education', icon: Globe2 },
  ],
};
