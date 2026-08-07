import { Ticket, Globe2, ShieldCheck, Music, Calendar, MapPin, Star } from 'lucide-react';
import { ServiceConfig, ServiceCategory, ServiceStatus } from '../types';
import { ServiceMediaAssets } from '../media';

export const eventsConfig: ServiceConfig = {
  id: 'events',
  slug: 'events',
  title: 'Events',
  titleKey: 'service.events.title',
  shortDescription: 'Secure tickets to the world\'s most exclusive events.',
  shortDescriptionKey: 'service.events.shortDesc',
  
  category: ServiceCategory.TRAVEL,
  status: ServiceStatus.ACTIVE,
  order: 10,
  
  seoTitle: 'Concert & Event Tickets | Converto',
  seoDescription: 'Book tickets for concerts, sports, theater, and global events.',
  searchKeywords: ['event tickets', 'concerts', 'sports tickets', 'live shows'],
  
  media: ServiceMediaAssets.events,
  
  capabilities: {
    supportsTracking: true, supportsPayments: true, supportsDocuments: false,
    supportsChat: true, supportsRealtimeUpdates: true, supportsScheduling: false,
  },
  
  permissions: { customer: true, staff: true, admin: true },
  
  featureFlags: {
    enableReviews: true, enableFAQ: true, enableCalculator: false,
    enableLiveTracking: false, enableChat: true, enableCoupons: false,
  },
  
  lifecycle: { createdAt: '2026-08-01', updatedAt: '2026-08-04', version: '2.0.0', author: 'Converto Core' },
  
  actionButton: 'Find Events',
  actionButtonKey: 'service.events.cta',
  actionRoute: '/services/events/request',
  
  badges: ['Verified Resale', 'VIP Access'],
  statistics: [
    { label: 'Events Listed', value: '100k+' },
    { label: 'Authenticity Guarantee', value: '100%' },
  ],
  
  whatItDoes: { 
    title: 'Live the Moment', 
    description: 'From front-row concert seats to VIP boxes at the Champions League, we secure tickets to events that are supposedly "sold out" everywhere else.' 
  },
  whyChooseUs: { 
    title: 'No Fake Tickets. Ever.', 
    description: 'The secondary ticket market is full of scams. Converto physically and digitally verifies every single ticket before it reaches your hands.' 
  },
  
  comparison: {
    traditional: { title: 'Scalpers / Shady Sites', points: ['High risk of fake tickets', 'No buyer protection', 'Hidden exorbitant fees', 'No customer service'] },
    converto: { title: 'Converto Events', points: ['100% Authenticity Guarantee', 'Full Buyer Protection', 'Transparent Pricing', '24/7 Dedicated Support'] }
  },
  
  features: [
    { title: 'Global Events', description: 'Access events in London, New York, Tokyo, etc.', icon: Globe2 },
    { title: '100% Guaranteed', description: 'Valid entry or your money back.', icon: ShieldCheck },
    { title: 'VIP Packages', description: 'Hospitality, meet & greets, and premium seating.', icon: Star },
  ],
  
  howItWorks: [
    { title: 'Search Event', description: 'Find your favorite artist or team.', icon: Music },
    { title: 'Select Section', description: 'Choose your desired seating zone.', icon: MapPin },
    { title: 'Receive Ticket', description: 'Get digital transfer or physical delivery.', icon: Ticket },
  ],
  
  faqs: [
    { question: 'What if the event is cancelled?', answer: 'You are guaranteed a full refund for cancelled events.' },
    { question: 'How do I receive my tickets?', answer: 'Most tickets are securely transferred via official digital apps (like Ticketmaster).' },
  ]
};
