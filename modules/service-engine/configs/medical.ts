import { HeartPulse, Globe2, ShieldCheck, CalendarCheck, FileText, UserPlus, Stethoscope, Clock } from 'lucide-react';
import { ServiceConfig, ServiceCategory, ServiceStatus } from '../types';
import { ServiceMediaAssets } from '../media';

export const medicalConfig: ServiceConfig = {
  id: 'medical',
  slug: 'medical',
  title: 'Medical',
  titleKey: 'service.medical.title',
  shortDescription: 'Book top-tier medical appointments and treatments globally.',
  shortDescriptionKey: 'service.medical.shortDesc',
  
  category: ServiceCategory.HEALTHCARE,
  status: ServiceStatus.ACTIVE,
  order: 2,
  
  seoTitle: 'Medical Tourism & Appointments | Converto',
  seoDescription: 'Access world-class healthcare globally with Converto.',
  searchKeywords: ['medical tourism', 'book doctor abroad', 'healthcare', 'global hospital'],
  
  media: ServiceMediaAssets.medical,
  
  capabilities: {
    supportsTracking: true, supportsPayments: true, supportsDocuments: true,
    supportsChat: true, supportsRealtimeUpdates: true, supportsScheduling: true,
  },
  
  permissions: { customer: true, staff: true, admin: true },
  
  featureFlags: {
    enableReviews: true, enableFAQ: true, enableCalculator: false,
    enableLiveTracking: false, enableChat: true, enableCoupons: false,
  },
  
  lifecycle: { createdAt: '2026-08-01', updatedAt: '2026-08-04', version: '2.0.0', author: 'Converto Core' },
  
  actionButton: 'Book Consultation',
  actionButtonKey: 'service.medical.cta',
  actionRoute: '/services/medical/request',
  
  badges: ['World-Class', 'Verified Hospitals'],
  statistics: [
    { label: 'Partner Hospitals', value: '500+' },
    { label: 'Specialties', value: '45+' },
  ],
  
  whatItDoes: { 
    title: 'Your Global Healthcare Partner', 
    description: 'We connect you with the world\'s best medical professionals and facilities, handling everything from appointment scheduling to medical visa assistance and travel logistics.' 
  },
  whyChooseUs: { 
    title: 'Health Without Borders', 
    description: 'Never settle for less when it comes to your health. Get access to cutting-edge treatments and renowned specialists worldwide.' 
  },
  
  comparison: {
    traditional: { title: 'Going Alone', points: ['Language Barriers', 'Complex Hospital Bureaucracy', 'No Travel Support', 'Hidden Treatment Costs'] },
    converto: { title: 'With Converto', points: ['Dedicated Medical Concierge', 'Priority Appointments', 'Full Logistics & Visa Support', 'Transparent Pricing'] }
  },
  
  features: [
    { title: 'Global Network', description: 'Access top hospitals in India, Thailand, Turkey, and more.', icon: Globe2 },
    { title: 'Verified Experts', description: 'All doctors are strictly vetted for excellence.', icon: ShieldCheck },
    { title: 'Full Concierge', description: 'We handle your flights, stay, and hospital transfers.', icon: HeartPulse },
  ],
  
  howItWorks: [
    { title: 'Submit Records', description: 'Upload your medical reports securely.', icon: FileText },
    { title: 'Get Treatment Plan', description: 'Receive options from multiple specialists.', icon: Stethoscope },
    { title: 'Travel & Recover', description: 'We handle the logistics while you focus on healing.', icon: CalendarCheck },
  ],
  
  benefits: [
    { title: '24/7 Support', description: 'Round the clock assistance during your trip.', icon: Clock },
    { title: 'Family Support', description: 'Accommodation and visa help for your attendants.', icon: UserPlus },
  ],
  
  faqs: [
    { question: 'Do you help with medical visas?', answer: 'Yes, we provide invitation letters and complete visa assistance.' },
    { question: 'Can I get a second opinion?', answer: 'Absolutely. We can arrange tele-consultations before you travel.' },
  ]
};
