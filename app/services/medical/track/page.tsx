"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, CheckCircle2, Upload, MessageSquare } from "lucide-react"

export default function MedicalTrackPage() {
  const searchParams = useSearchParams()
  const requestId = searchParams.get("id") || "MED-PENDING"

  // Mock timeline for UI purposes
  const timeline = [
    { id: 1, time: "11:45 AM, Today", status: "Request Created", desc: "Your medical request has been logged.", done: true },
    { id: 2, time: "12:01 PM, Today", status: "Passport Uploaded", desc: "Identity documents received.", done: true },
    { id: 3, time: "12:12 PM, Today", status: "Admin Verified", desc: "Documents have been verified by our team.", done: true },
    { id: 4, time: "2:15 PM, Today", status: "Hospital Contacted", desc: "Sent details to Apollo Hospitals.", done: true },
    { id: 5, time: "Pending", status: "Hospital Responded", desc: "Waiting for treatment plan and appointment.", done: false },
    { id: 6, time: "Pending", status: "Appointment Scheduled", desc: "Finalizing date and time.", done: false },
  ]

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full animate-in fade-in duration-500 pb-10">
      
      <header className="mb-8">
        <Link href="/services" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>
        <div>
          <h1 className="text-3xl md:text-5xl font-black font-heading uppercase leading-[0.9] tracking-tight">Track Request</h1>
          <p className="text-sm font-bold uppercase tracking-widest opacity-60 mt-2">Case {requestId}</p>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Timeline */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-black uppercase tracking-widest border-b-4 border-foreground pb-2 mb-6">Status Timeline</h2>
          
          <div className="bg-card border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] p-6 md:p-8">
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-foreground/20 before:to-transparent">
              
              {timeline.map((item) => (
                <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[2px_2px_0px_var(--color-foreground)] z-10 ${item.done ? 'bg-[#00FF66] text-black' : 'bg-muted text-foreground/40'}`}>
                    {item.done ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 border-2 border-foreground bg-white shadow-[4px_4px_0px_var(--color-foreground)]">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-black uppercase tracking-widest text-sm ${item.done ? '' : 'opacity-60'}`}>{item.status}</h3>
                    </div>
                    <p className={`text-xs font-bold mb-2 ${item.done ? 'opacity-80' : 'opacity-50'}`}>{item.desc}</p>
                    <time className={`text-[10px] font-black uppercase tracking-widest ${item.done ? 'text-primary' : 'opacity-40'}`}>{item.time}</time>
                  </div>
                </div>
              ))}
              
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-black uppercase tracking-widest border-b-4 border-foreground pb-2 mb-6">Actions</h2>
          
          <div className="bg-[#8B5CF6]/10 border-2 border-[#8B5CF6] p-6 text-center space-y-4 shadow-[4px_4px_0px_#8B5CF6]">
            <Upload className="w-8 h-8 mx-auto text-[#8B5CF6]" />
            <div>
              <h3 className="font-black uppercase tracking-widest text-sm text-[#8B5CF6]">Upload Missing Document</h3>
              <p className="text-xs font-bold mt-1 text-zinc-600">Admin requested additional blood reports.</p>
            </div>
            <button className="w-full bg-[#8B5CF6] text-white font-black uppercase tracking-widest py-3 border-2 border-transparent hover:border-foreground hover:bg-background hover:text-foreground transition-colors text-xs">
              Upload File
            </button>
          </div>

          <div className="bg-card border-2 border-foreground p-6 text-center space-y-4 shadow-[4px_4px_0px_var(--color-foreground)]">
            <MessageSquare className="w-8 h-8 mx-auto" />
            <div>
              <h3 className="font-black uppercase tracking-widest text-sm">Communication Center</h3>
              <p className="text-xs font-bold mt-1 opacity-70">Need help with your request?</p>
            </div>
            <button className="w-full bg-[#00FF66] text-black font-black uppercase tracking-widest py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors text-xs flex items-center justify-center gap-2">
              WhatsApp Us
            </button>
            <button className="w-full bg-muted text-foreground font-black uppercase tracking-widest py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors text-xs flex items-center justify-center gap-2">
              Send Email
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}
