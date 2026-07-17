/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Ticket, ArrowRight, ArrowLeft, Loader2, Plane, Hotel, Bus, CalendarDays, Users } from 'lucide-react'

type TicketType = 'flight' | 'hotel' | 'bus' | 'event'

export default function TicketBookingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    ticketType: 'flight' as TicketType,
    departureCity: '',
    destinationCity: '',
    travelStartDate: '',
    travelEndDate: '',
    eventName: '',
    specialRequests: '',
    passengers: [
      { firstName: '', lastName: '', passportOrIdNumber: '', dob: '' }
    ]
  })

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updatePassenger = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newPassengers = [...prev.passengers]
      newPassengers[index] = { ...newPassengers[index], [field]: value }
      return { ...prev, passengers: newPassengers }
    })
  }

  const addPassenger = () => {
    setFormData(prev => ({
      ...prev,
      passengers: [...prev.passengers, { firstName: '', lastName: '', passportOrIdNumber: '', dob: '' }]
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
      // Send to Server App API
      const res = await fetch('http://localhost:3000/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit request')
      }

      router.push('/dashboard?service=ticket_booking&status=success')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 animate-in fade-in duration-500">
      
      <div className="mb-10 text-center">
        <div className="inline-flex w-16 h-16 border-2 border-foreground bg-primary items-center justify-center mb-6 shadow-[4px_4px_0px_var(--color-foreground)]">
          <Ticket className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter">Ticket Booking</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">Flights, Hotels, Events & More</p>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { id: 'flight', label: 'Flight', icon: Plane },
                { id: 'hotel', label: 'Hotel', icon: Hotel },
                { id: 'bus', label: 'Bus', icon: Bus },
                { id: 'event', label: 'Event', icon: CalendarDays }
              ].map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => updateForm('ticketType', type.id)}
                  className={`p-4 border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                    formData.ticketType === type.id 
                      ? 'border-black bg-primary text-primary-foreground shadow-[4px_4px_0px_var(--color-foreground)] -translate-y-1' 
                      : 'border-black/20 bg-slate-50 opacity-60 hover:opacity-100 hover:border-black'
                  }`}
                >
                  <type.icon className="w-6 h-6" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                </button>
              ))}
            </div>

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

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Departure / Check-in</label>
                <input 
                  type="date"
                  value={formData.travelStartDate}
                  onChange={(e) => updateForm('travelStartDate', e.target.value)}
                  className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Return / Check-out (Optional)</label>
                <input 
                  type="date"
                  value={formData.travelEndDate}
                  onChange={(e) => updateForm('travelEndDate', e.target.value)}
                  className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                />
              </div>
            </div>
            
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
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6">2. Passenger Details</h2>
          
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
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Passport / ID Number</label>
                    <input 
                      type="text"
                      value={passenger.passportOrIdNumber}
                      onChange={(e) => updatePassenger(index, 'passportOrIdNumber', e.target.value)}
                      className="w-full p-3 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Date of Birth</label>
                    <input 
                      type="date"
                      value={passenger.dob}
                      onChange={(e) => updatePassenger(index, 'dob', e.target.value)}
                      className="w-full p-3 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                    />
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
