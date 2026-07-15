'use client';

import { Download, Search, Filter } from "lucide-react";
import { useWalletTransactions } from "@/hooks/useWalletTransactions";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryPage() {
  const { transactions, isLoading } = useWalletTransactions();

  return (
    <div className="flex-1 flex flex-col gap-8 md:gap-10 animate-in fade-in duration-500 pb-10">
      <header className="border-b-2 border-foreground pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2 block">Logs</span>
          <h1 className="text-4xl md:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">History</h1>
        </div>
        <div className="flex gap-2">
          <button className="border-2 border-foreground bg-white text-foreground px-4 py-2 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] hover:bg-secondary transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="border-2 border-foreground bg-primary text-primary-foreground px-4 py-2 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] hover:shadow-[4px_4px_0px_var(--color-foreground)] hover:-translate-y-1 transition-all">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </header>
      
      <div className="flex flex-col gap-6 border-2 border-foreground bg-white">
        
        {/* Search */}
        <div className="p-4 border-b-2 border-foreground flex items-center gap-4 bg-secondary/50">
          <Search className="w-5 h-5 opacity-40" />
          <input type="text" placeholder="Search by ID, Type, or Date..." className="flex-1 bg-transparent outline-none font-bold text-sm uppercase tracking-widest placeholder:opacity-40" />
        </div>

        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-foreground/50 font-bold uppercase tracking-widest text-sm">
            No transactions found.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-foreground text-[10px] font-bold uppercase tracking-widest opacity-60">
                    <th className="p-4 pb-2">Transaction ID</th>
                    <th className="p-4 pb-2">Date</th>
                    <th className="p-4 pb-2">Type</th>
                    <th className="p-4 pb-2 text-right">Amount</th>
                    <th className="p-4 pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="border-b-2 border-dashed border-muted hover:bg-secondary/30 transition-colors cursor-pointer">
                      <td className="p-4 font-mono text-sm font-bold">{txn.id.split('-')[0]}...</td>
                      <td className="p-4 text-xs font-bold uppercase tracking-widest opacity-80">
                        {new Date(txn.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm font-bold uppercase tracking-widest">{txn.type}</td>
                      <td className={`p-4 font-mono text-sm font-bold text-right ${txn.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {txn.wallet_account?.currency_code}
                      </td>
                      <td className={`p-4 text-xs font-bold uppercase tracking-widest text-right ${
                        txn.status === 'completed' ? 'text-emerald-600' : 
                        txn.status === 'failed' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {txn.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden flex flex-col">
              {transactions.map((txn) => (
                <div key={txn.id} className="flex flex-col gap-2 p-4 border-b-2 border-dashed border-muted hover:bg-secondary/30 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold uppercase tracking-widest">{txn.type}</div>
                      <div className="font-mono text-[10px] font-bold opacity-60 mt-1">{txn.id.split('-')[0]}...</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono text-sm font-bold ${txn.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {txn.wallet_account?.currency_code}
                      </div>
                      <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${
                        txn.status === 'completed' ? 'text-emerald-600' : 
                        txn.status === 'failed' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {txn.status}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 border-t border-muted/30 pt-2 mt-1">
                    {new Date(txn.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
