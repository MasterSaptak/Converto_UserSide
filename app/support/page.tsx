'use client';

import { MessageCircle, Mail, FileText } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="flex-1 flex flex-col gap-8 md:gap-10 animate-in fade-in duration-500 pb-10">
      <header className="border-b-2 border-foreground pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2 block">Assistance</span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">Live Support</h1>
      </header>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border-2 border-foreground bg-primary text-primary-foreground p-8 flex flex-col items-center text-center justify-center min-h-[300px]">
          <MessageCircle className="w-12 h-12 mb-6" />
          <h2 className="text-2xl font-bold font-heading uppercase mb-2">Live Chat</h2>
          <p className="text-xs uppercase font-bold opacity-80 tracking-widest mb-8">Speak to a dedicated account manager instantly.</p>
          <button className="border-2 border-foreground bg-white text-foreground px-8 py-4 font-bold uppercase tracking-widest text-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all">
            Start Chat
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <Link href="#" className="border-2 border-foreground bg-white p-6 flex items-center gap-6 group hover:bg-secondary transition-colors">
            <div className="w-12 h-12 border-2 border-foreground bg-emerald-100 flex items-center justify-center">
               <MessageCircle className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-bold uppercase text-sm mb-1 group-hover:underline">WhatsApp Support</h3>
              <p className="text-[10px] uppercase font-bold opacity-60 tracking-widest">Connect via WhatsApp</p>
            </div>
          </Link>
          
          <Link href="#" className="border-2 border-foreground bg-white p-6 flex items-center gap-6 group hover:bg-secondary transition-colors">
            <div className="w-12 h-12 border-2 border-foreground bg-blue-100 flex items-center justify-center">
               <Mail className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h3 className="font-bold uppercase text-sm mb-1 group-hover:underline">Email Support</h3>
              <p className="text-[10px] uppercase font-bold opacity-60 tracking-widest">support@converto.app</p>
            </div>
          </Link>

          <Link href="#" className="border-2 border-foreground bg-white p-6 flex items-center gap-6 group hover:bg-secondary transition-colors">
            <div className="w-12 h-12 border-2 border-foreground bg-yellow-100 flex items-center justify-center">
               <FileText className="w-6 h-6 text-yellow-700" />
            </div>
            <div>
              <h3 className="font-bold uppercase text-sm mb-1 group-hover:underline">My Tickets</h3>
              <p className="text-[10px] uppercase font-bold opacity-60 tracking-widest">View past support requests</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
