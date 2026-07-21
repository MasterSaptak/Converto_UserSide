'use client';

import { useState, useMemo } from "react";
import { Download, Search } from "lucide-react";
import { useWalletTransactions } from "@/hooks/useWalletTransactions";
import { useServiceRequests } from "@/hooks/useServiceRequests";
import { Skeleton } from "@/components/ui/skeleton";

type UnifiedActivity = {
  id: string;
  activityType: 'order' | 'wallet';
  title: string;
  amount: number | null;
  currency: string | null;
  status: string;
  createdAt: string;
  icon: string;
};

export default function HistoryPage() {
  const { transactions, isLoading: isWalletLoading } = useWalletTransactions();
  const { requests, loading: isRequestsLoading } = useServiceRequests();

  const isLoading = isWalletLoading || isRequestsLoading;

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All'); // All, Orders, Wallet
  const [filterStatus, setFilterStatus] = useState('All'); // All, Completed, Pending, Processing, Failed, Cancelled
  const [filterDate, setFilterDate] = useState('All Time'); // All Time, This Week, This Month
  const [sort, setSort] = useState('Latest First'); // Latest First, Oldest First, Highest Amount, Lowest Amount

  const activities = useMemo(() => {
    const walletActs: UnifiedActivity[] = transactions.map(t => ({
      id: t.id,
      activityType: 'wallet',
      title: t.type,
      amount: t.amount,
      currency: t.wallet_account?.currency_code || 'USD',
      status: t.status,
      createdAt: t.created_at,
      icon: t.amount > 0 ? '💳 Deposit' : '💳 Withdrawal'
    }));

    const orderActs: UnifiedActivity[] = requests.map(r => ({
      id: r.id,
      activityType: 'order',
      title: r.service?.name || 'Order',
      amount: r.amount,
      currency: r.currency || 'USD',
      status: (r as any).status_obj?.customer_visible === false ? 'Processing' : (r as any).status_obj?.name || r.status,
      createdAt: r.created_at,
      icon: '📦 ' + (r.service?.name || 'Order')
    }));

    let merged = [...walletActs, ...orderActs];

    if (filterType === 'Orders') merged = merged.filter(a => a.activityType === 'order');
    if (filterType === 'Wallet') merged = merged.filter(a => a.activityType === 'wallet');

    if (filterStatus !== 'All') {
      merged = merged.filter(a => a.status.toLowerCase() === filterStatus.toLowerCase());
    }

    if (filterDate === 'This Week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      merged = merged.filter(a => new Date(a.createdAt) >= oneWeekAgo);
    }
    if (filterDate === 'This Month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      merged = merged.filter(a => new Date(a.createdAt) >= oneMonthAgo);
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      merged = merged.filter(a => 
        a.title.toLowerCase().includes(s) || 
        a.id.toLowerCase().includes(s) ||
        (a.currency && a.currency.toLowerCase().includes(s)) ||
        a.status.toLowerCase().includes(s)
      );
    }

    merged.sort((a, b) => {
      if (sort === 'Latest First') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === 'Oldest First') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === 'Highest Amount') return Math.abs(b.amount || 0) - Math.abs(a.amount || 0);
      if (sort === 'Lowest Amount') return Math.abs(a.amount || 0) - Math.abs(b.amount || 0);
      return 0;
    });

    return merged;
  }, [transactions, requests, filterType, filterStatus, filterDate, search, sort]);

  return (
    <div className="flex-1 flex flex-col gap-8 md:gap-10 animate-in fade-in duration-500 pb-10">
      <header className="border-b-2 border-foreground pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2 block">Logs</span>
          <h1 className="text-4xl md:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">History</h1>
        </div>
        <div className="flex gap-2">
          <button className="border-2 border-foreground bg-primary text-primary-foreground px-4 py-2 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] hover:shadow-[4px_4px_0px_var(--color-foreground)] hover:-translate-y-1 transition-all">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </header>
      
      <div className="flex flex-col gap-6 border-2 border-foreground bg-white">
        
        {/* Search & Filters Toolbar */}
        <div className="flex flex-col border-b-2 border-foreground bg-secondary/30">
          <div className="p-4 border-b-2 border-foreground flex items-center gap-4">
            <Search className="w-5 h-5 opacity-40" />
            <input 
              type="text" 
              placeholder="Search by ID, Type, or Currency..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none font-bold text-sm uppercase tracking-widest placeholder:opacity-40" 
            />
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold uppercase tracking-widest">
            <div className="flex flex-col gap-2">
              <label className="opacity-60 text-[10px]">Type</label>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-white border-2 border-foreground p-2 outline-none">
                <option value="All">All Activities</option>
                <option value="Orders">Orders</option>
                <option value="Wallet">Wallet</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="opacity-60 text-[10px]">Status</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-white border-2 border-foreground p-2 outline-none">
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Failed">Failed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="opacity-60 text-[10px]">Date</label>
              <select value={filterDate} onChange={e => setFilterDate(e.target.value)} className="bg-white border-2 border-foreground p-2 outline-none">
                <option value="All Time">All Time</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="opacity-60 text-[10px]">Sort By</label>
              <select value={sort} onChange={e => setSort(e.target.value)} className="bg-white border-2 border-foreground p-2 outline-none">
                <option value="Latest First">Latest First</option>
                <option value="Oldest First">Oldest First</option>
                <option value="Highest Amount">Highest Amount</option>
                <option value="Lowest Amount">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
          </div>
        ) : activities.length === 0 ? (
          <div className="p-12 text-center text-foreground/50 font-bold uppercase tracking-widest text-sm">
            No activities found matching your criteria.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-foreground text-[10px] font-bold uppercase tracking-widest opacity-60">
                    <th className="p-4 pb-2">Activity ID</th>
                    <th className="p-4 pb-2">Date</th>
                    <th className="p-4 pb-2">Type</th>
                    <th className="p-4 pb-2 text-right">Amount</th>
                    <th className="p-4 pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((act) => (
                    <tr key={act.id} className="border-b-2 border-dashed border-muted hover:bg-secondary/30 transition-colors cursor-pointer">
                      <td className="p-4 font-mono text-sm font-bold">{act.id.split('-')[0]}...</td>
                      <td className="p-4 text-xs font-bold uppercase tracking-widest opacity-80">
                        {new Date(act.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm font-bold tracking-widest flex items-center gap-2">
                        {act.icon}
                      </td>
                      <td className={`p-4 font-mono text-sm font-bold text-right ${act.activityType === 'wallet' ? (act.amount && act.amount > 0 ? 'text-emerald-600' : 'text-red-600') : 'text-foreground'}`}>
                        {act.activityType === 'wallet' && act.amount && act.amount > 0 ? '+' : ''}
                        {act.amount !== null ? act.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'} {act.currency}
                      </td>
                      <td className={`p-4 text-xs font-bold uppercase tracking-widest text-right ${
                        act.status.toLowerCase() === 'completed' || act.status.toLowerCase() === 'done' ? 'text-emerald-600' : 
                        act.status.toLowerCase() === 'failed' || act.status.toLowerCase() === 'cancelled' || act.status.toLowerCase() === 'rejected' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {act.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden flex flex-col">
              {activities.map((act) => (
                <div key={act.id} className="flex flex-col gap-2 p-4 border-b-2 border-dashed border-muted hover:bg-secondary/30 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold tracking-widest flex items-center gap-2">{act.icon}</div>
                      <div className="font-mono text-[10px] font-bold opacity-60 mt-1">{act.id.split('-')[0]}...</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono text-sm font-bold ${act.activityType === 'wallet' ? (act.amount && act.amount > 0 ? 'text-emerald-600' : 'text-red-600') : 'text-foreground'}`}>
                        {act.activityType === 'wallet' && act.amount && act.amount > 0 ? '+' : ''}
                        {act.amount !== null ? act.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'} {act.currency}
                      </div>
                      <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${
                        act.status.toLowerCase() === 'completed' || act.status.toLowerCase() === 'done' ? 'text-emerald-600' : 
                        act.status.toLowerCase() === 'failed' || act.status.toLowerCase() === 'cancelled' || act.status.toLowerCase() === 'rejected' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {act.status}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 border-t border-muted/30 pt-2 mt-1">
                    {new Date(act.createdAt).toLocaleDateString()}
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
