/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2, ShieldCheck, Lock, QrCode, Building2, Globe, Wallet, CheckCircle2, Copy, ArrowLeft } from 'lucide-react'

type PaymentMethod = 'qr' | 'bank' | 'paypal' | 'international' | null

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const referenceCode = `CNV-${String(params.id).split('-')[0].toUpperCase()}`

  useEffect(() => {
    async function initCheckout() {
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('service_requests')
          .select('*, services(name), status_obj:pipeline_statuses(code, name)')
          .eq('id', params.id)
          .single()

        if (orderError) throw orderError
        const statusCode = (orderData as any).status_obj?.code ?? (orderData as any).status_code
        if (!['awaiting_payment', 'quote_sent', 'reviewing_quote'].includes(statusCode)) {
          router.push('/dashboard')
          return
        }

        // Fetch the active quote for this request to get the real amount
        const { data: quoteData } = await supabase
          .from('quotes')
          .select('amount, currency_code, status')
          .eq('request_id', params.id)
          .in('status', ['sent', 'approved'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (quoteData) {
          (orderData as any)._quoteAmount = quoteData.amount
          ;(orderData as any)._quoteCurrency = quoteData.currency_code
        }

        setOrder(orderData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    initCheckout()
  }, [params.id, router])

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleConfirmPayment = async () => {
    if (!selectedMethod) return
    setProcessing(true)

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Send mock webhook to ServerApp
      const res = await fetch('http://localhost:3000/api/webhooks/mock-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: params.id,
          intentId: `mock_${selectedMethod}_${Date.now()}`,
          status: 'succeeded',
          method: selectedMethod
        })
      })

      if (!res.ok) throw new Error('Payment processing failed')

      setPaymentSuccess(true)
      setTimeout(() => {
        router.push('/dashboard?payment=success')
        router.refresh()
      }, 3000)
    } catch (err: any) {
      setError(err.message)
      setProcessing(false)
    }
  }

  const totalAmount = order?._quoteAmount || order?.metadata?.total_fee || order?.amount || 0

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center animate-in fade-in duration-500">
        <div className="inline-flex w-20 h-20 border-4 border-emerald-500 bg-emerald-50 items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">Payment Confirmed!</h1>
        <p className="font-bold text-sm opacity-60 uppercase tracking-widest">
          Your payment has been received. Redirecting to dashboard...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="bg-red-100 border-2 border-red-500 text-red-700 p-6 font-bold">
          {error}
        </div>
        <button onClick={() => router.push('/track')} className="mt-4 brutal-button bg-black text-white px-6 py-3 font-bold uppercase text-sm">
          <ArrowLeft className="w-4 h-4 inline mr-2" /> Back to Track
        </button>
      </div>
    )
  }

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      className="p-1.5 border-2 border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
      title="Copy"
    >
      {copiedField === field ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )

  const paymentMethods = [
    {
      id: 'qr' as const,
      icon: QrCode,
      title: 'QR Code / UPI',
      description: 'Scan & pay via PhonePe, GPay, Paytm',
    },
    {
      id: 'bank' as const,
      icon: Building2,
      title: 'Bank Transfer',
      description: 'NEFT / IMPS / RTGS direct transfer',
    },
    {
      id: 'paypal' as const,
      icon: Wallet,
      title: 'PayPal',
      description: 'Pay with your PayPal account',
    },
    {
      id: 'international' as const,
      icon: Globe,
      title: 'International Wire',
      description: 'SWIFT / IBAN for foreign currencies',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-in fade-in duration-500 [&_button]:cursor-pointer">

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
                <span className="text-sm font-mono font-black">{referenceCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-bold opacity-60">Reference</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-black">{referenceCode}</span>
                  <CopyButton text={referenceCode} field="ref" />
                </div>
              </div>

              <div className="pt-4 border-t-2 border-foreground/10 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-black uppercase tracking-widest text-xs">Total Due</span>
                  <span className="text-2xl font-black font-mono">
                    ₹{Number(totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
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

        {/* Payment Methods */}
        <div className="md:col-span-3 space-y-6">

          {/* Method Selection */}
          <div className="space-y-3">
            <h3 className="font-black uppercase tracking-widest text-xs pb-2 border-b-2 border-foreground">Choose Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                const isSelected = selectedMethod === method.id
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 border-2 text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-[3px_3px_0px_var(--color-primary)]'
                        : 'border-foreground hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_var(--color-foreground)]'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-primary' : ''}`} />
                    <h4 className="font-black uppercase text-xs tracking-wider">{method.title}</h4>
                    <p className="text-[9px] font-bold uppercase tracking-wider opacity-50 mt-0.5">{method.description}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Payment Details based on selected method */}
          {selectedMethod && (
            <div className="border-2 border-foreground p-6 animate-in slide-in-from-bottom-2 duration-300 bg-white">

              {selectedMethod === 'qr' && (
                <div className="space-y-4">
                  <h4 className="font-black uppercase tracking-widest text-xs border-b-2 border-foreground/10 pb-2">Scan QR Code to Pay</h4>
                  {/* Mock QR Code */}
                  <div className="flex justify-center">
                    <div className="w-48 h-48 border-4 border-black bg-white p-3 flex items-center justify-center">
                      <div className="w-full h-full bg-[repeating-conic-gradient(#000_0%_25%,#fff_0%_50%)] bg-[length:12px_12px] opacity-90" />
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">UPI ID</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono font-black text-sm">converto@ybl</span>
                      <CopyButton text="converto@ybl" field="upi" />
                    </div>
                  </div>
                  <div className="bg-yellow-50 border-2 border-yellow-400 p-3 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-800">
                      Include reference: <span className="font-mono">{referenceCode}</span> in payment remarks
                    </p>
                  </div>
                </div>
              )}

              {selectedMethod === 'bank' && (
                <div className="space-y-4">
                  <h4 className="font-black uppercase tracking-widest text-xs border-b-2 border-foreground/10 pb-2">Bank Transfer Details</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Account Name', value: 'Converto Services Pvt. Ltd.', key: 'accname' },
                      { label: 'Account Number', value: '9876543210001234', key: 'accno' },
                      { label: 'IFSC Code', value: 'SBIN0001234', key: 'ifsc' },
                      { label: 'Bank', value: 'State Bank of India', key: 'bank' },
                      { label: 'Branch', value: 'Kolkata Main Branch', key: 'branch' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between border-b border-foreground/10 pb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs">{item.value}</span>
                          <CopyButton text={item.value} field={item.key} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-50 border-2 border-blue-400 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-800">
                      Use reference <span className="font-mono">{referenceCode}</span> as payment narration for instant verification.
                    </p>
                  </div>
                </div>
              )}

              {selectedMethod === 'paypal' && (
                <div className="space-y-4">
                  <h4 className="font-black uppercase tracking-widest text-xs border-b-2 border-foreground/10 pb-2">PayPal Payment</h4>
                  <div className="text-center space-y-4 py-4">
                    <div className="inline-flex w-16 h-16 bg-blue-600 items-center justify-center border-2 border-black">
                      <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Send payment to</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-mono font-black text-sm">payments@converto.app</span>
                        <CopyButton text="payments@converto.app" field="paypal" />
                      </div>
                    </div>
                    <div className="bg-yellow-50 border-2 border-yellow-400 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-800">
                        Amount: <span className="font-mono">₹{Number(totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> • Reference: <span className="font-mono">{referenceCode}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'international' && (
                <div className="space-y-4">
                  <h4 className="font-black uppercase tracking-widest text-xs border-b-2 border-foreground/10 pb-2">International Wire / SWIFT Transfer</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Beneficiary', value: 'Converto Services Pvt. Ltd.', key: 'intname' },
                      { label: 'SWIFT / BIC', value: 'SBININBB104', key: 'swift' },
                      { label: 'IBAN', value: 'IN89 SBIN 0001 2345 6789 0012 34', key: 'iban' },
                      { label: 'Bank', value: 'State Bank of India', key: 'intbank' },
                      { label: 'Currency', value: 'INR (Indian Rupee) or USD', key: 'curr' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between border-b border-foreground/10 pb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs">{item.value}</span>
                          <CopyButton text={item.value} field={item.key} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-purple-50 border-2 border-purple-400 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-purple-800">
                      Include reference <span className="font-mono">{referenceCode}</span> in the wire transfer memo. International transfers may take 2-5 business days.
                    </p>
                  </div>
                </div>
              )}

              {/* Confirm Button */}
              <button
                onClick={handleConfirmPayment}
                disabled={processing}
                className="w-full mt-6 bg-foreground text-background font-black uppercase tracking-widest py-4 border-2 border-transparent hover:border-foreground hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processing ? (
                  <>Processing Payment <Loader2 className="w-5 h-5 animate-spin" /></>
                ) : (
                  <>I have completed the payment — Confirm</>
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
