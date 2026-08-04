import { Globe2, ShieldCheck, Zap, ArrowRight, Wallet, Lock, Building, CheckCircle } from 'lucide-react';
import { ServiceConfig, ServiceCategory, ServiceStatus } from '../types';
import { ServiceMediaAssets } from '../media';
import { PAYMENT_METHODS, CORRIDORS as COUNTRY_ROUTES } from '@/lib/seo';

export const globalPaymentsConfig: ServiceConfig = {
  id: 'global-payments',
  slug: 'global-payments',
  title: 'Global Payments',
  titleKey: 'service.globalPayments.title',
  shortDescription: 'Send money to 100+ countries instantly.',
  shortDescriptionKey: 'service.globalPayments.shortDesc',
  
  category: ServiceCategory.FINANCIAL,
  status: ServiceStatus.ACTIVE,
  order: 4,
  
  seoTitle: 'International Payments | PayPal, Wise & Cross-Border Transfers',
  seoDescription: 'Send money globally with secure international payment solutions. Compare payment methods, cross-border transfers, and trusted financial services through Converto.',
  searchKeywords: ['money transfer', 'remittance', 'send money abroad', 'wire transfer', 'international payment', 'cross border payment', 'foreign payment', 'global payment'],

  seo: {
    title: 'International Payments | PayPal, Wise & Cross-Border Transfers',
    description: 'Send money globally with secure international payment solutions. Compare payment methods like PayPal, Wise, bKash, Nagad, and more. Cross-border transfers to 100+ countries through Converto.',
    keywords: {
      primary: ['international payment', 'cross border payment', 'global payment', 'send money abroad'],
      secondary: ['foreign payment', 'receive international payment', 'international transfer', 'money transfer', 'cross border finance', 'international banking'],
      longTail: [
        'send money to Bangladesh',
        'Bangladesh to India money transfer',
        'India to Bangladesh remittance',
        'best international payment platform',
        'cheapest way to send money abroad',
        'how to send money internationally',
        'fastest international money transfer',
        'send money to Bangladesh from India',
        'cross border payment without high fees',
      ],
    },
    relatedSearches: [
      'Send money abroad',
      'International remittance',
      'Cross-border banking',
      'Wise transfer',
      'PayPal payment',
      'SWIFT transfer',
      'Foreign exchange',
      'Bangladesh to India transfer',
      'India to Bangladesh money',
      'bKash transfer',
      'Nagad payment',
      'International wire transfer',
    ],
    paymentMethods: PAYMENT_METHODS,
    countryRoutes: COUNTRY_ROUTES,
    ctaSections: [
      { headline: 'Need to send money to Bangladesh?', buttonText: 'Start your transfer', href: '/services/global-payments/request' },
      { headline: 'Looking for the best exchange rates?', buttonText: 'Check live rates', href: '/services/exchange' },
      { headline: 'Want to pay university tuition abroad?', buttonText: 'Explore Education Payments', href: '/services/education' },
      { headline: 'Booking treatment in India?', buttonText: 'Visit Medical Services', href: '/services/medical' },
      { headline: 'Buying from Amazon or Flipkart?', buttonText: 'Use Buy For Me', href: '/services/buy-for-me' },
    ],
  },

  media: ServiceMediaAssets.globalPayments,
  
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
  
  actionButton: 'Send Money',
  actionButtonKey: 'service.globalPayments.cta',
  actionRoute: '/services/global-payments/request',
  
  badges: ['Low Fees', 'Secure'],
  statistics: [
    { label: 'Countries Supported', value: '100+' },
    { label: 'Active Users', value: '1M+' },
  ],
  
  whatItDoes: { 
    title: 'Money Without Borders', 
    description: 'Whether you\'re supporting family abroad, paying freelancers, or settling international invoices, Converto gets your money there fast and securely. Send money to Bangladesh, India, USA, UK, UAE, and over 100 more countries through trusted payment networks like PayPal, Wise, bKash, Nagad, and SWIFT.' 
  },
  whyChooseUs: { 
    title: 'The Smart Way to Send', 
    description: 'We bypass the outdated SWIFT network by using local bank payouts, saving you money and time on every transfer. Unlike traditional banks that charge 3-5% in hidden fees, Converto offers transparent mid-market rates so you always know exactly what you\'re paying.' 
  },
  
  comparison: {
    traditional: { title: 'Bank Wire', points: ['High Fixed Fees', 'Slow (3-5 Days)', 'Terrible Exchange Rates', 'Recipient pays receiving fees'] },
    converto: { title: 'Converto', points: ['Low Transparent Fees', 'Often Instant', 'Mid-market Exchange Rate', 'Recipient gets exactly what you send'] }
  },
  
  features: [
    { title: 'Local Payouts', description: 'Money arrives via local networks like ACH, SEPA, or FPS — faster and cheaper than international wires.', icon: Building },
    { title: 'Bank-Grade Security', description: 'Regulated and heavily audited to keep your funds safe. Encrypted end-to-end.', icon: Lock },
    { title: 'Speed', description: 'Over 50% of our transfers arrive in seconds. Most are completed the same day.', icon: Zap },
  ],
  
  howItWorks: [
    { title: 'Enter Amount', description: 'See the fees and exchange rate upfront before you commit.', icon: Wallet },
    { title: 'Add Recipient', description: 'Enter their local bank details, bKash, Nagad, or wallet.', icon: ArrowRight },
    { title: 'Money Sent', description: 'Track the transfer in real-time until it arrives.', icon: CheckCircle },
  ],
  
  faqs: [
    { question: 'How do I send money internationally?', answer: 'Simply enter the amount, add your recipient\'s bank or wallet details, and confirm the transfer. Converto handles the currency conversion and routing automatically.' },
    { question: 'Can I send money to Bangladesh?', answer: 'Yes! Bangladesh is one of our most popular corridors. We support direct transfers to bKash, Nagad, Rocket, and Bangladeshi bank accounts.' },
    { question: 'Can I transfer money from Bangladesh to India?', answer: 'Absolutely. Converto supports the Bangladesh to India corridor with competitive rates and fast settlement times.' },
    { question: 'What payment methods are supported?', answer: 'We support Visa, Mastercard, RuPay, PayPal, Wise, bank transfers, bKash, Nagad, Rocket, and more depending on your country.' },
    { question: 'Is PayPal supported?', answer: 'Yes, PayPal is supported as a funding source in many countries. You can send money via PayPal and have it arrive in local bank accounts or mobile wallets.' },
    { question: 'Is Wise supported?', answer: 'Yes, we integrate with Wise for certain corridors to ensure the best rates and fastest delivery.' },
    { question: 'What are the fees for international transfers?', answer: 'Fees vary by corridor and payment method but are always shown upfront before you confirm. There are no hidden fees.' },
    { question: 'How long does an international payment take?', answer: 'Most transfers arrive within minutes to a few hours. Bank transfers may take 1-2 business days depending on the destination.' },
    { question: 'Is my payment secure?', answer: 'Yes. We use bank-grade encryption, are regulated, and undergo regular security audits. Your money is protected at every step.' },
    { question: 'Can businesses use Converto for payments?', answer: 'Yes! We support business payments including supplier payments, freelancer payouts, and bulk transfers.' },
    { question: 'What exchange rate do you use?', answer: 'We use the mid-market exchange rate — the same rate you see on Google — with no hidden markup.' },
    { question: 'Are there any hidden fees?', answer: 'No. All fees are disclosed upfront before you confirm your transfer. What you see is what you pay.' },
    { question: 'Can I track my transfer?', answer: 'Yes, you can track every transfer in real-time through the Converto app or website.' },
    { question: 'What countries can I send money to?', answer: 'Converto supports over 100 countries including Bangladesh, India, USA, UK, Canada, Australia, UAE, and many more.' },
    { question: 'How is Converto different from traditional banks?', answer: 'Unlike banks that charge high fees and use poor exchange rates, Converto offers mid-market rates, transparent pricing, and often instant delivery.' },
  ],

  relatedServices: [
    { id: 'exchange', title: 'Currency Exchange', description: 'Need to convert currencies at the best rates?', href: '/services/exchange', icon: Globe2 },
    { id: 'education', title: 'Education Payments', description: 'Pay university tuition fees internationally.', href: '/services/education', icon: Globe2 },
    { id: 'buy-for-me', title: 'Buy For Me', description: 'Shop from international retailers through Converto.', href: '/services/buy-for-me', icon: Globe2 },
  ],
};

