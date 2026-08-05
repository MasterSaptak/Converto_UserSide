import type { Metadata } from 'next';
import './ai.css';

export const metadata: Metadata = {
  title: 'Converto AI — Converto Intelligence',
  description: 'Converto AI is your intelligent assistant for live rates, payments, shopping, travel, medical assistance, rewards, requests, and support.',
};

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
