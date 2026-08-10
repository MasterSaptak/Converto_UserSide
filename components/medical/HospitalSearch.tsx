import { useState } from "react"
import { Search, Star, MapPin } from "lucide-react"

const MOCK_HOSPITALS = [
  { id: "h1", name: "Apollo Hospitals", location: "Chennai, India", rating: 4.8, depts: ["Cardiology", "Neurology", "Eye"] },
  { id: "h2", name: "Bumrungrad International", location: "Bangkok, Thailand", rating: 4.9, depts: ["Oncology", "Orthopedics"] },
  { id: "h3", name: "Mount Elizabeth", location: "Singapore", rating: 4.7, depts: ["Cardiology", "Neurology"] },
  { id: "h4", name: "Narayana Health", location: "Bangalore, India", rating: 4.6, depts: ["Cardiology", "Transplant"] },
]

export default function HospitalSearch({ 
  value, 
  onChange 
}: { 
  value: string, 
  onChange: (id: string) => void 
}) {
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = MOCK_HOSPITALS.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
        <input 
          type="text"
          placeholder="Search hospitals by name, city, or department..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-white p-4 pl-12 border-2 border-foreground font-bold outline-none focus:ring-2 ring-primary"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {filtered.map(hospital => (
          <div 
            key={hospital.id}
            onClick={() => onChange(hospital.id)}
            className={`cursor-pointer border-2 p-4 transition-transform hover:-translate-y-1 ${
              value === hospital.id 
                ? 'border-primary bg-primary/5 shadow-[4px_4px_0px_var(--color-primary)]' 
                : 'border-foreground bg-card shadow-[4px_4px_0px_var(--color-foreground)]'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-black uppercase tracking-tight leading-tight">{hospital.name}</h4>
              <div className="flex items-center gap-1 text-amber-500 font-black text-xs shrink-0">
                <Star className="w-3 h-3 fill-amber-500" /> {hospital.rating}
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase opacity-60 mb-3">
              <MapPin className="w-3 h-3" /> {hospital.location}
            </div>
            <div className="flex flex-wrap gap-1">
              {hospital.depts.map(d => (
                <span key={d} className="text-[9px] font-black uppercase tracking-widest bg-muted px-2 py-0.5 border border-foreground/20">
                  {d}
                </span>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center p-8 border-2 border-foreground border-dashed opacity-60 font-bold uppercase tracking-widest text-sm">
            No hospitals found
          </div>
        )}
      </div>
    </div>
  )
}
