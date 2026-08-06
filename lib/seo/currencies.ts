export interface CurrencyEntity {
  code: string; // e.g. USD, INR
  name: string; // e.g. US Dollar, Indian Rupee
  symbol: string;
}

export const CURRENCIES: Record<string, CurrencyEntity> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$' },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  BDT: { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  MYR: { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  SAR: { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  QAR: { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق' },
};
