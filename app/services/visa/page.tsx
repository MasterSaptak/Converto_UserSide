'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitServiceRequest } from '@/hooks/useServiceRequests';
import { Loader2 } from 'lucide-react';

export default function VisaApplicationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    destinationCountry: '',
    visaType: 'Tourist',
    travelPurpose: '',
    expectedTravelDate: '',
    passportNumber: '',
    passportExpiryDate: '',
    notes: ''
  });

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: submitError } = await submitServiceRequest({
        serviceSlug: 'visa',
        metadata: {
          destination_country: formData.destinationCountry,
          visa_type: formData.visaType,
          travel_purpose: formData.travelPurpose,
          expected_travel_date: formData.expectedTravelDate,
          passport_number: formData.passportNumber,
          passport_expiry_date: formData.passportExpiryDate,
        },
        amount: 0,
        currency: 'USD',
        notes: formData.notes || `Visa Application for ${formData.destinationCountry}`
      });

      if (submitError || !data) {
        throw new Error(submitError || 'Failed to submit request');
      }

      router.push('/track');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-8 md:gap-10 animate-in fade-in duration-500 pb-10">
      <header className="border-b-2 border-foreground pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2 block">Services</span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">Visa Applications</h1>
      </header>
      
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Form */}
        <div className="flex flex-col gap-6">
          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 font-bold text-sm">
              {error}
            </div>
          )}
          <div className="border-2 border-foreground bg-white p-6">
            <h2 className="font-bold uppercase tracking-widest text-sm mb-6 border-b-2 border-foreground pb-2">Travel Details</h2>
            
            <div className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Destination Country</label>
                  <input type="text" value={formData.destinationCountry} onChange={(e) => updateForm('destinationCountry', e.target.value)} required placeholder="e.g. United Kingdom" className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Visa Type</label>
                  <select value={formData.visaType} onChange={(e) => updateForm('visaType', e.target.value)} className="border-2 border-foreground p-3 min-h-[48px] bg-secondary text-sm font-bold uppercase outline-none focus:border-primary w-full">
                    <option value="Tourist">Tourist</option>
                    <option value="Business">Business</option>
                    <option value="Student">Student</option>
                    <option value="Work">Work</option>
                    <option value="Transit">Transit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Expected Travel Date</label>
                  <input type="date" value={formData.expectedTravelDate} onChange={(e) => updateForm('expectedTravelDate', e.target.value)} required className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Travel Purpose (Optional)</label>
                  <input type="text" value={formData.travelPurpose} onChange={(e) => updateForm('travelPurpose', e.target.value)} placeholder="Vacation, Conference, etc." className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary w-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-2 border-foreground bg-white p-6">
            <h2 className="font-bold uppercase tracking-widest text-sm mb-6 border-b-2 border-foreground pb-2">Applicant Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Passport Number</label>
                <input type="text" value={formData.passportNumber} onChange={(e) => updateForm('passportNumber', e.target.value)} required placeholder="Passport No" className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary font-mono w-full" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Passport Expiry Date</label>
                <input type="date" value={formData.passportExpiryDate} onChange={(e) => updateForm('passportExpiryDate', e.target.value)} required className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary font-mono w-full" />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Additional Notes</label>
              <textarea rows={2} value={formData.notes} onChange={(e) => updateForm('notes', e.target.value)} placeholder="Any special instructions..." className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="border-2 border-foreground bg-primary text-primary-foreground p-6 sticky top-24">
            <h2 className="font-bold uppercase tracking-widest text-sm mb-6 border-b-2 border-white/20 pb-2">Application Summary</h2>
            
            <div className="flex flex-col gap-4 text-xs font-bold uppercase mb-8">
               <p className="opacity-80">1. We will review your application requirements based on the destination.</p>
               <p className="opacity-80">2. A list of required documents will be generated for you to upload.</p>
               <p className="opacity-80">3. We will handle the embassy booking and processing on your behalf.</p>
            </div>

            <button type="submit" disabled={loading} className="w-full border-2 border-foreground bg-white text-foreground p-4 font-bold uppercase tracking-widest text-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit Application'}
            </button>
          </div>
        </div>

      </div>
    </form>
  );
}
