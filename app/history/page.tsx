'use client';

import { Download, Search, Filter } from "lucide-react";

export default function HistoryPage() {
  const transactions = [
    { id: "TXN-8921", date: "12 Oct 2024", type: "Currency Exchange", amount: "$1,200.00", status: "Completed", color: "text-emerald-600" },
    { id: "TXN-8922", date: "12 Oct 2024", type: "Buy For Me", amount: "£899.00", status: "Processing", color: "text-blue-600" },
    { id: "TXN-8923", date: "10 Oct 2024", type: "Ticket Booking", amount: "€120.00", status: "Completed", color: "text-emerald-600" },
    { id: "TXN-8924", date: "05 Oct 2024", type: "Education Payment", amount: "$4,500.00", status: "Completed", color: "text-emerald-600" },
    { id: "TXN-8925", date: "01 Oct 2024", type: "Global Transfer", amount: "$300.00", status: "Failed", color: "text-red-600" },
  ];

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
              {transactions.map((txn, i) => (
                <tr key={i} className="border-b-2 border-dashed border-muted hover:bg-secondary/30 transition-colors cursor-pointer">
                  <td className="p-4 font-mono text-sm font-bold">{txn.id}</td>
                  <td className="p-4 text-xs font-bold uppercase tracking-widest opacity-80">{txn.date}</td>
                  <td className="p-4 text-sm font-bold uppercase tracking-widest">{txn.type}</td>
                  <td className="p-4 font-mono text-sm font-bold text-right">{txn.amount}</td>
                  <td className={`p-4 text-xs font-bold uppercase tracking-widest text-right ${txn.color}`}>
                    {txn.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden flex flex-col">
          {transactions.map((txn, i) => (
            <div key={i} className="flex flex-col gap-2 p-4 border-b-2 border-dashed border-muted hover:bg-secondary/30 transition-colors cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-bold uppercase tracking-widest">{txn.type}</div>
                  <div className="font-mono text-[10px] font-bold opacity-60 mt-1">{txn.id}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-bold">{txn.amount}</div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${txn.color}`}>
                    {txn.status}
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 border-t border-muted/30 pt-2 mt-1">
                {txn.date}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
