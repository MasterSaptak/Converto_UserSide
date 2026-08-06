import { Building2, Globe2, ShieldCheck, MapPin, Bed, Star, Heart } from 'lucide-react';
import { ServiceConfig, ServiceCategory, ServiceStatus } from '../types';
import { ServiceMediaAssets } from '../media';

export const hotelsConfig: ServiceConfig = {
  id: 'hotels',
  slug: 'hotels',
  title: 'Hotels',
  titleKey: 'service.hotels.title',
  shortDescription: 'Discover and book luxury hotels, resorts, and stays worldwide.',
  shortDescriptionKey: 'service.hotels.shortDesc',
  
  category: ServiceCategory.TRAVEL,
  status: ServiceStatus.ACTIVE,
  order: 7,
  
  seoTitle: 'Book Luxury Hotels & Resorts | Converto',
  seoDescription: 'Find the perfect stay with exclusive perks and guaranteed lowest rates.',
  searchKeywords: ['hotels', 'resorts', 'book hotel', 'luxury stays', 'accommodation'],
  
  media: ServiceMediaAssets.hotels,
  
  capabilities: {
    supportsTracking: true, supportsPayments: true, supportsDocuments: false,
    supportsChat: true, supportsRealtimeUpdates: true, supportsScheduling: true,
  },
  
  permissions: { customer: true, staff: true, admin: true },
  
  featureFlags: {
    enableReviews: true, enableFAQ: true, enableCalculator: false,
    enableLiveTracking: false, enableChat: true, enableCoupons: true,
  },
  
  lifecycle: { createdAt: '2026-08-01', updatedAt: '2026-08-04', version: '2.0.0', author: 'Converto Core' },
  
  actionButton: 'Find Stays',
  actionButtonKey: 'service.hotels.cta',
  actionRoute: '/services/hotels/request',
  
  badges: ['VIP Perks', 'Price Match'],
  statistics: [
    { label: 'Properties', value: '2M+' },
    { label: 'Verified Reviews', value: '10M+' },
  ],
  
  whatItDoes: { 
    title: 'Your Home Anywhere', 
    description: 'Whether it\'s a 5-star luxury resort in the Maldives or a boutique hotel in Paris, book your perfect accommodation with exclusive Converto VIP perks.' 
  },
  whyChooseUs: { 
    title: 'More Than Just a Room', 
    description: 'Booking with us unlocks room upgrades, free breakfasts, and late checkouts at participating premium properties around the world.' 
  },
  
  comparison: {
    traditional: { title: 'Standard Booking', points: ['Basic room only', 'Strict cancellation', 'No loyalty perks', 'Hidden resort fees'] },
    converto: { title: 'Converto Hotels', points: ['VIP Upgrades (when available)', 'Flexible Cancellation', 'Earn Converto Rewards', 'All taxes & fees included'] }
  },
  
  features: [
    { title: 'Global Selection', description: 'Over 2 million properties worldwide.', icon: Globe2 },
    { title: 'Verified Stays', description: 'Real reviews from verified guests.', icon: ShieldCheck },
    { title: 'VIP Treatment', description: 'Unlock exclusive perks and amenities.', icon: Star },
  ],
  
  howItWorks: [
    { title: 'Search', description: 'Enter your destination and dates.', icon: MapPin },
    { title: 'Select', description: 'Choose your room and preferred rate.', icon: Bed },
    { title: 'Enjoy', description: 'Check-in seamlessly and enjoy your stay.', icon: Heart },
  ],
  
  faqs: [
    { question: 'Do I get free breakfast?', answer: 'Many of our premium rates include complimentary breakfast.' },
    { question: 'Can I pay at the hotel?', answer: 'Yes, we offer both prepaid and pay-at-property options.' },
  ]
};
