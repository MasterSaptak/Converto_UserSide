'use client';

import Link from "next/link";
import { RequestStatusTracker } from "@/components/dashboard/RequestStatusTracker";
import { PromoCarousel } from "@/components/dashboard/PromoCarousel";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { LiveExchangeRates } from "@/components/dashboard/LiveExchangeRates";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const displayName = profile?.username || profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="flex-1 flex flex-col gap-8 md:gap-10 animate-in fade-in duration-500 pb-10">
      
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b-2 border-foreground pb-4 md:pb-6 relative">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <ShieldCheck className="w-4 h-4 text-emerald-600" />
             <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-emerald-600">Verified Account</span>
           </div>
           <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading uppercase leading-[0.9] tracking-tight">{getGreeting()}, <br className="hidden md:block"/>{displayName}</h1>
        </div>
        <div className="flex flex-col md:items-end mt-2 md:mt-0 gap-4">
           
           <div className="flex flex-col md:items-end">
             <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-1 md:mb-2">Total Balance</span>
             <div className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading">$12,450.00</div>
           </div>
        </div>
      </header>

      {/* Live Exchange Rates */}
      <LiveExchangeRates />

      <PromoCarousel />

      <QuickActions />

      {/* Two Column Layout */}
      <section className="grid lg:grid-cols-[1fr_350px] gap-8">
        
        <div className="flex flex-col gap-8">
          <RequestStatusTracker />
        </div>

        <div className="flex flex-col gap-8">
          {/* Recent Activity */}
          <div className="border-2 border-foreground bg-card flex flex-col h-full">
            <div className="p-4 md:p-6 border-b-2 border-foreground flex justify-between items-center bg-secondary">
              <span className="font-bold uppercase text-xs tracking-widest">Recent Activity</span>
              <Link href="/history" className="text-[10px] font-bold uppercase hover:text-primary transition-colors">View All</Link>
            </div>
            <div className="flex flex-col p-4 md:p-6 gap-4 flex-1">
               <div className="flex justify-between items-start pb-4 border-b-2 border-dashed border-muted">
                 <div>
                   <div className="font-bold uppercase text-xs mb-1">Currency Exchange</div>
                   <div className="text-[10px] font-bold opacity-60 uppercase">Req #8921 • USD to EUR</div>
                 </div>
                 <div className="text-right">
                   <div className="font-bold font-heading text-sm">$1,200.00</div>
                   <div className="text-[10px] font-bold text-emerald-600 uppercase">Completed</div>
                 </div>
               </div>
               <div className="flex justify-between items-start pb-4 border-b-2 border-dashed border-muted">
                 <div>
                   <div className="font-bold uppercase text-xs mb-1">Buy For Me</div>
                   <div className="text-[10px] font-bold opacity-60 uppercase">Req #8922 • Apple Store UK</div>
                 </div>
                 <div className="text-right">
                   <div className="font-bold font-heading text-sm">£899.00</div>
                   <div className="text-[10px] font-bold text-blue-600 uppercase">Processing</div>
                 </div>
               </div>
               <div className="flex justify-between items-start">
                 <div>
                   <div className="font-bold uppercase text-xs mb-1">Ticket Booking</div>
                   <div className="text-[10px] font-bold opacity-60 uppercase">Req #8923 • Paris to London</div>
                 </div>
                 <div className="text-right">
                   <div className="font-bold font-heading text-sm">€120.00</div>
                   <div className="text-[10px] font-bold text-orange-600 uppercase">Pending</div>
                 </div>
               </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
