'use client';

import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Sun, Moon, Activity, Wallet, Clock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function HeroDashboard() {
  const { user, profile } = useAuth();
  const [greeting, setGreeting] = useState("Welcome");
  const [isDay, setIsDay] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time and start timer
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // Greeting logic
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
      setIsDay(true);
    } else if (hour < 17) {
      setGreeting("Good Afternoon");
      setIsDay(true);
    } else {
      setGreeting("Good Evening");
      setIsDay(false);
    }

    return () => clearInterval(timer);
  }, []);

  const displayName = profile?.username || profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="w-full mb-6">
      <div className="border-2 border-foreground rounded-xl shadow-brutal overflow-hidden flex flex-col md:flex-row bg-card">

        {/* Left Section: Greeting & Action */}
        <div className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between w-full md:w-[60%] lg:w-[55%] bg-card text-foreground border-b-2 md:border-b-0 md:border-r-2 border-foreground gap-4">

          <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
            {/* Square Profile Photo */}
            <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-background border-2 border-foreground rounded-md shadow-[3px_3px_0px_var(--color-foreground)] overflow-hidden flex items-center justify-center">
              <img
                src={profile?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${displayName}&backgroundColor=f1f5f9`}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center flex-wrap gap-1 mb-1">
                {isDay ? (
                  <Sun className="w-3.5 h-3.5 text-orange-500 shrink-0" strokeWidth={2.5} />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-blue-500 shrink-0" strokeWidth={2.5} />
                )}
                <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest opacity-80 shrink-0">
                  {greeting},
                </span>

                {/* Live Digital Timer */}
                {currentTime && (
                  <div className="flex items-center gap-1.5 text-[9px] md:text-[11px] lg:text-xs uppercase tracking-widest shrink-0 ml-2 bg-foreground/5 border border-foreground/10 px-2.5 py-0.5 rounded-full">
                    <Clock className="w-3 h-3 opacity-60" />
                    <span className="font-bold opacity-80">
                      {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="opacity-30">•</span>
                    <span className="font-black text-primary w-[48px] md:w-[58px] lg:w-[62px] inline-block text-center">
                      {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>

              <h1 className="text-lg md:text-3xl lg:text-4xl font-black uppercase leading-none tracking-tighter truncate font-heading py-1">
                {displayName}
              </h1>

              <div className="flex items-center gap-2 mt-1.5 opacity-60">
                <span className="text-[8px] md:text-[10px] lg:text-xs font-bold uppercase tracking-widest bg-foreground/5 px-1.5 py-0.5 rounded-sm">
                  {profile?.role || 'Client'}
                </span>
                <span className="text-[8px] md:text-[10px] lg:text-xs font-bold uppercase tracking-widest">•</span>
                <span className="text-[8px] md:text-[10px] lg:text-xs font-bold uppercase tracking-widest text-primary">Level 1</span>
              </div>
            </div>
          </div>

          <Link
            href="/services/exchange/request"
            className="group flex items-center justify-center gap-2 border-2 border-foreground bg-primary text-primary-foreground px-4 py-2 font-black uppercase text-[10px] md:text-xs lg:text-sm tracking-widest rounded-lg hover:-translate-y-1 hover:shadow-[3px_3px_0px_var(--color-foreground)] transition-all shrink-0 w-full sm:w-auto"
          >
            <span>Transfer</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right Section: Mini Data Dashboard */}
        <div className="flex-1 bg-foreground p-4 md:p-6 flex flex-col justify-center text-background overflow-hidden">
          <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">

            {/* Stat 1 */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest opacity-60 truncate">Active Transfers</span>
              </div>
              <div className="text-xl md:text-3xl font-black tracking-tighter flex items-baseline gap-1">
                0<span className="text-primary text-xs md:text-sm mb-1">↓</span>
              </div>
              <div className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em] text-white/30 mt-1 truncate">
                No recent activity
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest opacity-60 truncate">Total Processed</span>
              </div>
              <div className="text-xl md:text-3xl font-black tracking-tighter flex items-baseline gap-1">
                <span className="text-emerald-400 text-xs md:text-sm mb-1">$</span>0
              </div>
              <div className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em] text-white/30 mt-1 truncate">
                Lifetime volume
              </div>
            </div>

            {/* Stat 3 */}
            <div className="hidden lg:flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest opacity-60 truncate">Pending Actions</span>
              </div>
              <div className="text-2xl md:text-3xl font-black tracking-tighter flex items-baseline gap-1">
                0<span className="text-amber-400 text-sm mb-1 opacity-0">.</span>
              </div>
              <div className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em] text-white/30 mt-1 truncate">
                All caught up
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
