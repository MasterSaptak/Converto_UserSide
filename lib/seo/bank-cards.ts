export interface BankCardEntity {
  bankName: string;
  cardName: string;
  slug: string;
  supported: boolean;
  comingSoon?: boolean;
}

export const BANK_CARDS: BankCardEntity[] = [
  { bankName: 'ICICI', cardName: 'Amazon Pay ICICI', slug: 'amazon-icici', supported: true },
  { bankName: 'Axis Bank', cardName: 'Flipkart Axis', slug: 'flipkart-axis', supported: true },
  { bankName: 'SBI', cardName: 'SBI Cashback', slug: 'sbi-cashback', supported: true },
  { bankName: 'HDFC', cardName: 'HDFC Millennia', slug: 'hdfc-millennia', supported: true },
  { bankName: 'HDFC', cardName: 'HDFC Regalia', slug: 'hdfc-regalia', supported: true },
  { bankName: 'ICICI', cardName: 'ICICI Coral', slug: 'icici-coral', supported: true },
  { bankName: 'ICICI', cardName: 'ICICI Rubyx', slug: 'icici-rubyx', supported: true },
  { bankName: 'Axis Bank', cardName: 'Axis Ace', slug: 'axis-ace', supported: true },
  { bankName: 'Axis Bank', cardName: 'Axis Neo', slug: 'axis-neo', supported: true },
  { bankName: 'American Express', cardName: 'Amex MRCC', slug: 'amex-mrcc', supported: true },
  { bankName: 'American Express', cardName: 'Amex Platinum', slug: 'amex-platinum', supported: true },
  { bankName: 'IDFC First', cardName: 'IDFC Wealth', slug: 'idfc-wealth', supported: true },
  { bankName: 'Kotak', cardName: 'Kotak League', slug: 'kotak-league', supported: true },
  { bankName: 'AU Small Finance', cardName: 'AU Zenith', slug: 'au-zenith', supported: true },
];
