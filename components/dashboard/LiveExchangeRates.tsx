'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Globe, Shield, ChevronDown, TrendingUp, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';



const FIXED_CURRENCIES = ['INR', 'BDT', 'USD', 'EUR', 'CNY'];

const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'CNY': return '¥';
    case 'INR': return '₹';
    case 'BDT': return '৳';
    default: return '';
  }
};

const getCurrencyFlagUrl = (currency: string) => {
  switch (currency) {
    case 'USD': return 'https://flagcdn.com/w320/us.png';
    case 'EUR': return 'https://flagcdn.com/w320/eu.png';
    case 'CNY': return 'https://flagcdn.com/w320/cn.png';
    case 'INR': return 'https://flagcdn.com/w320/in.png';
    case 'BDT': return 'https://flagcdn.com/w320/bd.png';
    default: return '';
  }
};

export const LiveExchangeRates = React.memo(function LiveExchangeRates() {
  const [baseCurrency, setBaseCurrency] = useState('BDT');
  const [marketRates, setMarketRates] = useState<Record<string, number>>({});
  const [convertoRates, setConvertoRates] = useState<Record<string, number>>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        .from('currency_rates')
        .select('target_currency, custom_rate')
        .eq('base_currency', baseCurrency);
        
      if (!error && data) {
        const ratesMap: Record<string, number> = {};
        data.forEach((r: { target_currency: string, custom_rate: number }) => {
          ratesMap[r.target_currency] = r.custom_rate;
        });
        setConvertoRates(ratesMap);
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

  // Restrict to only the fixed currencies as requested
  const availableBases = [...FIXED_CURRENCIES].sort();

  // Currencies to show in the Google Live Rates section
  const targetLiveCurrencies = FIXED_CURRENCIES.filter(c => c !== baseCurrency);

  return (
    <section className="bg-[#f4f4f0] border-2 border-black p-4 sm:p-6 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full overflow-hidden mb-8">
      
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
                  const flagUrl = getCurrencyFlagUrl(currency);
                  return (
                    <div 
                      key={`live_${currency}`} 
                      className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white flex h-[72px] overflow-hidden"
                    >
                      {/* Flag Left Section - 3:2 Aspect Ratio (108x72) */}
                      <div className="w-[108px] shrink-0 border-r-2 border-black relative bg-zinc-100">
                        <img 
                          src={flagUrl} 
                          alt={`${currency} flag`}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      {/* Details Right Section */}
                      <div className="flex-1 px-3 py-2 flex flex-col justify-center bg-white relative">
                        <div className="text-[10px] uppercase tracking-widest font-black flex items-center justify-between opacity-80 mb-1">
                          <span className="flex items-center gap-1">
                            <span className="text-sm font-sans leading-none">{getCurrencySymbol(currency)}</span>
                            <span className="leading-none">{currency}</span>
                          </span>
                        </div>
                        <div className="font-black font-mono text-lg leading-none">
                          {rate ? rate.toFixed(4) : '—'}
                        </div>
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
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {targetLiveCurrencies.map((currency) => {
                  const customRate = convertoRates[currency] || marketRates[currency];
                  const flagUrl = getCurrencyFlagUrl(currency);
                  return (
                    <div
                      key={`converto_${currency}`}
                      className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white flex h-[72px] overflow-hidden"
                    >
                      {/* Flag Left Section */}
                      <div className="w-[108px] shrink-0 border-r-2 border-black relative bg-zinc-100">
                        <img 
                          src={flagUrl} 
                          alt={`${currency} flag`}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      {/* Details Right Section */}
                      <div className="flex-1 px-3 py-2 flex flex-col justify-center bg-white relative">
                        <div className="text-[10px] uppercase tracking-widest font-black flex justify-between items-center w-full mb-1">
                          <span className="flex items-center gap-1 opacity-80">
                            <span className="text-sm font-sans leading-none">{getCurrencySymbol(currency)}</span>
                            <span className="leading-none">{currency}</span>
                          </span>
                          <span className="text-[8px] border-2 border-black px-1 py-0.5 bg-yellow-400 font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] leading-none">
                            CUSTOM
                          </span>
                        </div>
                        <div className="font-black font-mono text-lg leading-none">
                          {customRate ? Number(customRate).toFixed(4) : '—'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  );
});


