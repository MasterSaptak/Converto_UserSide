"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { ArrowRight, ArrowLeft, ArrowRightLeft, CheckCircle2, Loader2, AlertTriangle, CreditCard, Banknote, Smartphone, Zap, MessageSquare, Send } from "lucide-react"
import { SiBinance, SiPaypal, SiPhonepe, SiTether, SiWise } from "react-icons/si"
import { BsBank } from "react-icons/bs"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { submitServiceRequest } from '@/hooks/useServiceRequests'
import { supabase } from '@/lib/supabase'

type Step = 1 | 2 | 3

interface TransferMethod {
  id: string
  name: string
  category: string
  icon: string
}

interface TransferCorridor {
  id: string
  from_country: string
  to_country: string
  from_currency: string
  to_currency: string
  market_rate: number
  custom_rate: number
  fee_type: string
  fee_flat: number
  fee_percentage: number
  minimum_amount: number
  maximum_amount: number
  corridor_send_methods: { transfer_methods: TransferMethod }[]
  corridor_receive_methods: { transfer_methods: TransferMethod }[]
}

interface CurrencyRate {
  id: string
  base_currency: string
  target_currency: string
  market_rate: number
  custom_rate: number
}

function getIconComponent(iconName: string, methodName: string) {
  const name = methodName.toLowerCase();
  
  const getUnavatar = (domain: string) => `https://unavatar.io/${domain}`;

  if (name.includes('bkash')) {
    return function BkashIcon({ className, style }: { className?: string, style?: React.CSSProperties }) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={getUnavatar('bkash.com')} alt="bKash" className={className} style={{...style, objectFit: 'contain', borderRadius: '4px'}} />
    }
  }
  if (name.includes('nagad')) {
    return function NagadIcon({ className, style }: { className?: string, style?: React.CSSProperties }) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src="https://ui-avatars.com/api/?name=Nagad&background=ED1C24&color=fff&rounded=true&bold=true" alt="Nagad" className={className} style={{...style, objectFit: 'contain', borderRadius: '4px'}} />
    }
  }
  if (name.includes('rocket')) {
    return function RocketIcon({ className, style }: { className?: string, style?: React.CSSProperties }) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src="https://ui-avatars.com/api/?name=Rocket&background=8C3494&color=fff&rounded=true&bold=true" alt="Rocket" className={className} style={{...style, objectFit: 'contain', borderRadius: '4px'}} />
    }
  }
  if (name.includes('upi')) {
    return function UpiIcon({ className, style }: { className?: string, style?: React.CSSProperties }) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={getUnavatar('bhimupi.org.in')} alt="UPI" className={className} style={{...style, objectFit: 'contain', borderRadius: '4px'}} />
    }
  }
  if (name.includes('remitly')) {
    return function RemitlyIcon({ className, style }: { className?: string, style?: React.CSSProperties }) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={getUnavatar('remitly.com')} alt="Remitly" className={className} style={{...style, objectFit: 'contain', borderRadius: '4px'}} />
    }
  }
  if (name.includes('taptap')) {
    return function TaptapIcon({ className, style }: { className?: string, style?: React.CSSProperties }) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={getUnavatar('taptapsend.com')} alt="TapTap Send" className={className} style={{...style, objectFit: 'contain', borderRadius: '4px'}} />
    }
  }

  switch(iconName) {
    case 'BsBank': return BsBank
    case 'SiPhonepe': return SiPhonepe
    case 'SiBinance': return SiBinance
    case 'SiTether': return SiTether
    case 'SiWise': return SiWise
    case 'SiPaypal': return SiPaypal
    case 'Send': return Send
    case 'Zap': return Zap
    case 'Smartphone': return Smartphone
    case 'Banknote': return Banknote
    default: return CreditCard
  }
}

function getBrandColor(iconName: string, methodName: string) {
  const name = methodName.toLowerCase();
  if (name.includes('nagad')) return '#ED1C24'; // Nagad Orange/Red
  if (name.includes('rocket')) return '#8C3494'; // Rocket Purple
  if (name.includes('bkash')) return '#E2136E'; // bKash Pink
  if (name.includes('upi')) return '#EB6625'; // UPI Orange
  
  switch(iconName) {
    case 'SiBinance': return '#F3BA2F';
    case 'SiTether': return '#26A17B';
    case 'SiPhonepe': return '#5f259f';
    case 'SiWise': return '#9FE870';
    case 'SiPaypal': return '#003087';
    case 'Send': return '#0065ff'; // Remitly
    case 'Zap': return '#00d2ff'; // TapTap Send
    case 'Banknote': return '#85bb65';
    case 'BsBank': return '#000000';
    default: return '#000000';
  }
}

function calculateFee(amount: number, pair: TransferCorridor) {
  let flat = 0, pct = 0
  switch (pair.fee_type) {
    case 'flat': flat = pair.fee_flat; break
    case 'percentage': pct = (amount * pair.fee_percentage) / 100; break
    case 'hybrid': flat = pair.fee_flat; pct = (amount * pair.fee_percentage) / 100; break
  }
  return {
    flat: Math.round(flat * 100) / 100,
    percentage: Math.round(pct * 100) / 100,
    total: Math.round((flat + pct) * 100) / 100,
  }
}

export default function ExchangeServicePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Data from database
  const [corridors, setCorridors] = useState<TransferCorridor[]>([])
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([])
  const [loadingCorridors, setLoadingCorridors] = useState(true)

  // Form State
  const [fromCurrency, setFromCurrency] = useState("BDT")
  const [toCurrency, setToCurrency] = useState("INR")
  const [preferredSendMethodId, setPreferredSendMethodId] = useState<string>("")
  const [preferredReceiveMethodId, setPreferredReceiveMethodId] = useState<string>("")
  const [amount, setAmount] = useState<string>("10000")
  const [payoutDetails, setPayoutDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankName: ""
  })

  // Negotiation State
  const [isNegotiating, setIsNegotiating] = useState(false)
  const [requestedRate, setRequestedRate] = useState<string>("")
  const [requestNote, setRequestNote] = useState<string>("")
  const [notifyMe] = useState(false)

  // Fetch all active corridors
  const fetchCorridors = useCallback(async () => {
    try {
      const [corridorsRes, ratesRes] = await Promise.all([
        supabase
          .from('transfer_corridors')
          .select(`
            *,
            corridor_send_methods ( transfer_methods (*) ),
            corridor_receive_methods ( transfer_methods (*) )
          `),
        supabase.from('currency_rates').select('*')
      ])

      if (corridorsRes.error) throw corridorsRes.error
      setCorridors((corridorsRes.data as TransferCorridor[]) || [])
      setCurrencyRates(ratesRes.data || [])
    } catch (err) {
      console.error('Failed to fetch corridors:', err)
      setError('Failed to load exchange rates. Please try again.')
    } finally {
      setLoadingCorridors(false)
    }
  }, [])

  useEffect(() => {
    fetchCorridors()
  }, [fetchCorridors])

  // Derived: available currencies
  const fromCurrencies = Array.from(new Set(corridors.map(c => c.from_currency))).sort()
  const toCurrencies = Array.from(
    new Set(corridors.filter(c => c.from_currency === fromCurrency).map(c => c.to_currency))
  ).sort()

  // Active corridor and dynamic rate lookup
  const activeCorridor = corridors.find(
    c => c.from_currency === fromCurrency && c.to_currency === toCurrency
  )

  const activeRates = useMemo(() => {
    if (!activeCorridor) return null
    const dbRate = currencyRates.find(r => r.base_currency === fromCurrency && r.target_currency === toCurrency)
    return {
      custom_rate: dbRate?.custom_rate || activeCorridor.custom_rate,
      market_rate: dbRate?.market_rate || activeCorridor.market_rate
    }
  }, [activeCorridor, currencyRates, fromCurrency, toCurrency])

  // Extract Methods
  const availableSendMethods = useMemo(() => activeCorridor?.corridor_send_methods.map(s => s.transfer_methods).filter(Boolean) || [], [activeCorridor])
  const availableReceiveMethods = useMemo(() => activeCorridor?.corridor_receive_methods.map(r => r.transfer_methods).filter(Boolean) || [], [activeCorridor])

  // Auto-select valid to_currency when from_currency changes
  useEffect(() => {
    if (toCurrencies.length > 0 && !toCurrencies.includes(toCurrency)) {
      setToCurrency(toCurrencies[0])
    }
  }, [fromCurrency, toCurrencies, toCurrency])

  // Reset selected methods when corridor changes
  useEffect(() => {
    if (availableSendMethods.length > 0 && !availableSendMethods.find(m => m.id === preferredSendMethodId)) {
      setPreferredSendMethodId(availableSendMethods[0].id)
    }
    if (availableReceiveMethods.length > 0 && !availableReceiveMethods.find(m => m.id === preferredReceiveMethodId)) {
      setPreferredReceiveMethodId(availableReceiveMethods[0].id)
    }
  }, [activeCorridor?.id, availableSendMethods, availableReceiveMethods, preferredSendMethodId, preferredReceiveMethodId])

  // Calculations
  const numAmount = parseFloat(amount || "0")
  const fee = activeCorridor ? calculateFee(numAmount, activeCorridor) : { flat: 0, percentage: 0, total: 0 }
  const effectiveCustomRate = activeRates?.custom_rate || 0
  const effectiveMarketRate = activeRates?.market_rate || 0
  const recipientReceives = activeCorridor ? Math.round(numAmount * effectiveCustomRate * 100) / 100 : 0
  const totalToPay = Math.round((numAmount + fee.total) * 100) / 100

  const preferredSendMethod = availableSendMethods.find(m => m.id === preferredSendMethodId)
  const preferredReceiveMethod = availableReceiveMethods.find(m => m.id === preferredReceiveMethodId)

  // Validation
  const isAmountValid = activeCorridor
    ? numAmount >= activeCorridor.minimum_amount && numAmount <= activeCorridor.maximum_amount
    : false
  
  const canProceedStep1 = activeCorridor && isAmountValid && preferredSendMethodId && preferredReceiveMethodId

  const handleNext = () => {
    if (step === 1 && !isAmountValid) {
      setError(`Amount must be between ${activeCorridor?.minimum_amount} and ${activeCorridor?.maximum_amount} ${fromCurrency}`)
      return
    }
    setError(null)
    if (step < 3) setStep((s) => (s + 1) as Step)
  }

  const handleBack = () => {
    setError(null)
    if (step > 1) setStep((s) => (s - 1) as Step)
  }

  const handleSubmit = async () => {
    if (!activeCorridor || !preferredSendMethod || !preferredReceiveMethod) return
    setIsLoading(true)
    setError(null)
    try {
      const { data, error: submitError } = await submitServiceRequest({
        serviceSlug: 'exchange',
        metadata: {
          corridor_id: activeCorridor.id,
          from_currency: fromCurrency,
          to_currency: toCurrency,
          market_rate_snapshot: effectiveMarketRate,
          custom_rate_snapshot: effectiveCustomRate,
          fee_type: activeCorridor.fee_type,
          fee_flat_snapshot: fee.flat,
          fee_percentage_snapshot: fee.percentage,
          total_fee_snapshot: fee.total,
          send_amount: numAmount,
          total_paid: totalToPay,
          recipient_receives: recipientReceives,
          preferred_send_method: preferredSendMethod.name,
          preferred_receive_method: preferredReceiveMethod.name,
          payout_details: payoutDetails,
          is_negotiating: isNegotiating,
          requested_rate: isNegotiating ? parseFloat(requestedRate) : null,
          request_note: isNegotiating ? requestNote : null,
          notify_me: isNegotiating ? notifyMe : false,
          effective_rate: effectiveCustomRate,
        },
        amount: numAmount,
        currency: fromCurrency,
        notes: `Transfer: ${numAmount} ${fromCurrency} → ${recipientReceives} ${toCurrency} via ${preferredSendMethod.name} to ${preferredReceiveMethod.name}`
      })

      if (submitError || !data) {
        throw new Error(submitError || 'Failed to initialize exchange')
      }

      router.push("/track")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setIsLoading(false)
    }
  }

  if (loadingCorridors) {
    return (
      <div className="flex-1 flex items-center justify-center gap-3 py-20">
        <Loader2 className="w-6 h-6 animate-spin opacity-60" />
        <span className="font-bold uppercase tracking-widest text-sm opacity-60">Loading corridors...</span>
      </div>
    )
  }

  // Method Grouping Helper
  const renderMethodGroup = (methods: TransferMethod[], selectedId: string, onSelect: (id: string) => void) => {
    if (methods.length === 0) return null;
    
    // Group methods by category
    const grouped = methods.reduce((acc, method) => {
      acc[method.category] = acc[method.category] || []
      acc[method.category].push(method)
      return acc
    }, {} as Record<string, TransferMethod[]>)

    const getCategoryName = (cat: string) => {
      switch(cat) {
        case 'banking': return 'Banking'
        case 'digital_wallets': return 'Digital Wallets'
        case 'international': return 'International'
        default: return 'Other'
      }
    }

    return (
      <div className="space-y-4">
        {Object.entries(grouped).map(([category, catMethods]) => (
          <div key={category}>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">{getCategoryName(category)}</div>
            <div className="flex flex-wrap gap-3">
              {catMethods.map((method) => {
                const Icon = getIconComponent(method.icon, method.name)
                const isSelected = selectedId === method.id
                const brandColor = getBrandColor(method.icon, method.name)
                
                return (
                  <button
                    key={method.id}
                    onClick={() => onSelect(method.id)}
                    style={{ 
                      borderColor: isSelected ? brandColor : 'var(--border-color)',
                      backgroundColor: isSelected ? brandColor : 'var(--bg-color)',
                      color: isSelected ? '#fff' : 'inherit',
                      boxShadow: isSelected ? `3px 3px 0px #000` : 'none'
                    }}
                    className={`flex items-center gap-2 px-4 py-3 border-2 transition-all ${
                      isSelected 
                        ? 'shadow-black' 
                        : 'border-foreground/20 hover:border-foreground bg-card'
                    }`}
                  >
                    <Icon className="w-6 h-6 shrink-0" style={{ color: isSelected ? '#fff' : brandColor }} />
                    <span className="font-black tracking-wide text-xs">
                      {method.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
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
            <h1 className="text-4xl md:text-5xl font-black font-heading uppercase leading-[0.9] tracking-tight">Transfer Money</h1>
            <p className="text-sm font-bold uppercase tracking-widest opacity-60 mt-2">Fast, secure global transfers</p>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="flex items-center mb-8 bg-card border-2 border-foreground p-2">
        <div className={`flex-1 text-center py-2 text-[10px] font-black uppercase tracking-widest ${step >= 1 ? 'bg-foreground text-background' : 'opacity-40'}`}>1. Details</div>
        <div className={`flex-1 text-center py-2 text-[10px] font-black uppercase tracking-widest ${step >= 2 ? 'bg-foreground text-background' : 'opacity-40'}`}>2. Recipient</div>
        <div className={`flex-1 text-center py-2 text-[10px] font-black uppercase tracking-widest ${step >= 3 ? 'bg-foreground text-background' : 'opacity-40'}`}>3. Review</div>
      </div>

      <div className="bg-card border-2 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] relative">
        
        {/* Step 1: Calculator */}
        {step === 1 && (
          <div className="p-6 md:p-10 animate-in slide-in-from-right-4 duration-300">
            
            {/* Currency & Amount Grid */}
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center mb-10 pb-10 border-b-2 border-foreground/10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">You Send</label>
                <div className="flex border-2 border-foreground focus-within:ring-2 ring-primary">
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); setError(null) }}
                    className="w-full bg-transparent p-2 font-mono text-lg font-black outline-none"
                  />
                  <select 
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="bg-muted border-l-2 border-foreground p-2 font-black uppercase outline-none text-sm"
                  >
                    {fromCurrencies.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="hidden md:flex w-10 h-10 bg-foreground text-background items-center justify-center rounded-full mt-6">
                <ArrowRight className="w-5 h-5" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Recipient Gets</label>
                <div className="flex border-2 border-foreground bg-muted">
                  <div className="w-full p-4 font-mono text-3xl font-black text-foreground/70 flex items-center">
                    {recipientReceives.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <select 
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="bg-transparent border-l-2 border-foreground p-4 font-black uppercase outline-none cursor-pointer hover:bg-background"
                  >
                    {toCurrencies.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Methods Selection */}
            {activeCorridor ? (
              <>
                <div className="mb-10 pb-10 border-b-2 border-foreground/10">
                  <h3 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs">1</span>
                    How will you send the money?
                  </h3>
                  {renderMethodGroup(availableSendMethods, preferredSendMethodId, setPreferredSendMethodId)}
                </div>

                <div className="mb-10 pb-10 border-b-2 border-foreground/10">
                  <h3 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs">2</span>
                    How should the recipient receive it?
                  </h3>
                  {renderMethodGroup(availableReceiveMethods, preferredReceiveMethodId, setPreferredReceiveMethodId)}
                </div>

                {/* Rate & Submit */}
                <div className="bg-muted p-6 border-2 border-foreground mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Official Converto Rate</div>
                    <div className="font-mono font-black text-lg text-emerald-600">
                      1 {fromCurrency} = {Number(effectiveCustomRate).toFixed(4)} {toCurrency}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="negotiate"
                      checked={isNegotiating}
                      onChange={(e) => {
                        setIsNegotiating(e.target.checked)
                        if (e.target.checked && activeCorridor) {
                          setRequestedRate(Number(effectiveCustomRate).toFixed(4))
                        }
                      }}
                      className="w-4 h-4 accent-indigo-600 border-2 border-foreground cursor-pointer"
                    />
                    <label htmlFor="negotiate" className="text-xs font-bold cursor-pointer hover:underline">
                      Request Better Rate
                    </label>
                  </div>
                </div>

                {isNegotiating && (
                  <div className="mb-8 p-6 border-2 border-indigo-400 bg-indigo-50 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Your Preferred Rate</label>
                        <div className="flex border-2 border-indigo-500 focus-within:ring-2 ring-indigo-400 bg-white">
                          <div className="bg-indigo-500 text-white p-3 font-black text-xs flex items-center">1 {fromCurrency} =</div>
                          <input
                            type="number"
                            step="0.0001"
                            value={requestedRate}
                            onChange={(e) => setRequestedRate(e.target.value)}
                            className="w-full bg-transparent p-3 font-mono text-lg font-black outline-none"
                            placeholder={Number(effectiveCustomRate).toFixed(4)}
                          />
                          <div className="bg-indigo-100 text-indigo-800 p-3 font-black text-xs flex items-center">{toCurrency}</div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Why are you requesting a better rate?</label>
                        <div className="flex border-2 border-indigo-500/50 focus-within:ring-2 ring-indigo-400 bg-white h-[calc(100%-1.75rem)]">
                          <select
                            value={requestNote}
                            onChange={(e) => setRequestNote(e.target.value)}
                            className="w-full bg-transparent px-3 py-2 font-bold text-sm outline-none"
                          >
                            <option value="">Select a reason (Optional)</option>
                            <option value="Large Transfer Amount">Large Transfer Amount</option>
                            <option value="Another Agent Offered a Better Rate">Another Agent Offered a Better Rate</option>
                            <option value="I'm a Regular Customer">I&apos;m a Regular Customer</option>
                            <option value="Urgent Transfer">Urgent Transfer</option>
                            <option value="Long-Term Business Partnership">Long-Term Business Partnership</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 font-bold text-sm mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}

                <button 
                  onClick={handleNext}
                  disabled={!canProceedStep1}
                  className="w-full bg-primary text-primary-foreground font-black uppercase tracking-widest py-5 border-2 border-transparent hover:border-foreground hover:bg-background hover:text-foreground transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none text-lg"
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="bg-amber-50 border-2 border-amber-400 text-amber-800 p-6 font-bold flex flex-col items-center justify-center gap-2 text-center my-10">
                <AlertTriangle className="w-8 h-8 opacity-80 mb-2" />
                <p className="text-lg">This transfer corridor is not currently active.</p>
                <p className="opacity-70 font-normal">We do not support transfers from {fromCurrency} to {toCurrency} at this time.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Payout Details */}
        {step === 2 && (
          <div className="p-6 md:p-10 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-black uppercase tracking-widest border-b-4 border-foreground pb-4 mb-8">
              Recipient Details — {preferredReceiveMethod?.name}
            </h2>
            
            <div className="space-y-4 mb-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Recipient Name</label>
                <input 
                  type="text"
                  value={payoutDetails.accountName}
                  onChange={(e) => setPayoutDetails({...payoutDetails, accountName: e.target.value})}
                  className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary"
                  placeholder="Full name as on account"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Bank / Wallet Name</label>
                  <input 
                    type="text"
                    value={payoutDetails.bankName}
                    onChange={(e) => setPayoutDetails({...payoutDetails, bankName: e.target.value})}
                    className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary"
                    placeholder="e.g., State Bank of India, bKash"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    Account Number / ID
                  </label>
                  <input 
                    type="text"
                    value={payoutDetails.accountNumber}
                    onChange={(e) => setPayoutDetails({...payoutDetails, accountNumber: e.target.value})}
                    className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary"
                    placeholder="Account number or ID"
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
                disabled={!payoutDetails.accountName || !payoutDetails.accountNumber}
                className="w-2/3 bg-primary text-primary-foreground font-black uppercase tracking-widest py-5 border-2 border-transparent hover:border-foreground hover:bg-background hover:text-foreground transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Review Order <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && activeCorridor && (
          <div className="p-6 md:p-10 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-black uppercase tracking-widest border-b-4 border-foreground pb-4 mb-8">Review & Submit</h2>
            
            {error && (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 font-bold text-sm mb-6 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* Left: Amounts */}
              <div className="space-y-4">
                {isNegotiating && (
                  <div className="bg-indigo-100 border-2 border-indigo-500 p-4 flex items-center gap-3 shadow-[4px_4px_0px_#6366f1]">
                    <MessageSquare className="w-6 h-6 text-indigo-700 shrink-0" />
                    <div>
                      <div className="font-black uppercase tracking-widest text-xs text-indigo-800">Rate Request Pending</div>
                      <div className="text-[11px] font-bold text-indigo-700 mt-0.5">Your request will be reviewed by admin before the order is processed.</div>
                    </div>
                  </div>
                )}
                
                <div className="bg-[#00E5FF] p-6 border-2 border-foreground shadow-[4px_4px_0px_var(--color-foreground)]">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-2">Total You Send</span>
                  <div className="font-mono text-3xl font-black">{totalToPay.toLocaleString(undefined, { minimumFractionDigits: 2 })} {fromCurrency}</div>
                  <div className="text-xs font-bold mt-2">Includes {fee.total.toLocaleString(undefined, { minimumFractionDigits: 2 })} {fromCurrency} fee</div>
                </div>
                
                <div className="bg-[#00FF66] p-6 border-2 border-foreground shadow-[4px_4px_0px_var(--color-foreground)]">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-2">
                    Recipient Gets
                  </span>
                  <div className="font-mono text-3xl font-black">{recipientReceives.toLocaleString(undefined, { minimumFractionDigits: 2 })} {toCurrency}</div>
                  <div className="text-xs font-bold mt-2">
                    Converto Rate: {Number(effectiveCustomRate).toFixed(4)}
                  </div>
                </div>
              </div>

              {/* Right: Details */}
              <div className="border-2 border-foreground p-6 bg-card space-y-4">
                <h3 className="font-black uppercase tracking-widest text-sm border-b-2 border-foreground/20 pb-2">Transfer Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">You Pay Via</span>
                    <p className="font-bold">{preferredSendMethod?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">They Receive Via</span>
                    <p className="font-bold">{preferredReceiveMethod?.name}</p>
                  </div>
                </div>
                
                <div className="space-y-1 mt-4">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Recipient</span>
                  <p className="font-bold">{payoutDetails.accountName || '—'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Bank/Wallet</span>
                    <p className="font-bold">{payoutDetails.bankName || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Account/ID</span>
                    <p className="font-bold font-mono">{payoutDetails.accountNumber || '—'}</p>
                  </div>
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
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <>Confirm Transfer <CheckCircle2 className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
