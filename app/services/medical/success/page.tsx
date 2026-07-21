"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { HeartPulse, CheckCircle2, ArrowRight, Download, Eye } from "lucide-react"

export default function MedicalSuccessPage() {
  const searchParams = useSearchParams()
  const requestId = searchParams.get("id") || "MED-PENDING"

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full animate-in fade-in duration-500 py-20 px-4">
      
      <div className="w-24 h-24 bg-[#8B5CF6] text-white border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] flex items-center justify-center mb-10">
        <HeartPulse className="w-12 h-12" />
      </div>

      <h1 className="text-4xl md:text-5xl font-black font-heading uppercase text-center mb-4">Request Submitted</h1>
      <p className="text-center font-bold opacity-70 mb-10">
        Our medical coordination team is reviewing your case. We will contact you shortly with hospital recommendations.
      </p>

      <div className="w-full bg-card border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] p-8 mb-10">
        <div className="text-center mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Your Medical Case Number</p>
          <div className="text-3xl md:text-4xl font-mono font-black">{requestId}</div>
        </div>

        <div className="bg-amber-100 border-2 border-amber-500 p-4 flex gap-3 text-amber-900 mb-6">
          <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />
          <p className="text-sm font-bold">Please save this case number. You can use it to track your application and communicate with our support team.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Link href={`/services/medical/track?id=${requestId}`} className="bg-foreground text-background font-black uppercase tracking-widest p-4 border-2 border-transparent hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-2 text-sm text-center">
            <Eye className="w-4 h-4" /> Track Request
          </Link>
          <button className="bg-muted text-foreground font-black uppercase tracking-widest p-4 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      <Link href="/services" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:underline">
        Return to Services <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
