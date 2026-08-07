import { GraduationCap, Globe2, ShieldCheck, FileText, Building, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { ServiceConfig, ServiceCategory, ServiceStatus } from '../types';
import { ServiceMediaAssets } from '../media';
import { PAYMENT_METHODS, CORRIDORS as COUNTRY_ROUTES } from '@/lib/seo';

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
  
  seoTitle: 'International Education Payments | Pay University Tuition Fees Abroad',
  seoDescription: 'Pay international tuition fees, university payments, and study abroad expenses securely. Converto handles currency conversion, SWIFT fees, and guarantees exact amount delivery to your institution.',
  searchKeywords: ['tuition payment', 'international student', 'pay university fees', 'study abroad', 'education payment', 'college fees', 'student payment', 'international education payment'],

  seo: {
    title: 'International Education Payments | Pay University Tuition Fees Abroad',
    description: 'Pay international tuition fees, university payments, and study abroad expenses securely. Zero SWIFT fees, guaranteed exact amount delivery, and real-time tracking. Trusted by thousands of international students.',
    keywords: {
      primary: ['education payment', 'tuition payment', 'university fees', 'study abroad payment'],
      secondary: ['international student payment', 'college fees', 'student payment', 'international education payment', 'overseas tuition'],
      longTail: [
        'how to pay university fees abroad',
        'best way to pay tuition internationally',
        'pay university fees from Bangladesh',
        'pay university fees from India',
        'cheapest way to pay international tuition',
        'study abroad payment without SWIFT fees',
        'pay UK university fees from India',
      ],
    },
    relatedSearches: [
      'Study abroad payments',
      'University fee payment',
      'International tuition transfer',
      'Student money transfer',
      'College fees abroad',
      'Education loan payment',
      'University payment deadline',
      'GIC payment Canada',
      'UK university fees',
      'USA college payment',
    ],
    paymentMethods: PAYMENT_METHODS.filter(m => ['card', 'wallet', 'bank'].includes(m.category)),
    countryRoutes: COUNTRY_ROUTES.filter(r => ['India', 'Bangladesh'].includes(r.from)),
    ctaSections: [
      { headline: 'Need to pay university tuition abroad?', buttonText: 'Start payment', href: '/services/education/request' },
      { headline: 'Looking for the best exchange rates for tuition?', buttonText: 'Check rates', href: '/services/exchange' },
      { headline: 'Need help with student visa?', buttonText: 'Visa Assistance', href: '/services/visa' },
      { headline: 'Need medical check-up before traveling?', buttonText: 'Medical Services', href: '/services/medical' },
    ],
  },

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
    description: 'We make paying international tuition, housing deposits, and application fees as easy as a local bank transfer. Avoid expensive SWIFT fees and terrible exchange rates. Converto guarantees that your university receives the exact amount they requested, on time.' 
  },
  whyChooseUs: { 
    title: 'Built for International Students', 
    description: 'We understand the anxiety of large international transfers for tuition. That\'s why we offer real-time payment tracking, guaranteed exact amount delivery, and dedicated student support to help you meet every deadline.' 
  },
  
  comparison: {
    traditional: { title: 'Bank Wire Transfer', points: ['Expensive Swift Fees', 'Unpredictable Exchange Rates', 'No Tracking', 'Funds arrive short due to intermediary fees'] },
    converto: { title: 'Converto Education', points: ['Zero Swift Fees', 'Guaranteed Exact Amount Delivered', 'Real-time Payment Tracking', 'Pay in your local currency'] }
  },
  
  features: [
    { title: 'Direct University Network', description: 'We partner directly with 10,000+ institutions globally for seamless payments.', icon: Building },
    { title: 'Exact Amount Guarantee', description: 'The university receives exactly what is owed — no intermediary deductions.', icon: ShieldCheck },
    { title: 'Local Payments', description: 'Pay using domestic bank transfers, bKash, Nagad, or cards in your home country.', icon: Globe2 },
  ],
  
  howItWorks: [
    { title: 'Select Institution', description: 'Find your university or school in our database of 10,000+ institutions.', icon: BookOpen },
    { title: 'Enter Amount', description: 'Upload your invoice and see the guaranteed exchange rate and total cost.', icon: FileText },
    { title: 'Track Payment', description: 'Watch the funds travel in real-time and get an official receipt.', icon: CheckCircle },
  ],
  
  faqs: [
    { question: 'How long does it take for the university to receive funds?', answer: 'Usually 2-3 business days depending on the destination country and payment method.' },
    { question: 'Will I get a receipt for my visa application?', answer: 'Yes, you will receive an official payment confirmation that is accepted by embassies and universities.' },
    { question: 'Can I pay from Bangladesh?', answer: 'Yes! We support payments from Bangladesh using bKash, Nagad, and local bank transfers.' },
    { question: 'Can I pay from India?', answer: 'Absolutely. We support UPI, NEFT, RTGS, and all major Indian payment methods.' },
    { question: 'What universities do you support?', answer: 'We support 10,000+ institutions across 50+ countries including universities in USA, UK, Canada, Australia, and Europe.' },
    { question: 'Are there any hidden fees?', answer: 'No. All fees including exchange rate markup are shown upfront before you confirm the payment.' },
    { question: 'Can I pay housing deposits?', answer: 'Yes, we support tuition fees, housing deposits, application fees, and other university-related payments.' },
    { question: 'What if the university needs a specific reference number?', answer: 'You can add any reference number, student ID, or payment reference during the payment process.' },
    { question: 'Is my payment secure?', answer: 'Yes. All payments are encrypted and processed through regulated financial channels.' },
    { question: 'Can I schedule recurring tuition payments?', answer: 'We are working on this feature. Currently, each payment is processed individually.' },
    { question: 'What exchange rate do you use?', answer: 'We use competitive mid-market rates with a small transparent fee — much better than bank wire rates.' },
    { question: 'Can I pay in my local currency?', answer: 'Yes! You pay in your local currency and we handle the conversion. The university receives the exact amount in their currency.' },
    { question: 'What if my payment fails?', answer: 'If a payment fails, your money is fully refunded within 1-2 business days. Our support team will help you retry.' },
    { question: 'Do you support GIC payments for Canada?', answer: 'Yes, we support Guaranteed Investment Certificate (GIC) payments for Canadian student visa applications.' },
    { question: 'How is Converto better than a bank wire?', answer: 'Bank wires charge high SWIFT fees, use poor exchange rates, and intermediary banks often deduct from the amount. Converto eliminates all of these issues.' },
  ],

  relatedServices: [
    { id: 'global-payments', title: 'Global Payments', description: 'Send money internationally for any purpose.', href: '/services/global-payments', icon: Globe2 },
    { id: 'visa', title: 'Visa Assistance', description: 'Need help with student visa applications?', href: '/services/visa', icon: Globe2 },
  ],
};

