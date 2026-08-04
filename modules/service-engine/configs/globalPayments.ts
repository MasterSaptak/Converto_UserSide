import { Globe2, ShieldCheck, Zap, ArrowRight, Wallet, Lock, Building, CheckCircle } from 'lucide-react';
import { ServiceConfig, ServiceCategory, ServiceStatus } from '../types';
import { ServiceMediaAssets } from '../media';

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
  
  seoTitle: 'Send Money Globally | Converto',
  seoDescription: 'Fast and secure international money transfers.',
  searchKeywords: ['money transfer', 'remittance', 'send money abroad', 'wire transfer'],
  
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
    description: 'Whether you\'re supporting family abroad, paying freelancers, or settling international invoices, Converto gets your money there fast and securely.' 
  },
  whyChooseUs: { 
    title: 'The Smart Way to Send', 
    description: 'We bypass the outdated SWIFT network by using local bank payouts, saving you money and time on every transfer.' 
  },
  
  comparison: {
    traditional: { title: 'Bank Wire', points: ['High Fixed Fees', 'Slow (3-5 Days)', 'Terrible Exchange Rates', 'Recipient pays receiving fees'] },
    converto: { title: 'Converto', points: ['Low Transparent Fees', 'Often Instant', 'Mid-market Exchange Rate', 'Recipient gets exactly what you send'] }
  },
  
  features: [
    { title: 'Local Payouts', description: 'Money arrives via local networks like ACH, SEPA, or FPS.', icon: Building },
    { title: 'Bank-Grade Security', description: 'Regulated and heavily audited to keep funds safe.', icon: Lock },
    { title: 'Speed', description: 'Over 50% of our transfers arrive in seconds.', icon: Zap },
  ],
  
  howItWorks: [
    { title: 'Enter Amount', description: 'See the fees and rate upfront.', icon: Wallet },
    { title: 'Add Recipient', description: 'Enter their local bank details.', icon: ArrowRight },
    { title: 'Money Sent', description: 'Track the transfer in real-time.', icon: CheckCircle },
  ],
  
  faqs: [
    { question: 'How much does it cost?', answer: 'We charge a small percentage fee which is always shown upfront.' },
    { question: 'Is my money safe?', answer: 'Yes, we are a regulated financial institution.' },
  ]
};
