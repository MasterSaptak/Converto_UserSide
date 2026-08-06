import React from 'react';
import { ChevronDown } from 'lucide-react';

export const aboutFaqs = [
  {
    question: "What is Converto?",
    answer: "Converto is a unified global services platform that simplifies international payments, cross-border shopping (Buy For Me), education fees, medical tourism bookings, and travel arrangements all through a single dashboard."
  },
  {
    question: "Is Converto secure?",
    answer: "Yes. We employ enterprise-grade encryption, secure authentication, and comply with international financial regulations to ensure your data and payments are always protected."
  },
  {
    question: "Which countries are supported?",
    answer: "We support transactions across 35+ countries globally, with specific optimized corridors for regions like the US, UK, India, and Bangladesh. We are continuously expanding our network."
  },
  {
    question: "How does Buy For Me work?",
    answer: "Buy For Me allows you to shop from international stores like Amazon or Flipkart even if they don't accept your local card or ship to your country. We buy the items for you and handle the logistics."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept a wide range of global and local payment methods including Visa, Mastercard, PayPal, and localized wallets like bKash depending on your region."
  },
  {
    question: "Can I track my request?",
    answer: "Absolutely. Every transaction, whether it's a payment or a shopping order, has real-time tracking available directly within your unified dashboard."
  },
  {
    question: "How can I contact support?",
    answer: "Our human support team is available 24/7. You can reach out via live chat in your dashboard, email, or through our dedicated support page."
  }
];

export function FAQSection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-background border-b border-foreground/10">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-heading text-center mb-16">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col gap-4">
          {aboutFaqs.map((faq, i) => (
            <details 
              key={i} 
              className="group border-2 border-foreground/10 bg-zinc-50 p-6 [&_summary::-webkit-details-marker]:hidden open:border-primary open:shadow-[4px_4px_0px_var(--color-primary)] transition-all cursor-pointer"
            >
              <summary className="flex items-center justify-between font-bold text-lg outline-none">
                {faq.question}
                <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180 text-muted-foreground" />
              </summary>
              <div className="mt-4 text-muted-foreground leading-relaxed pt-4 border-t border-foreground/10">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
