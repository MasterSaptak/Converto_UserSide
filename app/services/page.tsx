import Link from "next/link";
import Image from "next/image";
import { ArrowRightLeft, ShoppingBag, Ticket, GraduationCap, Globe, Package, HeadphonesIcon, Settings2, Train, Bus, Plane, Hotel, CalendarDays, HeartPulse } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Map slugs to icons
const getIconForSlug = (slug: string) => {
  switch (slug) {
    case 'exchange': return ArrowRightLeft;
    case 'buy_for_me': return ShoppingBag;
    case 'tickets': case 'ticket_booking': return Ticket;
    case 'train_booking': return Train;
    case 'bus_booking': return Bus;
    case 'flight_booking': return Plane;
    case 'hotel_booking': return Hotel;
    case 'event_booking': return CalendarDays;
    case 'education': return GraduationCap;
    case 'global_payments': return Globe;
    case 'support': return HeadphonesIcon;
    case 'track': return Package;
    case 'medical': return HeartPulse;
    default: return Settings2;
  }
}

const getBgImageForSlug = (slug: string) => {
  switch (slug) {
    case 'exchange': return '/Currency.png';
    case 'buy_for_me': return '/Buy For Me.png';
    case 'train_booking': return '/Train.png';
    case 'bus_booking': return '/bus.png';
    case 'flight_booking': return '/PLane.png';
    case 'hotel_booking': return '/Hotel.png';
    case 'event_booking': return '/event.png';
    case 'education': return '/Education.png';
    case 'global_payments': return '/global.png';
    case 'medical': return '/medical.png';
    default: return null;
  }
}

// Hardcoded fallback services — always shown if DB is empty or not seeded
const FALLBACK_SERVICES = [
  { id: 'exchange', slug: 'exchange', name: 'Money Exchange', description: 'Convert currencies at competitive rates', route: '/services/exchange', color: '#FF90E8', sort_order: 1, is_active: true },
  { id: 'buy_for_me', slug: 'buy_for_me', name: 'Buy For Me', description: 'We purchase items on your behalf worldwide', route: '/services/buy-for-me', color: '#FFC900', sort_order: 2, is_active: true },
  { id: 'education', slug: 'education', name: 'Educational Payment', description: 'Pay tuition and university fees globally', route: '/services/education', color: '#94A3B8', sort_order: 4, is_active: true },
  { id: 'global_payments', slug: 'global_payments', name: 'Money Transfer', description: 'Send money across borders instantly', route: '/services/global-payments', color: '#00FF66', sort_order: 5, is_active: true },
  { id: 'medical', slug: 'medical', name: 'Medical Appointment Booking', description: 'Book doctor appointments securely', route: '/services/medical', color: '#8B5CF6', sort_order: 6, is_active: true }
];

export default async function ServicesPage() {
  // Try to load from DB first
  const { data: dbServices } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  // Use DB services if they exist, otherwise use hardcoded fallbacks
  // Filter out the old generic ticket services so we can expand them
  // Also filter out 'track' as it's accessible via the main navigation menu
  const baseServices = (dbServices && dbServices.length > 0) 
    ? dbServices.filter(s => s.slug !== 'ticket' && s.slug !== 'tickets' && s.slug !== 'ticket_booking' && s.slug !== 'track' && s.slug !== 'support')
    : FALLBACK_SERVICES;

  // Ensure 'medical' is included even if it's not in the DB yet
  if (!baseServices.some(s => s.slug === 'medical')) {
    baseServices.push({ 
      id: 'medical', 
      slug: 'medical', 
      name: 'Medical Appointment Booking', 
      description: 'Book doctor appointments securely', 
      route: '/services/medical', 
      color: '#8B5CF6', 
      sort_order: 6, 
      is_active: true 
    });
  }

  // Manually inject the expanded ticket services
  const expandedTicketServices = [
    { id: 'train_booking', slug: 'train_booking', name: 'Train Tickets', description: 'Book railway tickets easily', route: '/services/tickets?type=train', color: '#00E5FF', sort_order: 3.1, is_active: true },
    { id: 'bus_booking', slug: 'bus_booking', name: 'Bus Tickets', description: 'Intercity bus travel booking', route: '/services/tickets?type=bus', color: '#FF90E8', sort_order: 3.2, is_active: true },
    { id: 'flight_booking', slug: 'flight_booking', name: 'Plane Tickets', description: 'Domestic & international flights', route: '/services/tickets?type=flight', color: '#FFC900', sort_order: 3.3, is_active: true },
    { id: 'hotel_booking', slug: 'hotel_booking', name: 'Hotel Booking', description: 'Book your perfect stay anywhere', route: '/services/tickets?type=hotel', color: '#00FF66', sort_order: 3.4, is_active: true },
    { id: 'event_booking', slug: 'event_booking', name: 'Event Booking', description: 'Secure passes to major events', route: '/services/tickets?type=event', color: '#FF5C00', sort_order: 3.5, is_active: true },
  ];

  const services = [...baseServices, ...expandedTicketServices].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <div className="flex-1 flex flex-col gap-6 md:gap-10 animate-in fade-in duration-500 pb-10">
      <header className="border-b-2 border-foreground pb-4 md:pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2 block">Our Offerings</span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">Services</h1>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {services.map((service) => {
          const Icon = getIconForSlug(service.slug);
          const bgImage = getBgImageForSlug(service.slug);
          
          return (
            <Link key={service.id} href={service.route || `/services/${service.slug}`} className="group bg-white border-2 border-foreground flex flex-col transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--color-foreground)] overflow-hidden relative min-h-[220px] md:min-h-[260px]">
              
              {/* Top: Image Frame */}
              <div className="relative w-full h-32 md:h-40 border-b-2 border-foreground bg-zinc-50 shrink-0">
                <div className="absolute inset-0 overflow-hidden">
                  {bgImage ? (
                    <Image
                      src={bgImage}
                      alt={service.name}
                      fill
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div 
                      className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity duration-500"
                      style={{ backgroundColor: service.color || undefined }}
                    />
                  )}
                </div>

                {/* Icon overlapping the border */}
                <div 
                  className="absolute bottom-0 left-4 md:left-5 translate-y-1/2 w-10 h-10 md:w-12 md:h-12 border-2 border-foreground flex items-center justify-center transition-transform group-hover:scale-110 shadow-[2px_2px_0px_var(--color-foreground)] bg-white z-20"
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-zinc-950" />
                </div>
              </div>

              {/* Bottom: Text Content */}
              <div className="p-4 md:p-5 pt-8 md:pt-10 flex flex-col flex-1 bg-white relative z-10">
                <h2 
                  className="font-bold uppercase tracking-widest text-xs sm:text-sm leading-tight group-hover:opacity-80 transition-opacity mb-2"
                  style={{ color: service.color || '#000000' }}
                >
                  {service.name}
                </h2>
                
                <p className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-zinc-600 mb-4 line-clamp-2">
                  {service.description || "Core platform module"}
                </p>
                
                <div className="mt-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black">
                  <span className="group-hover:underline">
                    Select Service
                  </span>
                  <div 
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: service.color || '#E2E8F0' }}
                  />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  );
}
