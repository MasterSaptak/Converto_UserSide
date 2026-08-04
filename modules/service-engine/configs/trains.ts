import { Train, Globe2, ShieldCheck, Ticket, MapPin, Clock, CheckCircle } from 'lucide-react';
import { ServiceConfig, ServiceCategory, ServiceStatus } from '../types';
import { ServiceMediaAssets } from '../media';

export const trainsConfig: ServiceConfig = {
  id: 'trains',
  slug: 'trains',
  title: 'Trains',
  titleKey: 'service.trains.title',
  shortDescription: 'Book high-speed and scenic train journeys globally.',
  shortDescriptionKey: 'service.trains.shortDesc',
  
  category: ServiceCategory.TRAVEL,
  status: ServiceStatus.ACTIVE,
  order: 8,
  
  seoTitle: 'Book Train Tickets Online | Converto',
  seoDescription: 'Seamlessly book train tickets across Europe, Asia, and the Americas.',
  searchKeywords: ['train tickets', 'railway booking', 'eurail', 'shinkansen'],
  
  media: ServiceMediaAssets.trains,
  
  capabilities: {
    supportsTracking: true, supportsPayments: true, supportsDocuments: false,
    supportsChat: true, supportsRealtimeUpdates: true, supportsScheduling: true,
  },
  
  permissions: { customer: true, staff: true, admin: true },
  
  featureFlags: {
    enableReviews: true, enableFAQ: true, enableCalculator: false,
    enableLiveTracking: true, enableChat: true, enableCoupons: false,
  },
  
  lifecycle: { createdAt: '2026-08-01', updatedAt: '2026-08-04', version: '2.0.0', author: 'Converto Core' },
  
  actionButton: 'Book Trains',
  actionButtonKey: 'service.trains.cta',
  actionRoute: '/services/trains/request',
  
  badges: ['Eco-Friendly', 'Scenic Routes'],
  statistics: [
    { label: 'Rail Networks', value: '150+' },
    { label: 'Countries', value: '40+' },
  ],
  
  whatItDoes: { 
    title: 'The Smart Way to Travel Overland', 
    description: 'Avoid airport security lines and travel city-center to city-center on the world\'s most efficient high-speed rail networks.' 
  },
  whyChooseUs: { 
    title: 'All Networks, One Platform', 
    description: 'Booking trains in foreign countries is notoriously difficult due to language barriers and fragmented systems. We unify them all into one simple interface.' 
  },
  
  comparison: {
    traditional: { title: 'Local Rail Sites', points: ['Language Barriers', 'Foreign cards often rejected', 'Confusing seat maps', 'No multi-country routing'] },
    converto: { title: 'Converto Trains', points: ['English Interface', 'Accepts all payment methods', 'Visual Seat Selection', 'Seamless border crossings'] }
  },
  
  features: [
    { title: 'Global Coverage', description: 'Europe, Japan, China, and North America.', icon: Globe2 },
    { title: 'Guaranteed Seats', description: 'Immediate confirmation on all bookings.', icon: ShieldCheck },
    { title: 'E-Tickets', description: 'Skip the kiosk. Scan your phone at the gate.', icon: Ticket },
  ],
  
  howItWorks: [
    { title: 'Search Route', description: 'Enter stations or cities.', icon: MapPin },
    { title: 'Select Time', description: 'Pick your departure time and class.', icon: Clock },
    { title: 'Receive Ticket', description: 'Get a scannable QR e-ticket.', icon: CheckCircle },
  ],
  
  faqs: [
    { question: 'Do I need to print my ticket?', answer: 'Most modern rail networks accept the digital QR code we provide.' },
    { question: 'Can I select my seat?', answer: 'Yes, if the train operator supports advanced seat selection.' },
  ]
};
