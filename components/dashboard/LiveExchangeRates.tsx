'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Globe, Shield, ChevronDown, TrendingUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface TransferCorridorData {
  id: string;
  from_country: string;
  to_country: string;
  from_currency: string;
  to_currency: string;
  market_rate: number;
  custom_rate: number;
}

// Group pairs by from_country -> to_country
function groupPairs(pairs: TransferCorridorData[]): TransferCorridorData[] {
  const seen = new Map<string, TransferCorridorData>();
  for (const p of pairs) {
    const key = `${p.from_country}_${p.to_country}`;
    if (!seen.has(key)) {
      seen.set(key, p);
    }
  }
  return Array.from(seen.values());
}

export const LiveExchangeRates = React.memo(function LiveExchangeRates() {
  const [baseCurrency, setBaseCurrency] = useState('BDT');
  const [allPairs, setAllPairs] = useState<TransferCorridorData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch corridors from Supabase directly
  const fetchPairs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('transfer_corridors')
        .select('id, from_country, to_country, from_currency, to_currency, market_rate, custom_rate')
        
      if (error) throw error;
      setAllPairs((data as TransferCorridorData[]) || []);
    } catch (err) {
      console.error('Failed to fetch transfer corridors:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPairs();
    // Refresh every 5 minutes
    const interval = setInterval(fetchPairs, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchPairs]);

  // Get all available base currencies
  const availableBases = Array.from(new Set(allPairs.map(p => p.from_currency))).sort();

  // Filter pairs for the selected base currency and group by destination
  const displayPairs = groupPairs(allPairs.filter(p => p.from_currency === baseCurrency));

  return (
    <section className="bg-primary text-primary-foreground border-2 border-foreground p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col gap-5">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="font-bold uppercase text-base sm:text-xl md:text-2xl lg:text-3xl font-heading mb-1.5 tracking-wider flex items-center gap-2">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 opacity-80" />
              Live Exchange Rates
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest opacity-80 font-bold block">Base:</span>
              <div className="relative">
                <select 
                  value={baseCurrency}
                  onChange={(e) => setBaseCurrency(e.target.value)}
                  className="appearance-none bg-white/10 border-2 border-primary-foreground/20 hover:border-primary-foreground/40 text-[10px] sm:text-[11px] uppercase tracking-widest font-bold py-1 pl-2 pr-6 rounded-none cursor-pointer outline-none transition-colors"
                >
                  {availableBases.map(c => (
                    <option key={c} value={c} className="bg-primary text-primary-foreground">{c}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-80" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold opacity-70">
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Market</span>
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Converto</span>
          </div>
        </div>

        {/* Rates Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-6 gap-2 opacity-60">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-widest">Loading rates...</span>
          </div>
        ) : displayPairs.length === 0 ? (
          <div className="text-center py-6 opacity-50 text-xs font-bold uppercase tracking-widest">
            No corridors available for {baseCurrency}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {displayPairs.map((pair) => (
              <div
                key={pair.id}
                className="bg-white/10 border border-white/20 backdrop-blur-sm p-3 sm:p-4 hover:bg-white/15 transition-colors group"
              >
                {/* Pair Label */}
                <div className="text-[10px] sm:text-[11px] font-sans opacity-70 uppercase tracking-widest mb-2 font-bold">
                  {pair.from_currency} → {pair.to_currency}
                </div>
                
                {/* Two-column: Market vs Converto */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Market Rate */}
                  <div>
                    <div className="text-[9px] uppercase tracking-widest opacity-50 font-bold flex items-center gap-1 mb-0.5">
                      <Globe className="w-2.5 h-2.5" /> Market
                    </div>
                    <div className="font-heading font-bold text-base sm:text-lg opacity-60 line-through decoration-1">
                      {Number(pair.market_rate).toFixed(2)}
                    </div>
                  </div>

                  {/* Converto Rate */}
                  <div>
                    <div className="text-[9px] uppercase tracking-widest opacity-50 font-bold flex items-center gap-1 mb-0.5">
                      <Shield className="w-2.5 h-2.5" /> Converto
                    </div>
                    <div className="font-heading font-bold text-lg sm:text-xl text-[#00FF66] group-hover:scale-105 transition-transform origin-left">
                      {Number(pair.custom_rate).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Guaranteed label */}
                <div className="mt-2 text-[9px] font-bold uppercase tracking-widest opacity-40">
                  Guaranteed Today
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});
