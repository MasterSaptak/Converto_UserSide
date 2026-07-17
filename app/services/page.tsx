import Link from "next/link";
import { ArrowRightLeft, ShoppingBag, Ticket, GraduationCap, Globe, Package, HeadphonesIcon, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

// Map slugs to icons
const getIconForSlug = (slug: string) => {
  switch (slug) {
    case 'exchange': return ArrowRightLeft;
    case 'buy_for_me': return ShoppingBag;
    case 'tickets': case 'ticket_booking': return Ticket;
    case 'education': return GraduationCap;
    case 'global_payments': return Globe;
    case 'support': return HeadphonesIcon;
    case 'track': return Package;
    default: return Settings2;
  }
}

// Hardcoded fallback services — always shown if DB is empty or not seeded
const FALLBACK_SERVICES = [
  { id: 'exchange', slug: 'exchange', name: 'Money Exchange', description: 'Convert currencies at competitive rates', route: '/services/exchange', color: '#FF90E8', sort_order: 1, is_active: true },
  { id: 'buy_for_me', slug: 'buy_for_me', name: 'Buy For Me', description: 'We purchase items on your behalf worldwide', route: '/services/buy-for-me', color: '#FFC900', sort_order: 2, is_active: true },
  { id: 'tickets', slug: 'tickets', name: 'Ticket Booking', description: 'Book flights, trains, and bus tickets', route: '/services/tickets', color: '#00E5FF', sort_order: 3, is_active: true },
  { id: 'education', slug: 'education', name: 'Educational Payment', description: 'Pay tuition and university fees globally', route: '/services/education', color: '#94A3B8', sort_order: 4, is_active: true },
  { id: 'global_payments', slug: 'global_payments', name: 'Money Transfer', description: 'Send money across borders instantly', route: '/services/global-payments', color: '#00FF66', sort_order: 5, is_active: true },
  { id: 'track', slug: 'track', name: 'Order Tracking', description: 'Real-time status updates on all orders', route: '/track', color: '#FF5C00', sort_order: 6, is_active: true },
];

export default async function ServicesPage() {
  // Try to load from DB first
  const { data: dbServices } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  // Use DB services if they exist, otherwise use hardcoded fallbacks
  const services = (dbServices && dbServices.length > 0) ? dbServices : FALLBACK_SERVICES;

  return (
    <div className="flex-1 flex flex-col gap-6 md:gap-10 animate-in fade-in duration-500 pb-10">
      <header className="border-b-2 border-foreground pb-4 md:pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2 block">Our Offerings</span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">Services</h1>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {services.map((service) => {
          const Icon = getIconForSlug(service.slug);
          
          return (
            <Link key={service.id} href={service.route || `/services/${service.slug}`} className="group bg-card border-2 border-foreground p-5 md:p-6 flex flex-col transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--color-foreground)] overflow-hidden relative min-h-[140px] md:min-h-[160px]">
              {/* Colorful hover backdrop */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.15] transition-opacity pointer-events-none duration-500"
                style={{ backgroundColor: service.color || undefined }}
              />
              
              <div className="flex items-center gap-4 mb-3 md:mb-4 relative z-10">
                <div 
                  className="w-10 h-10 md:w-12 md:h-12 border-2 border-foreground flex items-center justify-center transition-transform group-hover:scale-110 shadow-[2px_2px_0px_var(--color-foreground)]"
                  style={{ backgroundColor: service.color || '#E2E8F0' }}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-zinc-950" />
                </div>
                <h2 className="font-bold uppercase tracking-widest text-xs sm:text-sm leading-tight group-hover:text-primary transition-colors">{service.name}</h2>
              </div>
              
              <p className="text-[10px] sm:text-xs uppercase font-bold opacity-60 tracking-wider flex-1 relative z-10">
                {service.description || "Core platform module"}
              </p>
              
              <div className="mt-4 md:mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest relative z-10">
                <span className="group-hover:underline text-foreground">Select Service</span>
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: service.color || '#E2E8F0' }}
                />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  );
}
