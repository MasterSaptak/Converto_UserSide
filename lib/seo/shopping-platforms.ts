export interface ShoppingPlatformEntity {
  name: string;
  slug: string;
  supported: boolean;
  comingSoon?: boolean;
}

export const SHOPPING_PLATFORMS: ShoppingPlatformEntity[] = [
  { name: 'Amazon', slug: 'amazon', supported: true },
  { name: 'Flipkart', slug: 'flipkart', supported: true },
  { name: 'Meesho', slug: 'meesho', supported: true },
  { name: 'Myntra', slug: 'myntra', supported: true },
  { name: 'Ajio', slug: 'ajio', supported: true },
  { name: 'Nykaa', slug: 'nykaa', supported: true },
  { name: 'Croma', slug: 'croma', supported: true },
  { name: 'Reliance Digital', slug: 'reliance-digital', supported: true },
  { name: 'Apple Store', slug: 'apple-store', supported: true },
  { name: 'Samsung Store', slug: 'samsung-store', supported: true },
];
