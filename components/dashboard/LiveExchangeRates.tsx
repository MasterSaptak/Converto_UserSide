'use client';

import { useState } from 'react';
import { Settings, Plus, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock base rates relative to USD for conversion math
const BASE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  INR: 83.15,
  BDT: 109.50,
  CNY: 7.19,
};

const ALL_CURRENCIES = Object.keys(BASE_RATES);

export function LiveExchangeRates() {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrencies, setTargetCurrencies] = useState<string[]>(['EUR', 'INR', 'BDT', 'CNY']);
  const [isEditing, setIsEditing] = useState(false);

  const removeCurrency = (currency: string) => {
    setTargetCurrencies(targetCurrencies.filter(c => c !== currency));
  };

  const addCurrency = () => {
    // Find a currency that isn't already in the target list and isn't the base currency
    const available = ALL_CURRENCIES.filter(c => c !== baseCurrency && !targetCurrencies.includes(c));
    if (available.length > 0) {
      setTargetCurrencies([...targetCurrencies, available[0]]);
    }
  };

  // Prevent adding if we've shown all possibilities
  const canAddMore = ALL_CURRENCIES.filter(c => c !== baseCurrency && !targetCurrencies.includes(c)).length > 0;

  return (
    <section className="bg-primary text-primary-foreground border-2 border-foreground p-5 sm:p-6 md:p-8 relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6 xl:gap-8">
        
        {/* Header & Base Currency Selector */}
        <div className="flex justify-between items-start shrink-0">
          <div>
            <div className="font-bold uppercase text-xl md:text-2xl lg:text-3xl font-heading mb-2 tracking-wider">Live Exchange Rates</div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest opacity-80 font-bold block">Base:</span>
              <div className="relative">
                <select 
                  value={baseCurrency}
                  onChange={(e) => {
                    const newBase = e.target.value;
                    setBaseCurrency(newBase);
                    // Ensure the new base isn't in the target list, and maybe add the old base to targets
                    const newTargets = targetCurrencies.filter(c => c !== newBase);
                    if (!newTargets.includes(baseCurrency) && baseCurrency !== newBase) {
                      newTargets.push(baseCurrency);
                    }
                    setTargetCurrencies(newTargets);
                  }}
                  className="appearance-none bg-white/10 border-2 border-primary-foreground/20 hover:border-primary-foreground/40 text-[10px] sm:text-[11px] uppercase tracking-widest font-bold py-1 pl-2 pr-6 rounded-none cursor-pointer outline-none transition-colors"
                >
                  {ALL_CURRENCIES.map(c => (
                    <option key={c} value={c} className="bg-primary text-primary-foreground">{c}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-80" />
              </div>
            </div>
            
          </div>
          
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="xl:hidden p-2 border-2 border-primary-foreground/20 hover:bg-white/10 transition-colors ml-4 shrink-0 mt-1"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Rates Scrollable Container */}
        <div className="flex-1 w-full overflow-x-auto pb-4 xl:pb-0 hide-scrollbar pt-2">
          <div className="flex gap-6 lg:gap-8 font-heading font-bold text-2xl sm:text-3xl w-max xl:w-full xl:justify-end">
            
            {targetCurrencies.map((target) => {
              // Math: (1 / baseInUSD) * targetInUSD
              const baseRate = BASE_RATES[baseCurrency];
              const targetRate = BASE_RATES[target];
              const exchangeRate = (targetRate / baseRate).toFixed(2);
              
              return (
                <div key={target} className={cn("flex flex-col gap-1 relative group", isEditing ? "pr-3" : "")}>
                  <span className="text-[11px] sm:text-xs font-sans opacity-80 uppercase tracking-widest">{baseCurrency}/{target}</span>
                  <span>{exchangeRate}</span>
                  
                  {isEditing && (
                    <button 
                      onClick={() => removeCurrency(target)}
                      className="absolute -top-4 -right-1 p-1 bg-background text-foreground border-2 border-foreground rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors z-20 shadow-sm"
                      title="Remove currency"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}

            {isEditing && canAddMore && (
              <button 
                onClick={addCurrency}
                className="flex flex-col justify-center items-center px-4 py-1 border-2 border-dashed border-white/40 hover:border-white hover:bg-white/10 transition-colors cursor-pointer -mt-2"
              >
                <Plus className="w-5 h-5 mb-0.5 opacity-80" />
                <span className="text-[10px] font-sans uppercase tracking-widest opacity-80">Add Pair</span>
              </button>
            )}
          </div>
        </div>

        {/* Desktop Edit Button */}
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="hidden xl:flex items-center gap-2 px-4 py-3 border-2 border-primary-foreground/20 hover:bg-white/10 transition-colors text-[10px] font-bold uppercase tracking-widest shrink-0 h-fit mt-1"
        >
          <Settings className="w-3 h-3" />
          {isEditing ? 'Done Editing' : 'Manage'}
        </button>
      </div>
    </section>
  );
}
