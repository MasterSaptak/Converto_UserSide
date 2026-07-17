'use client'

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Sidebar } from "./Sidebar"

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden p-2 border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_var(--color-foreground)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
        <Menu className="w-5 h-5 text-foreground" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 border-r-2 border-foreground h-full bg-secondary">
        {/* We reuse the internal contents of Sidebar without the hidden wrapper */}
        <Sidebar mobile />
      </SheetContent>
    </Sheet>
  )
}
