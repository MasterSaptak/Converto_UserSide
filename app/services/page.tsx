import Link from "next/link";
import { ArrowRightLeft, ShoppingBag, Train, GraduationCap, Globe, Package, HeadphonesIcon } from "lucide-react";

const SERVICES = [
  { href: "/services/exchange", label: "Currency Exchange", description: "Best rates for global transfers", icon: ArrowRightLeft },
  { href: "/services/buy-for-me", label: "Buy For Me", description: "Shop internationally with ease", icon: ShoppingBag },
  { href: "/services/tickets", label: "Ticket Booking", description: "Flights, trains, and buses", icon: Train },
  { href: "/services/education", label: "Education Payments", description: "Pay tuition & application fees", icon: GraduationCap },
  { href: "/services/global-payments", label: "Global Payments", description: "B2B and personal transfers", icon: Globe },
  { href: "/track", label: "Order Tracking", description: "Real-time status updates", icon: Package },
  { href: "/support", label: "Live Support", description: "24/7 dedicated assistance", icon: HeadphonesIcon },
];

export default function ServicesPage() {
  return (
    <div className="flex-1 flex flex-col gap-8 md:gap-10 animate-in fade-in duration-500 pb-10">
      <header className="border-b-2 border-foreground pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2 block">Our Offerings</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">Services</h1>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((service) => (
          <Link key={service.href} href={service.href} className="group bg-white border-2 border-foreground p-6 flex flex-col transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--color-foreground)]">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 border-2 border-foreground bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <service.icon className="w-6 h-6" />
              </div>
              <h2 className="font-bold uppercase tracking-widest text-sm leading-tight">{service.label}</h2>
            </div>
            <p className="text-xs uppercase font-bold opacity-60 tracking-wider flex-1">
              {service.description}
            </p>
            <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary group-hover:underline">
              Select Service
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
