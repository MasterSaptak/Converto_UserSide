'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { submitServiceRequest } from '@/hooks/useServiceRequests';
import { supabase } from '@/lib/supabase';
import { Loader2, UploadCloud, CheckCircle2 } from 'lucide-react';

export default function EducationPaymentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isOtherCountry, setIsOtherCountry] = useState(false);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    institution: '',
    country: 'UK',
    studentName: '',
    studentId: '',
    passportNumber: '',
    visaNumber: '',
    paymentPurpose: 'Tuition Fee',
    currency: 'BDT - Bangladeshi Taka',
    amount: '',
    deadline: '',
    notes: '',
    document_url: ''
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
        serviceSlug: 'education',
        metadata: {
          institution: formData.institution,
          country: formData.country,
          student_name: formData.studentName,
          student_id: formData.studentId,
          passport_number: formData.passportNumber,
          visa_number: formData.visaNumber,
          payment_type: formData.paymentPurpose,
          currency: formData.currency,
          deadline: formData.deadline,
          notes: formData.notes,
          document_url: formData.document_url
        },
        amount: parseFloat(formData.amount) || 0,
        currency: formData.currency.split(' ')[0], // Extracts USD, GBP, BDT, etc.
        notes: formData.notes || `Education Payment for ${formData.institution}`
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
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">Education Payments</h1>
      </header>
      
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Form */}
        <div className="flex flex-col gap-6">
          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 font-bold text-sm">
              {error}
            </div>
          )}

          {formData.document_url && (
            <div className="bg-green-100 border-2 border-green-500 text-green-800 p-4 font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Image successfully uploaded!
            </div>
          )}
          <div className="border-2 border-foreground bg-white p-6">
            <h2 className="font-bold uppercase tracking-widest text-sm mb-6 border-b-2 border-foreground pb-2">Student & Institution Details</h2>
            
            <div className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">University / Institution</label>
                  <input type="text" value={formData.institution} onChange={(e) => updateForm('institution', e.target.value)} required placeholder="Institution Name" className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Country</label>
                  <select 
                    value={isOtherCountry ? 'Other' : formData.country} 
                    onChange={(e) => {
                      if (e.target.value === 'Other') {
                        setIsOtherCountry(true);
                        updateForm('country', '');
                      } else {
                        setIsOtherCountry(false);
                        updateForm('country', e.target.value);
                      }
                    }} 
                    className="border-2 border-foreground p-3 min-h-[48px] bg-secondary text-sm font-bold uppercase outline-none focus:border-primary w-full"
                  >
                    <option value="India">India</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="China">China</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Germany">Germany</option>
                    <option value="Austria">Austria</option>
                    <option value="Italy">Italy</option>
                    <option value="Spain">Spain</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Australia">Australia</option>
                    <option value="Japan">Japan</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Other">Other</option>
                  </select>
                  
                  {isOtherCountry && (
                    <input 
                      type="text" 
                      value={formData.country} 
                      onChange={(e) => updateForm('country', e.target.value)} 
                      required 
                      placeholder="Enter Country Name" 
                      className="border-2 border-foreground p-3 mt-2 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary w-full" 
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Student Name</label>
                  <input type="text" value={formData.studentName} onChange={(e) => updateForm('studentName', e.target.value)} required placeholder="As per passport" className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Student ID / Reference Number</label>
                  <input type="text" value={formData.studentId} onChange={(e) => updateForm('studentId', e.target.value)} required placeholder="ID Number" className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary font-mono w-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Passport Number (Optional)</label>
                  <input type="text" value={formData.passportNumber} onChange={(e) => updateForm('passportNumber', e.target.value)} placeholder="Passport No" className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary font-mono w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Visa Number (Optional)</label>
                  <input type="text" value={formData.visaNumber} onChange={(e) => updateForm('visaNumber', e.target.value)} placeholder="Visa No" className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary font-mono w-full" />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4 border-t-2 border-dashed border-muted mt-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-4">Payment Purpose</label>
                <select value={formData.paymentPurpose} onChange={(e) => updateForm('paymentPurpose', e.target.value)} className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary w-full">
                  <option>Tuition Fee</option>
                  <option>Application Fee</option>
                  <option>Visa Fee / IHS</option>
                  <option>Accommodation Deposit</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Currency</label>
                  <select value={formData.currency} onChange={(e) => updateForm('currency', e.target.value)} className="border-2 border-foreground p-3 min-h-[48px] bg-secondary text-sm font-bold uppercase outline-none focus:border-primary w-full">
                    <option>GBP - British Pound</option>
                    <option>USD - US Dollar</option>
                    <option>EUR - Euro</option>
                    <option>CAD - Canadian Dollar</option>
                    <option>AUD - Australian Dollar</option>
                    <option>BDT - Bangladeshi Taka</option>
                    <option>INR - Indian Rupee</option>
                    <option>CNY - Chinese Yuan</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Amount to Pay</label>
                  <input type="number" step="0.01" value={formData.amount} onChange={(e) => updateForm('amount', e.target.value)} required placeholder="0.00" className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary font-mono w-full" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Payment Deadline (Optional)</label>
                <input type="date" value={formData.deadline} onChange={(e) => updateForm('deadline', e.target.value)} className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary font-mono" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Upload Invoice / Offer Letter (Image Only)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed ${formData.document_url ? 'border-green-500 bg-green-50' : 'border-foreground hover:bg-secondary/50'} p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative overflow-hidden group`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (!file.type.startsWith('image/')) {
                        setError('Please upload a valid image file (JPG, PNG).');
                        return;
                      }

                      setUploading(true);
                      setError(null);

                      try {
                        const fileExt = file.name.split('.').pop();
                        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
                        const filePath = `education_invoices/${fileName}`;

                        const { error: uploadError } = await supabase.storage
                          .from('service_documents')
                          .upload(filePath, file, { cacheControl: '3600', upsert: false });

                        if (uploadError) throw uploadError;

                        const { data: { publicUrl } } = supabase.storage
                          .from('service_documents')
                          .getPublicUrl(filePath);

                        updateForm('document_url', publicUrl);
                      } catch (err) {
                        const message = err instanceof Error ? err.message : 'Failed to upload image. Please ensure the storage bucket is set up.';
                        setError(message);
                      } finally {
                        setUploading(false);
                      }
                    }}
                  />
                  {uploading ? (
                    <div className="flex items-center gap-2 text-sm font-bold uppercase">
                      <Loader2 className="w-5 h-5 animate-spin" /> Uploading...
                    </div>
                  ) : formData.document_url ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-2 text-sm font-bold uppercase text-green-700">
                        <CheckCircle2 className="w-5 h-5" /> Image Attached
                      </div>
                      <a href={formData.document_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="block w-32 h-32 border-2 border-green-500 overflow-hidden hover:opacity-80 transition-opacity">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={formData.document_url} alt="Uploaded Invoice" className="w-full h-full object-cover" />
                      </a>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 mb-2 opacity-60 group-hover:opacity-100 transition-opacity" />
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Click to upload image of the official invoice</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Additional Notes</label>
                <textarea rows={2} value={formData.notes} onChange={(e) => updateForm('notes', e.target.value)} placeholder="Any instructions for our payment team..." className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary resize-none"></textarea>
              </div>

            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="border-2 border-foreground bg-primary text-primary-foreground p-6 sticky top-24">
            <h2 className="font-bold uppercase tracking-widest text-sm mb-6 border-b-2 border-white/20 pb-2">Payment Summary</h2>
            
            <div className="flex flex-col gap-4 text-xs font-bold uppercase mb-8">
               <p className="opacity-80">1. We will verify the university details and invoice to ensure safe transfer.</p>
               <p className="opacity-80">2. A localized quote will be provided with the exact exchange rate and low fees.</p>
               <p className="opacity-80">3. Official payment receipts will be provided for your visa applications.</p>
            </div>

            <div className="flex flex-col gap-2 mb-8 text-[10px] uppercase font-bold tracking-widest opacity-80">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                FCA Regulated Partner
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                Trackable swift transfer
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full border-2 border-foreground bg-white text-foreground p-4 font-bold uppercase tracking-widest text-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing</> : 'Request Quote'}
            </button>
          </div>
        </div>

      </div>
    </form>
  );
}
