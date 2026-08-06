import { Bus, Globe2, ShieldCheck, Ticket, MapPin, Clock, Map } from 'lucide-react';
import { ServiceConfig, ServiceCategory, ServiceStatus } from '../types';
import { ServiceMediaAssets } from '../media';

export const busesConfig: ServiceConfig = {
  id: 'buses',
  slug: 'buses',
  title: 'Buses',
  titleKey: 'service.buses.title',
  shortDescription: 'Affordable and comfortable intercity bus travel.',
  shortDescriptionKey: 'service.buses.shortDesc',
  
  category: ServiceCategory.TRAVEL,
  status: ServiceStatus.ACTIVE,
  order: 9,
  
  seoTitle: 'Book Intercity Bus Tickets | Converto',
  seoDescription: 'Find and book the cheapest intercity bus routes globally.',
  searchKeywords: ['bus tickets', 'coach booking', 'greyhound', 'flixbus'],
  
  media: ServiceMediaAssets.buses,
  
  capabilities: {
    supportsTracking: true, supportsPayments: true, supportsDocuments: false,
    supportsChat: true, supportsRealtimeUpdates: true, supportsScheduling: true,
  },
  
  permissions: { customer: true, staff: true, admin: true },
  
  featureFlags: {
    enableReviews: true, enableFAQ: true, enableCalculator: false,
    enableLiveTracking: true, enableChat: true, enableCoupons: true,
  },
  
  lifecycle: { createdAt: '2026-08-01', updatedAt: '2026-08-04', version: '2.0.0', author: 'Converto Core' },
  
  actionButton: 'Book Buses',
  actionButtonKey: 'service.buses.cta',
  actionRoute: '/services/buses/request',
  
  badges: ['Most Affordable', 'Wide Coverage'],
  statistics: [
    { label: 'Operators', value: '500+' },
    { label: 'Routes', value: '1M+' },
  ],
  
  whatItDoes: { 
    title: 'Connect Everywhere', 
    description: 'Travel to destinations not serviced by trains or flights. Enjoy modern coaches with Wi-Fi, power outlets, and comfortable reclining seats.' 
  },
  whyChooseUs: { 
    title: 'The Budget Traveler\'s Dream', 
    description: 'We aggregate hundreds of local and international bus operators to guarantee you the absolute lowest price for your overland journey.' 
  },
  
  comparison: {
    traditional: { title: 'Bus Stations', points: ['Long queues', 'Cash only', 'Sold out frequently', 'No route comparison'] },
    converto: { title: 'Converto Buses', points: ['Book in advance', 'Digital payments', 'Guaranteed seats', 'Compare 500+ operators'] }
  },
  
  features: [
    { title: 'Massive Network', description: 'Reach remote towns and major cities.', icon: Globe2 },
    { title: 'Secure Booking', description: 'Verified and reputable operators only.', icon: ShieldCheck },
    { title: 'Digital Tickets', description: 'Show your phone to the driver and board.', icon: Ticket },
  ],
  
  howItWorks: [
    { title: 'Enter Route', description: 'Where do you want to go?', icon: MapPin },
    { title: 'Compare', description: 'Compare times, prices, and amenities.', icon: Map },
    { title: 'Travel', description: 'Arrive at the stop and board.', icon: Clock },
  ],
  
  faqs: [
    { question: 'Is there luggage allowance?', answer: 'Most operators allow one large suitcase in the hold and one carry-on.' },
    { question: 'Are there toilets on board?', answer: 'Yes, long-distance coaches are equipped with onboard restrooms.' },
  ]
};
