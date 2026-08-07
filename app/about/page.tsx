import { Metadata } from 'next';
import React from 'react';
import { JsonLd } from '@/components/seo/JsonLd';
import { HeroSection } from './components/HeroSection';
import { WhoWeAre } from './components/WhoWeAre';
import { WhyWeExist } from './components/WhyWeExist';
import { WhatWeDo } from './components/WhatWeDo';
import { MissionVision } from './components/MissionVision';
import { Differentiators } from './components/Differentiators';
import { Stats } from './components/Stats';
import { HowItWorks } from './components/HowItWorks';
import { TrustSecurity } from './components/TrustSecurity';
import { WhyChooseUs } from './components/WhyChooseUs';
import { FutureRoadmap } from './components/FutureRoadmap';
import { FAQSection, aboutFaqs } from './components/FAQSection';
import { FinalCTA } from './components/FinalCTA';
import { BrandEntity } from './components/BrandEntity';

export const metadata: Metadata = {
  title: 'About Converto | Global Services Platform',
  description: 'Converto is a unified platform redefining how people access global services. From international payments to buy-for-me shopping, education, and medical tourism.',
  keywords: [
    'Global Services Platform',
    'International Payments',
    'Buy For Me',
    'Education Services',
    'Medical Tourism',
    'Visa Assistance',
    'Flight Booking',
    'Hotel Booking',
    'Gift Cards',
    'Cross-Border Payments',
    'Global Shopping',
    'Currency Exchange',
    'Secure Online Services'
  ],
  alternates: {
    canonical: 'https://converto.saptech.online/about'
  },
  openGraph: {
    title: 'About Converto | The Future of Global Services',
    description: 'Converto brings everything together into one seamless experience. International payments, global shopping, and more in a single dashboard.',
    url: 'https://converto.saptech.online/about',
    type: 'website'
  }
};

export default function AboutPage() {
  const faqSchema = {
    type: 'FAQPage' as const,
    questions: aboutFaqs
  };

  return (
    <main className="w-full bg-background min-h-screen text-foreground">
      <JsonLd data={faqSchema} />
      
      <HeroSection />
      <WhoWeAre />
      <WhyWeExist />
      <WhatWeDo />
      <MissionVision />
      <Differentiators />
      <Stats />
      <HowItWorks />
      <TrustSecurity />
      <WhyChooseUs />
      <FutureRoadmap />
      <BrandEntity />
      <FAQSection />
      <FinalCTA />
    </main>
  );
}
