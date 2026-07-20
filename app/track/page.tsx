'use client';

import { useState, useMemo } from 'react';
import { CheckCircle2, Search, ArrowRight, XCircle, ArrowLeft } from "lucide-react";
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useAuth } from '@/hooks/useAuth';
import type { ServiceRequest } from '@/types/database';

export default function TrackOrderPage() {
  const { user } = useAuth();
  const { requests, loading } = useServiceRequests();
  const [searchId, setSearchId] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  const filteredRequests = useMemo(() => {
    if (!searchId.trim()) return requests;
    return requests.filter(req => 
      req.id.toLowerCase().includes(searchId.toLowerCase()) || 
      (req.service?.name || '').toLowerCase().includes(searchId.toLowerCase())
    );
  }, [requests, searchId]);

  const handleSearch = () => {
    const found = requests.find(req => req.id.toLowerCase() === searchId.toLowerCase());
    if (found) {
      setSelectedRequest(found);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-800 border-emerald-800';
      case 'Quote Sent': return 'bg-purple-100 text-purple-800 border-purple-800';
      case 'Cancelled':
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-800';
      case 'Processing':
      case 'Purchased':
      case 'Booked': return 'bg-blue-100 text-blue-800 border-blue-800';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-800'; // Pending/Submitted states
    }
  };

  const getRequestTitle = (req: ServiceRequest) => {
    const s = req.service?.slug;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const m = req.metadata as any;
    if (s === 'exchange') {
      return `Exchange ${m.from_currency} to ${m.to_currency}`;
    }
    if (s === 'buy_for_me') {
      return m.product_name || 'Buy For Me Order';
    }
    if (s === 'ticket') {
      return `${m.transport_type === 'flight' ? 'Flight' : 'Train'} to ${m.destination || 'Unknown'}`;
    }
    return req.service?.name || 'Service Request';
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 animate-in fade-in">
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Sign in to track requests</h2>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-8 md:gap-10 animate-in fade-in duration-500 pb-10">
      <header className="border-b-2 border-foreground pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2 block">Monitoring</span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">Track Requests</h1>
      </header>
      
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
        
        {/* Search */}
        {!selectedRequest && (
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Search by ID or Service..." 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 border-2 border-foreground p-4 font-bold uppercase outline-none focus:border-primary font-mono text-sm min-h-[48px]" 
            />
            <button 
              onClick={handleSearch}
              className="border-2 border-foreground bg-primary text-primary-foreground px-8 font-bold uppercase tracking-widest text-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all min-h-[48px] flex items-center gap-2"
            >
              <Search className="w-4 h-4" /> Track
            </button>
          </div>
        )}

        {/* List View */}
        {!selectedRequest && (
          <div className="flex flex-col gap-4">
            <h2 className="font-bold uppercase tracking-widest text-sm border-b-2 border-foreground pb-2">Your Requests</h2>
            
            {loading ? (
              <div className="p-8 text-center border-2 border-foreground bg-white">
                <span className="font-bold uppercase text-sm animate-pulse">Loading requests...</span>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="p-8 text-center border-2 border-foreground bg-white">
                <span className="font-bold uppercase text-sm opacity-60">No requests found.</span>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredRequests.map(req => (
                  <div 
                    key={req.id} 
                    onClick={() => setSelectedRequest(req)}
                    className="border-2 border-foreground bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-secondary/20 hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all group"
                  >
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-1">
                        ID: {req.id.split('-')[0]} • {new Date(req.created_at).toLocaleDateString()}
                      </div>
                      <h3 className="font-bold uppercase text-sm">{getRequestTitle(req)}</h3>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className={`border-2 px-3 py-1 font-bold uppercase text-[10px] tracking-widest ${getStatusColor(req.status)}`}>
                        {req.status}
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Detail View */}
        {selectedRequest && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <button 
              onClick={() => setSelectedRequest(null)}
              className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs opacity-60 hover:opacity-100 transition-opacity mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to list
            </button>

            <div className="border-2 border-foreground bg-white">
              <div className="p-6 md:p-8 border-b-2 border-foreground flex flex-col md:flex-row md:items-center justify-between gap-4 bg-secondary/10">
                <div>
                  <div className="font-mono uppercase tracking-widest text-[10px] opacity-60 mb-2">Request ID: {selectedRequest.id}</div>
                  <h2 className="font-bold uppercase text-xl leading-none">{getRequestTitle(selectedRequest)}</h2>
                </div>
                <div className={`border-2 px-4 py-2 font-bold uppercase text-[10px] tracking-widest ${getStatusColor(selectedRequest.status)}`}>
                  {selectedRequest.status}
                </div>
              </div>

              <div className="p-6 md:p-8 grid md:grid-cols-2 gap-12">
                {/* Timeline */}
                <div>
                  <h3 className="font-bold uppercase tracking-widest text-sm mb-6 border-b-2 border-foreground pb-2">Status Timeline</h3>
                  <div className="relative border-l-2 border-foreground ml-3 space-y-8">
                    
                    {/* Step 1 - Created */}
                    <div className="relative pl-8">
                      <div className="absolute -left-[11px] top-0 w-5 h-5 bg-emerald-500 border-2 border-foreground rounded-full flex items-center justify-center z-10">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      <h4 className="font-bold uppercase text-sm leading-none mb-1">Request Received</h4>
                      <span className="font-mono text-[10px] uppercase tracking-widest opacity-60 block mb-2">
                        {new Date(selectedRequest.created_at).toLocaleString()}
                      </span>
                      <p className="text-xs uppercase font-bold opacity-80">Your request has been submitted securely.</p>
                    </div>

                    {/* Dynamic Step based on status */}
                    {selectedRequest.status === 'Submitted' ? (
                      <div className="relative pl-8">
                        <div className="absolute -left-[11px] top-0 w-5 h-5 bg-white border-2 border-primary rounded-full z-10">
                          <div className="absolute inset-[2px] bg-primary rounded-full animate-pulse"></div>
                        </div>
                        <h4 className="font-bold uppercase text-sm leading-none mb-1 text-primary">Awaiting Review</h4>
                        <span className="font-mono text-[10px] uppercase tracking-widest opacity-60 block mb-2">Current Status</span>
                        <p className="text-xs uppercase font-bold opacity-80">Our agents are reviewing your request details.</p>
                      </div>
                    ) : selectedRequest.status === 'Processing' ? (
                       <div className="relative pl-8">
                        <div className="absolute -left-[11px] top-0 w-5 h-5 bg-white border-2 border-primary rounded-full z-10">
                          <div className="absolute inset-[2px] bg-primary rounded-full animate-pulse"></div>
                        </div>
                        <h4 className="font-bold uppercase text-sm leading-none mb-1 text-primary">Processing</h4>
                        <span className="font-mono text-[10px] uppercase tracking-widest opacity-60 block mb-2">Current Status</span>
                        <p className="text-xs uppercase font-bold opacity-80">Your request is actively being processed by our team.</p>
                      </div>
                    ) : selectedRequest.status === 'Quote Sent' ? (
                       <div className="relative pl-8">
                        <div className="absolute -left-[11px] top-0 w-5 h-5 bg-purple-500 border-2 border-foreground rounded-full flex items-center justify-center z-10">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <h4 className="font-bold uppercase text-sm leading-none mb-1 text-purple-600">Quote Ready</h4>
                        <span className="font-mono text-[10px] uppercase tracking-widest opacity-60 block mb-2">
                          {new Date(selectedRequest.updated_at).toLocaleString()}
                        </span>
                        <p className="text-xs uppercase font-bold opacity-80 mb-3">Your custom quote has been generated and is ready for payment.</p>
                        <a href={`/checkout/${selectedRequest.id}`} className="inline-flex brutal-button bg-black text-white py-2 px-4 text-xs font-bold uppercase tracking-widest items-center gap-2">
                          Review & Pay <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    ) : selectedRequest.status === 'Completed' ? (
                       <div className="relative pl-8">
                        <div className="absolute -left-[11px] top-0 w-5 h-5 bg-emerald-500 border-2 border-foreground rounded-full flex items-center justify-center z-10">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <h4 className="font-bold uppercase text-sm leading-none mb-1 text-emerald-600">Completed</h4>
                        <span className="font-mono text-[10px] uppercase tracking-widest opacity-60 block mb-2">
                          {new Date(selectedRequest.updated_at).toLocaleString()}
                        </span>
                        <p className="text-xs uppercase font-bold opacity-80">Service request fulfilled successfully.</p>
                      </div>
                    ) : selectedRequest.status === 'Cancelled' || selectedRequest.status === 'Rejected' ? (
                      <div className="relative pl-8">
                        <div className="absolute -left-[11px] top-0 w-5 h-5 bg-red-500 border-2 border-foreground rounded-full flex items-center justify-center z-10">
                          <XCircle className="w-3 h-3 text-white" />
                        </div>
                        <h4 className="font-bold uppercase text-sm leading-none mb-1 text-red-600">{selectedRequest.status}</h4>
                        <span className="font-mono text-[10px] uppercase tracking-widest opacity-60 block mb-2">
                          {new Date(selectedRequest.updated_at).toLocaleString()}
                        </span>
                        <p className="text-xs uppercase font-bold opacity-80">This request will not proceed further.</p>
                      </div>
                    ) : (
                      <div className="relative pl-8">
                        <div className="absolute -left-[11px] top-0 w-5 h-5 bg-white border-2 border-primary rounded-full z-10">
                          <div className="absolute inset-[2px] bg-primary rounded-full animate-pulse"></div>
                        </div>
                        <h4 className="font-bold uppercase text-sm leading-none mb-1 text-primary">{selectedRequest.status}</h4>
                        <span className="font-mono text-[10px] uppercase tracking-widest opacity-60 block mb-2">Current Status</span>
                      </div>
                    )}

                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="font-bold uppercase tracking-widest text-sm mb-6 border-b-2 border-foreground pb-2">Request Details</h3>
                  <div className="space-y-4">
                    {selectedRequest.amount && (
                      <div className="flex justify-between border-b-2 border-dashed border-foreground/20 pb-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Amount</span>
                        <span className="font-mono font-bold text-sm">
                          {selectedRequest.amount.toLocaleString(undefined, {minimumFractionDigits: 2})} {selectedRequest.currency}
                        </span>
                      </div>
                    )}
                    
                    {Object.entries(selectedRequest.metadata || {}).map(([key, value]) => {
                      if (value === undefined || value === null || value === '') return null;
                      
                      // Format key: "product_url" -> "PRODUCT URL"
                      const formattedKey = key.replace(/_/g, ' ');
                      
                      // Format value based on type
                      let formattedValue = '';
                      if (typeof value === 'object') {
                        formattedValue = JSON.stringify(value);
                      } else {
                        formattedValue = String(value);
                      }

                      return (
                        <div key={key} className="flex flex-col gap-1 border-b-2 border-dashed border-foreground/20 pb-2">
                          <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">{formattedKey}</span>
                          <span className="font-mono font-bold text-xs truncate" title={formattedValue}>
                            {formattedValue}
                          </span>
                        </div>
                      );
                    })}

                    {selectedRequest.notes && (
                      <div className="flex flex-col gap-1 pt-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Notes</span>
                        <span className="font-mono font-bold text-xs bg-secondary/30 p-3 border-2 border-foreground">
                          {selectedRequest.notes}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
