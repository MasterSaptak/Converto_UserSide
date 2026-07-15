import Link from "next/link";
import { ArrowRightLeft, ShoppingBag, Train, GraduationCap, Globe, Package, HeadphonesIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICES = [
  { href: "/services/exchange", label: "Currency Exchange", description: "Best rates for global transfers", icon: ArrowRightLeft, color: "bg-[#FF90E8]", text: "text-[#FF90E8]" },
  { href: "/services/buy-for-me", label: "Buy For Me", description: "Shop internationally with ease", icon: ShoppingBag, color: "bg-[#FFC900]", text: "text-[#FFC900]" },
  { href: "/services/tickets", label: "Ticket Booking", description: "Flights, trains, and buses", icon: Train, color: "bg-[#00E5FF]", text: "text-[#00E5FF]" },
  { href: "/services/education", label: "Education Payments", description: "Pay tuition & application fees", icon: GraduationCap, color: "bg-[#94A3B8]", text: "text-[#94A3B8]" },
  { href: "/services/global-payments", label: "Global Payments", description: "B2B and personal transfers", icon: Globe, color: "bg-[#00FF66]", text: "text-[#00FF66]" },
  { href: "/track", label: "Order Tracking", description: "Real-time status updates", icon: Package, color: "bg-[#FF5C00]", text: "text-[#FF5C00]" },
  { href: "/support", label: "Live Support", description: "24/7 dedicated assistance", icon: HeadphonesIcon, color: "bg-[#B28DFF]", text: "text-[#B28DFF]" },
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
          <Link key={service.href} href={service.href} className="group bg-card border-2 border-foreground p-6 flex flex-col transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--color-foreground)] overflow-hidden relative min-h-[160px]">
            {/* Colorful hover backdrop */}
            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-[0.15] transition-opacity pointer-events-none duration-500", service.color)}></div>
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className={cn("w-12 h-12 border-2 border-foreground flex items-center justify-center transition-transform group-hover:scale-110 shadow-[2px_2px_0px_var(--color-foreground)]", service.color)}>
                <service.icon className="w-6 h-6 text-zinc-950" />
              </div>
              <h2 className="font-bold uppercase tracking-widest text-sm leading-tight group-hover:text-primary transition-colors">{service.label}</h2>
            </div>
            
            <p className="text-xs uppercase font-bold opacity-60 tracking-wider flex-1 relative z-10">
              {service.description}
            </p>
            
            <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest relative z-10">
              <span className="group-hover:underline text-foreground">Select Service</span>
              <div className={cn("w-2 h-2 rounded-full", service.color)}></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
