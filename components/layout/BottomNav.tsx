'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Grid, MapPin, HeadphonesIcon, Zap, ArrowRightLeft, ShoppingBag, Globe, Train } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { MobileSidebar } from "./MobileSidebar";

const LEFT_NAV_ITEMS = [
  { href: "/services", label: "Services", icon: Grid },
];

const RIGHT_NAV_ITEMS = [
  { href: "/track", label: "Track", icon: MapPin },
  { href: "/support", label: "Support", icon: HeadphonesIcon },
];

const QUICK_ACTIONS = [
  { href: "/services/exchange", label: "New Transfer", icon: ArrowRightLeft, color: "bg-primary text-primary-foreground" },
  { href: "/services/buy-for-me", label: "Buy For Me", icon: ShoppingBag, color: "bg-yellow-400 text-black" },
  { href: "/services/tickets?type=train", label: "Train Booking", icon: Train, color: "bg-cyan-400 text-black" },
  { href: "/services/global-payments", label: "Global Payments", icon: Globe, color: "bg-emerald-400 text-black" },
  { href: "/insta-order?type=buy", label: "1-Tap Buy", icon: Zap, color: "bg-pink-400 text-black" },
  { href: "/insta-order?type=transfer", label: "1-Tap Transfer", icon: Zap, color: "bg-orange-400 text-black" },
];

export function BottomNav() {
  const pathname = usePathname();

  const renderNavItem = (item: { href: string; label: string; icon: React.ElementType }) => {
    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
    return (
      <Link key={item.href} href={item.href} className={cn(
        "flex flex-col items-center justify-center gap-0.5 w-[60px] h-full text-[9px] font-bold uppercase transition-colors",
        isActive ? "text-primary" : "text-foreground opacity-60 hover:opacity-100"
      )}>
        <item.icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t-2 border-foreground bg-secondary z-50">
      <nav className="flex justify-between items-center h-[64px] px-2 max-w-md mx-auto relative">
        <div className="flex w-full justify-around pr-8">
          <MobileSidebar />
          {LEFT_NAV_ITEMS.map(renderNavItem)}
        </div>
        
        {/* Quick Action Glowing Button */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-5">
          <Sheet>
            <SheetTrigger className="relative group cursor-pointer border-none bg-transparent p-0 block">
              {/* Glowing Ping Effect */}
              <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-40"></div>
              {/* Main Button */}
              <div className="relative z-10 flex items-center justify-center w-14 h-14 bg-primary border-2 border-foreground rounded-full shadow-[2px_2px_0px_var(--color-foreground)] transition-all group-active:translate-y-0.5 group-active:translate-x-0.5 group-active:shadow-none">
                <Zap className="w-6 h-6 text-primary-foreground fill-primary-foreground group-hover:scale-110 transition-transform" />
              </div>
            </SheetTrigger>
            
            <SheetContent side="bottom" className="rounded-t-2xl border-t-2 border-x-2 border-foreground h-auto pb-8 pt-4 px-4 bg-secondary">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-center font-heading text-xl uppercase tracking-widest">Quick Actions</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-3 gap-3">
                {QUICK_ACTIONS.map((action, idx) => (
                  <SheetClose 
                    key={idx}
                    nativeButton={false}
                    render={
                      <Link 
                        href={action.href} 
                        className={cn(
                          "flex flex-col items-center justify-center gap-2 p-3 border-2 border-foreground bg-card shadow-[3px_3px_0px_var(--color-foreground)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_var(--color-foreground)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all",
                          action.color
                        )} 
                      />
                    }
                  >
                    <action.icon className="w-6 h-6 stroke-[2.5px]" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-center leading-tight">{action.label}</span>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex w-full justify-around pl-8">
          {RIGHT_NAV_ITEMS.map(renderNavItem)}
        </div>
      </nav>
      {/* Safe area spacer for notched phones */}
      <div className="h-[env(safe-area-inset-bottom,0px)] bg-secondary" />
    </div>
  );
}
