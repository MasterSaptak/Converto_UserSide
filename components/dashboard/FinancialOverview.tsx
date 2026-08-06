'use client';

import { useWallet } from "@/hooks/useWallet";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, Clock, CheckCircle2, TrendingDown, PiggyBank, Sparkles } from "lucide-react";
import React from 'react';

export function FinancialOverview() {
  const { accounts, isLoading: isWalletLoading } = useWallet();
  const mainWallet = accounts.find(a => a.currency_code === 'USD') || accounts[0];

  return (
    <section className="mb-12">
      <div className="font-bold uppercase text-[10px] tracking-[0.2em] mb-4 flex items-center gap-2 opacity-80">
        <div className="w-1.5 h-1.5 bg-primary" />
        Your Account
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Balance */}
        <div className="border-2 border-foreground bg-card rounded-xl p-4 shadow-brutal flex flex-col justify-between hover-lift">
          <div className="flex items-center gap-2 mb-3 opacity-70">
            <Wallet className="w-4 h-4" />
            <span className="text-[9px] uppercase font-bold tracking-widest">Balance</span>
          </div>
          <div className="text-xl md:text-2xl font-bold font-heading">
            {isWalletLoading ? (
              <Skeleton className="w-20 h-8" />
            ) : mainWallet ? (
              <span>{mainWallet.currency_code} {mainWallet.available_balance.toLocaleString()}</span>
            ) : (
              '0.00'
            )}
          </div>
        </div>

        {/* Pending */}
        <div className="border-2 border-foreground bg-card rounded-xl p-4 shadow-brutal flex flex-col justify-between hover-lift">
          <div className="flex items-center gap-2 mb-3 text-orange-600">
            <Clock className="w-4 h-4" />
            <span className="text-[9px] uppercase font-bold tracking-widest">Pending</span>
          </div>
          <div className="text-xl md:text-2xl font-bold font-heading text-orange-600">
            $450.00
          </div>
        </div>

        {/* Completed */}
        <div className="border-2 border-foreground bg-card rounded-xl p-4 shadow-brutal flex flex-col justify-between hover-lift">
          <div className="flex items-center gap-2 mb-3 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[9px] uppercase font-bold tracking-widest">Completed</span>
          </div>
          <div className="text-xl md:text-2xl font-bold font-heading text-emerald-600">
            $2,100.00
          </div>
        </div>

        {/* Rewards */}
        <div className="border-2 border-foreground bg-card rounded-xl p-4 shadow-brutal flex flex-col justify-between hover-lift">
          <div className="flex items-center gap-2 mb-3 text-yellow-500">
            <Sparkles className="w-4 h-4" />
            <span className="text-[9px] uppercase font-bold tracking-widest">Rewards</span>
          </div>
          <div className="text-xl md:text-2xl font-bold font-heading text-yellow-500">
            2,580 C
          </div>
        </div>

        {/* Saved */}
        <div className="border-2 border-foreground bg-card rounded-xl p-4 shadow-brutal flex flex-col justify-between hover-lift">
          <div className="flex items-center gap-2 mb-3 text-blue-500">
            <PiggyBank className="w-4 h-4" />
            <span className="text-[9px] uppercase font-bold tracking-widest">Saved</span>
          </div>
          <div className="text-xl md:text-2xl font-bold font-heading text-blue-500">
            $120.00
          </div>
        </div>

        {/* Monthly Spending */}
        <div className="border-2 border-foreground bg-card rounded-xl p-4 shadow-brutal flex flex-col justify-between hover-lift">
          <div className="flex items-center gap-2 mb-3 opacity-70">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-[9px] uppercase font-bold tracking-widest">Monthly</span>
          </div>
          <div className="text-xl md:text-2xl font-bold font-heading">
            $890.00
          </div>
        </div>

      </div>
    </section>
  );
}
