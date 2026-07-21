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

const FIXED_CURRENCIES = ['INR', 'BDT', 'USD', 'EUR', 'CNY'];

// Brutalist currency styling map
const getCurrencyColor = (currency: string) => {
  switch (currency) {
    case 'USD': return 'bg-[#00FF66] text-black'; // Neon Green
    case 'EUR': return 'bg-[#00F0FF] text-black'; // Cyan
    case 'CNY': return 'bg-[#FF90E8] text-black'; // Pink
    case 'INR': return 'bg-[#FFE200] text-black'; // Yellow
    case 'BDT': return 'bg-[#FF4D00] text-white'; // Deep Orange
    default: return 'bg-white text-black';
  }
};

export const LiveExchangeRates = React.memo(function LiveExchangeRates() {
  const [baseCurrency, setBaseCurrency] = useState('BDT');
  const [marketRates, setMarketRates] = useState<Record<string, number>>({});
  const [convertoCorridors, setConvertoCorridors] = useState<TransferCorridorData[]>([]);
  const [dbBases, setDbBases] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch db bases once or periodically
  const fetchDbBases = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('transfer_corridors')
        .select('from_currency');
      if (!error && data) {
        const bases = Array.from(new Set(data.map(d => d.from_currency)));
        setDbBases(bases);
      }
    } catch (err) {
      console.error('Failed to fetch bases:', err);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Google Live Rates (Market Rates) from a public API
      const res = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
      const apiData = await res.json();
      if (apiData && apiData.rates) {
        setMarketRates(apiData.rates);
      }

      // 2. Fetch Converto Custom Rates from Supabase
      const { data, error } = await supabase
        .from('transfer_corridors')
        .select('id, from_country, to_country, from_currency, to_currency, market_rate, custom_rate')
        .eq('from_currency', baseCurrency)
        .eq('is_active', true);
        
      if (!error && data) {
        setConvertoCorridors(groupPairs(data as TransferCorridorData[]));
      }
    } catch (err) {
      console.error('Failed to fetch rates:', err);
    } finally {
      setLoading(false);
    }
  }, [baseCurrency]);

  useEffect(() => {
    fetchDbBases();
  }, [fetchDbBases]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Combine fixed currencies and db bases for the dropdown
  const availableBases = Array.from(new Set([...FIXED_CURRENCIES, ...dbBases])).sort();

  // Currencies to show in the Google Live Rates section
  const targetLiveCurrencies = FIXED_CURRENCIES.filter(c => c !== baseCurrency);

  return (
    <section className="bg-white border-2 border-black p-4 sm:p-6 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full overflow-hidden mb-8">
      
      <div className="relative z-10 flex flex-col gap-6">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#FF90E8] border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-black" strokeWidth={3} />
            </div>
            <div className="font-black text-xl sm:text-2xl font-heading tracking-tight uppercase">
              Exchange Rates
            </div>
          </div>
            
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest pl-2">Base:</span>
            <div className="relative">
              <select 
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="appearance-none bg-white border-2 border-black text-xs uppercase font-black py-1.5 pl-3 pr-8 cursor-pointer outline-none hover:bg-slate-100 transition-colors"
              >
                {availableBases.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none stroke-[3]" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 gap-3 border-2 border-dashed border-black/20 bg-slate-50">
            <Loader2 className="w-6 h-6 animate-spin text-black" />
            <span className="text-xs font-black uppercase tracking-widest">Fetching Rates...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            
            {/* Section 1: Google Live Rates */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b-2 border-black pb-2">
                <Globe className="w-4 h-4 stroke-[3]" />
                <h3 className="font-black uppercase tracking-widest text-xs sm:text-sm">Google Live Rates</h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {targetLiveCurrencies.map(currency => {
                  const rate = marketRates[currency];
                  const colorClass = getCurrencyColor(currency);
                  return (
                    <div 
                      key={`live_${currency}`} 
                      className={cn(
                        "border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                        colorClass
                      )}
                    >
                      <div className="text-[10px] uppercase tracking-widest mb-1.5 font-black flex items-center justify-between opacity-80">
                        <span>{currency}</span>
                      </div>
                      <div className="font-black font-mono text-lg sm:text-xl">
                        {rate ? rate.toFixed(4) : '—'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Converto Rates */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b-2 border-black pb-2">
                <Shield className="w-4 h-4 stroke-[3]" />
                <h3 className="font-black uppercase tracking-widest text-xs sm:text-sm">Converto Rates</h3>
              </div>
              
              {convertoCorridors.length === 0 ? (
                <div className="py-6 border-2 border-dashed border-black/20 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-center opacity-60">
                  No Converto corridors for {baseCurrency}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {convertoCorridors.map((pair) => {
                    const colorClass = getCurrencyColor(pair.to_currency);
                    return (
                      <div
                        key={pair.id}
                        className={cn(
                          "border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between",
                          colorClass
                        )}
                      >
                        <div className="text-[10px] uppercase tracking-widest mb-1.5 font-black flex justify-between items-center">
                          <span className="opacity-80">{pair.to_currency}</span>
                          <span className="text-[9px] border-2 border-current px-1.5 py-0.5 bg-white/20 font-black">
                            CUSTOM
                          </span>
                        </div>
                        
                        <div className="font-black font-mono text-xl sm:text-2xl mt-1">
                          {Number(pair.custom_rate).toFixed(4)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </section>
  );
});


