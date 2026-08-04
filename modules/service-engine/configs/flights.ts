import { Plane, Globe2, ShieldCheck, Ticket, Calendar, Search, MapPin, Star } from 'lucide-react';
import { ServiceConfig, ServiceCategory, ServiceStatus } from '../types';
import { ServiceMediaAssets } from '../media';

export const flightsConfig: ServiceConfig = {
  id: 'flights',
  slug: 'flights',
  title: 'Flights',
  titleKey: 'service.flights.title',
  shortDescription: 'Book premium global flights at unbeatable prices.',
  shortDescriptionKey: 'service.flights.shortDesc',
  
  category: ServiceCategory.TRAVEL,
  status: ServiceStatus.ACTIVE,
  order: 6,
  
  seoTitle: 'Book Global Flights | Converto',
  seoDescription: 'Search and book cheap flights globally.',
  searchKeywords: ['flights', 'airline tickets', 'book flights', 'cheap flights'],
  
  media: ServiceMediaAssets.flights,
  
  capabilities: {
    supportsTracking: true, supportsPayments: true, supportsDocuments: true,
    supportsChat: true, supportsRealtimeUpdates: true, supportsScheduling: true,
  },
  
  permissions: { customer: true, staff: true, admin: true },
  
  featureFlags: {
    enableReviews: true, enableFAQ: true, enableCalculator: false,
    enableLiveTracking: true, enableChat: true, enableCoupons: true,
  },
  
  lifecycle: { createdAt: '2026-08-01', updatedAt: '2026-08-04', version: '2.0.0', author: 'Converto Core' },
  
  actionButton: 'Search Flights',
  actionButtonKey: 'service.flights.cta',
  actionRoute: '/services/flights/request',
  
  badges: ['Best Prices', '24/7 Support'],
  statistics: [
    { label: 'Airlines', value: '400+' },
    { label: 'Destinations', value: 'Global' },
  ],
  
  whatItDoes: { 
    title: 'The Sky is Yours', 
    description: 'Access exclusive flight deals, manage your itineraries effortlessly, and get 24/7 concierge support for all your air travel needs.' 
  },
  whyChooseUs: { 
    title: 'Travel Without The Stress', 
    description: 'We don\'t just sell tickets. We monitor your flights, assist with reschedules, and provide real human support when things go wrong.' 
  },
  
  comparison: {
    traditional: { title: 'Standard Booking Sites', points: ['Hidden Booking Fees', 'Bot Customer Service', 'No Reschedule Assistance', 'Prices change during checkout'] },
    converto: { title: 'Converto Flights', points: ['Transparent Upfront Pricing', '24/7 VIP Human Support', 'Proactive Flight Monitoring', 'Flexible Cancellation Options'] }
  },
  
  features: [
    { title: 'Global Coverage', description: 'Book with over 400 airlines worldwide.', icon: Globe2 },
    { title: 'Price Protection', description: 'What you see is what you pay.', icon: ShieldCheck },
    { title: 'VIP Support', description: 'Get priority assistance for changes and cancellations.', icon: Star },
  ],
  
  howItWorks: [
    { title: 'Search Route', description: 'Enter your departure and destination.', icon: MapPin },
    { title: 'Compare Options', description: 'Choose from hundreds of flight options.', icon: Search },
    { title: 'Book Securely', description: 'Receive your e-tickets instantly.', icon: Ticket },
  ],
  
  faqs: [
    { question: 'Can I cancel my flight?', answer: 'Cancellation policies depend on the airline and fare type chosen.' },
    { question: 'Do you offer group bookings?', answer: 'Yes, our concierge team can assist with large group bookings.' },
  ]
};
