'use client';

/**
 * QuickActions — Premium fintech Quick Actions section.
 * 
 * Uses the Illustration Design System for scalable, consistent
 * illustrations with breathing, floating, parallax, glow, and shine
 * animations.
 * 
 * Adding a new service:
 *   1. Create an illustration component
 *   2. Register it in IllustrationRegistry
 *   3. Add one entry to ACTIONS below
 */

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { IllustrationRegistry, MotionWrapper } from "@/components/illustrations";
import {
  entranceContainer,
  entranceItem,
  cardHover,
  cardTap,
} from "@/lib/motion/quick-actions";

// ─── Action definitions ────────────────────────────────────

const ACTIONS = [
  {
    href: "/services/exchange",
    label: "Money Exchange",
    illustrationKey: "exchange",
    accent: "#EC4899",
  },
  {
    href: "/services/buy-for-me",
    label: "Buy For Me",
    illustrationKey: "buy_for_me",
    accent: "#F59E0B",
  },
  {
    href: "/services/tickets?type=flight",
    label: "Ticket Booking",
    illustrationKey: "ticket_booking",
    accent: "#06B6D4",
  },
  {
    href: "/services/education",
    label: "Educational Payment",
    illustrationKey: "education",
    accent: "#94A3B8",
  },
  {
    href: "/services/global-payments",
    label: "Money Transfer",
    illustrationKey: "global_payments",
    accent: "#22C55E",
  },
  {
    href: "/track",
    label: "Track",
    illustrationKey: "track",
    accent: "#F97316",
  }
];

// ─── Component ─────────────────────────────────────────────

import React from 'react';

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
      <motion.div
        className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4 pb-4"
        variants={entranceContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10px" }}
      >
        {ACTIONS.map((action) => {
          const Illustration = IllustrationRegistry[action.illustrationKey];

          return (
            <motion.div
              key={action.href}
              variants={entranceItem}
              className="h-full"
              style={{ perspective: 800 }}
            >
              <Link href={action.href} className="block h-full">
                <motion.div
                  className="relative flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer h-full aspect-square sm:aspect-[4/3] p-3 sm:p-4 bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80"
                  style={{
                    borderRadius: 16,
                    border: `1.5px solid ${action.accent}4D`,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
                  }}
                  whileHover={prefersReducedMotion ? undefined : cardHover}
                  whileTap={cardTap}
                >
                  {/* Glass overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/30 via-transparent to-transparent dark:from-white/[0.06] dark:via-transparent dark:to-transparent"
                    style={{ borderRadius: "inherit" }}
                  />

                  {/* Illustration with breathing/floating/parallax/glow/shine */}
                  <div className="relative z-10 mb-1.5 sm:mb-2.5">
                    <MotionWrapper
                      accent={action.accent}
                      size={56}
                      animated={!prefersReducedMotion}
                    >
                      {Illustration && (
                        <Illustration
                          size={56}
                          accent={action.accent}
                          animated={!prefersReducedMotion}
                        />
                      )}
                    </MotionWrapper>
                  </div>

                  {/* Label */}
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase leading-tight tracking-wider relative z-10">
                    {action.label}
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
});
