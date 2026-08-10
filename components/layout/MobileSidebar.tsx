'use client'

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Sidebar } from "./Sidebar"

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger className="flex flex-col items-center justify-center gap-0.5 w-[60px] h-full text-[9px] font-bold uppercase transition-colors text-foreground opacity-60 hover:opacity-100 bg-transparent border-none p-0 focus:outline-none">
        <Menu className="w-5 h-5 stroke-2" />
        <span>Menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 border-r-2 border-foreground h-full bg-secondary">
        {/* We reuse the internal contents of Sidebar without the hidden wrapper */}
        <Sidebar mobile />
      </SheetContent>
    </Sheet>
  )
}
