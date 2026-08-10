'use client';

import { useState, useMemo } from 'react';
import { CheckCircle2, Search, ArrowRight, XCircle, ArrowLeft } from "lucide-react";
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useAuth } from '@/hooks/useAuth';
import type { ServiceRequest } from '@/types/database';

type ExtendedRequest = ServiceRequest & {
  stage?: { name: string; code: string };
  status_obj?: {
    name: string;
    customer_visible: boolean;
    color?: string;
    code?: string;
    requires_customer_action?: boolean;
  };
  quotes?: any[];
};

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
                      <div 
                        className="border-2 px-3 py-1 font-bold uppercase text-[10px] tracking-widest bg-white"
                        style={{
                          borderColor: (req as unknown as ExtendedRequest).status_obj?.color || '#000',
                          borderWidth: '2px'
                        }}
                      >
                        <span className="opacity-50">{(req as unknown as ExtendedRequest).stage?.name} / </span>
                        <span style={{ color: (req as unknown as ExtendedRequest).status_obj?.color || '#000' }}>
                          {(req as unknown as ExtendedRequest).status_obj?.customer_visible === false ? 'Processing' : (req as unknown as ExtendedRequest).status_obj?.name || 'Submitted'}
                        </span>
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
                <div 
                  className="border-2 px-4 py-2 font-bold uppercase text-[10px] tracking-widest bg-white"
                  style={{
                    borderColor: (selectedRequest as unknown as ExtendedRequest).status_obj?.color || '#000',
                    borderWidth: '2px'
                  }}
                >
                  <span className="opacity-50">{(selectedRequest as unknown as ExtendedRequest).stage?.name} / </span>
                  <span style={{ color: (selectedRequest as unknown as ExtendedRequest).status_obj?.color || '#000' }}>
                    {(selectedRequest as unknown as ExtendedRequest).status_obj?.customer_visible === false ? 'Processing' : (selectedRequest as unknown as ExtendedRequest).status_obj?.name || 'Submitted'}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 grid md:grid-cols-2 gap-12">
                {/* Timeline */}
                <div>
                  <h3 className="font-bold uppercase tracking-widest text-sm mb-6 border-b-2 border-foreground pb-2">Status Timeline</h3>
                  <div className="relative border-l-2 border-foreground ml-3 space-y-8">
                    
                    {/* Issued Ticket Details */}
                    {(selectedRequest as any)?.draft_data?.issuedTicket && (
                      <div className="bg-emerald-50 border-2 border-emerald-300 p-4 mb-8">
                        <h4 className="text-sm font-black uppercase tracking-widest text-emerald-800 border-b-2 border-emerald-300 pb-2 mb-3">Your Ticket Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                          <div>
                            <span className="opacity-60 block">PNR / Reference</span>
                            <span className="font-bold">{(selectedRequest as any).draft_data.issuedTicket.pnr || '—'}</span>
                          </div>
                          <div>
                            <span className="opacity-60 block">Coach</span>
                            <span className="font-bold">{(selectedRequest as any).draft_data.issuedTicket.coach || '—'}</span>
                          </div>
                          <div>
                            <span className="opacity-60 block">Seat / Berth</span>
                            <span className="font-bold">{(selectedRequest as any).draft_data.issuedTicket.seat || '—'}</span>
                          </div>
                          <div>
                            <span className="opacity-60 block">Ticket URL</span>
                            {(selectedRequest as any).draft_data.issuedTicket.ticket_url ? (
                              <a href={(selectedRequest as any).draft_data.issuedTicket.ticket_url} target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold">Download / View</a>
                            ) : (
                              <span className="font-bold">—</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {(() => {
                      const reqExt = selectedRequest as unknown as ExtendedRequest;
                      const sSlug = selectedRequest.service?.slug;
                      const sName = (selectedRequest.service?.name || '').toLowerCase();
                      const isTicket = sSlug === 'tickets' || sSlug === 'ticket' || sSlug === 'train_booking' || sSlug === 'bus_booking' || sSlug === 'flight_booking' || sName.includes('ticket') || sName.includes('train') || sName.includes('bus') || sName.includes('flight');
                      const statusCode = reqExt.status_obj?.code;
                      const hasQuote = reqExt.quotes && reqExt.quotes.length > 0;
                      const liveQuote = reqExt.quotes?.find((q: any) => ['sent', 'approved'].includes(q.status));
                      const displayQuote = liveQuote || (hasQuote ? reqExt.quotes![0] : null);
                      const isQuotePhase = hasQuote || statusCode === 'quote_sent' || statusCode === 'awaiting_payment' || statusCode === 'reviewing_quote';
                      const isTicketGen = statusCode === 'ticket_delivered' || statusCode === 'booking_voucher_sent' || statusCode === 'completed' || !!(selectedRequest as any).draft_data?.issuedTicket;
                      const isPaymentDone = statusCode === 'payment_confirmed' || statusCode === 'in_progress' || isTicketGen;
                      const isComplete = statusCode === 'completed';
                      const isClosed = statusCode === 'closed';

                      if (isTicket) {
                        return (
                          <>
                            {/* 1. Request Accepted */}
                            <div className="relative pl-8">
                              <div className="absolute -left-[11px] top-0 w-5 h-5 bg-emerald-500 border-2 border-foreground rounded-full flex items-center justify-center z-10">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              </div>
                              <h4 className="font-bold uppercase text-sm leading-none mb-1">Request Accepted</h4>
                              <span className="font-mono text-[10px] uppercase tracking-widest opacity-60 block mb-2">
                                {new Date(selectedRequest.created_at).toLocaleString()}
                              </span>
                              <p className="text-xs uppercase font-bold opacity-80">Your request has been submitted securely.</p>
                            </div>

                            {/* 2. Quotation Send */}
                            <div className="relative pl-8">
                              <div className={`absolute -left-[11px] top-0 w-5 h-5 ${isPaymentDone ? 'bg-emerald-500' : isQuotePhase ? 'bg-purple-500' : 'bg-gray-200'} border-2 border-foreground rounded-full flex items-center justify-center z-10`}>
                                {(isPaymentDone || isQuotePhase) && <CheckCircle2 className="w-3 h-3 text-white" />}
                              </div>
                              <h4 className={`font-bold uppercase text-sm leading-none mb-1 ${isPaymentDone ? 'text-emerald-600' : isQuotePhase ? 'text-purple-600' : 'text-gray-400'}`}>Quotation Send</h4>
                              {(isQuotePhase || isPaymentDone) && (
                                <p className="text-xs uppercase font-bold opacity-80 mb-3 mt-2">Your custom quote is ready.</p>
                              )}
                              
                              {displayQuote && (
                                <div className={`bg-purple-50 border-2 border-purple-200 p-4 mb-4 ${!isQuotePhase && !isPaymentDone ? 'hidden' : ''}`}>
                                  <h5 className="text-[10px] font-black uppercase tracking-widest text-purple-800 border-b-2 border-purple-200 pb-2 mb-2">Cost Breakdown</h5>
                                  <div className="space-y-1">
                                    {displayQuote.breakdown?.line_items?.map((item: any, idx: number) => (
                                      <div key={idx} className="flex justify-between text-xs font-mono">
                                        <span className="opacity-80">{item.label} <span className="opacity-50">x{item.quantity}</span></span>
                                        <span className="font-bold">{item.amount > 0 ? '' : '-'}${Math.abs(item.amount).toFixed(2)}</span>
                                      </div>
                                    ))}
                                    <div className="flex justify-between text-sm font-black border-t-2 border-purple-200 pt-2 mt-2">
                                      <span>TOTAL</span>
                                      <span>${(displayQuote.amount || 0).toFixed(2)}</span>
                                    </div>
                                  </div>
                                  {displayQuote.notes && (
                                    <p className="text-xs italic text-purple-700 mt-3 pt-2 border-t border-purple-200 opacity-90">
                                      &ldquo;{displayQuote.notes}&rdquo;
                                    </p>
                                  )}
                                  {displayQuote.valid_until && (
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600 mt-2 opacity-70">
                                      Valid Until: {new Date(displayQuote.valid_until).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              )}

                              {isQuotePhase && !isPaymentDone && (
                                <a href={`/checkout/${selectedRequest.id}`} className="inline-flex brutal-button bg-black text-white py-2 px-4 text-xs font-bold uppercase tracking-widest items-center gap-2 hover:bg-gray-800 mt-2">
                                  Review & Pay <ArrowRight className="w-4 h-4" />
                                </a>
                              )}
                            </div>

                            {/* 3. Payment Done */}
                            <div className="relative pl-8">
                              <div className={`absolute -left-[11px] top-0 w-5 h-5 ${isPaymentDone ? 'bg-emerald-500' : 'bg-gray-200'} border-2 border-foreground rounded-full flex items-center justify-center z-10`}>
                                {isPaymentDone && <CheckCircle2 className="w-3 h-3 text-white" />}
                              </div>
                              <h4 className={`font-bold uppercase text-sm leading-none mb-1 ${isPaymentDone ? 'text-emerald-600' : 'text-gray-400'}`}>Payment Done</h4>
                              {isPaymentDone && (
                                <div className="mt-3 inline-flex brutal-button bg-emerald-500 text-white py-2 px-4 text-xs font-bold uppercase tracking-widest items-center gap-2 cursor-default">
                                  Payment Done <CheckCircle2 className="w-4 h-4" />
                                </div>
                              )}
                            </div>

                            {/* 4. Ticket Generated */}
                            <div className="relative pl-8">
                              <div className={`absolute -left-[11px] top-0 w-5 h-5 ${isTicketGen ? 'bg-emerald-500' : 'bg-gray-200'} border-2 border-foreground rounded-full flex items-center justify-center z-10`}>
                                {isTicketGen && <CheckCircle2 className="w-3 h-3 text-white" />}
                              </div>
                              <h4 className={`font-bold uppercase text-sm leading-none mb-1 ${isTicketGen ? 'text-emerald-600' : 'text-gray-400'}`}>Ticket Generated</h4>
                              {isTicketGen && (
                                <p className="text-xs uppercase font-bold opacity-80 mt-2">Your ticket has been generated successfully.</p>
                              )}
                            </div>

                            {/* 5. Complete */}
                            <div className="relative pl-8">
                              <div className={`absolute -left-[11px] top-0 w-5 h-5 ${isComplete ? 'bg-emerald-500' : 'bg-gray-200'} border-2 border-foreground rounded-full flex items-center justify-center z-10`}>
                                {isComplete && <CheckCircle2 className="w-3 h-3 text-white" />}
                              </div>
                              <h4 className={`font-bold uppercase text-sm leading-none mb-1 ${isComplete ? 'text-emerald-600' : 'text-gray-400'}`}>Complete</h4>
                              {isComplete && (
                                <p className="text-xs uppercase font-bold opacity-80 mt-2">Service request fulfilled successfully.</p>
                              )}
                            </div>
                            
                            {isClosed && (
                              <div className="relative pl-8">
                                <div className="absolute -left-[11px] top-0 w-5 h-5 bg-red-500 border-2 border-foreground rounded-full flex items-center justify-center z-10">
                                  <XCircle className="w-3 h-3 text-white" />
                                </div>
                                <h4 className="font-bold uppercase text-sm leading-none mb-1 text-red-600">Closed</h4>
                                <p className="text-xs uppercase font-bold opacity-80 mt-2">This request is closed.</p>
                              </div>
                            )}
                          </>
                        );
                      }

                      // Original Timeline for other services
                      return (
                        <>
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
                        </>
                      );
                    })()}
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
                      if (Array.isArray(value)) {
                        return (
                          <div key={key} className="flex flex-col gap-1 border-b-2 border-dashed border-foreground/20 pb-2">
                            <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">{formattedKey}</span>
                            <div className="flex flex-col gap-2 mt-1">
                              {value.map((item, idx) => (
                                <div key={idx} className="bg-slate-50 p-2 text-xs font-mono border-l-2 border-foreground">
                                  {typeof item === 'object' ? (
                                    Object.entries(item).map(([k, v]) => (
                                      <div key={k} className="flex justify-between">
                                        <span className="opacity-60 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className="font-bold">{String(v)}</span>
                                      </div>
                                    ))
                                  ) : (
                                    String(item)
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }

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
