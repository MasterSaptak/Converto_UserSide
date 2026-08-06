'use client';

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useServiceRequests } from "@/hooks/useServiceRequests";
import { motion } from "motion/react";
import { staggerContainer, scaleIn } from "@/lib/animations";

import React from 'react';
import { formatDistanceToNow } from 'date-fns';

export const RequestStatusTracker = React.memo(function RequestStatusTracker() {
  const { requests } = useServiceRequests();

  // Show only active requests (not completed) or recent ones
  const activeRequests = requests
    .filter(r => r.status !== 'Completed')
    .slice(0, 4); // show max 4

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
      case 'Pending':
      case 'Waiting Customer':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Processing':
      case 'Assigned':
      case 'Accepted':
      case 'Waiting Vendor':
      case 'Waiting Payment':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Completed':
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Action Required':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-secondary text-foreground border-foreground/20';
    }
  };

  return (
    <div className="border-2 border-foreground rounded-xl shadow-brutal p-5 bg-card flex flex-col hover-lift">
      <div className="flex justify-between items-center mb-6 border-b-2 border-foreground pb-4">
        <span className="font-bold uppercase tracking-widest text-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Active Requests
        </span>
        <Link href="/requests" className="text-[10px] font-bold uppercase tracking-wider hover:text-primary transition-colors flex items-center gap-1 border-2 border-foreground bg-secondary px-3 py-1 rounded-lg hover:bg-foreground hover:text-background shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-[2px] translate-y-[2px] transition-all">
          View All <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {activeRequests.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center p-6 border-2 border-dashed border-foreground/20 rounded-xl bg-secondary/30">
            <span className="text-xs font-bold uppercase tracking-widest opacity-60">No active requests found</span>
          </div>
        ) : (
          <motion.div 
            className="flex flex-col gap-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {activeRequests.map((req) => (
              <motion.div key={req.id} variants={scaleIn} className="flex justify-between items-center border-2 border-foreground rounded-xl p-4 bg-background shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group hover:bg-secondary/50 transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="font-bold uppercase text-xs tracking-wider group-hover:text-primary transition-colors">
                    {req.service?.name || 'Service Request'}
                  </span>
                  <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
                    {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}
                  </span>
                </div>
                <div>
                  <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border-2", getStatusColor(req.status))}>
                    {req.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
});
