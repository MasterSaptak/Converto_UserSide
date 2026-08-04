import { HeartPulse, Globe2, ShieldCheck, CalendarCheck, FileText, UserPlus, Stethoscope, Clock } from 'lucide-react';
import { ServiceConfig, ServiceCategory, ServiceStatus } from '../types';
import { ServiceMediaAssets } from '../media';
import { PAYMENT_METHODS, CORRIDORS as COUNTRY_ROUTES } from '@/lib/seo';

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
  
  seoTitle: 'Medical Tourism & Healthcare Appointments Abroad',
  seoDescription: 'Access world-class healthcare globally. Book hospital appointments, medical treatments, and medical visa assistance in India, Thailand, Turkey and more through Converto.',
  searchKeywords: ['medical tourism', 'hospital booking', 'medical visa', 'treatment in India', 'medical appointment', 'hospital payment', 'healthcare abroad'],

  seo: {
    title: 'Medical Tourism & Healthcare Appointments Abroad',
    description: 'Book world-class hospital appointments and medical treatments in India, Thailand, and Turkey. Full concierge service including medical visa, travel arrangements, and transparent pricing through Converto.',
    keywords: {
      primary: ['medical tourism', 'hospital booking', 'medical visa', 'treatment in India'],
      secondary: ['medical appointment abroad', 'hospital payment', 'healthcare India', 'medical travel', 'treatment abroad'],
      longTail: [
        'medical tourism India from Bangladesh',
        'hospital booking India from Bangladesh',
        'medical visa assistance',
        'cheapest medical treatment in India',
        'best hospitals in India for Bangladeshi patients',
        'medical treatment cost in India',
        'how to book hospital appointment in India',
      ],
    },
    relatedSearches: [
      'Medical tourism India',
      'Hospital booking',
      'Medical visa',
      'Treatment in India',
      'Healthcare abroad',
      'Medical concierge',
      'Hospital payment India',
      'Medical travel Bangladesh',
      'Second opinion abroad',
      'Affordable healthcare India',
    ],
    paymentMethods: PAYMENT_METHODS.filter(m => ['card', 'wallet', 'regional', 'bank'].includes(m.category)),
    countryRoutes: COUNTRY_ROUTES.filter(r => r.to === 'India' || r.from === 'India'),
    ctaSections: [
      { headline: 'Need medical treatment in India?', buttonText: 'Book consultation', href: '/services/medical/request' },
      { headline: 'Need help with medical visa?', buttonText: 'Visa Assistance', href: '/services/visa' },
      { headline: 'Need to send money for hospital bills?', buttonText: 'Global Payments', href: '/services/global-payments' },
      { headline: 'Paying university fees abroad too?', buttonText: 'Education Payments', href: '/services/education' },
    ],
  },

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
    description: 'We connect you with the world\'s best medical professionals and facilities in India, Thailand, Turkey, and beyond. From appointment scheduling to medical visa assistance and travel logistics, Converto handles everything so you can focus on your health.' 
  },
  whyChooseUs: { 
    title: 'Health Without Borders', 
    description: 'Never settle for less when it comes to your health. Get access to cutting-edge treatments and renowned specialists worldwide with transparent pricing, no hidden costs, and full concierge support.' 
  },
  
  comparison: {
    traditional: { title: 'Going Alone', points: ['Language Barriers', 'Complex Hospital Bureaucracy', 'No Travel Support', 'Hidden Treatment Costs'] },
    converto: { title: 'With Converto', points: ['Dedicated Medical Concierge', 'Priority Appointments', 'Full Logistics & Visa Support', 'Transparent Pricing'] }
  },
  
  features: [
    { title: 'Global Network', description: 'Access 500+ partner hospitals in India, Thailand, Turkey, and more countries.', icon: Globe2 },
    { title: 'Verified Experts', description: 'All doctors and facilities are strictly vetted for clinical excellence.', icon: ShieldCheck },
    { title: 'Full Concierge', description: 'We handle flights, accommodation, hospital transfers, and medical visa assistance.', icon: HeartPulse },
  ],
  
  howItWorks: [
    { title: 'Submit Records', description: 'Upload your medical reports securely for specialist review.', icon: FileText },
    { title: 'Get Treatment Plan', description: 'Receive detailed treatment options and cost estimates from multiple specialists.', icon: Stethoscope },
    { title: 'Travel & Recover', description: 'We handle all logistics — flights, stay, and hospital transfers — while you focus on healing.', icon: CalendarCheck },
  ],
  
  benefits: [
    { title: '24/7 Support', description: 'Round the clock medical concierge assistance during your entire trip.', icon: Clock },
    { title: 'Family Support', description: 'Accommodation and visa help for your attendants and family members.', icon: UserPlus },
  ],
  
  faqs: [
    { question: 'Do you help with medical visas?', answer: 'Yes, we provide invitation letters from hospitals and complete medical visa assistance for patients and their attendants.' },
    { question: 'Can I get a second opinion?', answer: 'Absolutely. We can arrange tele-consultations with specialists before you travel.' },
    { question: 'Which countries do you support for medical tourism?', answer: 'We primarily support India, Thailand, Turkey, Singapore, and Malaysia. India is our most popular destination.' },
    { question: 'How much does medical treatment cost in India?', answer: 'Costs vary by treatment but are typically 60-80% lower than in the US or UK. We provide transparent cost estimates upfront.' },
    { question: 'Can patients from Bangladesh travel to India for treatment?', answer: 'Yes! Bangladesh to India is our most popular medical tourism corridor. We handle the entire process from visa to hospital booking.' },
    { question: 'Do you arrange accommodation?', answer: 'Yes, we arrange patient-friendly accommodation near the hospital for both patients and attendants.' },
    { question: 'What specialties are covered?', answer: 'We cover 45+ specialties including cardiology, oncology, orthopedics, neurology, fertility, dental, and cosmetic surgery.' },
    { question: 'How do I pay for treatment?', answer: 'You can pay using local methods like bKash, Nagad, bank transfers, or cards. We handle the currency conversion.' },
    { question: 'Is there a language barrier at hospitals?', answer: 'Our concierge team provides translation support. Many Indian hospitals also have Bengali-speaking staff.' },
    { question: 'What if I need emergency treatment?', answer: 'We have expedited processing for urgent cases and can arrange fast-track visas and appointments.' },
    { question: 'Do you handle airport pickup?', answer: 'Yes, we arrange airport pickup, hospital transfers, and all local transportation.' },
    { question: 'Can I see the hospital and doctor credentials?', answer: 'Yes, we share verified credentials, accreditations (JCI, NABH), and patient reviews for all partner hospitals and doctors.' },
    { question: 'What happens after treatment?', answer: 'We arrange post-treatment follow-ups, including tele-consultations with the treating doctor after you return home.' },
    { question: 'Is my medical data secure?', answer: 'Yes, all medical records are transmitted via encrypted channels and handled per international data protection standards.' },
    { question: 'Can I bring a family member?', answer: 'Yes! We assist with attendant visas, accommodation, and logistics for family members.' },
  ],

  relatedServices: [
    { id: 'global-payments', title: 'Global Payments', description: 'Pay hospital bills internationally.', href: '/services/global-payments', icon: Globe2 },
    { id: 'visa', title: 'Visa Assistance', description: 'Medical visa processing.', href: '/services/visa', icon: Globe2 },
  ],
};
