'use client';

import { ArrowDown } from "lucide-react";

export default function CurrencyExchangePage() {
  return (
    <div className="flex-1 flex flex-col gap-8 md:gap-10 animate-in fade-in duration-500 pb-10">
      <header className="border-b-2 border-foreground pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2 block">Services</span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">Currency Exchange</h1>
      </header>
      
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Form */}
        <div className="flex flex-col gap-6">
          <div className="border-2 border-foreground bg-white p-6">
            <h2 className="font-bold uppercase tracking-widest text-sm mb-6 border-b-2 border-foreground pb-2">Exchange Details</h2>
            
            <div className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Send Currency</label>
                  <select className="border-2 border-foreground p-3 min-h-[48px] bg-secondary text-sm font-bold uppercase outline-none focus:border-primary">
                    <option>USD - US Dollar</option>
                    <option>EUR - Euro</option>
                    <option>GBP - British Pound</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Amount</label>
                  <input type="number" placeholder="1000.00" className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary font-mono w-full" />
                </div>
              </div>

              <div className="flex justify-center -my-2 relative z-10">
                <div className="w-8 h-8 bg-primary text-primary-foreground border-2 border-foreground flex items-center justify-center rounded-full">
                  <ArrowDown className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Receive Currency</label>
                  <select className="border-2 border-foreground p-3 min-h-[48px] bg-secondary text-sm font-bold uppercase outline-none focus:border-primary">
                    <option>EUR - Euro</option>
                    <option>USD - US Dollar</option>
                    <option>GBP - British Pound</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Amount (Est.)</label>
                  <input type="number" placeholder="920.00" readOnly className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none bg-secondary/50 font-mono opacity-80 w-full" />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Payment Method</label>
                <select className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary">
                  <option>Wallet Balance (USD)</option>
                  <option>Bank Transfer</option>
                  <option>Card Payment</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Upload Payment Screenshot (If Bank Transfer)</label>
                <div className="border-2 border-dashed border-foreground p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Click to browse or drag & drop</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Reference Number</label>
                <input type="text" placeholder="e.g. TXN-123456" className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary font-mono" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Notes (Optional)</label>
                <textarea rows={3} placeholder="Any special instructions..." className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary resize-none"></textarea>
              </div>

            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="border-2 border-foreground bg-primary text-primary-foreground p-6 sticky top-24">
            <h2 className="font-bold uppercase tracking-widest text-sm mb-6 border-b-2 border-white/20 pb-2">Exchange Summary</h2>
            
            <div className="flex flex-col gap-4 font-mono text-sm mb-8">
               <div className="flex justify-between items-center">
                 <span className="uppercase opacity-80">Send Amount</span>
                 <span className="font-bold">1,000.00 USD</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="uppercase opacity-80">Live Rate</span>
                 <span className="font-bold">1 USD = 0.92 EUR</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="uppercase opacity-80">Service Fee</span>
                 <span className="font-bold text-emerald-300">0.00 USD</span>
               </div>
               <div className="border-t-2 border-dashed border-white/30 my-2"></div>
               <div className="flex justify-between items-center text-lg">
                 <span className="uppercase opacity-80">You Get</span>
                 <span className="font-bold">920.00 EUR</span>
               </div>
            </div>

            <div className="flex flex-col gap-2 mb-8 text-[10px] uppercase font-bold tracking-widest opacity-80">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                Est. Delivery: Instant
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                Secure Transaction
              </div>
            </div>

            <button className="w-full border-2 border-foreground bg-white text-foreground p-4 font-bold uppercase tracking-widest text-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all">
              Submit Request
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
