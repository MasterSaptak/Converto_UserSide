import { User, Phone, MessageCircle, Mail, Clock, Check } from "lucide-react"

export interface ContactInfoData {
  contact_name: string
  contact_mobile: string
  contact_whatsapp: string
  contact_email: string
  preferred_contact_method: string
  preferred_contact_time: string
  sameAsMobile: boolean
}

interface ContactInformationSectionProps {
  data: ContactInfoData
  onChange: (data: ContactInfoData) => void
  errors?: Partial<Record<keyof ContactInfoData, string>>
}

export default function ContactInformationSection({ data, onChange, errors = {} }: ContactInformationSectionProps) {
  
  const handleChange = (field: keyof ContactInfoData, value: string | boolean) => {
    const newData = { ...data, [field]: value }
    
    // Auto-sync WhatsApp if checkbox is checked
    if (field === 'sameAsMobile' && value === true) {
      newData.contact_whatsapp = newData.contact_mobile
    } else if (field === 'contact_mobile' && data.sameAsMobile) {
      newData.contact_whatsapp = value as string
    }
    
    onChange(newData)
  }

  return (
    <div className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
          <User className="w-3 h-3" /> Full Name <span className="text-red-500">*</span>
        </label>
        <div className={`flex border-2 ${errors.contact_name ? 'border-red-500 bg-red-50' : 'border-foreground focus-within:ring-2 ring-primary bg-transparent'}`}>
          <input 
            type="text"
            value={data.contact_name}
            onChange={(e) => handleChange('contact_name', e.target.value)}
            className="w-full bg-transparent p-4 font-bold outline-none"
            placeholder="John Doe"
          />
        </div>
        {errors.contact_name && <p className="text-xs text-red-500 font-bold">{errors.contact_name}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Mobile Number */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
            <Phone className="w-3 h-3" /> Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className={`flex border-2 ${errors.contact_mobile ? 'border-red-500 bg-red-50' : 'border-foreground focus-within:ring-2 ring-primary bg-transparent'}`}>
            <input 
              type="tel"
              value={data.contact_mobile}
              onChange={(e) => handleChange('contact_mobile', e.target.value)}
              className="w-full bg-transparent p-4 font-bold outline-none"
              placeholder="+1 234 567 8900"
            />
          </div>
          {errors.contact_mobile && <p className="text-xs text-red-500 font-bold">{errors.contact_mobile}</p>}
        </div>

        {/* WhatsApp Number */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
              <MessageCircle className="w-3 h-3" /> WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox"
                  checked={data.sameAsMobile}
                  onChange={(e) => handleChange('sameAsMobile', e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 border-2 border-foreground peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
                <Check className="w-3 h-3 text-primary-foreground absolute opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={4} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest group-hover:opacity-100 opacity-60 transition-opacity">Same as Mobile</span>
            </label>
          </div>
          <div className={`flex border-2 ${errors.contact_whatsapp ? 'border-red-500 bg-red-50' : 'border-foreground focus-within:ring-2 ring-primary'} ${data.sameAsMobile ? 'bg-muted opacity-70' : 'bg-transparent'}`}>
            <input 
              type="tel"
              value={data.contact_whatsapp}
              onChange={(e) => handleChange('contact_whatsapp', e.target.value)}
              disabled={data.sameAsMobile}
              className="w-full bg-transparent p-4 font-bold outline-none disabled:cursor-not-allowed"
              placeholder="+1 234 567 8900"
            />
          </div>
          {errors.contact_whatsapp && <p className="text-xs text-red-500 font-bold">{errors.contact_whatsapp}</p>}
        </div>
      </div>

      {/* Email Address */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
          <Mail className="w-3 h-3" /> Email Address
        </label>
        <div className={`flex border-2 ${errors.contact_email ? 'border-red-500 bg-red-50' : 'border-foreground focus-within:ring-2 ring-primary bg-transparent'}`}>
          <input 
            type="email"
            value={data.contact_email}
            onChange={(e) => handleChange('contact_email', e.target.value)}
            className="w-full bg-transparent p-4 font-bold outline-none"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Preferred Contact Method */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">
            Preferred Contact Method
          </label>
          <div className="flex border-2 border-foreground focus-within:ring-2 ring-primary bg-transparent">
            <select
              value={data.preferred_contact_method}
              onChange={(e) => handleChange('preferred_contact_method', e.target.value)}
              className="w-full bg-transparent p-4 font-bold outline-none appearance-none cursor-pointer"
            >
              <option value="WhatsApp">WhatsApp</option>
              <option value="Phone Call">Phone Call</option>
              <option value="Email">Email</option>
            </select>
          </div>
        </div>

        {/* Preferred Contact Time */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
            <Clock className="w-3 h-3" /> Preferred Contact Time
          </label>
          <div className="flex border-2 border-foreground focus-within:ring-2 ring-primary bg-transparent">
            <select
              value={data.preferred_contact_time}
              onChange={(e) => handleChange('preferred_contact_time', e.target.value)}
              className="w-full bg-transparent p-4 font-bold outline-none appearance-none cursor-pointer"
            >
              <option value="Anytime">Anytime</option>
              <option value="Morning">Morning (9 AM - 12 PM)</option>
              <option value="Afternoon">Afternoon (12 PM - 4 PM)</option>
              <option value="Evening">Evening (4 PM - 8 PM)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
