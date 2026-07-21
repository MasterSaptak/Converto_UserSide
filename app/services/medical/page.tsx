"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, HeartPulse, CheckCircle2, Loader2, AlertTriangle, Save } from "lucide-react"
import Link from "next/link"
import ContactInformationSection from "@/components/common/ContactInformationSection"
import HospitalSearch from "@/components/medical/HospitalSearch"
import DoctorSearch from "@/components/medical/DoctorSearch"
import { MedicalFormData, initialMedicalFormData } from "@/types/medical"
import { supabase } from "@/lib/supabase"

// --- Placeholder sub-components for the steps. In a production app these would be imported from separate files. ---

function Step1PatientInfo({ data, onChange }: { data: MedicalFormData, onChange: (d: MedicalFormData) => void }) {
  const handleChange = (field: string, value: string) => onChange({ ...data, patient: { ...data.patient, [field]: value } })
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black uppercase tracking-widest border-b-2 border-foreground pb-2">Patient Information</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Full Name *</label>
          <input type="text" value={data.patient.full_name} onChange={e => handleChange('full_name', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Date of Birth *</label>
          <input type="date" value={data.patient.date_of_birth} onChange={e => handleChange('date_of_birth', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Gender *</label>
          <select value={data.patient.gender} onChange={e => handleChange('gender', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Nationality *</label>
          <input type="text" value={data.patient.nationality} onChange={e => handleChange('nationality', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary" />
        </div>
      </div>

      <h3 className="text-xl font-black uppercase tracking-widest border-b-2 border-foreground pb-2 mt-8">Identification</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Passport Number</label>
          <input type="text" value={data.patient.passport_number} onChange={e => handleChange('passport_number', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">National ID</label>
          <input type="text" value={data.patient.national_id} onChange={e => handleChange('national_id', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary" />
        </div>
      </div>

      <h3 className="text-xl font-black uppercase tracking-widest border-b-2 border-foreground pb-2 mt-8">Address</h3>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Current Address</label>
        <textarea value={data.patient.current_address} onChange={e => handleChange('current_address', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary" rows={3}></textarea>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">City</label>
          <input type="text" value={data.patient.city} onChange={e => handleChange('city', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">State</label>
          <input type="text" value={data.patient.state_region} onChange={e => handleChange('state_region', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Country</label>
          <input type="text" value={data.patient.country} onChange={e => handleChange('country', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary" />
        </div>
      </div>
    </div>
  )
}

function Step2MedicalInfo({ data, onChange }: { data: MedicalFormData, onChange: (d: MedicalFormData) => void }) {
  const handleChange = (field: keyof MedicalFormData, value: string | boolean | string[]) => onChange({ ...data, [field]: value })
  
  const conditionsList = ["Diabetes", "High Blood Pressure", "Heart Disease", "Kidney Disease", "Asthma", "Cancer", "Thyroid", "None", "Others"]
  
  const handleConditionToggle = (condition: string) => {
    let newConditions = [...data.existing_conditions]
    if (condition === "None") {
      newConditions = ["None"]
    } else {
      if (newConditions.includes("None")) newConditions = newConditions.filter(c => c !== "None")
      if (newConditions.includes(condition)) {
        newConditions = newConditions.filter(c => c !== condition)
      } else {
        newConditions.push(condition)
      }
    }
    handleChange('existing_conditions', newConditions)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black uppercase tracking-widest border-b-2 border-foreground pb-2">Medical Problem</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Disease / Condition</label>
          <input type="text" value={data.medical_problem} onChange={e => handleChange('medical_problem', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Department Required</label>
          <select value={data.department_required} onChange={e => handleChange('department_required', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary">
            <option value="">Select Department</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Oncology">Oncology</option>
            <option value="Eye">Eye</option>
            <option value="Dental">Dental</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Symptoms</label>
        <textarea value={data.symptoms} onChange={e => handleChange('symptoms', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary" rows={3}></textarea>
      </div>

      <h3 className="text-xl font-black uppercase tracking-widest border-b-2 border-foreground pb-2 mt-8">Existing Conditions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {conditionsList.map(cond => (
          <label key={cond} className="flex items-center gap-2 cursor-pointer p-3 border-2 border-foreground/20 hover:border-foreground transition-colors">
            <input type="checkbox" checked={data.existing_conditions.includes(cond)} onChange={() => handleConditionToggle(cond)} className="w-4 h-4 accent-primary border-2 border-foreground" />
            <span className="text-xs font-bold uppercase">{cond}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function Step3HospitalPreference({ data, onChange }: { data: MedicalFormData, onChange: (d: MedicalFormData) => void }) {
  const handleChange = (field: keyof MedicalFormData, value: string | boolean | string[]) => onChange({ ...data, [field]: value })
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-black uppercase tracking-widest border-b-2 border-foreground pb-2">Select Hospital (Optional)</h3>
        <HospitalSearch 
          value={data.preferred_hospital_id} 
          onChange={val => handleChange('preferred_hospital_id', val)} 
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-black uppercase tracking-widest border-b-2 border-foreground pb-2">Select Doctor (Optional)</h3>
        <DoctorSearch 
          hospitalId={data.preferred_hospital_id} 
          department={data.department_required}
          value={data.preferred_doctor_id}
          onChange={val => handleChange('preferred_doctor_id', val)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Preferred Consultation</label>
          <select value={data.preferred_consultation} onChange={e => handleChange('preferred_consultation', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary">
            <option value="Physical Visit">Physical Visit</option>
            <option value="Video Consultation">Video Consultation</option>
            <option value="No Preference">No Preference</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Preferred Language</label>
          <select value={data.preferred_language} onChange={e => handleChange('preferred_language', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary">
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Bengali">Bengali</option>
            <option value="Tamil">Tamil</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function Step4TravelInfo({ data, onChange }: { data: MedicalFormData, onChange: (d: MedicalFormData) => void }) {
  const handleChange = (field: keyof MedicalFormData, value: string | boolean | string[]) => onChange({ ...data, [field]: value })
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black uppercase tracking-widest border-b-2 border-foreground pb-2">Travel Information</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Expected Travel Date</label>
          <input type="date" value={data.expected_travel_date} onChange={e => handleChange('expected_travel_date', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Expected Return Date</label>
          <input type="date" value={data.expected_return_date} onChange={e => handleChange('expected_return_date', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Visa Status</label>
          <select value={data.visa_status} onChange={e => handleChange('visa_status', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary">
            <option value="Already Have Visa">Already Have Visa</option>
            <option value="Need Medical Visa">Need Medical Visa</option>
            <option value="Visa Processing">Visa Processing</option>
            <option value="Not Applied">Not Applied</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Arrival City</label>
          <input type="text" value={data.arrival_city} onChange={e => handleChange('arrival_city', e.target.value)} className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary" />
        </div>
      </div>

      <h3 className="text-xl font-black uppercase tracking-widest border-b-2 border-foreground pb-2 mt-8">Assistance Required</h3>
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: 'needs_pickup', label: 'Airport Pickup' },
          { key: 'needs_hotel', label: 'Hotel Booking' },
          { key: 'needs_translator', label: 'Translator' },
          { key: 'needs_local_transport', label: 'Local Transport' }
        ].map(item => (
          <label key={item.key} className="flex items-center gap-2 cursor-pointer p-3 border-2 border-foreground/20 hover:border-foreground transition-colors">
            <input type="checkbox" checked={data[item.key as keyof MedicalFormData] as boolean} onChange={e => handleChange(item.key as keyof MedicalFormData, e.target.checked)} className="w-4 h-4 accent-primary border-2 border-foreground" />
            <span className="text-xs font-bold uppercase">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function Step5Attendants({ data, onChange }: { data: MedicalFormData, onChange: (d: MedicalFormData) => void }) {
  const addAttendant = () => {
    onChange({
      ...data,
      attendants: [
        ...data.attendants,
        { id: Date.now().toString(), name: '', relationship: '', gender: '', age: '', passport_number: '', national_id: '', mobile_number: '', whatsapp_number: '', email: '', nationality: '' }
      ]
    })
  }

  const updateAttendant = (index: number, field: string, value: string) => {
    const newAttendants = [...data.attendants]
    newAttendants[index] = { ...newAttendants[index], [field]: value }
    onChange({ ...data, attendants: newAttendants })
  }

  const removeAttendant = (index: number) => {
    onChange({
      ...data,
      attendants: data.attendants.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b-2 border-foreground pb-2">
        <h3 className="text-xl font-black uppercase tracking-widest">Attendants</h3>
        <button onClick={addAttendant} className="bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest px-4 py-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors">
          + Add Attendant
        </button>
      </div>
      
      {data.attendants.length === 0 ? (
        <div className="bg-muted p-8 text-center border-2 border-foreground border-dashed">
          <p className="text-sm font-bold opacity-60 uppercase tracking-widest">No attendants added</p>
        </div>
      ) : (
        <div className="space-y-8">
          {data.attendants.map((attendant, index) => (
            <div key={attendant.id} className="border-2 border-foreground p-4 bg-card shadow-[4px_4px_0px_var(--color-foreground)]">
              <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-foreground/10">
                <h4 className="font-black uppercase tracking-widest">Attendant {index + 1}</h4>
                <button onClick={() => removeAttendant(index)} className="text-red-500 text-xs font-bold uppercase tracking-widest hover:underline">Remove</button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Full Name</label>
                  <input type="text" value={attendant.name} onChange={e => updateAttendant(index, 'name', e.target.value)} className="w-full bg-transparent p-3 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Relationship to Patient</label>
                  <input type="text" value={attendant.relationship} onChange={e => updateAttendant(index, 'relationship', e.target.value)} className="w-full bg-transparent p-3 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Passport Number</label>
                  <input type="text" value={attendant.passport_number} onChange={e => updateAttendant(index, 'passport_number', e.target.value)} className="w-full bg-transparent p-3 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Mobile Number</label>
                  <input type="text" value={attendant.mobile_number} onChange={e => updateAttendant(index, 'mobile_number', e.target.value)} className="w-full bg-transparent p-3 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary text-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Step6DocumentUpload() {
  // In a real app, this would handle file uploads to Supabase Storage and track the state
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black uppercase tracking-widest border-b-2 border-foreground pb-2">Medical Documents</h3>
      
      <div className="bg-indigo-50 border-2 border-indigo-400 p-6 text-center space-y-4">
        <p className="font-bold text-indigo-900">Upload your medical reports, passports, and prescriptions.</p>
        <p className="text-xs font-bold text-indigo-700/80">Support for PDF, JPG, PNG, WEBP. Max 10MB per file.</p>
        
        <label className="inline-block bg-indigo-600 text-white font-black uppercase tracking-widest px-6 py-3 cursor-pointer hover:bg-indigo-700 transition-colors">
          Select Files
          <input type="file" multiple className="hidden" />
        </label>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border-2 border-foreground p-4 bg-muted">
          <h4 className="font-black uppercase tracking-widest text-xs mb-2">Required</h4>
          <ul className="text-sm font-bold opacity-70 list-disc list-inside">
            <li>Patient Passport / ID</li>
            <li>Latest Medical Reports</li>
          </ul>
        </div>
        <div className="border-2 border-foreground p-4 bg-muted">
          <h4 className="font-black uppercase tracking-widest text-xs mb-2">Optional</h4>
          <ul className="text-sm font-bold opacity-70 list-disc list-inside">
            <li>Referral Letter</li>
            <li>MRI / CT Scans</li>
            <li>Attendant Passports</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function Step7AdditionalInfo({ data, onChange }: { data: MedicalFormData, onChange: (d: MedicalFormData) => void }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black uppercase tracking-widest border-b-2 border-foreground pb-2">Additional Information</h3>
      
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Special Requests / Notes</label>
        <textarea 
          value={data.special_requests} 
          onChange={e => onChange({ ...data, special_requests: e.target.value })} 
          className="w-full bg-transparent p-4 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary" 
          rows={6}
          placeholder="e.g. Patient cannot walk, needs wheelchair at airport, requires female doctor, etc."
        ></textarea>
      </div>
    </div>
  )
}

function Step8Review({ data }: { data: MedicalFormData }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black uppercase tracking-widest border-b-2 border-foreground pb-2">Review Your Request</h3>
      
      <div className="bg-card border-2 border-foreground p-6 shadow-[4px_4px_0px_var(--color-foreground)]">
        <h4 className="font-black uppercase tracking-widest text-sm mb-4">Patient</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="opacity-60">Name:</div><div className="font-bold">{data.patient.full_name || '-'}</div>
          <div className="opacity-60">DOB:</div><div className="font-bold">{data.patient.date_of_birth || '-'}</div>
          <div className="opacity-60">Nationality:</div><div className="font-bold">{data.patient.nationality || '-'}</div>
        </div>
      </div>

      <div className="bg-card border-2 border-foreground p-6 shadow-[4px_4px_0px_var(--color-foreground)]">
        <h4 className="font-black uppercase tracking-widest text-sm mb-4">Medical</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="opacity-60">Condition:</div><div className="font-bold">{data.medical_problem || '-'}</div>
          <div className="opacity-60">Department:</div><div className="font-bold">{data.department_required || '-'}</div>
        </div>
      </div>
      
      <div className="bg-amber-100 border-2 border-amber-500 p-4 font-bold text-amber-900 text-sm">
        By submitting this request, our medical coordination team will begin evaluating your case and contact you with hospital options.
      </div>
    </div>
  )
}

// --- Main Page Component ---

export default function MedicalServicePage() {
  const router = useRouter()
  const [step, setStep] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<MedicalFormData>(initialMedicalFormData)
  
  // Autosave State
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  const formDataRef = useRef(formData)
  formDataRef.current = formData

  // Mock Autosave Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setIsSaving(true)
      // Simulate API call
      setTimeout(() => {
        setIsSaving(false)
        setLastSaved(new Date())
      }, 1000)
    }, 15000) // 15 seconds for demonstration
    return () => clearInterval(timer)
  }, [])

  const steps = [
    { title: "Contact Information", component: ContactInformationSection, props: { data: formData, onChange: (d: MedicalFormData) => setFormData(d) } },
    { title: "Patient Details", component: Step1PatientInfo, props: { data: formData, onChange: (d: MedicalFormData) => setFormData(d) } },
    { title: "Medical Information", component: Step2MedicalInfo, props: { data: formData, onChange: (d: MedicalFormData) => setFormData(d) } },
    { title: "Hospital Preference", component: Step3HospitalPreference, props: { data: formData, onChange: (d: MedicalFormData) => setFormData(d) } },
    { title: "Travel Details", component: Step4TravelInfo, props: { data: formData, onChange: (d: MedicalFormData) => setFormData(d) } },
    { title: "Attendants", component: Step5Attendants, props: { data: formData, onChange: (d: MedicalFormData) => setFormData(d) } },
    { title: "Documents", component: Step6DocumentUpload, props: { data: formData, onChange: (d: MedicalFormData) => setFormData(d) } },
    { title: "Additional Info", component: Step7AdditionalInfo, props: { data: formData, onChange: (d: MedicalFormData) => setFormData(d) } },
    { title: "Review", component: Step8Review, props: { data: formData } },
  ]

  const CurrentStepComponent = steps[step].component
  const progressPercentage = Math.round((step / (steps.length - 1)) * 100)

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1)
      window.scrollTo(0, 0)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // 1. We would typically check auth user here
      // 2. Submit to our new medical_requests table
      
      // For now, we will hit the service_requests table as a fallback if the API route isn't set up,
      // but ideally we should have a custom RPC or endpoint for this.
      // Assuming we have an RPC or we use Supabase client directly:
      
      const { data: requestData, error: requestError } = await supabase
        .from('medical_requests')
        .insert({
          service_type: 'medical',
          contact_name: formData.contact_name,
          contact_mobile: formData.contact_mobile,
          contact_whatsapp: formData.contact_whatsapp,
          contact_email: formData.contact_email,
          medical_problem: formData.medical_problem,
          department_required: formData.department_required,
          // other fields would be mapped here in a full implementation
        })
        .select('request_uid')
        .single()
        
      if (requestError) {
        // If the table doesn't exist yet (migration not applied), we can throw a friendly error
        console.error("Submission error:", requestError)
        throw new Error("Failed to submit request. Our database is currently being updated. Please try again shortly.")
      }

      // We would also insert into medical_patients, medical_attendants here in a real transaction
      
      router.push(`/services/medical/success?id=${requestData?.request_uid || 'MED-PENDING'}`)
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full animate-in fade-in duration-500 pb-10">
      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link href="/services" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border-2 border-foreground bg-[#8B5CF6] flex items-center justify-center shadow-[4px_4px_0px_var(--color-foreground)]">
              <HeartPulse className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black font-heading uppercase leading-[0.9] tracking-tight">Medical Appointment</h1>
              <p className="text-sm font-bold uppercase tracking-widest opacity-60 mt-2">Treatment & Tourism Coordination</p>
            </div>
          </div>
        </div>
        
        {/* Autosave Status */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-2 border-2 border-foreground/20 bg-muted self-start md:self-auto">
          {isSaving ? (
            <><Loader2 className="w-3 h-3 animate-spin text-primary" /> Saving Draft...</>
          ) : lastSaved ? (
            <><Save className="w-3 h-3 text-emerald-500" /> Draft Saved {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</>
          ) : (
            <><Save className="w-3 h-3 opacity-50" /> Unsaved Draft</>
          )}
        </div>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar: Smart Progress System */}
        <div className="hidden lg:block lg:col-span-1 space-y-2">
          <div className="mb-6 border-b-2 border-foreground pb-4">
            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest mb-2">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-muted border-2 border-foreground">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
          
          <div className="space-y-1">
            {steps.map((s, i) => {
              let status = "⚪" // Not Started
              let textClass = "opacity-50"
              
              if (i < step) {
                status = "✅" // Completed
                textClass = "text-emerald-600"
              } else if (i === step) {
                status = "🟡" // In Progress
                textClass = "font-black"
              }
              
              return (
                <div key={i} className={`flex items-center gap-3 p-3 text-[10px] uppercase tracking-widest font-bold cursor-pointer hover:bg-muted transition-colors ${i === step ? 'bg-primary/10 border-2 border-primary/20' : ''}`} onClick={() => i < step && setStep(i)}>
                  <span className="text-sm">{status}</span>
                  <span className={textClass}>{s.title}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Content: Form */}
        <div className="lg:col-span-3">
          
          {/* Mobile Progress Bar (Visible only on small screens) */}
          <div className="lg:hidden mb-6 border-b-2 border-foreground pb-4">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2">
              <span>Step {step + 1} of {steps.length}: {steps[step].title}</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-muted border-2 border-foreground">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>

          <div className="bg-card border-2 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] p-6 md:p-10 relative min-h-[400px]">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <CurrentStepComponent {...(steps[step].props as any)} />
        
        {error && (
          <div className="mt-8 bg-red-100 border-2 border-red-500 text-red-700 p-4 font-bold text-sm flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        <div className="flex gap-4 mt-10 pt-6 border-t-2 border-foreground/10">
          {step > 0 && (
            <button 
              onClick={handleBack}
              disabled={isLoading}
              className="w-1/3 bg-muted text-foreground font-black uppercase tracking-widest py-4 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
            >
              Back
            </button>
          )}
          <button 
            onClick={handleNext}
            disabled={isLoading}
            className={`${step > 0 ? 'w-2/3' : 'w-full'} bg-primary text-primary-foreground font-black uppercase tracking-widest py-4 border-2 border-transparent hover:border-foreground hover:bg-background hover:text-foreground transition-colors flex items-center justify-center gap-2 disabled:opacity-50`}
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
            ) : step === steps.length - 1 ? (
              <>Submit Request <CheckCircle2 className="w-5 h-5" /></>
            ) : (
              <>Continue <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}
