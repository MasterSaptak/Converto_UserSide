'use client';

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const WALLETS = [
  { currency: "USD", symbol: "$", balance: "12,450.00", color: "bg-emerald-100", textColor: "text-emerald-900" },
  { currency: "EUR", symbol: "€", balance: "4,200.50", color: "bg-blue-100", textColor: "text-blue-900" },
  { currency: "GBP", symbol: "£", balance: "850.25", color: "bg-purple-100", textColor: "text-purple-900" },
];

export function WalletSummary() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {WALLETS.map((wallet) => (
        <div key={wallet.currency} className={cn("border-2 border-foreground p-4 md:p-5 flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer bg-card relative overflow-hidden min-h-[120px]")}>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-bold text-xs uppercase tracking-widest">{wallet.currency}</span>
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border-2 border-foreground font-bold text-[10px]", wallet.color, wallet.textColor)}>
              {wallet.symbol}
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-2xl md:text-3xl font-heading font-bold">{wallet.balance}</div>
          </div>
        </div>
      ))}
      <div className="border-2 border-dashed border-muted p-5 flex flex-col justify-center items-center text-center cursor-pointer hover:border-foreground transition-colors hover:bg-secondary/50">
        <Plus className="w-8 h-8 opacity-40 mb-2" />
        <span className="font-bold uppercase text-[10px] tracking-widest opacity-60">Add Wallet</span>
      </div>
    </div>
  );
}
