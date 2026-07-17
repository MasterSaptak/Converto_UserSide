'use client';

import Link from "next/link";
import { ArrowRightLeft, ShoppingBag, Train, GraduationCap, Globe, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { staggerContainer, fadeUpItem } from "@/lib/animations";

const ACTIONS = [
  { href: "/services/exchange", label: "Money Exchange", icon: ArrowRightLeft, borderColor: "border-[#FF90E8]", darkTextColor: "dark:text-[#FF90E8]" },
  { href: "/services/buy-for-me", label: "Buy For Me", icon: ShoppingBag, borderColor: "border-[#FFC900]", darkTextColor: "dark:text-[#FFC900]" },
  { href: "/services/tickets?type=flight", label: "Ticket Booking", icon: Train, borderColor: "border-[#00E5FF]", darkTextColor: "dark:text-[#00E5FF]" },
  { href: "/services/education", label: "Educational Payment", icon: GraduationCap, borderColor: "border-[#94A3B8]", darkTextColor: "dark:text-[#E2E8F0]" },
  { href: "/services/global-payments", label: "Money Transfer", icon: Globe, borderColor: "border-[#00FF66]", darkTextColor: "dark:text-[#00FF66]" },
  { href: "/track", label: "Track", icon: Package, borderColor: "border-[#FF5C00]", darkTextColor: "dark:text-[#FF5C00]" },
];

export function QuickActions() {
  return (
    <section>
      <div className="font-bold uppercase text-[10px] tracking-[0.2em] mb-4 flex items-center gap-2 opacity-80">
        <div className="w-1.5 h-1.5 bg-primary"></div>
        Quick Actions
      </div>
      <motion.div 
        className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4 pb-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10px" }}
      >
        {ACTIONS.map((action) => (
          <motion.div key={action.href} variants={fadeUpItem} className="h-full">
            <Link 
              href={action.href} 
              className={cn(
                "group relative border-[3px] p-3 sm:p-4 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] aspect-square sm:aspect-[4/3] overflow-hidden",
                // Light Mode: Light metallic bg, sharp black text
                "bg-gradient-to-br from-zinc-100 via-white to-zinc-200 text-zinc-950 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]",
                // Dark Mode: Dark metallic bg, neon text
                "dark:bg-gradient-to-br dark:from-zinc-800 dark:via-zinc-900 dark:to-black dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]",
                action.borderColor,
                action.darkTextColor
              )}
            >
              {/* Metallic glare effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 dark:via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mix-blend-overlay"></div>
              
              <action.icon className="w-6 h-6 sm:w-7 sm:h-7 mb-2 sm:mb-3 group-hover:scale-125 transition-transform relative z-10 dark:drop-shadow-[0_0_8px_currentColor]" />
              <span className="text-[9px] sm:text-[10px] font-bold uppercase leading-tight tracking-wider relative z-10">{action.label}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
