'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { useWalletTransactions } from '@/hooks/useWalletTransactions';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export const RecentTransactions = React.memo(function RecentTransactions() {
  const { transactions, isLoading: isTxnLoading } = useWalletTransactions();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 opacity-80">
          <div className="w-1.5 h-1.5 bg-primary" />
          Recent Transactions
        </div>
        <Link href="/history" className="text-[10px] font-bold uppercase tracking-wider hover:text-primary transition-colors flex items-center gap-1">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="border-2 border-foreground bg-card rounded-xl shadow-brutal overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b-2 border-foreground bg-secondary/30 text-[10px] font-bold uppercase tracking-widest opacity-70">
          <div className="col-span-3 sm:col-span-2">Date</div>
          <div className="col-span-5 sm:col-span-4">Service</div>
          <div className="col-span-4 sm:col-span-2 text-center hidden sm:block">Status</div>
          <div className="col-span-4 sm:col-span-3 text-right">Amount</div>
          <div className="col-span-1 text-right hidden sm:block">Invoice</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {isTxnLoading ? (
            <div className="p-4 space-y-4">
              <Skeleton className="w-full h-12 rounded-lg" />
              <Skeleton className="w-full h-12 rounded-lg" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center opacity-50 text-xs font-bold uppercase py-12 tracking-widest">
              No recent activity
            </div>
          ) : (
            transactions.slice(0, 5).map((txn) => (
              <Link 
                href={`/history/${txn.id}`} 
                key={txn.id}
                className="grid grid-cols-12 gap-4 p-4 border-b-2 border-dashed border-foreground/10 last:border-0 items-center hover:bg-secondary/50 transition-colors group"
              >
                <div className="col-span-3 sm:col-span-2 text-xs font-bold opacity-80">
                  {new Date(txn.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
                <div className="col-span-5 sm:col-span-4 font-bold text-xs uppercase tracking-wide group-hover:text-primary transition-colors truncate">
                  {txn.type.replace(/_/g, ' ')}
                </div>
                <div className="col-span-4 sm:col-span-2 text-center hidden sm:block">
                  <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border-2", getStatusColor(txn.status))}>
                    {txn.status}
                  </span>
                </div>
                <div className="col-span-4 sm:col-span-3 text-right">
                  <div className={`font-bold font-mono text-sm ${txn.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {txn.wallet_account?.currency_code}
                  </div>
                </div>
                <div className="col-span-1 text-right hidden sm:flex justify-end">
                  <div className="p-1.5 rounded-lg border border-foreground/10 bg-background group-hover:bg-foreground group-hover:text-background transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
});
