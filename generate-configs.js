const fs = require('fs');
const path = require('path');

const services = [
  { id: 'medical', cat: 'HEALTHCARE', order: 2, icon: 'Stethoscope' },
  { id: 'exchange', cat: 'FINANCIAL', order: 3, icon: 'RefreshCcw' },
  { id: 'globalPayments', cat: 'FINANCIAL', order: 4, icon: 'Globe2' },
  { id: 'education', cat: 'EDUCATION', order: 5, icon: 'GraduationCap' },
  { id: 'flights', cat: 'TRAVEL', order: 6, icon: 'Plane' },
  { id: 'hotels', cat: 'TRAVEL', order: 7, icon: 'Building2' },
  { id: 'trains', cat: 'TRAVEL', order: 8, icon: 'Train' },
  { id: 'buses', cat: 'TRAVEL', order: 9, icon: 'Bus' },
  { id: 'events', cat: 'TRAVEL', order: 10, icon: 'Ticket' },
  { id: 'visa', cat: 'TRAVEL', order: 11, icon: 'ShieldCheck' }
];

const template = (s) => `import { ${s.icon}, Globe2, ShieldCheck, Truck, Link as LinkIcon, DollarSign, HeadphonesIcon, CreditCard } from 'lucide-react';
import { ServiceConfig, ServiceCategory, ServiceStatus } from '../types';
import { ServiceMediaAssets } from '../media';

export const ${s.id}Config: ServiceConfig = {
  id: '${s.id.toLowerCase()}',
  slug: '${s.id.toLowerCase()}',
  title: '${s.id.charAt(0).toUpperCase() + s.id.slice(1)}',
  titleKey: 'service.${s.id}.title',
  shortDescription: 'World-class service simplified.',
  shortDescriptionKey: 'service.${s.id}.shortDesc',
  
  category: ServiceCategory.${s.cat},
  status: ServiceStatus.ACTIVE,
  order: ${s.order},
  
  seoTitle: '${s.id.charAt(0).toUpperCase() + s.id.slice(1)} Services | Converto',
  seoDescription: 'Premium ${s.id} services for global citizens.',
  searchKeywords: ['${s.id}', 'global', 'service'],
  
  media: ServiceMediaAssets.${s.id},
  
  capabilities: {
    supportsTracking: true, supportsPayments: true, supportsDocuments: true,
    supportsChat: true, supportsRealtimeUpdates: true, supportsScheduling: false,
  },
  
  permissions: { customer: true, staff: true, admin: true },
  
  featureFlags: {
    enableReviews: true, enableFAQ: true, enableCalculator: false,
    enableLiveTracking: true, enableChat: true, enableCoupons: false,
  },
  
  lifecycle: { createdAt: '2026-08-01', updatedAt: '2026-08-04', version: '2.0.0', author: 'Converto Core' },
  
  actionButton: 'Get Started',
  actionButtonKey: 'service.${s.id}.cta',
  actionRoute: '/services/${s.id.toLowerCase()}/request',
  
  whatItDoes: { title: 'Your Global Partner', description: 'Handling all your ${s.id} needs effortlessly.' },
  
  features: [
    { title: 'Global Access', description: 'Access from anywhere.', icon: Globe2 },
  ],
};
`;

services.forEach(s => {
  fs.writeFileSync(path.join(__dirname, 'modules/service-engine/configs', s.id + '.ts'), template(s));
});

const indexContent = "import { ServiceRegistry } from '../registry';\n" +
"import { buyForMeConfig } from './buyForMe';\n" +
services.map(s => "import { " + s.id + "Config } from './" + s.id + "';").join('\n') + "\n\n" +
"ServiceRegistry.register(buyForMeConfig);\n" +
services.map(s => "ServiceRegistry.register(" + s.id + "Config);").join('\n') + "\n\n" +
"export { ServiceRegistry };\n";

fs.writeFileSync(path.join(__dirname, 'modules/service-engine/configs/index.ts'), indexContent);
console.log('Configs generated!');
