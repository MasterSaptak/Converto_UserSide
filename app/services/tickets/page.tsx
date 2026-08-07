/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Ticket, ArrowRight, ArrowLeft, Loader2, Plane, Hotel, Bus, CalendarDays, Users, Train, Info } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { submitServiceRequest } from '@/hooks/useServiceRequests'
import { searchStations } from 'indian-railway-station-codes'
import { searchTrains } from '@/lib/trains'

type TicketType = 'flight' | 'hotel' | 'bus' | 'event' | 'train'
type Category = 'travel' | 'hotel' | 'event'

const BrutalDatePicker = ({ value, onChange, placeholder = 'dd/mm/yy' }: { value: string, onChange: (val: string) => void, placeholder?: string }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return placeholder;
    try {
      const [y, m, d] = dateStr.split('-');
      if (y && m && d) return `${d}/${m}/${y.slice(2)}`;
      return placeholder;
    } catch {
      return placeholder;
    }
  }

  return (
    <div 
      className="relative w-full group focus-within:ring-2 ring-primary bg-white cursor-pointer"
      onClick={() => {
        try {
          if ('showPicker' in HTMLInputElement.prototype) {
            inputRef.current?.showPicker()
          } else {
            inputRef.current?.focus()
          }
        } catch (e) {
          inputRef.current?.focus()
        }
      }}
    >
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="w-full p-4 border-2 border-black font-bold flex items-center justify-between">
        <span className={value ? 'text-black' : 'text-gray-400 font-normal tracking-widest'}>
          {formatDateDisplay(value)}
        </span>
        <CalendarDays className="w-5 h-5 opacity-60" />
      </div>
    </div>
  )
}

function TicketBookingForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlType = searchParams.get('type')
  const initialType = (urlType as TicketType) || 'flight'
  const hasTypeParam = !!urlType

  const initialCategory: Category =
    initialType === 'hotel' ? 'hotel' :
      initialType === 'event' ? 'event' : 'travel'

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedPassengers, setSavedPassengers] = useState<any[]>([])
  const [fromQuery, setFromQuery] = useState('')
  const [toQuery, setToQuery] = useState('')
  const [trainQuery, setTrainQuery] = useState('')
  const [fromOpen, setFromOpen] = useState(false)
  const [toOpen, setToOpen] = useState(false)
  const [trainOpen, setTrainOpen] = useState(false)
  const fromRef = useRef<HTMLDivElement>(null)
  const toRef = useRef<HTMLDivElement>(null)
  const trainRef = useRef<HTMLDivElement>(null)

  const [category, setCategory] = useState<Category>(initialCategory)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.saved_passengers) {
        setSavedPassengers(user.user_metadata.saved_passengers)
      }
    }
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [formData, setFormData] = useState({
    ticketType: initialType,
    departureCity: '',
    destinationCity: '',
    travelStartDate: '',
    travelStartDateTo: '',
    travelEndDate: '',
    travelEndDateTo: '',
    eventName: '',
    coachClass: '',
    trainChoice: '',
    budget: '',
    specialRequests: '',
    passengers: [
      { firstName: '', lastName: '', passportOrIdNumber: '', dob: '', nationality: 'Indian', nidOrAadhar: '', mealPreference: false, mealType: '', seatPreference: '' }
    ]
  })

  // Close autocomplete dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) setFromOpen(false)
      if (toRef.current && !toRef.current.contains(e.target as Node)) setToOpen(false)
      if (trainRef.current && !trainRef.current.contains(e.target as Node)) setTrainOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Memoized station search results
  const fromMatches = useMemo(() => fromQuery.length >= 1 ? searchStations(fromQuery).slice(0, 30) : [], [fromQuery])
  const toMatches = useMemo(() => toQuery.length >= 1 ? searchStations(toQuery).slice(0, 30) : [], [toQuery])
  const trainMatches = useMemo(() => trainQuery.length >= 1 ? searchTrains(trainQuery).slice(0, 20) : [], [trainQuery])

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updatePassenger = (index: number, field: string, value: string | boolean) => {
    setFormData(prev => {
      const newPassengers = [...prev.passengers]
      newPassengers[index] = { ...newPassengers[index], [field]: value }
      return { ...prev, passengers: newPassengers }
    })
  }

  const loadSavedPassenger = (index: number, savedPassengerIndex: string) => {
    if (savedPassengerIndex === "") return;
    const p = savedPassengers[parseInt(savedPassengerIndex)];
    if (p) {
      setFormData(prev => {
        const newPassengers = [...prev.passengers]
        newPassengers[index] = {
          ...newPassengers[index],
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          passportOrIdNumber: p.passportOrIdNumber || '',
          dob: p.dob || '',
          nationality: p.nationality || '',
          nidOrAadhar: p.nidOrAadhar || '',
          mealPreference: p.mealPreference || false,
          mealType: p.mealType || ''
        }
        return { ...prev, passengers: newPassengers }
      })
    }
  }

  const addPassenger = () => {
    setFormData(prev => ({
      ...prev,
      passengers: [...prev.passengers, { firstName: '', lastName: '', passportOrIdNumber: '', dob: '', nationality: 'Indian', nidOrAadhar: '', mealPreference: false, mealType: '', seatPreference: '' }]
    }))
  }

  const removePassenger = (index: number) => {
    if (formData.passengers.length === 1) return;
    setFormData(prev => {
      const newPassengers = [...prev.passengers]
      newPassengers.splice(index, 1)
      return { ...prev, passengers: newPassengers }
    })
  }

  const handleNext = () => setStep(s => s + 1)
  const handlePrev = () => setStep(s => s - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Save passengers to user_metadata automatically
      const passengersToSave = formData.passengers
      if (passengersToSave.length > 0) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const newSaved = [...savedPassengers]

          passengersToSave.forEach(pData => {
            if (!newSaved.some(s => s.firstName === pData.firstName && s.lastName === pData.lastName && s.dob === pData.dob)) {
              newSaved.push(pData)
            }
          })

          await supabase.auth.updateUser({
            data: { saved_passengers: newSaved }
          })
          setSavedPassengers(newSaved)
        }
      }

      // 2. Submit via SDK
      const { error: submitError } = await submitServiceRequest({
        serviceSlug: 'tickets',
        metadata: formData,
        amount: 0,
        currency: 'USD',
        notes: `Ticket Booking: ${formData.ticketType} to ${formData.destinationCity}`
      })

      if (submitError) throw new Error(submitError)

      router.push('/?service=ticket_booking&status=success')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 animate-in fade-in duration-500 [&_button]:cursor-pointer">

      <div className="mb-10 text-center">
        <div className="inline-flex w-16 h-16 border-2 border-foreground bg-primary items-center justify-center mb-6 shadow-[4px_4px_0px_var(--color-foreground)]">
          <Ticket className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          {formData.ticketType} Booking
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">
          {formData.ticketType === 'train' ? 'Railway Tickets' :
            formData.ticketType === 'flight' ? 'Domestic & International Flights' :
              formData.ticketType === 'bus' ? 'Intercity Bus Travel' :
                formData.ticketType === 'hotel' ? 'Book your perfect stay' :
                  formData.ticketType === 'event' ? 'Secure passes to major events' : 'Flights, Hotels, Events & More'}
        </p>
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

        {/* STEP 1: Ticket Type & Details */}
        <div className={step === 1 ? 'block' : 'hidden'}>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6">1. Travel Details</h2>

          <div className="space-y-6">
            {!hasTypeParam && (
              <>
                <div className="flex gap-2 mb-6">
                  {[
                    { id: 'travel', label: 'Travel', icon: Plane },
                    { id: 'hotel', label: 'Hotel', icon: Hotel },
                    { id: 'event', label: 'Event', icon: CalendarDays }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategory(cat.id as Category)
                        if (cat.id === 'travel') updateForm('ticketType', 'flight')
                        else if (cat.id === 'hotel') updateForm('ticketType', 'hotel')
                        else if (cat.id === 'event') updateForm('ticketType', 'event')
                      }}
                      className={`flex-1 p-3 border-2 flex items-center justify-center gap-2 transition-all ${category === cat.id
                        ? 'border-black bg-primary text-primary-foreground shadow-[4px_4px_0px_var(--color-foreground)] -translate-y-1'
                        : 'border-black/20 bg-slate-50 opacity-60 hover:opacity-100 hover:border-black'
                        }`}
                    >
                      <cat.icon className="w-5 h-5 hidden sm:block" />
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">{cat.label}</span>
                    </button>
                  ))}
                </div>

                {category === 'travel' && (
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { id: 'flight', label: 'Flight', icon: Plane },
                      { id: 'train', label: 'Train', icon: Train },
                      { id: 'bus', label: 'Bus', icon: Bus }
                    ].map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => updateForm('ticketType', type.id)}
                        className={`p-4 border-2 flex flex-col items-center justify-center gap-2 transition-all ${formData.ticketType === type.id
                          ? 'border-black bg-black text-white shadow-[4px_4px_0px_var(--color-primary)] -translate-y-1'
                          : 'border-black/20 bg-slate-50 opacity-60 hover:opacity-100 hover:border-black'
                          }`}
                      >
                        <type.icon className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {formData.ticketType === 'event' ? (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Event Name / Link</label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => updateForm('eventName', e.target.value)}
                  placeholder="E.g., Tomorrowland 2026 or link to event"
                  className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                />
              </div>
            ) : formData.ticketType === 'train' ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* FROM STATION AUTOCOMPLETE */}
                  <div className="space-y-2" ref={fromRef}>
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">From Station</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={fromQuery}
                        onChange={(e) => { setFromQuery(e.target.value); updateForm('departureCity', e.target.value); setFromOpen(true) }}
                        onFocus={() => setFromOpen(true)}
                        placeholder="Type station name or code..."
                        className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                      />
                      {fromOpen && fromMatches.length > 0 && (
                        <ul className="absolute z-50 top-full left-0 right-0 bg-white border-2 border-black shadow-[4px_4px_0px_#000] max-h-52 overflow-y-auto">
                          {fromMatches.map((s) => (
                            <li
                              key={s.code}
                              onMouseDown={() => { const v = `${s.code} - ${s.name}`; updateForm('departureCity', v); setFromQuery(v); setFromOpen(false) }}
                              className="p-3 font-bold text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground border-b border-black/10 last:border-0"
                            >
                              <span className="font-black text-primary">{s.code}</span> — {s.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  {/* TO STATION AUTOCOMPLETE */}
                  <div className="space-y-2" ref={toRef}>
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">To Station</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={toQuery}
                        onChange={(e) => { setToQuery(e.target.value); updateForm('destinationCity', e.target.value); setToOpen(true) }}
                        onFocus={() => setToOpen(true)}
                        placeholder="Type station name or code..."
                        className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                      />
                      {toOpen && toMatches.length > 0 && (
                        <ul className="absolute z-50 top-full left-0 right-0 bg-white border-2 border-black shadow-[4px_4px_0px_#000] max-h-52 overflow-y-auto">
                          {toMatches.map((s) => (
                            <li
                              key={s.code}
                              onMouseDown={() => { const v = `${s.code} - ${s.name}`; updateForm('destinationCity', v); setToQuery(v); setToOpen(false) }}
                              className="p-3 font-bold text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground border-b border-black/10 last:border-0"
                            >
                              <span className="font-black text-primary">{s.code}</span> — {s.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* TRAIN CHOICE AUTOCOMPLETE - Moved above Coach/Seat */}
                <div className="space-y-2" ref={trainRef}>
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Train Choice Preference (Name / Number)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={trainQuery}
                      onChange={(e) => { setTrainQuery(e.target.value); updateForm('trainChoice', e.target.value); setTrainOpen(true) }}
                      onFocus={() => setTrainOpen(true)}
                      placeholder="Type train name or number..."
                      className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                    />
                    {trainOpen && trainMatches.length > 0 && (
                      <ul className="absolute z-50 top-full left-0 right-0 bg-white border-2 border-black shadow-[4px_4px_0px_#000] max-h-52 overflow-y-auto">
                        {trainMatches.map((t) => (
                          <li
                            key={`${t.number}-${t.name}`}
                            onMouseDown={() => { const v = `${t.number} - ${t.name}`; updateForm('trainChoice', v); setTrainQuery(v); setTrainOpen(false) }}
                            className="p-3 font-bold text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground border-b border-black/10 last:border-0"
                          >
                            <span className="font-black text-primary">{t.number}</span> — {t.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Coach Class</label>
                    <select
                      value={formData.coachClass}
                      onChange={(e) => updateForm('coachClass', e.target.value)}
                      className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none bg-white cursor-pointer"
                    >
                      <option value="">Select Coach Class</option>
                      <option value="1A - First AC">1A - First AC</option>
                      <option value="2A - Second AC">2A - Second AC</option>
                      <option value="3A - Third AC">3A - Third AC</option>
                      <option value="3E - Third AC Economy">3E - Third AC Economy</option>
                      <option value="SL - Sleeper">SL - Sleeper</option>
                      <option value="CC - Chair Car">CC - Chair Car</option>
                      <option value="EC - Executive Chair Car">EC - Executive Chair Car</option>
                      <option value="2S - Second Seating">2S - Second Seating</option>
                      <option value="GN - General">GN - General</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {formData.ticketType !== 'hotel' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">From (City/Airport)</label>
                    <input
                      type="text"
                      value={formData.departureCity}
                      onChange={(e) => updateForm('departureCity', e.target.value)}
                      placeholder="E.g., New York (JFK)"
                      className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">To (City/Airport/Hotel)</label>
                  <input
                    type="text"
                    value={formData.destinationCity}
                    onChange={(e) => updateForm('destinationCity', e.target.value)}
                    placeholder="E.g., London (LHR)"
                    className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                  />
                </div>
              </div>
            )}

            {formData.ticketType === 'train' ? (
              <div className="space-y-4">
                {/* Info tooltip */}
                <div className="flex items-start gap-2 p-3 bg-blue-50 border-2 border-blue-300">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-800 leading-relaxed">
                    Train tickets on your preferred date may be waitlisted. Providing a flexible date range helps us book the earliest confirmed ticket for you.
                  </p>
                </div>
                {/* Departure Range */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Departure Date Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">From</span>
                      <BrutalDatePicker
                        value={formData.travelStartDate}
                        onChange={(val) => updateForm('travelStartDate', val)}
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">To</span>
                      <BrutalDatePicker
                        value={formData.travelStartDateTo}
                        onChange={(val) => updateForm('travelStartDateTo', val)}
                      />
                    </div>
                  </div>
                </div>
                {/* Return Range */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Return Date Range (Optional)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">From</span>
                      <BrutalDatePicker
                        value={formData.travelEndDate}
                        onChange={(val) => updateForm('travelEndDate', val)}
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">To</span>
                      <BrutalDatePicker
                        value={formData.travelEndDateTo}
                        onChange={(val) => updateForm('travelEndDateTo', val)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Departure / Check-in</label>
                  <BrutalDatePicker
                    value={formData.travelStartDate}
                    onChange={(val) => updateForm('travelStartDate', val)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Return / Check-out (Optional)</label>
                  <BrutalDatePicker
                    value={formData.travelEndDate}
                    onChange={(val) => updateForm('travelEndDate', val)}
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="w-full brutal-button bg-black text-white flex items-center justify-center gap-2"
            >
              Next Step <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEP 2: Passengers */}
        <div className={step === 2 ? 'block' : 'hidden'}>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-black uppercase tracking-tight">2. Passenger Details</h2>
          </div>

          <div className="space-y-8 mb-6">
            {formData.passengers.map((passenger, index) => (
              <div key={index} className="bg-slate-50 border-2 border-black p-4 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary border-2 border-black text-primary-foreground font-black flex items-center justify-center">
                  {index + 1}
                </div>

                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removePassenger(index)}
                    className="absolute -top-3 -right-3 px-2 py-1 bg-red-500 border-2 border-black text-white text-[10px] font-black uppercase"
                  >
                    Remove
                  </button>
                )}

                {savedPassengers.length > 0 && (
                  <div className="mb-6 mt-4 p-4 border-2 border-dashed border-primary bg-primary/5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Quick Fill from Saved Passengers</label>
                    <select
                      className="w-full p-2 border-2 border-black font-bold outline-none cursor-pointer"
                      onChange={(e) => loadSavedPassenger(index, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Select a saved passenger...</option>
                      {savedPassengers.map((p, pIdx) => (
                        <option key={pIdx} value={pIdx}>
                          {p.firstName} {p.lastName} {p.passportOrIdNumber ? `(${p.passportOrIdNumber})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">First Name</label>
                    <input
                      type="text"
                      value={passenger.firstName}
                      onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                      required
                      className="w-full p-3 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Last Name</label>
                    <input
                      type="text"
                      value={passenger.lastName}
                      onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                      required
                      className="w-full p-3 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Nationality</label>
                    <select
                      value={passenger.nationality}
                      onChange={(e) => {
                        updatePassenger(index, 'nationality', e.target.value)
                        // Clear the ID field when switching
                        updatePassenger(index, 'passportOrIdNumber', '')
                        updatePassenger(index, 'nidOrAadhar', '')
                      }}
                      required
                      className="w-full p-3 border-2 border-black font-bold focus:ring-2 ring-primary outline-none bg-white cursor-pointer"
                    >
                      <option value="Indian">Indian</option>
                      <option value="Foreigner">Foreigner</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Date of Birth</label>
                    <BrutalDatePicker
                      value={passenger.dob}
                      onChange={(val) => updatePassenger(index, 'dob', val)}
                    />
                  </div>

                  {passenger.nationality === 'Indian' ? (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Aadhar Number</label>
                      <input
                        type="text"
                        value={passenger.nidOrAadhar}
                        onChange={(e) => updatePassenger(index, 'nidOrAadhar', e.target.value)}
                        placeholder="Enter 12-digit Aadhar number"
                        required
                        maxLength={12}
                        className="w-full p-3 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Passport Number</label>
                      <input
                        type="text"
                        value={passenger.passportOrIdNumber}
                        onChange={(e) => updatePassenger(index, 'passportOrIdNumber', e.target.value)}
                        placeholder="Enter passport number"
                        required
                        className="w-full p-3 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                      />
                    </div>
                  )}

                  {formData.ticketType === 'train' && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Seat/Berth Preference</label>
                      <select
                        value={passenger.seatPreference || ''}
                        onChange={(e) => updatePassenger(index, 'seatPreference', e.target.value)}
                        className="w-full p-3 border-2 border-black font-bold focus:ring-2 ring-primary outline-none bg-white cursor-pointer"
                      >
                        <option value="">No Preference</option>
                        <option value="Lower Berth">Lower Berth</option>
                        <option value="Middle Berth">Middle Berth</option>
                        <option value="Upper Berth">Upper Berth</option>
                        <option value="Side Lower">Side Lower</option>
                        <option value="Side Upper">Side Upper</option>
                        <option value="Window Seat">Window Seat</option>
                        <option value="Aisle Seat">Aisle Seat</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-2 md:col-span-2 bg-white p-4 border-2 border-black">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={passenger.mealPreference}
                        onChange={(e) => {
                          updatePassenger(index, 'mealPreference', e.target.checked);
                          if (!e.target.checked) updatePassenger(index, 'mealType', '');
                        }}
                        className="w-5 h-5 accent-primary"
                      />
                      <span className="text-sm font-bold">Meal Preference Required?</span>
                    </label>

                    {passenger.mealPreference && (
                      <div className="mt-4 flex gap-4 pl-7">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`mealType-${index}`}
                            checked={passenger.mealType === 'veg'}
                            onChange={() => updatePassenger(index, 'mealType', 'veg')}
                            className="w-4 h-4 accent-primary"
                          />
                          <span className="text-sm font-bold">Veg</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`mealType-${index}`}
                            checked={passenger.mealType === 'nonveg'}
                            onChange={() => updatePassenger(index, 'mealType', 'nonveg')}
                            className="w-4 h-4 accent-primary"
                          />
                          <span className="text-sm font-bold">Non-Veg</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addPassenger}
              className="w-full p-4 border-2 border-dashed border-black hover:bg-slate-100 transition-colors font-black uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" /> Add Another Passenger
            </button>
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
              Review & Submit <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEP 3: Review */}
        <div className={step === 3 ? 'block' : 'hidden'}>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6">3. Special Requests</h2>

          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Intended Budget</label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => updateForm('budget', e.target.value)}
                placeholder="E.g., ₹5000, $200, or Flexible"
                className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Any preferences or special instructions?</label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => updateForm('specialRequests', e.target.value)}
                placeholder="E.g., Window seat preferred, vegetarian meal, ground floor hotel room..."
                rows={4}
                className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none resize-none"
              />
            </div>
          </div>

          <div className="bg-primary/10 border-2 border-primary p-4 mb-6">
            <h4 className="font-black uppercase tracking-widest text-xs mb-2">Next Steps</h4>
            <p className="text-sm font-bold opacity-80">
              Once submitted, our team will source the best options and generate a final price quote. You&apos;ll be notified when the quote is ready for your approval and payment.
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

export default function TicketBookingPage() {
  return (
    <Suspense fallback={<div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <TicketBookingForm />
    </Suspense>
  )
}
