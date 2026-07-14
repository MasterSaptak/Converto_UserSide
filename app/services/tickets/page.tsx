'use client';

import { useState } from 'react';
import { cn } from "@/lib/utils";
import { Train, Plane, Bus } from "lucide-react";

export default function TicketBookingPage() {
  const [activeTab, setActiveTab] = useState('flight');

  return (
    <div className="flex-1 flex flex-col gap-8 md:gap-10 animate-in fade-in duration-500 pb-10">
      <header className="border-b-2 border-foreground pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2 block">Services</span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">Ticket Booking</h1>
      </header>
      
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Form Container */}
        <div className="flex flex-col gap-6">
          
          {/* Tabs */}
          <div className="flex border-2 border-foreground bg-white">
            <button 
              onClick={() => setActiveTab('flight')}
              className={cn("flex-1 p-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs transition-colors", activeTab === 'flight' ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}
            >
              <Plane className="w-4 h-4" /> Flight
            </button>
            <button 
              onClick={() => setActiveTab('train')}
              className={cn("flex-1 p-4 flex items-center justify-center gap-2 border-l-2 border-foreground font-bold uppercase tracking-widest text-xs transition-colors", activeTab === 'train' ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}
            >
              <Train className="w-4 h-4" /> Train
            </button>
            <button 
              onClick={() => setActiveTab('bus')}
              className={cn("flex-1 p-4 flex items-center justify-center gap-2 border-l-2 border-foreground font-bold uppercase tracking-widest text-xs transition-colors", activeTab === 'bus' ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}
            >
              <Bus className="w-4 h-4" /> Bus
            </button>
          </div>

          <div className="border-2 border-foreground bg-white p-6">
            {activeTab === 'flight' && (
              <div className="flex flex-col gap-6 animate-in fade-in">
                <h2 className="font-bold uppercase tracking-widest text-sm mb-2 border-b-2 border-foreground pb-2">Flight Details</h2>
                
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase cursor-pointer">
                    <input type="radio" name="tripType" defaultChecked className="accent-primary" /> One Way
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase cursor-pointer">
                    <input type="radio" name="tripType" className="accent-primary" /> Round Trip
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Origin</label>
                    <input type="text" placeholder="City or Airport" className="border-2 border-foreground p-3 md:p-4 text-sm font-bold uppercase outline-none focus:border-primary w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Destination</label>
                    <input type="text" placeholder="City or Airport" className="border-2 border-foreground p-3 md:p-4 text-sm font-bold uppercase outline-none focus:border-primary w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Departure Date</label>
                    <input type="date" className="border-2 border-foreground p-3 md:p-4 text-sm font-bold uppercase outline-none focus:border-primary font-mono w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Return Date</label>
                    <input type="date" className="border-2 border-foreground p-3 md:p-4 text-sm font-bold uppercase outline-none focus:border-primary font-mono opacity-50 cursor-not-allowed w-full" disabled />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Adults</label>
                    <input type="number" min="1" defaultValue="1" className="border-2 border-foreground p-3 md:p-4 text-sm font-bold uppercase outline-none focus:border-primary font-mono w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Children</label>
                    <input type="number" min="0" defaultValue="0" className="border-2 border-foreground p-3 md:p-4 text-sm font-bold uppercase outline-none focus:border-primary font-mono w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Infants</label>
                    <input type="number" min="0" defaultValue="0" className="border-2 border-foreground p-3 md:p-4 text-sm font-bold uppercase outline-none focus:border-primary font-mono w-full" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Cabin Class</label>
                  <select className="border-2 border-foreground p-3 md:p-4 bg-secondary text-sm font-bold uppercase outline-none focus:border-primary w-full min-h-[48px]">
                    <option>Economy</option>
                    <option>Premium Economy</option>
                    <option>Business</option>
                    <option>First Class</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Passport / Visa Upload</label>
                  <div className="border-2 border-dashed border-foreground p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/50 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Upload required travel documents</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'train' && (
              <div className="flex flex-col gap-6 animate-in fade-in">
                <h2 className="font-bold uppercase tracking-widest text-sm mb-2 border-b-2 border-foreground pb-2">Train Details</h2>
                {/* Simplified form for train */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Origin Station</label>
                    <input type="text" placeholder="e.g. London Euston" className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Destination Station</label>
                    <input type="text" placeholder="e.g. Manchester Piccadilly" className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Journey Date</label>
                    <input type="date" className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary font-mono" />
                </div>
              </div>
            )}

            {activeTab === 'bus' && (
              <div className="flex flex-col gap-6 animate-in fade-in">
                <h2 className="font-bold uppercase tracking-widest text-sm mb-2 border-b-2 border-foreground pb-2">Bus Details</h2>
                <div className="flex flex-col gap-2 text-center py-8 opacity-60">
                   <span className="font-bold uppercase tracking-widest text-xs">Bus service integration coming soon</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="flex flex-col gap-6 relative">
          <div className="border-2 border-foreground bg-primary text-primary-foreground p-6 sticky top-24 z-10 lg:static lg:z-auto">
            <h2 className="font-bold uppercase tracking-widest text-sm mb-6 border-b-2 border-white/20 pb-2">Booking Summary</h2>
            
            <div className="flex flex-col gap-4 text-xs font-bold uppercase mb-8">
               <p className="opacity-80">Submit your travel requirements and our agents will find the best available options for you.</p>
               <p className="opacity-80">You will receive an itinerary and quotation for approval before finalizing the booking.</p>
            </div>

            <button className="w-full min-h-[48px] border-2 border-foreground bg-white text-foreground p-4 font-bold uppercase tracking-widest text-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all">
              Submit Request
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
