/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2, ShieldCheck, CreditCard, Lock } from 'lucide-react'

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [intent, setIntent] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initCheckout() {
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('service_requests')
          .select('*, services(name)')
          .eq('id', params.id)
          .single()

        if (orderError) throw orderError
        if (orderData.status_code !== 'awaiting_payment') {
          router.push('/dashboard')
          return
        }

        setOrder(orderData)

        // Request payment intent from Server App API
        // For MVP, we make a call to localhost:3000 where Server App is running
        // In production, this should be an env variable API_URL
        const res = await fetch('http://localhost:3000/api/payments/create-intent', {
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
      
      // Send mock webhook to ServerApp
      const res = await fetch('http://localhost:3000/api/webhooks/mock-payment', {
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
      router.push('/dashboard?payment=success')
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
                  <span className="font-black uppercase tracking-widest text-xs">Total Due</span>
                  <span className="text-2xl font-black font-mono">
                    ${(order?.metadata?.total_fee || 100).toFixed(2)}
                  </span>
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
          <form onSubmit={handleSimulatedPayment} className="brutal-card bg-white p-6 md:p-8 space-y-6">
            
            <div className="bg-yellow-100 border-2 border-yellow-500 text-yellow-800 p-4 text-xs font-bold flex gap-3">
              <CreditCard className="w-5 h-5 shrink-0" />
              This is a test environment using the Mock Payment Engine. No real charges will be processed.
            </div>

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
                <input 
                  type="text"
                  disabled
                  className="brutal-input w-full bg-slate-100 opacity-70"
                  value="12/28"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">CVC</label>
                <input 
                  type="text"
                  disabled
                  className="brutal-input w-full bg-slate-100 opacity-70"
                  value="123"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={processing}
              className="w-full bg-foreground text-background font-black uppercase tracking-widest py-4 border-2 border-transparent hover:border-foreground hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processing ? (
                <>Processing Payment <Loader2 className="w-5 h-5 animate-spin" /></>
              ) : (
                `Pay $${(order?.metadata?.total_fee || 100).toFixed(2)}`
              )}
            </button>
            
          </form>
        </div>

      </div>
    </div>
  )
}
