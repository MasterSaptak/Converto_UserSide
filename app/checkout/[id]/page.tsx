/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2, ShieldCheck, CreditCard, Lock, QrCode, Building2, Globe } from 'lucide-react'

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [intent, setIntent] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('card')

  useEffect(() => {
    async function initCheckout() {
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('service_requests')
          .select('*, services(name), status_obj:pipeline_statuses(*), quotes:quotes!quotes_request_id_fkey(*)')
          .eq('id', params.id)
          .single()

        if (orderError) throw orderError
        
        const hasQuote = orderData.quotes && orderData.quotes.length > 0
        if (!hasQuote && orderData.status_obj?.code !== 'awaiting_payment' && orderData.status_obj?.code !== 'quote_sent' && orderData.status_obj?.code !== 'reviewing_quote') {
          router.push('/track')
          return
        }

        setOrder(orderData)

        // Request payment intent
        const res = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: params.id })
        })

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || 'Failed to initialize payment')
        }

        const intentData = await res.json()
        setIntent(intentData)

      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    initCheckout()
  }, [params.id, router])

  const handleSimulatedPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    
    try {
      // Simulate Stripe Processing Delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Send mock webhook to API
      const res = await fetch('/api/webhooks/mock-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: params.id,
          intentId: intent.intentId,
          status: 'succeeded'
        })
      })

      if (!res.ok) throw new Error('Payment processing failed')

      // Redirect to success
      router.push('/track?payment=success')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="bg-red-100 border-2 border-red-500 text-red-700 p-6 font-bold">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 animate-in fade-in duration-500">
      
      <div className="mb-10 text-center">
        <div className="inline-flex w-16 h-16 border-2 border-foreground bg-primary items-center justify-center mb-6 shadow-[4px_4px_0px_var(--color-foreground)]">
          <Lock className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter">Secure Checkout</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">Powered by Converto Payment Engine</p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        
        {/* Order Summary */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-50 border-2 border-foreground p-6">
            <h3 className="font-black uppercase tracking-widest text-xs mb-4 pb-4 border-b-2 border-foreground/10">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-bold opacity-60">Service</span>
                <span className="text-sm font-black text-right">{order?.services?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-bold opacity-60">Order ID</span>
                <span className="text-sm font-mono font-black">{order?.id.split('-')[0]}</span>
              </div>
              
              <div className="pt-4 border-t-2 border-foreground/10 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black uppercase tracking-widest">Total Due</span>
                  <span className="text-2xl font-black">${(order?.quotes?.[0]?.amount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-center opacity-50">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">256-bit SSL Encrypted</span>
          </div>
        </div>

        {/* Payment Form (Mock) */}
        <div className="md:col-span-3">
          <div className="brutal-card bg-white p-6 md:p-8 space-y-6">
            
            <div className="bg-yellow-100 border-2 border-yellow-500 text-yellow-800 p-4 text-xs font-bold flex gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              This is a test environment using the Mock Payment Engine. No real charges will be processed.
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-b-2 border-foreground/10 pb-4">
              <button 
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center justify-center p-3 gap-2 border-2 transition-all ${paymentMethod === 'card' ? 'border-foreground bg-primary text-primary-foreground shadow-[2px_2px_0px_var(--color-foreground)]' : 'border-transparent hover:bg-slate-100'}`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-[9px] font-black uppercase tracking-widest text-center">Card</span>
              </button>
              <button 
                type="button"
                onClick={() => setPaymentMethod('qr')}
                className={`flex flex-col items-center justify-center p-3 gap-2 border-2 transition-all ${paymentMethod === 'qr' ? 'border-foreground bg-primary text-primary-foreground shadow-[2px_2px_0px_var(--color-foreground)]' : 'border-transparent hover:bg-slate-100'}`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-[9px] font-black uppercase tracking-widest text-center">QR / UPI</span>
              </button>
              <button 
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={`flex flex-col items-center justify-center p-3 gap-2 border-2 transition-all ${paymentMethod === 'bank' ? 'border-foreground bg-primary text-primary-foreground shadow-[2px_2px_0px_var(--color-foreground)]' : 'border-transparent hover:bg-slate-100'}`}
              >
                <Building2 className="w-5 h-5" />
                <span className="text-[9px] font-black uppercase tracking-widest text-center">Bank Transfer</span>
              </button>
              <button 
                type="button"
                onClick={() => setPaymentMethod('international')}
                className={`flex flex-col items-center justify-center p-3 gap-2 border-2 transition-all ${paymentMethod === 'international' ? 'border-foreground bg-primary text-primary-foreground shadow-[2px_2px_0px_var(--color-foreground)]' : 'border-transparent hover:bg-slate-100'}`}
              >
                <Globe className="w-5 h-5" />
                <span className="text-[9px] font-black uppercase tracking-widest text-center">International (Paypal/Swift)</span>
              </button>
            </div>

            <form onSubmit={handleSimulatedPayment} className="space-y-6">
              {paymentMethod === 'card' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Card Number (Mock)</label>
                    <input 
                      type="text"
                      disabled
                      className="brutal-input w-full bg-slate-100 opacity-70"
                      value="4242 4242 4242 4242"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Expiry</label>
                      <input type="text" disabled className="brutal-input w-full bg-slate-100 opacity-70" value="12/28" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-60">CVC</label>
                      <input type="text" disabled className="brutal-input w-full bg-slate-100 opacity-70" value="123" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'qr' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 text-center py-6 border-2 border-dashed border-foreground/20">
                  <div className="inline-flex p-4 bg-white border-4 border-foreground mb-4">
                    <QrCode className="w-32 h-32 text-foreground" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest">Scan with WeChat or UPI</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Approve on your device to continue</p>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="bg-slate-50 p-4 border-l-4 border-primary">
                    <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Wire Instructions</h4>
                    <div className="space-y-2 text-xs font-mono font-bold">
                      <div className="flex justify-between"><span className="opacity-50">Bank:</span><span>Global Reserve</span></div>
                      <div className="flex justify-between"><span className="opacity-50">Account:</span><span>1234 5678 9012</span></div>
                      <div className="flex justify-between"><span className="opacity-50">Routing:</span><span>12230044</span></div>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 text-center">Click &apos;Confirm Transfer&apos; once you have initiated the wire.</p>
                </div>
              )}

              {paymentMethod === 'international' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="bg-blue-50 p-6 border-2 border-blue-200 text-center flex flex-col items-center justify-center gap-4">
                      <Globe className="w-10 h-10 text-blue-500" />
                      <p className="text-xs font-bold uppercase tracking-widest text-blue-900">Checkout with Paypal or Stripe International</p>
                   </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={processing}
                className="w-full bg-foreground text-background font-black uppercase tracking-widest py-4 border-2 border-transparent hover:border-foreground hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processing ? (
                  <>Processing <Loader2 className="w-5 h-5 animate-spin" /></>
                ) : (
                  paymentMethod === 'bank' ? 'Confirm Transfer Initiated' : `Pay $${(order?.quotes?.[0]?.amount || 0).toFixed(2)}`
                )}
              </button>
              
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
