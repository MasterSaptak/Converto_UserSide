'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Globe, Shield, ChevronDown, TrendingUp, Loader2 } from 'lucide-react';
import Image from 'next/image';
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
    <section className="bg-[#f4f4f0] border-2 border-black p-3 sm:p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full overflow-hidden mb-4">

      <div className="relative z-10 flex flex-col gap-3">

        {/* Header Row */}
        <div className="flex flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-[#FF90E8] border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <TrendingUp className="w-4 h-4 text-black" strokeWidth={3} />
            </div>
            <div className="font-black text-base sm:text-lg font-heading tracking-tight uppercase">
              Exchange Rates
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 p-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <span className="text-[9px] font-black uppercase tracking-widest pl-1.5 hidden sm:inline">Base:</span>
            <div className="relative">
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="appearance-none bg-white border-2 border-black text-[11px] uppercase font-black py-1 pl-2 pr-6 cursor-pointer outline-none hover:bg-slate-100 transition-colors"
              >
                {availableBases.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[3]" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-6 gap-2 border-2 border-dashed border-black/20 bg-slate-50">
            <Loader2 className="w-4 h-4 animate-spin text-black" />
            <span className="text-[10px] font-black uppercase tracking-widest">Fetching Rates...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">

            {/* Section 1: Google Live Rates */}
            <div>
              <div className="flex items-center gap-1.5 mb-2 border-b-2 border-black pb-1">
                <Globe className="w-3 h-3 stroke-[3]" />
                <h3 className="font-black uppercase tracking-widest text-[10px]">Google Live Rates</h3>
              </div>

              <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
                {targetLiveCurrencies.map(currency => {
                  const rate = marketRates[currency];
                  const flagUrl = getCurrencyFlagUrl(currency);
                  return (
                    <div 
                      key={`live_${currency}`} 
                      className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white flex h-[52px] overflow-hidden"
                    >
                      {/* Flag Left Section */}
                      <div className="w-[52px] shrink-0 border-r-2 border-black relative bg-zinc-100">
                        <Image
                          src={flagUrl} 
                          alt={`${currency} flag`}
                          width={52}
                          height={52}
                          unoptimized
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      {/* Details Right Section */}
                      <div className="flex-1 px-2 py-1 flex flex-col justify-center bg-white relative">
                        <div className="text-[9px] uppercase tracking-widest font-black flex items-center justify-between opacity-80 mb-0.5">
                          <span className="flex items-center gap-1">
                            <span className="text-[11px] font-sans leading-none">{getCurrencySymbol(currency)}</span>
                            <span className="leading-none">{currency}</span>
                          </span>
                        </div>
                        <div className="font-black font-mono text-sm leading-none">
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
              <div className="flex items-center gap-1.5 mb-2 border-b-2 border-black pb-1">
                <Shield className="w-3 h-3 stroke-[3]" />
                <h3 className="font-black uppercase tracking-widest text-[10px]">Converto Rates</h3>
              </div>

              <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
                {targetLiveCurrencies.map((currency) => {
                  const customRate = convertoRates[currency] || marketRates[currency];
                  const flagUrl = getCurrencyFlagUrl(currency);
                  return (
                    <div
                      key={`converto_${currency}`}
                      className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white flex h-[52px] overflow-hidden"
                    >
                      {/* Flag Left Section */}
                      <div className="w-[52px] shrink-0 border-r-2 border-black relative bg-zinc-100">
                        <Image 
                          src={flagUrl} 
                          alt={`${currency} flag`}
                          width={52}
                          height={52}
                          unoptimized
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      {/* Details Right Section */}
                      <div className="flex-1 px-2 py-1 flex flex-col justify-center bg-white relative">
                        <div className="text-[9px] uppercase tracking-widest font-black flex justify-between items-center w-full mb-0.5">
                          <span className="flex items-center gap-1 opacity-80">
                            <span className="text-[11px] font-sans leading-none">{getCurrencySymbol(currency)}</span>
                            <span className="leading-none">{currency}</span>
                          </span>
                          <span className="text-[7px] border border-black px-1 bg-yellow-400 font-black leading-none">
                            CUSTOM
                          </span>
                        </div>
                        <div className="font-black font-mono text-sm leading-none">
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


