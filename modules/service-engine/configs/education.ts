import { GraduationCap, Globe2, ShieldCheck, FileText, Building, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { ServiceConfig, ServiceCategory, ServiceStatus } from '../types';
import { ServiceMediaAssets } from '../media';

export const educationConfig: ServiceConfig = {
  id: 'education',
  slug: 'education',
  title: 'Education',
  titleKey: 'service.education.title',
  shortDescription: 'Pay international tuition and university fees seamlessly.',
  shortDescriptionKey: 'service.education.shortDesc',
  
  category: ServiceCategory.EDUCATION,
  status: ServiceStatus.ACTIVE,
  order: 5,
  
  seoTitle: 'Pay International Tuition Fees | Converto',
  seoDescription: 'Securely pay university and tuition fees worldwide.',
  searchKeywords: ['tuition payment', 'international student', 'pay university fees', 'study abroad'],
  
  media: ServiceMediaAssets.education,
  
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
  
  actionButton: 'Pay Tuition',
  actionButtonKey: 'service.education.cta',
  actionRoute: '/services/education/request',
  
  badges: ['Student Choice', 'Guaranteed Delivery'],
  statistics: [
    { label: 'Universities Supported', value: '10,000+' },
    { label: 'Countries', value: '50+' },
  ],
  
  whatItDoes: { 
    title: 'Focus on Studies, Not Payments', 
    description: 'We make paying international tuition, housing, and application fees as easy as a local bank transfer. Avoid expensive bank wire fees and terrible exchange rates.' 
  },
  whyChooseUs: { 
    title: 'Built for International Students', 
    description: 'We understand the anxiety of large international transfers. That\'s why we offer real-time tracking and guarantee that the university receives the exact amount they requested.' 
  },
  
  comparison: {
    traditional: { title: 'Bank Wire Transfer', points: ['Expensive Swift Fees', 'Unpredictable Exchange Rates', 'No Tracking', 'Funds arrive short due to intermediary fees'] },
    converto: { title: 'Converto Education', points: ['Zero Swift Fees', 'Guaranteed Exact Amount Delivered', 'Real-time Payment Tracking', 'Pay in your local currency'] }
  },
  
  features: [
    { title: 'Direct University Network', description: 'We partner directly with institutions globally.', icon: Building },
    { title: 'Exact Amount Guarantee', description: 'The university receives exactly what is owed.', icon: ShieldCheck },
    { title: 'Local Payments', description: 'Pay using domestic bank transfers in your home country.', icon: Globe2 },
  ],
  
  howItWorks: [
    { title: 'Select Institution', description: 'Find your university or school in our database.', icon: BookOpen },
    { title: 'Enter Amount', description: 'Upload your invoice and see the guaranteed rate.', icon: FileText },
    { title: 'Track Payment', description: 'Watch the funds travel and get a receipt.', icon: CheckCircle },
  ],
  
  faqs: [
    { question: 'How long does it take for the university to receive funds?', answer: 'Usually 2-3 business days depending on the destination country.' },
    { question: 'Will I get a receipt for my visa application?', answer: 'Yes, you will receive an official payment confirmation.' },
  ]
};
