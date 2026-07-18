// Base rates relative to USD (1 USD = 1)
export const BASE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  INR: 83.15,
  BDT: 109.50,
  CNY: 7.19,
};

export const ALL_CURRENCIES = Object.keys(BASE_RATES);

/**
 * Calculates the C-Points earned for a given transaction amount.
 * 1 USD equivalent = 100 C-Points.
 * 
 * @param amount The transaction amount in the local currency
 * @param currencyCode The currency code (e.g., 'USD', 'INR')
 * @returns The integer amount of C-Points earned
 */
export function calculateCPoints(amount: number, currencyCode: string): number {
  const baseRate = BASE_RATES[currencyCode];
  
  if (!baseRate) {
    // If currency not found, default to 0 to avoid errors, or fallback to USD rate
    console.warn(`Currency code ${currencyCode} not found in BASE_RATES. Points calculation skipped.`);
    return 0;
  }

  // Convert to USD equivalent
  const amountInUSD = Math.abs(amount) / baseRate;
  
  // Calculate points (1 USD = 100 Points) and return as integer
  return Math.floor(amountInUSD * 100);
}

// Reward Tiers Logic
export const REWARD_TIERS = [
  { name: 'Bronze', minPoints: 0 },
  { name: 'Silver', minPoints: 5000 },
  { name: 'Gold', minPoints: 25000 },
  { name: 'Platinum', minPoints: 100000 },
  { name: 'Diamond', minPoints: 250000 },
  { name: 'Ruby', minPoints: 500000 },
  { name: 'Sapphire', minPoints: 1000000 },
  { name: 'Emerald', minPoints: 2500000 },
  { name: 'Titanium', minPoints: 5000000 },
  { name: 'Black Card', minPoints: 10000000 },
];

export function getTierInfo(points: number) {
  let currentTier = REWARD_TIERS[0];
  let nextTier = REWARD_TIERS[1];
  
  for (let i = 0; i < REWARD_TIERS.length; i++) {
    if (points >= REWARD_TIERS[i].minPoints) {
      currentTier = REWARD_TIERS[i];
      nextTier = REWARD_TIERS[i + 1] || null; // Null if max tier
    } else {
      break;
    }
  }

  return {
    current: currentTier,
    next: nextTier,
    progress: nextTier 
      ? Math.min(100, Math.max(0, ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100))
      : 100
  };
}
