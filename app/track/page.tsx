'use client';

import { CheckCircle2 } from "lucide-react";

export default function TrackOrderPage() {
  return (
    <div className="flex-1 flex flex-col gap-8 md:gap-10 animate-in fade-in duration-500 pb-10">
      <header className="border-b-2 border-foreground pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2 block">Monitoring</span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">Track Request</h1>
      </header>
      
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-8">
        
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input type="text" placeholder="Enter Tracking ID or Request Number" className="flex-1 border-2 border-foreground p-4 font-bold uppercase outline-none focus:border-primary font-mono text-sm min-h-[48px]" />
          <button className="border-2 border-foreground bg-primary text-primary-foreground p-4 font-bold uppercase tracking-widest text-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all min-h-[48px]">
            Track
          </button>
        </div>

        {/* Status Display */}
        <div className="border-2 border-foreground bg-white">
          <div className="p-6 border-b-2 border-foreground flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="font-bold uppercase tracking-widest text-xs opacity-60 mb-1">Request #8922</div>
              <h2 className="font-bold uppercase text-lg leading-none">Apple MacBook Pro 14&quot;</h2>
            </div>
            <div className="bg-blue-100 text-blue-800 border-2 border-blue-800 px-3 py-1 font-bold uppercase text-[10px] tracking-widest w-fit">
              Processing
            </div>
          </div>

          <div className="p-8">
            <div className="relative border-l-2 border-foreground ml-3 space-y-8">
              
              {/* Step 1 */}
              <div className="relative pl-8">
                <div className="absolute -left-[11px] top-0 w-5 h-5 bg-emerald-500 border-2 border-foreground rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <h3 className="font-bold uppercase text-sm leading-none mb-1">Request Received</h3>
                <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold block mb-2">12 Oct 2024 • 09:41 AM</span>
                <p className="text-xs uppercase font-bold opacity-80">Your request has been submitted and is awaiting agent review.</p>
              </div>

              {/* Step 2 */}
              <div className="relative pl-8">
                <div className="absolute -left-[11px] top-0 w-5 h-5 bg-emerald-500 border-2 border-foreground rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <h3 className="font-bold uppercase text-sm leading-none mb-1">Payment Verified</h3>
                <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold block mb-2">12 Oct 2024 • 11:30 AM</span>
                <p className="text-xs uppercase font-bold opacity-80">Payment of £899.00 has been securely processed.</p>
              </div>

              {/* Step 3 - Current */}
              <div className="relative pl-8">
                <div className="absolute -left-[11px] top-0 w-5 h-5 bg-white border-2 border-primary rounded-full">
                  <div className="absolute inset-[2px] bg-primary rounded-full animate-pulse"></div>
                </div>
                <h3 className="font-bold uppercase text-sm leading-none mb-1 text-primary">Order Processing</h3>
                <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold block mb-2">13 Oct 2024 • 08:15 AM</span>
                <p className="text-xs uppercase font-bold opacity-80">Our local team is purchasing your item from the specified store.</p>
              </div>

              {/* Step 4 - Pending */}
              <div className="relative pl-8 opacity-40">
                <div className="absolute -left-[11px] top-0 w-5 h-5 bg-secondary border-2 border-foreground rounded-full"></div>
                <h3 className="font-bold uppercase text-sm leading-none mb-1">Shipped to Destination</h3>
                <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold block mb-2">Pending</span>
                <p className="text-xs uppercase font-bold">Item will be shipped to your registered address.</p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
