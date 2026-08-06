export interface CountryEntity {
  name: string;
  slug: string;
  code: string; // ISO 3166-1 alpha-2 (e.g., 'IN', 'BD', 'US')
  currency: string;
  popularCorridors: string[]; // Slugs of popular destinations/origins
}

export const COUNTRIES: Record<string, CountryEntity> = {
  india: {
    name: 'India',
    slug: 'india',
    code: 'IN',
    currency: 'INR',
    popularCorridors: ['bangladesh', 'usa', 'uk', 'uae', 'canada', 'australia'],
  },
  bangladesh: {
    name: 'Bangladesh',
    slug: 'bangladesh',
    code: 'BD',
    currency: 'BDT',
    popularCorridors: ['india', 'usa', 'uk', 'canada', 'australia', 'uae', 'qatar', 'saudi-arabia', 'singapore', 'malaysia'],
  },
  usa: { name: 'USA', slug: 'usa', code: 'US', currency: 'USD', popularCorridors: ['bangladesh', 'india'] },
  uk: { name: 'UK', slug: 'uk', code: 'GB', currency: 'GBP', popularCorridors: ['bangladesh', 'india'] },
  canada: { name: 'Canada', slug: 'canada', code: 'CA', currency: 'CAD', popularCorridors: ['bangladesh', 'india'] },
  australia: { name: 'Australia', slug: 'australia', code: 'AU', currency: 'AUD', popularCorridors: ['bangladesh', 'india'] },
  uae: { name: 'UAE', slug: 'uae', code: 'AE', currency: 'AED', popularCorridors: ['bangladesh', 'india'] },
  qatar: { name: 'Qatar', slug: 'qatar', code: 'QA', currency: 'QAR', popularCorridors: ['bangladesh'] },
  'saudi-arabia': { name: 'Saudi Arabia', slug: 'saudi-arabia', code: 'SA', currency: 'SAR', popularCorridors: ['bangladesh'] },
  singapore: { name: 'Singapore', slug: 'singapore', code: 'SG', currency: 'SGD', popularCorridors: ['bangladesh'] },
  malaysia: { name: 'Malaysia', slug: 'malaysia', code: 'MY', currency: 'MYR', popularCorridors: ['bangladesh'] },
};

// Generate the specific corridors (e.g., india-to-bangladesh)
export interface CorridorEntity {
  from: string; // Name
  to: string; // Name
  slug: string;
  label: string;
}

export const CORRIDORS: CorridorEntity[] = [];

// Automatically generate corridors based on popularCorridors array
Object.values(COUNTRIES).forEach(origin => {
  origin.popularCorridors.forEach(destSlug => {
    const dest = COUNTRIES[destSlug];
    if (dest) {
      CORRIDORS.push({
        from: origin.name,
        to: dest.name,
        slug: `${origin.slug}-to-${dest.slug}`,
        label: `${origin.name} → ${dest.name}`
      });
    }
  });
});
