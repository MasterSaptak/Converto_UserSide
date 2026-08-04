export interface ServiceEntity {
  name: string;
  slug: string;
  shortDescription: string;
}

export const SERVICES: Record<string, ServiceEntity> = {
  'global-payments': {
    name: 'Global Payments',
    slug: 'global-payments',
    shortDescription: 'Send money internationally with unbeatable exchange rates.',
  },
  'buy-for-me': {
    name: 'Buy For Me',
    slug: 'buy-for-me',
    shortDescription: 'Shop from international stores and we handle shipping to you.',
  },
  medical: {
    name: 'Medical Tourism',
    slug: 'medical',
    shortDescription: 'Pay for international medical treatments and hospitals.',
  },
  education: {
    name: 'Education Payments',
    slug: 'education',
    shortDescription: 'Pay university tuition and study abroad fees globally.',
  },
  exchange: {
    name: 'Currency Exchange',
    slug: 'exchange',
    shortDescription: 'Convert currencies at the real mid-market rate.',
  },
  flights: { name: 'Flights', slug: 'flights', shortDescription: 'Book international flights.' },
  hotels: { name: 'Hotels', slug: 'hotels', shortDescription: 'Book international hotels.' },
  trains: { name: 'Trains', slug: 'trains', shortDescription: 'Book international trains.' },
  buses: { name: 'Buses', slug: 'buses', shortDescription: 'Book international buses.' },
  events: { name: 'Events', slug: 'events', shortDescription: 'Book international events.' },
  visa: { name: 'Visa Services', slug: 'visa', shortDescription: 'Apply for international visas.' },
  tickets: { name: 'Tickets', slug: 'tickets', shortDescription: 'Book international tickets.' },
};
