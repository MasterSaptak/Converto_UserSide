'use client';

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useServiceRequests } from "@/hooks/useServiceRequests";

export function RequestStatusTracker() {
  const { requests } = useServiceRequests();

  const pendingCount = requests.filter(r => ['Submitted', 'Pending', 'Action Required'].includes(r.status)).length;
  const processingCount = requests.filter(r => ['Processing', 'Purchased', 'Booked', 'Shipping', 'Waiting Payment', 'Payment Confirmed', 'Assigned', 'Accepted', 'Waiting Customer', 'Waiting Vendor'].includes(r.status)).length;
  const completedCount = requests.filter(r => ['Completed'].includes(r.status)).length;

  const statusCounts = [
    { label: 'Pending', count: pendingCount, color: 'text-orange-600' },
    { label: 'Processing', count: processingCount, color: 'text-blue-600' },
    { label: 'Completed', count: completedCount, color: 'text-emerald-600' }
  ];

  return (
    <div className="border-2 border-foreground p-6 md:p-8 bg-card flex flex-col h-full">
      <div className="flex justify-between items-center mb-8 border-b-2 border-foreground pb-2">
        <span className="font-bold uppercase tracking-widest text-sm">Request Status</span>
        <Link href="/requests" className="text-[10px] font-bold uppercase tracking-wider hover:text-primary transition-colors flex items-center gap-1">
          View All <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-2 flex-1">
        {statusCounts.map((status, index) => (
          <div key={status.label} className={cn("flex flex-col justify-center items-center text-center", index !== statusCounts.length - 1 ? "border-r-2 border-dashed border-muted" : "")}>
            <span className={cn("text-3xl md:text-5xl font-heading font-bold mb-2", status.color)}>
              {status.count}
            </span>
            <span className="text-[9px] md:text-[10px] uppercase font-bold opacity-60 tracking-wider">{status.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
