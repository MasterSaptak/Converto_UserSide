import { Metadata } from 'next';
import Link from 'next/link';
import { Plane, Building2, Train, Bus, Ticket } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Travel & Booking Portal | Converto',
  description: 'Book flights, hotels, trains, buses, and events globally.',
};

export default function TicketsPortalPage() {
  const options = [
    { name: 'Flights', icon: Plane, href: '/services/flights' },
    { name: 'Hotels', icon: Building2, href: '/services/hotels' },
    { name: 'Trains', icon: Train, href: '/services/trains' },
    { name: 'Buses', icon: Bus, href: '/services/buses' },
    { name: 'Events', icon: Ticket, href: '/services/events' },
  ];

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8 font-mono">
      <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-center">Where do you want to go?</h1>
      <p className="text-muted-foreground mb-12 text-center uppercase tracking-widest">Select a booking service to continue</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto w-full">
        {options.map((opt) => (
          <Link key={opt.name} href={opt.href} className="group relative w-full aspect-square border-2 border-foreground bg-white shadow-[6px_6px_0px_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-foreground)] transition-all flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
              <opt.icon className="w-8 h-8 text-primary" />
            </div>
            <span className="font-bold uppercase tracking-widest">{opt.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
