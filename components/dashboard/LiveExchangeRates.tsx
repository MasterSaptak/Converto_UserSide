'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, TrendingUp, Loader2 } from 'lucide-react';
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
    <section className="mb-6">
      <div className="font-bold uppercase text-[10px] tracking-[0.2em] mb-3 flex items-center gap-2 opacity-80">
        <div className="w-1.5 h-1.5 bg-primary" />
        Live Exchange
      </div>

      <div className="relative z-10 flex flex-col gap-3">
        {/* Header Row */}
        <div className="flex flex-row justify-between items-center gap-3 border-b-2 border-foreground pb-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary border-2 border-foreground p-1.5 rounded-lg shadow-brutal text-primary-foreground">
              <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-bold text-sm md:text-xl font-heading tracking-tight uppercase leading-none">
                Exchange Rates
              </div>
              <div className="text-[9px] font-bold opacity-60 uppercase mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Market
                <span className="md:hidden text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-black tracking-widest border border-primary/20">SWIPE ← →</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="appearance-none bg-secondary border-2 border-foreground rounded-lg text-xs uppercase font-bold py-1.5 pl-2.5 pr-7 cursor-pointer outline-none hover:bg-muted transition-colors shadow-brutal"
            >
              {availableBases.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[3]" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8 gap-3 border-2 border-dashed border-foreground/20 bg-muted/20 rounded-xl">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Fetching Live Rates...</span>
          </div>
        ) : (
          <>
            {/* Mobile: horizontal scroll cards with peek effect */}
            <div className="flex md:hidden overflow-x-auto gap-2.5 pb-2 -mx-4 px-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {targetLiveCurrencies.map(currency => {
                const googleRate = marketRates[currency] || 0;
                const convertoRate = convertoRates[currency] || googleRate;
                const diffPercent = googleRate > 0
                  ? ((convertoRate - googleRate) / googleRate) * 100
                  : 0;
                const isBetter = diffPercent > 0;
                const flagUrl = getCurrencyFlagUrl(currency);

                return (
                  <div
                    key={currency}
                    className="border-2 border-foreground rounded-xl shadow-brutal bg-card p-3 flex flex-col min-w-[160px] w-[160px] snap-start shrink-0"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 border-2 border-foreground rounded-full overflow-hidden relative shrink-0">
                          <Image src={flagUrl} alt={`${currency} flag`} fill sizes="32px" unoptimized className="object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-base font-heading leading-none">{currency}</div>
                          <div className="text-[9px] font-bold opacity-50 uppercase">{getCurrencySymbol(currency)}</div>
                        </div>
                      </div>
                      {isBetter && (
                        <div className="bg-emerald-100 text-emerald-700 border border-emerald-300 px-1.5 py-0.5 rounded text-[8px] font-bold flex items-center gap-0.5">
                          <TrendingUp className="w-2.5 h-2.5" />
                          +{diffPercent.toFixed(1)}%
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="bg-secondary/50 p-2 rounded-lg">
                        <div className="text-[8px] font-bold uppercase tracking-wider opacity-50 mb-0.5">Google</div>
                        <div className="font-mono font-bold text-xs">{googleRate > 0 ? googleRate.toFixed(4) : '—'}</div>
                      </div>
                      <div className="bg-primary/5 p-2 rounded-lg border border-primary/20">
                        <div className="text-[8px] font-bold uppercase tracking-wider text-primary mb-0.5">Converto</div>
                        <div className="font-mono font-bold text-xs text-primary">{convertoRate > 0 ? convertoRate.toFixed(4) : '—'}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop: grid layout */}
            <div className="hidden md:grid grid-cols-2 xl:grid-cols-4 gap-4">
              {targetLiveCurrencies.map(currency => {
                const googleRate = marketRates[currency] || 0;
                const convertoRate = convertoRates[currency] || googleRate;
                const diffPercent = googleRate > 0
                  ? ((convertoRate - googleRate) / googleRate) * 100
                  : 0;
                const isBetter = diffPercent > 0;
                const flagUrl = getCurrencyFlagUrl(currency);

                return (
                  <div
                    key={currency}
                    className="border-2 border-foreground rounded-xl shadow-brutal hover-lift bg-card p-4 flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border-2 border-foreground rounded-full overflow-hidden relative">
                          <Image
                            src={flagUrl}
                            alt={`${currency} flag`}
                            fill
                            sizes="40px"
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-lg font-heading">{currency}</div>
                          <div className="text-[10px] font-bold opacity-60 uppercase">{getCurrencySymbol(currency)} Target</div>
                        </div>
                      </div>
                      {isBetter && (
                        <div className="bg-emerald-100 text-emerald-700 border-2 border-foreground px-2 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[9px] font-bold uppercase tracking-widest flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +{diffPercent.toFixed(1)}%
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <div className="bg-secondary/50 p-2 rounded-lg border border-foreground/10">
                        <div className="text-[9px] font-bold uppercase tracking-widest opacity-60 mb-1">Google</div>
                        <div className="font-mono font-bold text-sm">{googleRate > 0 ? googleRate.toFixed(4) : '—'}</div>
                      </div>
                      <div className="bg-primary/5 p-2 rounded-lg border-2 border-primary/20">
                        <div className="text-[9px] font-bold uppercase tracking-widest text-primary flex justify-between items-center mb-1">
                          Converto
                        </div>
                        <div className="font-mono font-bold text-sm text-primary">{convertoRate > 0 ? convertoRate.toFixed(4) : '—'}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
});
