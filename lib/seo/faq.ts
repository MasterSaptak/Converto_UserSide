export interface FAQ {
  question: string;
  answer: string;
}

interface FAQOptions {
  service?: string;
  country?: string;
  destination?: string;
  brand?: string;
  paymentMethod?: string;
}

export function generateFAQs(opts: FAQOptions): FAQ[] {
  const faqs: FAQ[] = [];
  const { country, destination, brand, paymentMethod } = opts;

  // General FAQs
  faqs.push({
    question: 'Is Converto safe and secure?',
    answer: 'Yes. Converto uses bank-level encryption and is fully regulated to ensure your transactions and data are always secure.'
  });

  // Cross Border / Remittance FAQs
  if (country && destination) {
    faqs.push({
      question: `How long does it take to send money from ${country} to ${destination}?`,
      answer: `Most transfers from ${country} to ${destination} via Converto are completed within minutes, depending on the payout method you choose.`
    });
    faqs.push({
      question: `What is the cheapest way to send money from ${country} to ${destination}?`,
      answer: `Converto offers the real mid-market exchange rate with no hidden fees, making it one of the most cost-effective ways to transfer funds from ${country} to ${destination}.`
    });
    faqs.push({
      question: `Can I track my transfer from ${country} to ${destination}?`,
      answer: `Yes, you can track your transfer in real-time through the Converto dashboard or via SMS/Email notifications.`
    });
  }

  // Shopping FAQs
  if (brand) {
    faqs.push({
      question: `Does ${brand} ship internationally?`,
      answer: `Many items on ${brand} may not ship to your country directly. Converto's Buy For Me service acts as your proxy, purchasing the item and shipping it to you.`
    });
    faqs.push({
      question: `How do I buy from ${brand} using Converto?`,
      answer: `Simply copy the product link from ${brand}, paste it into Converto, pay in your local currency, and we will handle the purchase and international delivery.`
    });
    faqs.push({
      question: `Are there hidden fees for buying from ${brand}?`,
      answer: `No. Converto provides a transparent breakdown of the item cost, our small service fee, and shipping costs before you pay.`
    });
  }

  // Payment Method FAQs
  if (paymentMethod) {
    faqs.push({
      question: `Can I use ${paymentMethod} for international transfers?`,
      answer: `Yes, Converto supports ${paymentMethod} to fund your international transfers quickly and securely.`
    });
    faqs.push({
      question: `Are there extra fees when using ${paymentMethod}?`,
      answer: `We display any third-party processing fees associated with ${paymentMethod} upfront so you know exactly what you're paying.`
    });
  }

  // If we don't have enough FAQs, add some generic ones to always have a decent amount
  if (faqs.length < 5) {
    faqs.push({
      question: 'How do I contact Converto customer support?',
      answer: 'Our support team is available 24/7 via live chat, email, or phone directly from your dashboard.'
    });
    faqs.push({
      question: 'Does Converto have hidden fees?',
      answer: 'Never. We pride ourselves on complete transparency. The rate and fees you see are exactly what you pay.'
    });
  }

  return faqs;
}
