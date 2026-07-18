'use client';

/**
 * TicketBooking Illustration
 * 
 * Boarding pass / ticket stub with a small airplane silhouette.
 * Personality animation: airplane drifts horizontally ±2px.
 * Accent: Cyan #06B6D4
 */

import { motion } from "motion/react";
import type { IllustrationProps } from "./types";
import { BaseIllustration } from "./BaseIllustration";

export function TicketBookingIllustration({
  size = 96,
  accent = "#06B6D4",
  animated = true,
  className,
}: IllustrationProps) {
  return (
    <BaseIllustration size={size} className={className}>
      <defs>
        <linearGradient id="tb-grad" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accent} stopOpacity="0.2" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="tb-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={accent} stopOpacity="0.75" />
        </linearGradient>
        <filter id="tb-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor={accent} floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Background */}
      <circle cx="48" cy="48" r="38" fill="url(#tb-grad)" />

      {/* Ticket body */}
      <g filter="url(#tb-shadow)">
        <rect x="14" y="30" width="68" height="40" rx="5" fill={accent} fillOpacity="0.1" stroke={accent} strokeOpacity="0.45" />

        {/* Perforated line (dashed vertical) */}
        <line x1="58" y1="30" x2="58" y2="70" stroke={accent} strokeOpacity="0.3" strokeDasharray="3 3" />

        {/* Semicircle cutouts at the perforation */}
        <circle cx="58" cy="30" r="4" fill="var(--color-background, #F8F7F4)" stroke={accent} strokeOpacity="0.3" />
        <circle cx="58" cy="70" r="4" fill="var(--color-background, #F8F7F4)" stroke={accent} strokeOpacity="0.3" />

        {/* Left side — ticket details */}
        <line x1="22" y1="40" x2="40" y2="40" stroke={accent} strokeOpacity="0.35" />
        <line x1="22" y1="46" x2="34" y2="46" stroke={accent} strokeOpacity="0.25" />
        <line x1="22" y1="52" x2="48" y2="52" stroke={accent} strokeOpacity="0.35" />
        <line x1="22" y1="58" x2="38" y2="58" stroke={accent} strokeOpacity="0.25" />

        {/* Right side — barcode lines */}
        <line x1="64" y1="38" x2="64" y2="56" stroke={accent} strokeOpacity="0.5" strokeWidth="1.5" />
        <line x1="67" y1="38" x2="67" y2="56" stroke={accent} strokeOpacity="0.6" strokeWidth="1" />
        <line x1="69.5" y1="38" x2="69.5" y2="56" stroke={accent} strokeOpacity="0.4" strokeWidth="1.5" />
        <line x1="72" y1="38" x2="72" y2="56" stroke={accent} strokeOpacity="0.55" strokeWidth="1" />
        <line x1="74.5" y1="38" x2="74.5" y2="56" stroke={accent} strokeOpacity="0.5" strokeWidth="1.5" />
      </g>

      {/* Airplane — personality animation: drift ±2px */}
      <motion.g
        initial={{ x: 0 }}
        animate={animated ? { x: [0, 2, 0, -1, 0] } : undefined}
        transition={animated ? { duration: 6, ease: "easeInOut", repeat: Infinity } : undefined}
      >
        {/* Simple airplane silhouette */}
        <path
          d="M30 42 L26 44 L30 46 L30 45 L38 45 L40 48 L42 48 L40 45 L46 45 L48 47 L50 47 L47 44 L50 44 L50 42 L47 42 L50 39 L48 39 L46 41 L40 41 L42 38 L40 38 L38 41 L30 41 Z"
          fill={accent}
          fillOpacity="0.5"
          stroke={accent}
          strokeOpacity="0.7"
          strokeWidth="0.5"
        />
      </motion.g>
    </BaseIllustration>
  );
}
