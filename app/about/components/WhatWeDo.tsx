import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Plane, HeartPulse, GraduationCap, ShoppingBag, CreditCard, Ticket, HeadphonesIcon } from 'lucide-react';

export function WhatWeDo() {
  const services = [
    { title: "International Payments", icon: Globe, href: "/services/global-payments" },
    { title: "Education Services", icon: GraduationCap, href: "/services/education" },
    { title: "Medical Tourism", icon: HeartPulse, href: "/services/medical" },
    { title: "Flight Booking", icon: Plane, href: "/services/flights" },
    { title: "Buy For Me", icon: ShoppingBag, href: "/services/buy-for-me" },
    { title: "Global Shopping", icon: ShoppingBag, href: "/shopping" },
    { title: "Gift Cards", icon: CreditCard, href: "/services/gift-cards" },
    { title: "Event Tickets", icon: Ticket, href: "/services/events" },
    { title: "24/7 Support", icon: HeadphonesIcon, href: "/support" },
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-heading">What We Do</h2>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl">A comprehensive suite of services designed to eliminate borders.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <Link 
              key={i} 
              href={service.href}
              className="group block p-6 bg-zinc-50 border-2 border-foreground/10 hover:border-primary hover:shadow-[4px_4px_0px_var(--color-primary)] transition-all"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-xl text-primary group-hover:scale-110 transition-transform">
                  <service.icon className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">{service.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
