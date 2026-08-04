import { ShoppingBag, Globe2, ShieldCheck, Truck, Link as LinkIcon, DollarSign, HeadphonesIcon, CreditCard, Stethoscope, BriefcaseMedical, PhoneCall, RefreshCcw, Landmark, Plane, Bus, Train, Ticket, GraduationCap, Building2 } from 'lucide-react';
import { ServiceConfig } from '@/types/services';

export const buyForMeConfig: ServiceConfig = {
  id: 'buy-for-me',
  slug: 'buy-for-me',
  title: 'Buy For Me',
  shortDescription: 'Paste a link, we handle the rest. Shop globally, delivered locally.',
  seoTitle: 'Buy For Me - Your Personal Global Shopper | Converto',
  seoDescription: 'Shop from Amazon, eBay, AliExpress, and global retailers. Paste the link, and we will buy it and ship it to your doorstep.',
  seoKeywords: ['global shopper', 'package forwarding', 'buy from amazon', 'international shipping', 'proxy buyer'],
  heroImage: '/Buy For Me.png',
  category: 'Logistics',
  actionButton: 'Start Shopping',
  actionRoute: '/services/buy-for-me/request',
  badges: ['Most Popular', 'Fast Delivery'],
  statistics: [
    { label: 'Happy Customers', value: '10k+' },
    { label: 'Supported Stores', value: 'Unlimited' },
  ],
  whatItDoes: {
    title: 'Your Personal Global Shopper',
    description: 'Can\'t get that item shipped to your country? Is your local card rejected? Just paste the product link from any global retailer, and we will purchase it on your behalf and deliver it right to your doorstep.',
  },
  whyChooseUs: {
    title: 'Eliminate Borders',
    description: 'We eliminate international shipping hurdles, currency conversion fees, and payment rejections. You get seamless access to Amazon, eBay, AliExpress, BestBuy, and thousands of other global retailers without leaving Converto.',
  },
  comparison: {
    traditional: {
      title: 'Traditional Forwarder',
      points: ['Hidden Customs Fees', 'High Shipping Rates', 'You must buy it yourself', 'Local cards often rejected', 'Slow customer service']
    },
    converto: {
      title: 'Converto Buy For Me',
      points: ['Transparent Upfront Pricing', 'Consolidated Cheap Shipping', 'We buy it for you', 'Pay with local methods', '24/7 Dedicated Support']
    }
  },
  features: [
    { title: 'Global Store Access', description: 'Shop from any online store in the US, UK, China, or Europe even if they don\'t ship internationally.', icon: Globe2 },
    { title: 'Guaranteed Payments', description: 'Don\'t worry about international card blocks. Pay locally on Converto, and we pay the retailer.', icon: ShieldCheck },
    { title: 'Doorstep Delivery', description: 'We handle customs, international logistics, and final mile delivery right to your door.', icon: Truck },
  ],
  howItWorks: [
    { title: 'Find Your Product', description: 'Find what you want on any website and copy the product URL.', icon: LinkIcon },
    { title: 'Submit Request', description: 'Paste the link into Converto and tell us the size/color you need.', icon: ShoppingBag },
    { title: 'Pay & Receive', description: 'Accept our guaranteed quote, and we will buy and ship the item immediately.', icon: Truck },
  ],
  benefits: [
    { title: 'No Credit Card Needed', description: 'Pay using local payment methods, bank transfers, or Converto credits.', icon: CreditCard },
    { title: 'Consolidated Shipping', description: 'Buy from multiple stores and we will pack them into one cheaper shipment.', icon: Truck },
    { title: 'Transparent Pricing', description: 'See all costs upfront including customs. No hidden fees on delivery.', icon: DollarSign },
    { title: '24/7 Dedicated Support', description: 'Our team tracks your package and handles any retailer disputes.', icon: HeadphonesIcon },
  ],
  faqs: [
    { question: 'Which websites can I buy from?', answer: 'You can buy from virtually any online retailer globally. The most popular are Amazon, eBay, and AliExpress.' },
    { question: 'How long does shipping take?', answer: 'Express shipping usually takes 3-7 business days once it reaches our international warehouse.' },
  ],
  relatedServices: [
    { id: 'payments', title: 'Global Payments', description: 'Need to pay an international vendor directly?', href: '/services/global-payments', icon: Globe2 },
  ],
};

export const medicalConfig: ServiceConfig = {
  id: 'medical',
  slug: 'medical',
  title: 'Medical Assistance',
  shortDescription: 'World-class healthcare access, simplified for global patients.',
  seoTitle: 'Medical Assistance & Tourism | Converto',
  heroImage: '/medical.png',
  category: 'Healthcare',
  actionButton: 'Get Medical Help',
  actionRoute: '/services/medical/request',
  whatItDoes: {
    title: 'Your Global Healthcare Partner',
    description: 'We connect you with top-tier hospitals globally, handling appointments, visa assistance, and travel arrangements so you can focus on your health.',
  },
  features: [
    { title: 'Top Hospitals', description: 'Access to accredited hospitals in India, Thailand, Turkey, and more.', icon: Building2 },
    { title: 'Priority Appointments', description: 'Skip the waiting lists with our partner healthcare networks.', icon: Stethoscope },
    { title: 'End-to-End Care', description: 'From airport pickup to post-treatment follow-ups.', icon: BriefcaseMedical },
  ],
  howItWorks: [
    { title: 'Share Reports', description: 'Upload your medical reports securely.', icon: LinkIcon },
    { title: 'Get Treatment Plan', description: 'Receive quotes and plans from top doctors.', icon: Stethoscope },
    { title: 'Travel & Recover', description: 'We arrange your travel, stay, and hospital visits.', icon: Truck },
  ]
};

export const exchangeConfig: ServiceConfig = {
  id: 'exchange',
  slug: 'exchange',
  title: 'Currency Exchange',
  shortDescription: 'Exchange currencies at competitive real-time rates.',
  seoTitle: 'Currency Exchange | Converto',
  heroImage: '/Currency.png',
  category: 'Finance',
  actionButton: 'Exchange Currency',
  actionRoute: '/services/exchange/request',
  whatItDoes: {
    title: 'Smart Currency Conversion',
    description: 'Convert your local currency to USD, EUR, GBP and more at the best market rates with zero hidden markup.',
  },
  comparison: {
    traditional: { title: 'Local Banks', points: ['High Markup (3-5%)', 'Hidden Fees', 'Slow Processing'] },
    converto: { title: 'Converto Exchange', points: ['Real-time Market Rates', 'Zero Hidden Fees', 'Instant Wallet Credit'] }
  },
  features: [
    { title: 'Best Rates', description: 'We aggregate rates to give you the cheapest conversion.', icon: RefreshCcw },
    { title: 'Multi-Currency Wallet', description: 'Hold balances in multiple currencies.', icon: Landmark },
  ]
};

export const globalPaymentsConfig: ServiceConfig = {
  id: 'global-payments',
  slug: 'global-payments',
  title: 'Global Payments',
  shortDescription: 'Send payments to anyone, anywhere in the world.',
  seoTitle: 'Global Payments & Transfers | Converto',
  heroImage: '/global.png',
  category: 'Finance',
  actionButton: 'Send Payment',
  actionRoute: '/services/global-payments/request',
  whatItDoes: {
    title: 'Borderless Transactions',
    description: 'Pay university tuition, international suppliers, or freelancers without needing a global credit card.',
  },
  features: [
    { title: 'Pay Vendors', description: 'Direct bank transfers to over 150 countries.', icon: Landmark },
    { title: 'Local Funding', description: 'Fund your transfer using local payment methods.', icon: CreditCard },
  ]
};

export const educationConfig: ServiceConfig = {
  id: 'education',
  slug: 'education',
  title: 'Education Payments',
  shortDescription: 'Pay tuition and education fees internationally with ease.',
  seoTitle: 'International Education Payments | Converto',
  heroImage: '/Education.png',
  category: 'Education',
  actionButton: 'Pay Tuition',
  actionRoute: '/services/education/request',
  whatItDoes: {
    title: 'Simplifying Student Life',
    description: 'Don\'t let payment hurdles stop your education. We transfer tuition directly to universities worldwide.',
  },
  features: [
    { title: 'University Network', description: 'Payments accepted by thousands of global institutions.', icon: GraduationCap },
    { title: 'Fast Settlement', description: 'Ensure your fees are paid before deadlines.', icon: Zap },
  ]
};

export const ticketsConfig: ServiceConfig = {
  id: 'tickets',
  slug: 'tickets',
  title: 'Tickets & Bookings',
  shortDescription: 'Book flights, trains, buses, hotels, and events globally.',
  seoTitle: 'Global Tickets & Travel Bookings | Converto',
  heroImage: '/PLane.png',
  category: 'Travel',
  actionButton: 'Book Now',
  actionRoute: '/services/tickets/request',
  whatItDoes: {
    title: 'Your Ultimate Travel Desk',
    description: 'Whether it is a train across Europe, a flight to Dubai, or a hotel in New York, book it all using your local currency.',
  },
  features: [
    { title: 'Flight Booking', description: 'Domestic & International flights at the best rates.', icon: Plane },
    { title: 'Hotel Booking', description: 'Stay anywhere in the world securely.', icon: Building2 },
    { title: 'Overland Travel', description: 'Train and bus tickets across major global networks.', icon: Train },
  ]
};

export const visaConfig: ServiceConfig = {
  id: 'visa',
  slug: 'visa',
  title: 'Visa Assistance',
  shortDescription: 'Expert guidance for tourist, student, and medical visas.',
  seoTitle: 'Visa Assistance Services | Converto',
  heroImage: '/global.png', // Fallback to global
  category: 'Travel',
  actionButton: 'Apply for Visa',
  actionRoute: '/services/visa/request',
  whatItDoes: {
    title: 'Hassle-Free Visa Processing',
    description: 'Navigating visa requirements is tough. Our experts handle documentation, appointments, and processing for you.',
  },
  features: [
    { title: 'Document Verification', description: 'We ensure your paperwork is 100% correct before submission.', icon: ShieldCheck },
  ]
};

// Map of all service configs for dynamic lookup
export const serviceRegistry: Record<string, ServiceConfig> = {
  'buy-for-me': buyForMeConfig,
  'medical': medicalConfig,
  'exchange': exchangeConfig,
  'global-payments': globalPaymentsConfig,
  'education': educationConfig,
  'tickets': ticketsConfig,
  'visa': visaConfig,
};
