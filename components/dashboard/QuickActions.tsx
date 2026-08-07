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

import { IllustrationRegistry } from "@/components/illustrations";
import { ArrowRight, Info } from "lucide-react";
import React from 'react';
import { useRouter } from 'next/navigation';

// ─── Action definitions ────────────────────────────────────

const ACTIONS = [
  {
    href: "/services/buy-for-me/request",
    infoHref: "/services/buy-for-me",
    label: "Buy For Me",
    desc: "Shop globally",
    illustrationKey: "buy_for_me",
    bgImage: "/Buy For Me.png",
    accent: "#F97316", // Bus orange
  },
  {
    href: "/services/education/request",
    infoHref: "/services/education",
    label: "Educational Payment",
    desc: "Pay tuition & fees",
    illustrationKey: "education",
    bgImage: "/Education.png",
    accent: "#94A3B8", // Education slate
  },
  {
    href: "/services/tickets/request?type=train",
    infoHref: "/services/trains",
    label: "Train Ticket Booking",
    desc: "Book railway tickets easily",
    illustrationKey: "ticket_booking",
    bgImage: "/Train.png",
    accent: "#06B6D4", // Train cyan
  },
  {
    href: "/services/global-payments/request",
    infoHref: "/services/global-payments",
    label: "Global Payments",
    desc: "Send money globally",
    illustrationKey: "global_payments",
    bgImage: "/global.png",
    accent: "#10B981", // Global emerald
  },
  {
    href: "/services/exchange/request",
    infoHref: "/services/exchange",
    label: "Currency Exchange",
    desc: "Exchange currencies",
    illustrationKey: "exchange",
    bgImage: "/Currency.png",
    accent: "#E11D48", // Currency pink
  },
  {
    href: "/services/medical/request",
    infoHref: "/services/medical",
    label: "Medical Appointment Booking",
    desc: "Book doctor appointments",
    illustrationKey: "medical",
    bgImage: "/medical.png",
    accent: "#8B5CF6", // Medical purple
  }
];

// ─── Component ─────────────────────────────────────────────

export const QuickActions = React.memo(function QuickActions() {
  const router = useRouter();

  return (
    <section className="mb-12">
      {/* Section header */}
      <div className="font-bold uppercase text-[10px] tracking-[0.2em] mb-4 flex items-center gap-2 opacity-80">
        <div className="w-1.5 h-1.5 bg-primary" />
        Quick Actions
      </div>

      {/* Glow keyframes injected once */}
      <style jsx global>{`
        @keyframes info-glow {
          0%, 100% {
            box-shadow: 0 0 4px 1px rgba(var(--info-glow-rgb), 0.4), 0 0 8px 2px rgba(var(--info-glow-rgb), 0.15);
          }
          50% {
            box-shadow: 0 0 8px 3px rgba(var(--info-glow-rgb), 0.6), 0 0 16px 6px rgba(var(--info-glow-rgb), 0.25);
          }
        }
      `}</style>

      {/* Cards grid — 2 cols on mobile, 3 cols on tablet/desktop for spacious, prominent cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pb-4">
        {ACTIONS.map((action) => {
          const Illustration = IllustrationRegistry[action.illustrationKey as keyof typeof IllustrationRegistry];

          // Parse hex accent to RGB for the glow effect
          const hexToRgb = (hex: string) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `${r}, ${g}, ${b}`;
          };

          return (
            <Link key={action.href} href={action.href} className="block h-full group outline-none">
              <div
                className="relative flex flex-col justify-start overflow-hidden cursor-pointer h-full min-h-[180px] sm:min-h-[220px] md:min-h-[300px] bg-card border-2 border-foreground rounded-xl shadow-brutal hover-lift"
              >
                {/* ⓘ Info Button — Top Right Corner */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(action.infoHref);
                  }}
                  className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-black/20 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
                  style={{
                    ['--info-glow-rgb' as string]: hexToRgb(action.accent),
                    animation: 'info-glow 2s ease-in-out infinite',
                  }}
                  title="Need Details?"
                  aria-label={`Info about ${action.label}`}
                >
                  <Info
                    size={16}
                    style={{ color: action.accent }}
                    strokeWidth={2.5}
                  />
                </button>

                {/* Top: Image Frame */}
                <div className="relative w-full h-24 sm:h-36 md:h-52 border-b-2 border-foreground bg-secondary overflow-hidden shrink-0">
                  {action.bgImage ? (
                    <Image
                      src={action.bgImage}
                      alt={action.label}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.1] group-hover:scale-105 transition-transform duration-700">
                      {Illustration && (
                        <Illustration
                          size={140}
                          accent={action.accent}
                          animated={false}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom: Text Content */}
                <div className="p-4 md:p-5 flex flex-col flex-1 bg-card relative z-20 justify-between">
                  <div className="w-full flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        {/* Small square accent */}
                        <div
                          className="w-2.5 h-2.5 mt-1 shrink-0 rounded-sm"
                          style={{ backgroundColor: action.accent }}
                        />
                        <h3
                          className="font-bold uppercase tracking-wide text-xs sm:text-sm md:text-base leading-tight font-heading"
                          style={{ color: action.accent }}
                        >
                          {action.label}
                        </h3>
                      </div>
                      <div className="pl-4 mt-1 hidden sm:block">
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                          {action.desc}
                        </span>
                      </div>
                    </div>

                    {/* Arrow Icon Top Right */}
                    <div className="shrink-0 bg-secondary p-2 border border-foreground/10 group-hover:bg-foreground group-hover:text-background transition-colors rounded-lg">
                      <ArrowRight
                        size={18}
                        className="transition-transform duration-300 group-hover:-rotate-45"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
});
