export interface PaymentMethodEntity {
  name: string;
  slug: string;
  category: 'card' | 'wallet' | 'regional' | 'crypto' | 'bank';
  supported: boolean;
  comingSoon?: boolean;
}

export const PAYMENT_METHODS: PaymentMethodEntity[] = [
  // Cards
  { name: 'Visa', slug: 'visa', category: 'card', supported: true },
  { name: 'Mastercard', slug: 'mastercard', category: 'card', supported: true },
  { name: 'RuPay', slug: 'rupay', category: 'card', supported: true },

  // Wallets
  { name: 'PayPal', slug: 'paypal', category: 'wallet', supported: true },
  { name: 'Wise', slug: 'wise', category: 'wallet', supported: true },
  { name: 'Remitly', slug: 'remitly', category: 'wallet', supported: true },
  { name: 'TapTap Send', slug: 'taptap-send', category: 'wallet', supported: true },

  // Regional (Bangladesh)
  { name: 'bKash', slug: 'bkash', category: 'regional', supported: true },
  { name: 'Nagad', slug: 'nagad', category: 'regional', supported: true },
  { name: 'Rocket', slug: 'rocket', category: 'regional', supported: true },

  // Crypto
  { name: 'Binance Pay', slug: 'binance', category: 'crypto', supported: false, comingSoon: true },
  { name: 'Bitcoin', slug: 'bitcoin', category: 'crypto', supported: false, comingSoon: true },
  { name: 'USDT', slug: 'usdt', category: 'crypto', supported: false, comingSoon: true },

  // Bank Transfer
  { name: 'SWIFT', slug: 'swift', category: 'bank', supported: true },
];
