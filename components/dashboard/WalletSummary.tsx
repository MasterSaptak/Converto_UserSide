'use client';

import { Plus, Wallet as WalletIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/hooks/useWallet";
import { Skeleton } from "@/components/ui/skeleton";

// Map currency to a symbol and color scheme for aesthetics
const currencyDetails: Record<string, { symbol: string, color: string, textColor: string }> = {
  'USD': { symbol: "$", color: "bg-emerald-100", textColor: "text-emerald-900" },
  'EUR': { symbol: "€", color: "bg-blue-100", textColor: "text-blue-900" },
  'GBP': { symbol: "£", color: "bg-purple-100", textColor: "text-purple-900" },
  'NGN': { symbol: "₦", color: "bg-green-100", textColor: "text-green-900" },
};

const defaultCurrencyStyle = { symbol: "¤", color: "bg-slate-100", textColor: "text-slate-900" };

export function WalletSummary() {
  const { accounts, isLoading } = useWallet();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {isLoading ? (
        // Loading Skeletons
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-2 border-foreground p-4 md:p-5 flex flex-col justify-between bg-card min-h-[120px]">
            <Skeleton className="w-16 h-4 mb-4" />
            <Skeleton className="w-24 h-8" />
          </div>
        ))
      ) : accounts.length === 0 ? (
        // Empty State
        <div className="col-span-full border-2 border-dashed border-foreground/30 p-8 flex flex-col items-center justify-center text-center bg-card">
          <WalletIcon className="w-12 h-12 mb-4 opacity-20" />
          <p className="font-bold text-sm uppercase tracking-widest opacity-60">No Wallet Accounts Found</p>
          <p className="text-xs opacity-50 mt-1 max-w-sm">You haven&apos;t activated any wallet currencies yet. Click &quot;Add Wallet&quot; to get started.</p>
        </div>
      ) : (
        // Real Data
        accounts.map((wallet) => {
          const details = currencyDetails[wallet.currency_code.toUpperCase()] || defaultCurrencyStyle;
          
          return (
            <div key={wallet.id} className={cn("border-2 border-foreground p-4 md:p-5 flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer bg-card relative overflow-hidden min-h-[120px]")}>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <span className="font-bold text-xs uppercase tracking-widest">{wallet.currency_code}</span>
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border-2 border-foreground font-bold text-[10px]", details.color, details.textColor)}>
                  {details.symbol}
                </div>
              </div>
              <div className="relative z-10">
                <div className="text-2xl md:text-3xl font-heading font-bold">
                  {wallet.available_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                {wallet.locked_balance > 0 && (
                  <div className="text-[10px] font-bold text-red-600 mt-1">
                    Locked: {wallet.locked_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
      
      {/* Add Wallet Button */}
      <div className="border-2 border-dashed border-muted p-5 flex flex-col justify-center items-center text-center cursor-pointer hover:border-foreground transition-colors hover:bg-secondary/50 min-h-[120px]">
        <Plus className="w-8 h-8 opacity-40 mb-2" />
        <span className="font-bold uppercase text-[10px] tracking-widest opacity-60">Add Wallet</span>
      </div>
    </div>
  );
}
