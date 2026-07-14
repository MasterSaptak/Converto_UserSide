'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/services", label: "Services" },
  { href: "/track", label: "Track Order" },
  { href: "/history", label: "History" },
  { href: "/support", label: "Support" },
  { href: "/profile", label: "Profile" },
];

export function Sidebar() {
  const pathname = usePathname();
  
  return (
    <aside className="hidden md:block w-[240px] lg:w-[280px] border-r-2 border-foreground bg-secondary shrink-0 relative">
      <div className="h-screen sticky top-0 flex flex-col p-8 lg:p-10">
        <Link href="/" className="flex items-center gap-3 mb-12 group">
          <img src="/Logo.png" alt="Converto Logo" className="w-12 h-12 border-2 border-foreground bg-white p-1 object-contain transition-transform group-hover:scale-105 shrink-0" />
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold uppercase tracking-widest font-heading group-hover:text-primary transition-colors leading-none">Converto</h2>
            <span className="text-[8px] uppercase tracking-widest font-bold opacity-60 mt-1">The Ultimate Payment Engine</span>
          </div>
        </Link>
        
        <nav className="flex flex-col gap-5 mb-10">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-xs font-bold uppercase border-b-2 pb-1.5 w-fit transition-colors",
                  isActive ? "border-primary text-primary" : "border-transparent text-foreground hover:border-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Added Sidebar Features */}
        <div className="flex flex-col gap-6 mt-4">
          <div className="border-2 border-foreground bg-card p-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest block mb-2 opacity-80">Daily Limit</span>
            <div className="flex items-end justify-between mb-2">
              <span className="text-lg font-heading font-bold">$4,500</span>
              <span className="text-[10px] font-bold opacity-60">/ $10k</span>
            </div>
            <div className="w-full h-2 bg-secondary border-2 border-foreground overflow-hidden">
              <div className="h-full bg-primary w-[45%]"></div>
            </div>
          </div>
          
          <Link href="/services/exchange" className="w-full bg-primary text-primary-foreground border-2 border-foreground py-3 text-center text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors shadow-[4px_4px_0px_var(--color-foreground)] hover:shadow-none hover:translate-y-1 hover:translate-x-1">
            New Transfer
          </Link>
        </div>

        <div className="mt-auto pt-6">
          <span className="text-[10px] uppercase tracking-widest opacity-60 block mb-1">System</span>
          <div className="font-bold text-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            ONLINE
          </div>
        </div>
      </div>
    </aside>
  );
}
