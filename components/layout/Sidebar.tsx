'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Grid, MapPin, Clock, HeadphonesIcon, User, MonitorPlay } from "lucide-react";
import { LiveFooter } from "./LiveFooter";
import { RewardsProgress } from "@/components/dashboard/RewardsProgress";
import { AiAssistantWidget } from "@/components/dashboard/AiAssistantWidget";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/services", label: "Services", icon: Grid },
  { href: "/services/subscriptions", label: "App Subscriptions", icon: MonitorPlay },
  { href: "/track", label: "Track Order", icon: MapPin },
  { href: "/history", label: "History", icon: Clock },
  { href: "/support", label: "Support", icon: HeadphonesIcon },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const activeHref = NAV_ITEMS
    .filter((item) => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/')))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  const content = (
    <div className={cn(
      "flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
      mobile ? "h-full" : "h-screen sticky top-0"
    )}>
      {/* ── Logo Strip ── */}
      <Link href="/" className="flex items-center gap-3 px-5 py-4 border-b-2 border-foreground bg-card group shrink-0">
        <div className="w-11 h-11 border-2 border-foreground bg-white overflow-hidden shrink-0 shadow-[3px_3px_0px_var(--color-foreground)] group-hover:shadow-[1px_1px_0px_var(--color-foreground)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
          <Image src="/Logo.png" alt="Converto Logo" width={44} height={44} className="w-full h-full object-cover scale-[1.4]" priority />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-base font-black uppercase tracking-widest font-heading leading-none group-hover:text-primary transition-colors">Converto</span>
          <span className="text-[8px] uppercase tracking-[0.15em] font-bold text-muted-foreground mt-1">Global Payment Engine</span>
        </div>
      </Link>

      {/* ── Navigation ── */}
      <nav className="flex flex-col gap-1 px-3 py-4 shrink-0">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground px-3 mb-2">Menu</span>
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === activeHref;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all relative group/nav",
                isActive
                  ? "bg-foreground text-background border-2 border-foreground shadow-[3px_3px_0px_var(--color-primary)]"
                  : "text-foreground/70 hover:text-foreground hover:bg-card border-2 border-transparent"
              )}
            >
              <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "stroke-[2.5px]" : "stroke-2")} />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[1px] w-[3px] h-4 bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Spacer ── */}
      <div className="flex-1 min-h-4" />

      {/* ── Widgets ── */}
      <div className="flex flex-col gap-3 px-3 pb-3 shrink-0">
        <RewardsProgress />
        <AiAssistantWidget />
      </div>

      {/* ── System Status & Footer ── */}
      <div className="px-5 py-3 border-t-2 border-foreground/10 flex flex-col gap-3 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">System</span>
          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-600">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </div>
        </div>
        {mobile && <LiveFooter compact />}
      </div>

      {/* ── Mobile-only Legal ── */}
      {mobile && (
        <div className="px-5 py-4 flex flex-col gap-3 border-t-2 border-foreground/10 shrink-0">
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-50">Legal & Support</span>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-wider">
            <Link href="/privacy" className="text-foreground/70 hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-foreground/70 hover:text-primary transition-colors">Terms of Use</Link>
            <Link href="/support" className="text-foreground/70 hover:text-primary transition-colors">Help Center</Link>
            <Link href="/contact" className="text-foreground/70 hover:text-primary transition-colors">Contact Support</Link>
          </div>
        </div>
      )}
    </div>
  );

  if (mobile) return content;

  return (
    <aside className="hidden lg:block w-[240px] xl:w-[280px] border-r-2 border-foreground bg-secondary shrink-0">
      {content}
    </aside>
  );
}
