import { ShoppingBag, Globe2, ShieldCheck, Truck, Link as LinkIcon, DollarSign, HeadphonesIcon, CreditCard } from 'lucide-react';
import { ServiceConfig, ServiceCategory, ServiceStatus } from '../types';
import { ServiceMediaAssets } from '../media';

export const buyForMeConfig: ServiceConfig = {
  id: 'buy-for-me',
  slug: 'buy-for-me',
  title: 'Buy For Me',
  titleKey: 'service.buyForMe.title',
  shortDescription: 'Paste a link, we handle the rest. Shop globally, delivered locally.',
  shortDescriptionKey: 'service.buyForMe.shortDesc',
  
  category: ServiceCategory.LOGISTICS,
  status: ServiceStatus.ACTIVE,
  order: 1,
  
  seoTitle: 'Buy For Me - Your Personal Global Shopper | Converto',
  seoDescription: 'Shop from Amazon, eBay, AliExpress, and global retailers.',
  searchKeywords: ['global shopper', 'package forwarding', 'buy from amazon', 'international shipping', 'proxy buyer'],
  
  media: ServiceMediaAssets.buyForMe,
  
  capabilities: {
    supportsTracking: true,
    supportsPayments: true,
    supportsDocuments: false,
    supportsChat: true,
    supportsRealtimeUpdates: true,
    supportsScheduling: false,
  },
  
  permissions: { customer: true, staff: true, admin: true },
  
  featureFlags: {
    enableReviews: true, enableFAQ: true, enableCalculator: true,
    enableLiveTracking: true, enableChat: true, enableCoupons: true,
  },
  
  lifecycle: { createdAt: '2026-08-01', updatedAt: '2026-08-04', version: '2.0.0', author: 'Converto Core' },
  
  actionButton: 'Start Shopping',
  actionButtonKey: 'service.buyForMe.cta',
  actionRoute: '/services/buy-for-me/request',
  
  badges: ['Most Popular', 'Fast Delivery'],
  statistics: [
    { label: 'Happy Customers', value: '10k+' },
    { label: 'Supported Stores', value: 'Unlimited' },
  ],
  
  whatItDoes: { title: 'Your Personal Global Shopper', description: 'Can\'t get that item shipped to your country? Is your local card rejected? Just paste the product link from any global retailer, and we will purchase it on your behalf and deliver it right to your doorstep.' },
  whyChooseUs: { title: 'Eliminate Borders', description: 'We eliminate international shipping hurdles, currency conversion fees, and payment rejections.' },
  
  comparison: {
    traditional: { title: 'Traditional Forwarder', points: ['Hidden Customs Fees', 'High Shipping Rates', 'You must buy it yourself', 'Local cards often rejected', 'Slow customer service'] },
    converto: { title: 'Converto Buy For Me', points: ['Transparent Upfront Pricing', 'Consolidated Cheap Shipping', 'We buy it for you', 'Pay with local methods', '24/7 Dedicated Support'] }
  },
  
  features: [
    { title: 'Global Store Access', description: 'Shop from any online store in the US, UK, China, or Europe.', icon: Globe2 },
    { title: 'Guaranteed Payments', description: 'Don\'t worry about international card blocks.', icon: ShieldCheck },
    { title: 'Doorstep Delivery', description: 'We handle customs, international logistics, and final mile delivery.', icon: Truck },
  ],
  
  howItWorks: [
    { title: 'Find Your Product', description: 'Find what you want on any website and copy the product URL.', icon: LinkIcon },
    { title: 'Submit Request', description: 'Paste the link into Converto and tell us the size/color you need.', icon: ShoppingBag },
    { title: 'Pay & Receive', description: 'Accept our guaranteed quote, and we will buy and ship the item immediately.', icon: Truck },
  ],
  
  benefits: [
    { title: 'No Credit Card Needed', description: 'Pay using local payment methods.', icon: CreditCard },
    { title: 'Transparent Pricing', description: 'See all costs upfront including customs.', icon: DollarSign },
  ],
  
  faqs: [
    { question: 'Which websites can I buy from?', answer: 'You can buy from virtually any online retailer globally.' },
    { question: 'How long does shipping take?', answer: 'Express shipping usually takes 3-7 business days.' },
  ]
};
