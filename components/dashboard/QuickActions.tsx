'use client';

/**
 * QuickActions — Premium fintech Quick Actions section.
 * 
 * Uses the Neo-Brutalist Bento design language:
 * - White canvas
 * - Thick black borders (2px)
 * - Solid sharp shadows
 * - Editorial typography
 * - Large, vibrant hero images (no grayscale)
 */

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { IllustrationRegistry } from "@/components/illustrations";
import { ArrowRight } from "lucide-react";
import React from 'react';

// ─── Action definitions ────────────────────────────────────

const ACTIONS = [
  {
    href: "/services/buy-for-me",
    label: "Buy For Me",
    desc: "Shop globally",
    illustrationKey: "buy_for_me",
    bgImage: "/Buy For Me.png",
    accent: "#F97316", // Bus orange
  },
  {
    href: "/services/education",
    label: "Educational Payment",
    desc: "Pay tuition & fees",
    illustrationKey: "education",
    bgImage: "/Education.png",
    accent: "#94A3B8", // Education slate
  },
  {
    href: "/services/tickets?type=train",
    label: "Train Ticket Booking",
    desc: "Book railway tickets easily",
    illustrationKey: "ticket_booking",
    bgImage: "/Train.png",
    accent: "#06B6D4", // Train cyan
  },
  {
    href: "/services/global-payments",
    label: "Global Payments",
    desc: "Send money globally",
    illustrationKey: "global_payments",
    bgImage: "/global.png",
    accent: "#10B981", // Global emerald
  },
  {
    href: "/services/exchange",
    label: "Currency Exchange",
    desc: "Exchange currencies",
    illustrationKey: "exchange",
    bgImage: "/Currency.png",
    accent: "#E11D48", // Currency pink
  },
  {
    href: "/services/medical",
    label: "Medical Appointment Booking",
    desc: "Book doctor appointments",
    illustrationKey: "medical",
    bgImage: "/medical.png",
    accent: "#8B5CF6", // Medical purple
  }
];

// ─── Component ─────────────────────────────────────────────

export const QuickActions = React.memo(function QuickActions() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section>
      {/* Section header */}
      <div className="font-bold uppercase text-[10px] tracking-[0.2em] mb-4 flex items-center gap-2 opacity-80">
        <div className="w-1.5 h-1.5 bg-primary" />
        Quick Actions
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4">
        {ACTIONS.map((action) => {
          const Illustration = IllustrationRegistry[action.illustrationKey as keyof typeof IllustrationRegistry];

          return (
            <Link key={action.href} href={action.href} className="block h-full group outline-none">
              <motion.div
                className="relative flex flex-col justify-start overflow-hidden cursor-pointer h-full min-h-[180px] p-5 bg-white border-2 border-black transition-all duration-300 ease-out"
                style={{
                  boxShadow: "4px 4px 0px rgba(0,0,0,1)",
                }}
                whileHover={prefersReducedMotion ? undefined : {
                  x: -3,
                  y: -3,
                  boxShadow: "7px 7px 0px rgba(0,0,0,1)",
                }}
                whileTap={prefersReducedMotion ? undefined : {
                  x: 0,
                  y: 0,
                  boxShadow: "0px 0px 0px rgba(0,0,0,1)",
                }}
              >
                {/* Top: Image Frame */}
                <div className="relative w-full h-28 md:h-32 border-b-2 border-black bg-zinc-50 overflow-hidden shrink-0">
                  {action.bgImage ? (
                    <Image
                      src={action.bgImage}
                      alt={action.label}
                      fill
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.1] group-hover:scale-110 transition-transform duration-700">
                      {Illustration && (
                        <Illustration
                          size={120}
                          accent={action.accent}
                          animated={false}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom: Text Content */}
                <div className="p-4 md:p-5 flex flex-col flex-1 bg-white relative z-20 justify-center">
                  <div className="w-full flex justify-between items-start">
                    <div className="max-w-[85%]">
                      <div className="flex items-start gap-2 mb-1">
                        {/* Small square accent */}
                        <div 
                          className="w-2 h-2 mt-1.5 shrink-0" 
                          style={{ backgroundColor: action.accent }}
                        />
                        <h3 
                          className="font-bold uppercase tracking-wide text-sm leading-tight"
                          style={{ color: action.accent }}
                        >
                          {action.label}
                        </h3>
                      </div>
                      <div className="pl-4 mt-1">
                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                          {action.desc}
                        </span>
                      </div>
                    </div>

                    {/* Arrow Icon Top Right */}
                    <div className="shrink-0 bg-zinc-100 p-1.5 border border-black/10 group-hover:bg-zinc-200 transition-colors">
                      <ArrowRight 
                        size={16} 
                        className="text-black transition-transform duration-300 group-hover:-rotate-45" 
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
});
