import { ShoppingBag, Globe2, ShieldCheck, Truck, Link as LinkIcon, DollarSign, HeadphonesIcon, CreditCard } from 'lucide-react';
import { ServiceConfig, ServiceCategory, ServiceStatus } from '../types';
import { ServiceMediaAssets } from '../media';
import { SHOPPING_PLATFORMS, BANK_CARDS as BANK_OFFERS } from '@/lib/seo';

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
  
  seoTitle: 'Buy For Me — Shopping Concierge & Proxy Shopping Service',
  seoDescription: 'Shop from Amazon, Flipkart, Myntra, Meesho and global retailers. Paste the link, and we buy it and ship it to your doorstep. Personal shopper India.',
  searchKeywords: ['buy for me', 'shopping concierge', 'proxy shopping', 'personal shopper India', 'buy from amazon', 'international shipping', 'purchase assistance'],

  seo: {
    title: 'Buy For Me — Shopping Concierge & Proxy Shopping Service',
    description: 'Shop from Amazon, Flipkart, Myntra, Meesho and thousands of global retailers. Just paste the product link — we buy it and deliver it to your doorstep. Personal shopper India.',
    keywords: {
      primary: ['buy for me', 'shopping concierge', 'purchase assistance', 'proxy shopping'],
      secondary: ['buy products from India', 'buy products for Bangladesh', 'personal shopper India', 'international shopping', 'shopping from abroad'],
      longTail: [
        'buy from Amazon India for Bangladesh',
        'how to buy from Flipkart to Bangladesh',
        'personal shopper service India',
        'proxy shopping India to Bangladesh',
        'buy Myntra products from outside India',
        'shopping assistant for international buyers',
        'buy Indian products from Bangladesh',
      ],
    },
    relatedSearches: [
      'Amazon India shopping',
      'Flipkart shopping',
      'Proxy shopping',
      'Shopping concierge',
      'Buy products from India',
      'International package forwarding',
      'Myntra overseas delivery',
      'Meesho international shipping',
      'Personal shopper service',
      'Cross-border shopping guide',
    ],
    shoppingPlatforms: SHOPPING_PLATFORMS,
    bankOffers: BANK_OFFERS,
    ctaSections: [
      { headline: 'Want to buy from Amazon India?', buttonText: 'Start shopping', href: '/services/buy-for-me/request' },
      { headline: 'Looking for Flipkart or Myntra products?', buttonText: 'Place your order', href: '/services/buy-for-me/request' },
      { headline: 'Need help with international delivery?', buttonText: 'Contact Support', href: '/support' },
      { headline: 'Interested in credit card offers on shopping?', buttonText: 'Explore Offers', href: '/offers' },
    ],
  },

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
  
  whatItDoes: { title: 'Your Personal Global Shopper', description: 'Can\'t get that item shipped to your country? Is your local card rejected on Amazon, Flipkart, or Myntra? Just paste the product link from any retailer, and we will purchase it on your behalf and deliver it right to your doorstep. Works with Amazon, Flipkart, Myntra, Meesho, Ajio, Nykaa, and thousands more.' },
  whyChooseUs: { title: 'Eliminate Borders', description: 'We eliminate international shipping hurdles, currency conversion fees, and payment rejections. Whether you\'re in Bangladesh, UAE, or anywhere else, access Indian and global products effortlessly through Converto.' },
  
  comparison: {
    traditional: { title: 'Traditional Forwarder', points: ['Hidden Customs Fees', 'High Shipping Rates', 'You must buy it yourself', 'Local cards often rejected', 'Slow customer service'] },
    converto: { title: 'Converto Buy For Me', points: ['Transparent Upfront Pricing', 'Consolidated Cheap Shipping', 'We buy it for you', 'Pay with local methods', '24/7 Dedicated Support'] }
  },
  
  features: [
    { title: 'Global Store Access', description: 'Shop from Amazon, Flipkart, Myntra, Meesho, and any online store worldwide — even if they don\'t ship internationally.', icon: Globe2 },
    { title: 'Guaranteed Payments', description: 'Don\'t worry about international card blocks. Pay locally on Converto.', icon: ShieldCheck },
    { title: 'Doorstep Delivery', description: 'We handle customs, international logistics, and final mile delivery to your door.', icon: Truck },
  ],
  
  howItWorks: [
    { title: 'Find Your Product', description: 'Find what you want on Amazon, Flipkart, Myntra, or any website and copy the product URL.', icon: LinkIcon },
    { title: 'Submit Request', description: 'Paste the link into Converto and tell us the size, color, or variant you need.', icon: ShoppingBag },
    { title: 'Pay & Receive', description: 'Accept our guaranteed quote, and we will buy and ship the item immediately.', icon: Truck },
  ],
  
  benefits: [
    { title: 'No Credit Card Needed', description: 'Pay using local payment methods, bKash, Nagad, or bank transfers.', icon: CreditCard },
    { title: 'Transparent Pricing', description: 'See all costs upfront including customs and shipping. No hidden fees on delivery.', icon: DollarSign },
  ],
  
  faqs: [
    { question: 'Which websites can I buy from?', answer: 'You can buy from virtually any online retailer globally. The most popular include Amazon, Flipkart, Myntra, Meesho, Ajio, Nykaa, eBay, and AliExpress.' },
    { question: 'How long does shipping take?', answer: 'Express shipping usually takes 3-7 business days once it reaches our international warehouse. Domestic orders within India are even faster.' },
    { question: 'Can I buy from Amazon India to Bangladesh?', answer: 'Yes! This is one of our most popular use cases. Simply paste the Amazon India product link and we handle everything.' },
    { question: 'Can I buy from Flipkart for delivery outside India?', answer: 'Absolutely. Flipkart doesn\'t ship internationally, but Converto\'s Buy For Me service bridges that gap.' },
    { question: 'What if the product is out of stock?', answer: 'We\'ll notify you immediately and can help find alternatives from other retailers.' },
    { question: 'Can I combine multiple orders into one shipment?', answer: 'Yes! Consolidated shipping is one of our best features. Buy from multiple stores and we pack them into one cheaper shipment.' },
    { question: 'How do I pay for my order?', answer: 'You can pay using bKash, Nagad, bank transfer, or any local payment method available in your country.' },
    { question: 'Are there any hidden fees?', answer: 'No. All costs including product price, shipping, customs, and our service fee are shown upfront before you confirm.' },
    { question: 'Can I return items bought through Buy For Me?', answer: 'Returns depend on the retailer\'s policy. We\'ll assist you with the return process if needed.' },
    { question: 'Is Buy For Me available for electronics?', answer: 'Yes! You can buy phones, laptops, tablets, and other electronics from Amazon, Croma, Reliance Digital, and more.' },
    { question: 'Do you handle customs clearance?', answer: 'Yes, we handle all customs paperwork and duties. The total cost including customs is quoted upfront.' },
    { question: 'Can I use credit card offers with Buy For Me?', answer: 'Yes! If you\'re using an eligible card like Amazon Pay ICICI or Flipkart Axis, the offers may apply to your purchase.' },
    { question: 'What if my product arrives damaged?', answer: 'We photograph every item at our warehouse. If it arrives damaged, we\'ll handle the claim with the retailer.' },
    { question: 'Is there a minimum or maximum order value?', answer: 'There\'s no minimum order. Maximum order values depend on the destination country\'s customs regulations.' },
    { question: 'How do I track my order?', answer: 'Every order has real-time tracking from purchase to delivery. You\'ll get updates at every stage.' },
  ],

  relatedServices: [
    { id: 'global-payments', title: 'Global Payments', description: 'Need to pay an international vendor directly?', href: '/services/global-payments', icon: Globe2 },
    { id: 'exchange', title: 'Currency Exchange', description: 'Convert currencies at the best market rates.', href: '/services/exchange', icon: Globe2 },
  ],
};

