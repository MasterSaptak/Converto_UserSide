'use client';

import { useState } from 'react';
import { cn } from "@/lib/utils";
import { Train, Plane, Bus, Loader2, CheckCircle } from "lucide-react";
import { submitServiceRequest } from '@/hooks/useServiceRequests';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function TicketBookingPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('flight');
  
  // Flight state
  const [tripType, setTripType] = useState('one_way');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState('1');
  const [children, setChildren] = useState('0');
  const [infants, setInfants] = useState('0');
  const [cabinClass, setCabinClass] = useState('Economy');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!origin || !destination || !departureDate) {
      setError('Origin, destination, and departure date are required.');
      return;
    }

    setLoading(true);
    setError('');

    const metadata: Record<string, unknown> = {
      transport_type: activeTab,
      origin,
      destination,
      departure_date: departureDate,
      passengers: {
        adults: parseInt(adults) || 1,
        children: parseInt(children) || 0,
        infants: parseInt(infants) || 0,
      }
    };

    if (activeTab === 'flight') {
      metadata.trip_type = tripType;
      metadata.cabin_class = cabinClass;
      if (tripType === 'round_trip') {
        metadata.return_date = returnDate;
      }
    }

    const { error: submitError } = await submitServiceRequest({
      serviceSlug: 'ticket',
      metadata,
    });

    if (submitError) {
      setError(submitError);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // Redirect to track after a short delay
    setTimeout(() => {
      router.push('/track');
    }, 2000);
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500 py-20">
        <div className="w-20 h-20 bg-emerald-400 border-2 border-foreground flex items-center justify-center shadow-[4px_4px_0px_var(--color-foreground)]">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold font-heading uppercase tracking-tight">Request Submitted!</h2>
        <p className="text-sm font-bold uppercase tracking-widest opacity-60">
          Your ticket request has been received. Redirecting to tracker...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-8 md:gap-10 animate-in fade-in duration-500 pb-10">
      <header className="border-b-2 border-foreground pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2 block">Services</span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">Ticket Booking</h1>
      </header>
      
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Form Container */}
        <div className="flex flex-col gap-6">
          
          {error && (
            <div className="border-2 border-red-600 bg-red-50 p-4 text-xs font-bold uppercase tracking-wider text-red-600">
              {error}
            </div>
          )}

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
                    <input 
                      type="radio" 
                      name="tripType" 
                      checked={tripType === 'one_way'} 
                      onChange={() => setTripType('one_way')}
                      className="accent-primary" 
                    /> One Way
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase cursor-pointer">
                    <input 
                      type="radio" 
                      name="tripType" 
                      checked={tripType === 'round_trip'} 
                      onChange={() => setTripType('round_trip')}
                      className="accent-primary" 
                    /> Round Trip
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Origin</label>
                    <input 
                      type="text" 
                      placeholder="City or Airport" 
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="border-2 border-foreground p-3 md:p-4 text-sm font-bold uppercase outline-none focus:border-primary w-full" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Destination</label>
                    <input 
                      type="text" 
                      placeholder="City or Airport" 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="border-2 border-foreground p-3 md:p-4 text-sm font-bold uppercase outline-none focus:border-primary w-full" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Departure Date</label>
                    <input 
                      type="date" 
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="border-2 border-foreground p-3 md:p-4 text-sm font-bold uppercase outline-none focus:border-primary font-mono w-full" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Return Date</label>
                    <input 
                      type="date" 
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      disabled={tripType === 'one_way'}
                      className={cn(
                        "border-2 border-foreground p-3 md:p-4 text-sm font-bold uppercase outline-none focus:border-primary font-mono w-full",
                        tripType === 'one_way' && "opacity-50 cursor-not-allowed"
                      )} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Adults</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={adults}
                      onChange={(e) => setAdults(e.target.value)}
                      className="border-2 border-foreground p-3 md:p-4 text-sm font-bold uppercase outline-none focus:border-primary font-mono w-full" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Children</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={children}
                      onChange={(e) => setChildren(e.target.value)}
                      className="border-2 border-foreground p-3 md:p-4 text-sm font-bold uppercase outline-none focus:border-primary font-mono w-full" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Infants</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={infants}
                      onChange={(e) => setInfants(e.target.value)}
                      className="border-2 border-foreground p-3 md:p-4 text-sm font-bold uppercase outline-none focus:border-primary font-mono w-full" 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Cabin Class</label>
                  <select 
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value)}
                    className="border-2 border-foreground p-3 md:p-4 bg-secondary text-sm font-bold uppercase outline-none focus:border-primary w-full min-h-[48px]"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business</option>
                    <option value="First Class">First Class</option>
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
                    <input 
                      type="text" 
                      placeholder="e.g. London Euston" 
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Destination Station</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Manchester Piccadilly" 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary" 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Journey Date</label>
                    <input 
                      type="date" 
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary font-mono" 
                    />
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

            <button 
              onClick={handleSubmit}
              disabled={loading || activeTab === 'bus'}
              className="w-full min-h-[48px] border-2 border-foreground bg-white text-foreground p-4 font-bold uppercase tracking-widest text-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
