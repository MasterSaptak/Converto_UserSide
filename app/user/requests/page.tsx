"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, CheckCircle2, AlertTriangle, FileText, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

const MOCK_REQUESTS = [
  {
    id: "REQ-2026-000154",
    type: "medical",
    title: "Medical Appointment",
    status: "Waiting Hospital",
    health: "yellow",
    date: "2026-07-21",
    subtitle: "Apollo Hospitals",
  },
  {
    id: "REQ-2026-000142",
    type: "exchange",
    title: "Currency Exchange",
    status: "Completed",
    health: "green",
    date: "2026-07-10",
    subtitle: "$5,000 USD to BDT",
  },
  {
    id: "REQ-2026-000130",
    type: "visa",
    title: "Visa Assistance",
    status: "Draft",
    health: "gray",
    date: "2026-06-25",
    subtitle: "Indian Medical Visa",
  }
]

const TABS = [
  "All Requests", 
  "Medical", 
  "Exchange", 
  "Visa", 
  "Payments", 
  "Education", 
  "Completed", 
  "Cancelled", 
  "Drafts"
]

export default function MyRequestsPage() {
  const [activeTab, setActiveTab] = useState("All Requests")

  const filteredRequests = MOCK_REQUESTS.filter(req => {
    if (activeTab === "All Requests") return true
    if (activeTab === "Medical" && req.type === "medical") return true
    if (activeTab === "Exchange" && req.type === "exchange") return true
    if (activeTab === "Visa" && req.type === "visa") return true
    if (activeTab === "Completed" && req.status === "Completed") return true
    if (activeTab === "Drafts" && req.status === "Draft") return true
    // add logic for Cancelled, Payments, Education when they have mock data
    return false
  })

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full animate-in fade-in duration-500 py-10 px-4">
      <header className="mb-6 border-b-2 border-foreground pb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-4xl md:text-5xl font-black font-heading uppercase leading-[0.9] tracking-tight">My Requests</h1>
        <p className="text-sm font-bold uppercase tracking-widest opacity-60 mt-2">Manage all your Converto service requests</p>
      </header>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide border-b-2 border-foreground mb-8">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-3 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors border-b-4",
              activeTab === tab 
                ? "border-primary text-foreground" 
                : "border-transparent text-foreground/50 hover:text-foreground hover:border-foreground/20"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredRequests.map(req => (
          <div key={req.id} className="bg-card border-2 border-foreground shadow-[6px_6px_0px_var(--color-foreground)] p-6 transition-transform hover:-translate-y-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 flex items-center justify-center border-2 border-foreground shrink-0 ${
                  req.type === 'medical' ? 'bg-[#8B5CF6] text-white' : 
                  req.type === 'exchange' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {req.type === 'medical' ? <FileText className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black uppercase tracking-widest bg-muted px-2 py-0.5 border border-foreground/20">{req.id}</span>
                    <span className="text-[10px] font-bold uppercase opacity-60">{req.date}</span>
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-lg">{req.title}</h3>
                  {req.subtitle && <p className="text-sm font-bold opacity-70">{req.subtitle}</p>}
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-2">
                <div className={`inline-flex items-center gap-2 px-3 py-1 border-2 border-foreground text-xs font-black uppercase tracking-widest ${
                  req.health === 'green' ? 'bg-emerald-100 text-emerald-800' : 
                  req.health === 'yellow' ? 'bg-amber-100 text-amber-800' : 
                  req.health === 'gray' ? 'bg-muted text-foreground' : 'bg-red-100 text-red-800'
                }`}>
                  {req.health === 'green' && <CheckCircle2 className="w-4 h-4" />}
                  {req.health === 'yellow' && <Clock className="w-4 h-4" />}
                  {req.health === 'red' && <AlertTriangle className="w-4 h-4" />}
                  {req.health === 'gray' && <FileText className="w-4 h-4" />}
                  {req.status}
                </div>
                
                <Link 
                  href={`/services/${req.type}/track/${req.id}`} 
                  className="text-xs font-bold uppercase tracking-widest hover:underline"
                >
                  View Details &rarr;
                </Link>
              </div>

            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="text-center p-12 border-2 border-foreground border-dashed bg-muted/50">
            <p className="font-bold opacity-60 uppercase tracking-widest mb-2">No {activeTab.toLowerCase()} found.</p>
            <p className="text-sm">When you create a request, it will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

