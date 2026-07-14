'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Grid, MapPin, HeadphonesIcon, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/services", label: "Services", icon: Grid },
  { href: "/track", label: "Track", icon: MapPin },
  { href: "/support", label: "Support", icon: HeadphonesIcon },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t-2 border-foreground bg-secondary z-50 pb-safe">
      <nav className="flex justify-between items-center h-[72px] px-2 max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full text-[10px] font-bold uppercase transition-colors",
              isActive ? "text-primary" : "text-foreground opacity-60 hover:opacity-100"
            )}>
              <item.icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  );
}
