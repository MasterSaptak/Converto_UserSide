import { ShieldCheck, Globe2, Truck, Link as LinkIcon, DollarSign, HeadphonesIcon, CreditCard, Building2, MapPin, Key } from 'lucide-react';
import { ServiceConfig, ServiceCategory, ServiceStatus } from '../types';
import { ServiceMediaAssets } from '../media';

export const visaConfig: ServiceConfig = {
  id: 'visa',
  slug: 'visa',
  title: 'Visa Services',
  titleKey: 'service.visa.title',
  shortDescription: 'Seamless visa processing and application assistance.',
  shortDescriptionKey: 'service.visa.shortDesc',
  
  category: ServiceCategory.TRAVEL,
  status: ServiceStatus.ACTIVE,
  order: 11,
  
  seoTitle: 'Visa Processing Services | Converto',
  seoDescription: 'Expert assistance for tourist, business, and medical visas.',
  searchKeywords: ['visa', 'tourist visa', 'business visa', 'visa application'],
  
  media: ServiceMediaAssets.visa,
  
  capabilities: {
    supportsTracking: true, supportsPayments: true, supportsDocuments: true,
    supportsChat: true, supportsRealtimeUpdates: true, supportsScheduling: true,
  },
  
  permissions: { customer: true, staff: true, admin: true },
  
  featureFlags: {
    enableReviews: true, enableFAQ: true, enableCalculator: false,
    enableLiveTracking: true, enableChat: true, enableCoupons: false,
  },
  
  lifecycle: { createdAt: '2026-08-01', updatedAt: '2026-08-04', version: '2.0.0', author: 'Converto Core' },
  
  actionButton: 'Check Requirements',
  actionButtonKey: 'service.visa.cta',
  actionRoute: '/services/visa/request',
  
  badges: ['High Success Rate', 'Expert Guidance'],
  statistics: [
    { label: 'Visas Approved', value: '50k+' },
    { label: 'Success Rate', value: '98%' },
  ],
  
  whatItDoes: { 
    title: 'Your Passport to the World', 
    description: 'We demystify the complex visa application process. From document preparation to embassy appointments, our experts guide you every step of the way.' 
  },
  whyChooseUs: { 
    title: 'Zero Paperwork Stress', 
    description: 'Visa rejections happen due to minor errors. We thoroughly review every document and application to ensure a near-perfect success rate.' 
  },
  
  comparison: {
    traditional: { title: 'Applying Alone', points: ['Confusing embassy rules', 'High chance of rejection', 'No dedicated advisor', 'Wasted time in queues'] },
    converto: { title: 'Converto Visa', points: ['Step-by-step guidance', 'Document pre-screening', 'Dedicated Visa Expert', 'Premium lounge appointments'] }
  },
  
  features: [
    { title: 'Global Visas', description: 'Assistance for Schengen, US, UK, and more.', icon: Globe2 },
    { title: 'Secure Processing', description: 'Your sensitive documents are encrypted and safe.', icon: ShieldCheck },
    { title: 'Expert Consultants', description: 'Speak directly with former embassy staff.', icon: HeadphonesIcon },
  ],
  
  howItWorks: [
    { title: 'Select Country', description: 'Choose your destination and visa type.', icon: MapPin },
    { title: 'Upload Docs', description: 'Upload the required documents for review.', icon: Key },
    { title: 'Get Approved', description: 'We submit your application and track it.', icon: ShieldCheck },
  ],
  
  faqs: [
    { question: 'Do you guarantee visa approval?', answer: 'No agency can guarantee approval, but our 98% success rate speaks for itself.' },
    { question: 'How long does it take?', answer: 'Processing times vary wildly by country, usually 1-4 weeks.' },
  ]
};
