'use client';

import React from 'react';
import { Trophy, Gift, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const RewardsProgress = React.memo(function RewardsProgress() {
  const currentTier = "Wood";
  const currentPoints = 2500;
  const nextTier = "Stone";
  const nextTierPoints = 3000;
  const progressPercent = (currentPoints / nextTierPoints) * 100;
  const remainingPoints = nextTierPoints - currentPoints;

  return (
    <section>
      <div className="font-bold uppercase text-[10px] tracking-[0.2em] mb-4 flex items-center gap-2 opacity-80">
        <Trophy className="w-3 h-3 text-yellow-500" />
        Converto Rewards
      </div>

      <div className="border-2 border-foreground bg-card rounded-xl shadow-brutal p-5 flex flex-col gap-5 relative overflow-hidden">
        
        {/* Abstract Background Element */}
        <div className="absolute -right-16 -bottom-16 opacity-5 pointer-events-none">
          <Gift className="w-48 h-48" />
        </div>

        {/* Top Row: Tier Info & Goal */}
        <div className="flex justify-between items-start relative z-10 w-full">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Current Tier</span>
            <div className="flex items-center gap-1.5 text-yellow-600">
              <Trophy className="w-5 h-5" />
              <h3 className="text-2xl font-bold font-heading uppercase">{currentTier}</h3>
            </div>
            <span className="font-mono font-bold text-sm">{currentPoints.toLocaleString()} C</span>
          </div>

          <div className="flex flex-col items-end text-right gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Next Tier</span>
            <h3 className="text-xl font-bold font-heading uppercase text-foreground/40">{nextTier}</h3>
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary mt-0.5">
              {remainingPoints.toLocaleString()} C left
            </span>
          </div>
        </div>

        {/* Progress Bar Area */}
        <div className="w-full flex flex-col relative z-10">
          <div className="w-full h-2.5 bg-secondary border-2 border-foreground rounded-full overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
            <div 
              className="h-full bg-yellow-400 border-r-2 border-foreground relative transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/30 w-full h-full -skew-x-12 translate-x-[-100%] animate-[illustration-shine_3s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="w-full relative z-10 mt-1">
          <Link href="/rewards" className="flex items-center justify-center gap-2 border-2 border-foreground bg-foreground text-background w-full py-2.5 font-bold uppercase text-[10px] tracking-widest rounded-xl hover-lift shadow-brutal">
            Claim Rewards <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
});
