'use client';

import { useState } from 'react';
import { ArrowDown, Loader2, CheckCircle } from "lucide-react";
import { submitServiceRequest } from '@/hooks/useServiceRequests';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function CurrencyExchangePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Simple estimated rate (will be replaced by real rates later)
  const estimatedRate = fromCurrency === 'USD' && toCurrency === 'EUR' ? 0.92
    : fromCurrency === 'USD' && toCurrency === 'GBP' ? 0.79
    : fromCurrency === 'EUR' && toCurrency === 'USD' ? 1.09
    : fromCurrency === 'GBP' && toCurrency === 'USD' ? 1.27
    : 1;

  const numAmount = parseFloat(amount) || 0;
  const estimatedReceive = (numAmount * estimatedRate).toFixed(2);

  const handleSubmit = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!amount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: submitError } = await submitServiceRequest({
      serviceSlug: 'exchange',
      amount: numAmount,
      currency: fromCurrency,
      metadata: {
        from_currency: fromCurrency,
        to_currency: toCurrency,
        estimated_rate: estimatedRate,
        estimated_receive: parseFloat(estimatedReceive),
        payment_method: paymentMethod,
        reference_number: referenceNumber || undefined,
      },
      notes: notes || undefined,
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
          Your exchange request has been received. Redirecting to tracker...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-8 md:gap-10 animate-in fade-in duration-500 pb-10">
      <header className="border-b-2 border-foreground pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2 block">Services</span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">Currency Exchange</h1>
      </header>
      
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Form */}
        <div className="flex flex-col gap-6">
          <div className="border-2 border-foreground bg-white p-6">
            <h2 className="font-bold uppercase tracking-widest text-sm mb-6 border-b-2 border-foreground pb-2">Exchange Details</h2>
            
            {error && (
              <div className="border-2 border-red-600 bg-red-50 p-4 text-xs font-bold uppercase tracking-wider text-red-600 mb-4">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Send Currency</label>
                  <select 
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="border-2 border-foreground p-3 min-h-[48px] bg-secondary text-sm font-bold uppercase outline-none focus:border-primary"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="NGN">NGN - Nigerian Naira</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Amount</label>
                  <input 
                    type="number" 
                    placeholder="1000.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary font-mono w-full" 
                  />
                </div>
              </div>

              <div className="flex justify-center -my-2 relative z-10">
                <div className="w-8 h-8 bg-primary text-primary-foreground border-2 border-foreground flex items-center justify-center rounded-full">
                  <ArrowDown className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Receive Currency</label>
                  <select 
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="border-2 border-foreground p-3 min-h-[48px] bg-secondary text-sm font-bold uppercase outline-none focus:border-primary"
                  >
                    <option value="EUR">EUR - Euro</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="NGN">NGN - Nigerian Naira</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Amount (Est.)</label>
                  <input 
                    type="text" 
                    value={numAmount > 0 ? estimatedReceive : ''} 
                    readOnly 
                    placeholder="0.00"
                    className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none bg-secondary/50 font-mono opacity-80 w-full" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Payment Method</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary"
                >
                  <option value="wallet">Wallet Balance</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="card">Card Payment</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Upload Payment Screenshot (If Bank Transfer)</label>
                <div className="border-2 border-dashed border-foreground p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Click to browse or drag & drop</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Reference Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. TXN-123456" 
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary font-mono" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Notes (Optional)</label>
                <textarea 
                  rows={3} 
                  placeholder="Any special instructions..." 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="border-2 border-foreground bg-primary text-primary-foreground p-6 sticky top-24">
            <h2 className="font-bold uppercase tracking-widest text-sm mb-6 border-b-2 border-white/20 pb-2">Exchange Summary</h2>
            
            <div className="flex flex-col gap-4 font-mono text-sm mb-8">
               <div className="flex justify-between items-center">
                 <span className="uppercase opacity-80">Send Amount</span>
                 <span className="font-bold">{numAmount > 0 ? numAmount.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0.00'} {fromCurrency}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="uppercase opacity-80">Live Rate</span>
                 <span className="font-bold">1 {fromCurrency} = {estimatedRate} {toCurrency}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="uppercase opacity-80">Service Fee</span>
                 <span className="font-bold text-emerald-300">0.00 {fromCurrency}</span>
               </div>
               <div className="border-t-2 border-dashed border-white/30 my-2"></div>
               <div className="flex justify-between items-center text-lg">
                 <span className="uppercase opacity-80">You Get</span>
                 <span className="font-bold">{numAmount > 0 ? parseFloat(estimatedReceive).toLocaleString(undefined, {minimumFractionDigits: 2}) : '0.00'} {toCurrency}</span>
               </div>
            </div>

            <div className="flex flex-col gap-2 mb-8 text-[10px] uppercase font-bold tracking-widest opacity-80">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                Est. Delivery: Instant
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                Secure Transaction
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={loading || !amount || numAmount <= 0}
              className="w-full border-2 border-foreground bg-white text-foreground p-4 font-bold uppercase tracking-widest text-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
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
