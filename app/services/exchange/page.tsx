"use client"

import { useState } from "react"
import { ArrowRight, ArrowLeft, ArrowRightLeft, CreditCard, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Step = 1 | 2 | 3
type PayoutMethod = "bank_transfer" | "crypto_wallet" | "mobile_money" | "cash_pickup"

export default function ExchangeServicePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [isLoading, setIsLoading] = useState(false)

  // Form State
  const [fromCurrency, setFromCurrency] = useState("BDT")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [amount, setAmount] = useState<string>("1000")
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>("bank_transfer")
  const [payoutDetails, setPayoutDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankName: ""
  })

  // Simulated Live Rate (In a real app, fetch from API)
  const exchangeRate = 0.92
  const serviceFee = 15.00
  const exchangedAmount = parseFloat(amount || "0") * exchangeRate
  const totalCost = parseFloat(amount || "0") + serviceFee

  const handleNext = () => {
    if (step < 3) setStep((s) => (s + 1) as Step)
  }

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Note: Assuming we are communicating with Converto_ServerSide running on port 3000
      const response = await fetch("http://localhost:3000/api/exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from_currency: fromCurrency,
          to_currency: toCurrency,
          amount: parseFloat(amount),
          payout_method: payoutMethod,
          payout_details: payoutDetails
        })
      })

      if (!response.ok) {
        console.error("API Error")
      }

      // Success
      router.push("/track") // Redirect to order tracking or success page
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full animate-in fade-in duration-500 pb-10">
      
      <header className="mb-8">
        <Link href="/services" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 border-2 border-foreground bg-[#FF90E8] flex items-center justify-center shadow-[4px_4px_0px_var(--color-foreground)]">
            <ArrowRightLeft className="w-8 h-8 text-zinc-950" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-heading uppercase leading-[0.9] tracking-tight">Currency Exchange</h1>
            <p className="text-sm font-bold uppercase tracking-widest opacity-60 mt-2">Fast, secure global transfers</p>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="flex items-center mb-8 bg-card border-2 border-foreground p-2">
        <div className={`flex-1 text-center py-2 text-[10px] font-black uppercase tracking-widest ${step >= 1 ? 'bg-foreground text-background' : 'opacity-40'}`}>1. Calculator</div>
        <div className={`flex-1 text-center py-2 text-[10px] font-black uppercase tracking-widest ${step >= 2 ? 'bg-foreground text-background' : 'opacity-40'}`}>2. Payout Details</div>
        <div className={`flex-1 text-center py-2 text-[10px] font-black uppercase tracking-widest ${step >= 3 ? 'bg-foreground text-background' : 'opacity-40'}`}>3. Review</div>
      </div>

      <div className="bg-card border-2 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] relative">
        
        {/* Step 1: Calculator */}
        {step === 1 && (
          <div className="p-6 md:p-10 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-black uppercase tracking-widest border-b-4 border-foreground pb-4 mb-8">Exchange Details</h2>
            
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-end mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">You Send</label>
                <div className="flex border-2 border-foreground focus-within:ring-2 ring-primary">
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-transparent p-4 font-mono text-2xl font-black outline-none"
                  />
                  <select 
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="bg-muted border-l-2 border-foreground p-4 font-black uppercase outline-none"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="BDT">BDT</option>
                    <option value="INR">INR</option>
                    <option value="CNY">CNY</option>
                  </select>
                </div>
              </div>

              <div className="hidden md:flex mb-4 w-12 h-12 bg-foreground text-background items-center justify-center rounded-full">
                <ArrowRight className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Recipient Gets</label>
                <div className="flex border-2 border-foreground bg-muted opacity-80 cursor-not-allowed">
                  <div className="w-full p-4 font-mono text-2xl font-black text-foreground/70 flex items-center">
                    {exchangedAmount.toFixed(2)}
                  </div>
                  <select 
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="bg-transparent border-l-2 border-foreground p-4 font-black uppercase outline-none cursor-pointer hover:bg-background"
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="BDT">BDT</option>
                    <option value="INR">INR</option>
                    <option value="CNY">CNY</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-muted p-6 border-2 border-foreground font-mono space-y-2 mb-10">
              <div className="flex justify-between text-sm">
                <span className="font-bold opacity-60">Exchange Rate</span>
                <span className="font-black">1 {fromCurrency} = {exchangeRate} {toCurrency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-bold opacity-60">Service Fee</span>
                <span className="font-black">{serviceFee.toFixed(2)} {fromCurrency}</span>
              </div>
              <div className="flex justify-between text-lg pt-4 border-t-2 border-foreground mt-2">
                <span className="font-black uppercase tracking-widest">Total to Pay</span>
                <span className="font-black">{totalCost.toFixed(2)} {fromCurrency}</span>
              </div>
            </div>

            <button 
              onClick={handleNext}
              className="w-full bg-primary text-primary-foreground font-black uppercase tracking-widest py-5 border-2 border-transparent hover:border-foreground hover:bg-background hover:text-foreground transition-colors flex items-center justify-center gap-2"
            >
              Continue to Payout Details <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Payout Details */}
        {step === 2 && (
          <div className="p-6 md:p-10 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-black uppercase tracking-widest border-b-4 border-foreground pb-4 mb-8">Payout Method</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { id: 'bank_transfer', label: 'Bank Transfer', icon: CreditCard },
                { id: 'crypto_wallet', label: 'Crypto Wallet', icon: ArrowRightLeft },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPayoutMethod(method.id as PayoutMethod)}
                  className={`p-4 border-2 flex flex-col items-center gap-3 transition-colors ${payoutMethod === method.id ? 'border-foreground bg-foreground text-background shadow-[4px_4px_0px_var(--color-primary)]' : 'border-foreground/20 hover:border-foreground bg-card'}`}
                >
                  <method.icon className="w-8 h-8" />
                  <span className="font-black uppercase tracking-widest text-[10px]">{method.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4 mb-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Account Name</label>
                <input 
                  type="text"
                  value={payoutDetails.accountName}
                  onChange={(e) => setPayoutDetails({...payoutDetails, accountName: e.target.value})}
                  className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary"
                  placeholder="John Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Bank Name</label>
                  <input 
                    type="text"
                    value={payoutDetails.bankName}
                    onChange={(e) => setPayoutDetails({...payoutDetails, bankName: e.target.value})}
                    className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary"
                    placeholder="Chase Bank"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Account Number / IBAN</label>
                  <input 
                    type="text"
                    value={payoutDetails.accountNumber}
                    onChange={(e) => setPayoutDetails({...payoutDetails, accountNumber: e.target.value})}
                    className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary"
                    placeholder="US123456789"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleBack}
                className="w-1/3 bg-muted text-foreground font-black uppercase tracking-widest py-5 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleNext}
                className="w-2/3 bg-primary text-primary-foreground font-black uppercase tracking-widest py-5 border-2 border-transparent hover:border-foreground hover:bg-background hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                Review Order <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="p-6 md:p-10 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-black uppercase tracking-widest border-b-4 border-foreground pb-4 mb-8">Review & Submit</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-6">
                <div className="brutal-card bg-[#00E5FF] p-6 border-2 border-foreground shadow-[4px_4px_0px_var(--color-foreground)]">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-2">You Send</span>
                  <div className="font-mono text-3xl font-black">{totalCost.toFixed(2)} {fromCurrency}</div>
                  <div className="text-xs font-bold mt-2">Includes {serviceFee} fee</div>
                </div>
                <div className="brutal-card bg-[#00FF66] p-6 border-2 border-foreground shadow-[4px_4px_0px_var(--color-foreground)]">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-2">Recipient Gets</span>
                  <div className="font-mono text-3xl font-black">{exchangedAmount.toFixed(2)} {toCurrency}</div>
                  <div className="text-xs font-bold mt-2">Rate: {exchangeRate}</div>
                </div>
              </div>

              <div className="border-2 border-foreground p-6 bg-card space-y-4">
                <h3 className="font-black uppercase tracking-widest text-sm border-b-2 border-foreground/20 pb-2">Payout Information</h3>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Method</span>
                  <p className="font-bold capitalize">{payoutMethod.replace('_', ' ')}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Recipient</span>
                  <p className="font-bold">{payoutDetails.accountName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Bank</span>
                  <p className="font-bold">{payoutDetails.bankName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Account Number</span>
                  <p className="font-bold font-mono">{payoutDetails.accountNumber}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleBack}
                disabled={isLoading}
                className="w-1/3 bg-muted text-foreground font-black uppercase tracking-widest py-5 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-2/3 bg-foreground text-background font-black uppercase tracking-widest py-5 border-2 border-transparent hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? "Processing..." : (
                  <>Confirm & Submit <CheckCircle2 className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
