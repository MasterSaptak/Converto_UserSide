export interface KeywordCluster {
  primary: string[];
  secondary: string[];
  commercial: string[];
  informational: string[];
  longTail: string[];
}

interface GeneratorOptions {
  service?: string;
  country?: string;
  destination?: string;
  brand?: string;
  paymentMethod?: string;
}

export function generateKeywordCluster(opts: GeneratorOptions): KeywordCluster {
  const primary: string[] = [];
  const secondary: string[] = [];
  const commercial: string[] = [];
  const informational: string[] = [];
  const longTail: string[] = [];

  const { service, country, destination, brand, paymentMethod } = opts;

  // Logic for Country to Country payments (e.g. India to Bangladesh)
  if (country && destination && (service === 'global-payments' || !service)) {
    primary.push(`send money from ${country} to ${destination}`);
    primary.push(`${country} to ${destination} money transfer`);
    secondary.push(`remittance ${country} to ${destination}`);
    secondary.push(`exchange rate ${country} to ${destination}`);
    commercial.push(`cheapest way to send money to ${destination} from ${country}`);
    commercial.push(`best app to transfer money from ${country} to ${destination}`);
    informational.push(`how to send money from ${country} to ${destination}`);
    informational.push(`how long does a transfer take from ${country} to ${destination}`);
    longTail.push(`send money from ${country} to ${destination} online instantly`);
    longTail.push(`low fee money transfer from ${country} to ${destination}`);
  }

  // Logic for Shopping/Buy For Me
  if (brand && (service === 'buy-for-me' || service === 'shopping')) {
    primary.push(`buy from ${brand} internationally`);
    primary.push(`${brand} international shipping`);
    secondary.push(`${brand} forwarder`);
    secondary.push(`shop on ${brand} from abroad`);
    commercial.push(`best package forwarder for ${brand}`);
    commercial.push(`buy ${brand} products cheap international shipping`);
    informational.push(`does ${brand} ship internationally?`);
    informational.push(`how to buy from ${brand} if they don't ship to my country`);
    longTail.push(`how to order from ${brand} using international credit card`);
  }

  // Logic for Payment Methods
  if (paymentMethod) {
    primary.push(`${paymentMethod} international payments`);
    secondary.push(`use ${paymentMethod} abroad`);
    commercial.push(`apps that accept ${paymentMethod} for money transfer`);
    informational.push(`how to use ${paymentMethod} internationally`);
    longTail.push(`send money internationally using ${paymentMethod} instantly`);
    
    if (country && destination) {
      primary.push(`send money from ${country} to ${destination} using ${paymentMethod}`);
    }
  }

  return { primary, secondary, commercial, informational, longTail };
}
