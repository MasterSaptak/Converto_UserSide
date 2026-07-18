'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LiveFooter } from "./LiveFooter";
import { LayoutDashboard, Grid, MapPin, Clock, HeadphonesIcon, User } from "lucide-react";
import { useWalletTransactions } from "@/hooks/useWalletTransactions";

const DESKTOP_NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/services", label: "Services", icon: Grid },
  { href: "/track", label: "Track Order", icon: MapPin },
  { href: "/history", label: "Transaction History", icon: Clock },
  { href: "/support", label: "Support", icon: HeadphonesIcon },
  { href: "/profile", label: "My Profile", icon: User },
];

const MOBILE_NAV_ITEMS = [
  { href: "/history", label: "Transaction History", icon: Clock },
  { href: "/profile", label: "My Profile", icon: User },
];

export function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const { transactions } = useWalletTransactions();

  // Calculate daily limit based on today's outbound transactions
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const usedDailyLimit = transactions
    .filter(t => new Date(t.created_at) >= today && t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const maxDailyLimit = 10000;
  const limitPercentage = Math.min((usedDailyLimit / maxDailyLimit) * 100, 100);

  const content = (
    <div className="h-full sticky top-0 flex flex-col p-6 lg:p-8 overflow-y-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <Link href="/" className="flex flex-col items-center mb-8 group -mx-6 lg:-mx-8 -mt-6 lg:-mt-8 p-5 border-b-2 border-foreground bg-card">
        <div className="w-full max-w-[200px] h-28 border-2 border-foreground bg-white overflow-hidden flex items-center justify-center mb-3">
          <Image src="/Logo.png" alt="Converto Logo" width={200} height={200} className="w-full h-full object-cover scale-[1.45] transition-transform duration-300 group-hover:scale-[1.55]" priority />
        </div>
        <h2 className="text-2xl font-bold uppercase tracking-widest font-heading group-hover:text-primary transition-colors leading-none mt-3">Converto</h2>
        <span className="text-[8px] uppercase tracking-widest font-bold opacity-60 mt-1">The Ultimate Payment Engine</span>
      </Link>

      <nav className="flex flex-col gap-4 mb-6">
        {(mobile ? MOBILE_NAV_ITEMS : DESKTOP_NAV_ITEMS).map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 text-xs font-bold uppercase border-b-2 pb-1.5 w-fit transition-colors group/nav",
                isActive ? "border-primary text-primary" : "border-transparent text-foreground hover:border-foreground"
              )}
            >
              {item.icon && <item.icon className={cn("w-4 h-4", isActive ? "stroke-[2.5px]" : "stroke-2 opacity-70 group-hover/nav:opacity-100")} />}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Added Sidebar Features */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="border-2 border-foreground bg-card p-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest block mb-2 opacity-80">Daily Limit</span>
          <div className="flex items-end justify-between mb-2">
            <span className="text-lg font-heading font-bold">${usedDailyLimit.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
            <span className="text-[10px] font-bold opacity-60">/ ${maxDailyLimit.toLocaleString()}</span>
          </div>
          <div className="w-full h-2 bg-secondary border-2 border-foreground overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${limitPercentage}%` }}></div>
          </div>
        </div>

        <Link href="/services/exchange" className="w-full bg-primary text-primary-foreground border-2 border-foreground py-3 text-center text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors shadow-[4px_4px_0px_var(--color-foreground)] hover:shadow-none hover:translate-y-1 hover:translate-x-1">
          New Transfer
        </Link>
      </div>

      <div className="mt-auto pt-4">
        <span className="text-[10px] uppercase tracking-widest opacity-60 block mb-1">System</span>
        <div className="font-bold text-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          ONLINE
        </div>
        {mobile && <LiveFooter compact />}
      </div>
    </div>
  );

  if (mobile) return content;

  return (
    <aside className="hidden md:block w-[240px] lg:w-[280px] border-r-2 border-foreground bg-secondary shrink-0 relative">
      {content}
    </aside>
  );
}
