'use client';

import { useState } from 'react';
import { Loader2, CheckCircle } from "lucide-react";
import { submitServiceRequest } from '@/hooks/useServiceRequests';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function BuyForMePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [productUrl, setProductUrl] = useState('');
  const [storeName, setStoreName] = useState('');
  const [country, setCountry] = useState('United States');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (!productName || !storeName) {
      setError('Product Name and Store Name are required');
      return;
    }

    setLoading(true);
    setError('');

    const numQuantity = parseInt(quantity, 10) || 1;
    const numCost = parseFloat(estimatedCost) || 0;

    const { error: submitError } = await submitServiceRequest({
      serviceSlug: 'buy_for_me',
      amount: numCost,
      currency: 'USD', // Assumed base currency for estimates
      metadata: {
        product_url: productUrl || undefined,
        store: storeName,
        country: country,
        product_name: productName,
        quantity: numQuantity,
        color: color || undefined,
        size: size || undefined,
        shipping_address: shippingAddress || undefined,
      },
      notes: specialInstructions || undefined,
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
          Your Buy For Me request has been received. Redirecting to tracker...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-8 md:gap-10 animate-in fade-in duration-500 pb-10">
      <header className="border-b-2 border-foreground pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2 block">Services</span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">Buy For Me</h1>
      </header>
      
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Form */}
        <div className="flex flex-col gap-6">
          <div className="border-2 border-foreground bg-white p-6">
            <h2 className="font-bold uppercase tracking-widest text-sm mb-6 border-b-2 border-foreground pb-2">Product Details</h2>
            
            {error && (
              <div className="border-2 border-red-600 bg-red-50 p-4 text-xs font-bold uppercase tracking-wider text-red-600 mb-4">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-6">
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Product URL</label>
                <input 
                  type="url" 
                  placeholder="https://..." 
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary font-mono" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Store Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Amazon" 
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary w-full" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Country</label>
                  <select 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="border-2 border-foreground p-3 min-h-[48px] bg-secondary text-sm font-bold uppercase outline-none focus:border-primary w-full"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Japan">Japan</option>
                    <option value="China">China</option>
                    <option value="UAE">UAE</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Product Name</label>
                <input 
                  type="text" 
                  placeholder="Exact product title" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary w-full" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Quantity</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary font-mono w-full" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Color</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Black" 
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary w-full" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Size</label>
                  <input 
                    type="text" 
                    placeholder="e.g. M" 
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary w-full" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Estimated Cost (Local Currency)</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary font-mono" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Shipping Address</label>
                <textarea 
                  rows={3} 
                  placeholder="Full delivery address" 
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Reference Images</label>
                <div className="border-2 border-dashed border-foreground p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Upload screenshots of the product</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Special Instructions / Budget Limit</label>
                <textarea 
                  rows={2} 
                  placeholder="Max budget, alternatives if out of stock..." 
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="border-2 border-foreground bg-primary text-primary-foreground p-6 sticky top-24">
            <h2 className="font-bold uppercase tracking-widest text-sm mb-6 border-b-2 border-white/20 pb-2">Service Summary</h2>
            
            <div className="flex flex-col gap-4 text-xs font-bold uppercase mb-8">
               <p className="opacity-80">1. We will verify the product details and confirm the final cost including shipping.</p>
               <p className="opacity-80">2. Once confirmed, you will receive an invoice to proceed with the payment.</p>
               <p className="opacity-80">3. We will purchase and ship the item to your designated address.</p>
            </div>

            <div className="flex flex-col gap-2 mb-8 text-[10px] uppercase font-bold tracking-widest opacity-80">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                Procurement Fee applies
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                Customs handling included
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={loading}
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
