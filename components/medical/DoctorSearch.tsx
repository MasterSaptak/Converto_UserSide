import { useState } from "react"
import { Search } from "lucide-react"

const MOCK_DOCTORS = [
  { id: "d1", hospital_id: "h1", department: "Cardiology", name: "Dr. Arvind Sengupta", exp: "20+ Years" },
  { id: "d2", hospital_id: "h1", department: "Neurology", name: "Dr. Ramesh Kumar", exp: "15+ Years" },
  { id: "d3", hospital_id: "h2", department: "Oncology", name: "Dr. Somsak P.", exp: "12+ Years" },
  { id: "d4", hospital_id: "h3", department: "Cardiology", name: "Dr. Emily Chen", exp: "18+ Years" },
  { id: "d5", hospital_id: "h1", department: "Cardiology", name: "Dr. Priya Nair", exp: "10+ Years" },
]

export default function DoctorSearch({
  hospitalId,
  department,
  value,
  onChange
}: {
  hospitalId: string
  department: string
  value: string
  onChange: (id: string) => void
}) {
  const [searchTerm, setSearchTerm] = useState("")

  // Dependent filtering
  let filtered = MOCK_DOCTORS

  if (hospitalId) {
    filtered = filtered.filter(d => d.hospital_id === hospitalId)
  }
  if (department) {
    filtered = filtered.filter(d => d.department === department)
  }

  if (searchTerm) {
    filtered = filtered.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
        <input 
          type="text"
          placeholder="Search doctors by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-white p-4 pl-12 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {filtered.map(doc => (
          <div 
            key={doc.id}
            onClick={() => onChange(doc.id)}
            className={`cursor-pointer border-2 p-3 transition-colors flex items-center gap-4 ${
              value === doc.id 
                ? 'border-primary bg-primary/5 shadow-[2px_2px_0px_var(--color-primary)]' 
                : 'border-foreground bg-card hover:bg-muted'
            }`}
          >
            <div className="w-12 h-12 bg-muted border-2 border-foreground rounded-full flex items-center justify-center shrink-0">
               <span className="font-black text-lg opacity-50">{doc.name.charAt(4)}</span>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-tight text-sm leading-tight">{doc.name}</h4>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">{doc.department} • {doc.exp}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center p-8 border-2 border-foreground border-dashed opacity-60 font-bold uppercase tracking-widest text-sm">
            No doctors found matching criteria
          </div>
        )}
      </div>
    </div>
  )
}
