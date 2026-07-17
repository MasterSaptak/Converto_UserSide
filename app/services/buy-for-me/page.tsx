/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, ArrowRight, ArrowLeft, Loader2, Link as LinkIcon, Info, MapPin } from 'lucide-react'

export default function BuyForMePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    productUrl: '',
    quantity: '1',
    color: '',
    size: '',
    specialInstructions: '',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      country: '',
      zip_code: ''
    }
  })

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateAddress = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: { ...prev.shippingAddress, [field]: value }
    }))
  }

  const handleNext = () => setStep(s => s + 1)
  const handlePrev = () => setStep(s => s - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Send to Server App API (In prod, use NEXT_PUBLIC_API_URL)
      const res = await fetch('http://localhost:3000/api/buy-for-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit request')
      }

      router.push('/dashboard?service=buy_for_me&status=success')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 animate-in fade-in duration-500">
      
      <div className="mb-10 text-center">
        <div className="inline-flex w-16 h-16 border-2 border-foreground bg-primary items-center justify-center mb-6 shadow-[4px_4px_0px_var(--color-foreground)]">
          <ShoppingBag className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter">Buy For Me</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">Paste a link, we handle the rest</p>
      </div>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-2 flex-1 border-2 border-foreground ${step >= i ? 'bg-primary' : 'bg-transparent'}`} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="brutal-card bg-white p-6 md:p-8 space-y-8">
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 font-bold text-sm">
            {error}
          </div>
        )}

        {/* STEP 1: Product Link */}
        <div className={step === 1 ? 'block' : 'hidden'}>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6">1. Product Link</h2>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border-2 border-blue-200 p-4 text-xs font-bold text-blue-800 flex gap-3">
              <Info className="w-5 h-5 shrink-0" />
              Paste the exact link to the product you want us to purchase (e.g., from Amazon, eBay, BestBuy).
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-60">URL</label>
              <div className="flex">
                <div className="bg-slate-100 border-y-2 border-l-2 border-black p-4 flex items-center justify-center">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <input 
                  type="url"
                  value={formData.productUrl}
                  onChange={(e) => updateForm('productUrl', e.target.value)}
                  required
                  placeholder="https://www.amazon.com/dp/B08N5WRWNW"
                  className="w-full p-4 border-2 border-black font-mono focus:ring-2 ring-primary outline-none"
                />
              </div>
            </div>
            
            <button 
              type="button"
              onClick={handleNext}
              disabled={!formData.productUrl}
              className="w-full brutal-button bg-black text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Next Step <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEP 2: Specifications */}
        <div className={step === 2 ? 'block' : 'hidden'}>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6">2. Specifications</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Color (Optional)</label>
              <input 
                type="text"
                value={formData.color}
                onChange={(e) => updateForm('color', e.target.value)}
                placeholder="e.g. Space Gray"
                className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Size (Optional)</label>
              <input 
                type="text"
                value={formData.size}
                onChange={(e) => updateForm('size', e.target.value)}
                placeholder="e.g. XL"
                className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Quantity</label>
              <input 
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => updateForm('quantity', e.target.value)}
                required
                className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Special Instructions</label>
              <textarea 
                value={formData.specialInstructions}
                onChange={(e) => updateForm('specialInstructions', e.target.value)}
                placeholder="Any details the shopper should know..."
                rows={3}
                className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={handlePrev} className="p-4 border-2 border-black hover:bg-slate-100 transition-colors font-black uppercase tracking-widest flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              type="button" 
              onClick={handleNext}
              className="flex-1 brutal-button bg-black text-white flex items-center justify-center gap-2"
            >
              Shipping Details <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEP 3: Shipping */}
        <div className={step === 3 ? 'block' : 'hidden'}>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6">3. Shipping Details</h2>
          
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Street Address</label>
              <div className="flex">
                <div className="bg-slate-100 border-y-2 border-l-2 border-black p-4 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <input 
                  type="text"
                  value={formData.shippingAddress.street}
                  onChange={(e) => updateAddress('street', e.target.value)}
                  required
                  placeholder="123 Delivery St, Apt 4B"
                  className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">City</label>
                <input 
                  type="text"
                  value={formData.shippingAddress.city}
                  onChange={(e) => updateAddress('city', e.target.value)}
                  required
                  className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">State/Province</label>
                <input 
                  type="text"
                  value={formData.shippingAddress.state}
                  onChange={(e) => updateAddress('state', e.target.value)}
                  required
                  className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">ZIP/Postal Code</label>
                <input 
                  type="text"
                  value={formData.shippingAddress.zip_code}
                  onChange={(e) => updateAddress('zip_code', e.target.value)}
                  required
                  className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Country</label>
                <input 
                  type="text"
                  value={formData.shippingAddress.country}
                  onChange={(e) => updateAddress('country', e.target.value)}
                  required
                  className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border-2 border-primary p-4 mb-6">
            <h4 className="font-black uppercase tracking-widest text-xs mb-2">Next Steps</h4>
            <p className="text-sm font-bold opacity-80">
              Once submitted, our team will review the link and generate a final price quote (including shipping and service fees). You&apos;ll be notified when the quote is ready for payment.
            </p>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={handlePrev} className="p-4 border-2 border-black hover:bg-slate-100 transition-colors font-black uppercase tracking-widest flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 brutal-button bg-primary text-primary-foreground flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>Submitting <Loader2 className="w-5 h-5 animate-spin" /></>
              ) : (
                <>Request Quote <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  )
}
