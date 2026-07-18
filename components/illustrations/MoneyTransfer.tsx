'use client';

/**
 * MoneyTransfer Illustration
 * 
 * Globe with latitude/longitude arcs, transfer arrows, and currency dots.
 * Personality animation: globe rotates ±2°.
 * Accent: Emerald #22C55E
 */

import { motion } from "motion/react";
import type { IllustrationProps } from "./types";
import { BaseIllustration } from "./BaseIllustration";

export function MoneyTransferIllustration({
  size = 96,
  accent = "#22C55E",
  animated = true,
  className,
}: IllustrationProps) {
  return (
    <BaseIllustration size={size} className={className}>
      <defs>
        <linearGradient id="mt-grad" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accent} stopOpacity="0.2" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="mt-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={accent} stopOpacity="0.75" />
        </linearGradient>
        <filter id="mt-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor={accent} floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Background */}
      <circle cx="48" cy="48" r="38" fill="url(#mt-grad)" />

      {/* Globe — personality animation: rotate ±2° */}
      <motion.g
        initial={{ rotate: 0 }}
        animate={animated ? { rotate: [0, 2, 0, -2, 0] } : undefined}
        transition={animated ? { duration: 7, ease: "easeInOut", repeat: Infinity } : undefined}
        style={{ transformOrigin: "48px 44px" }}
        filter="url(#mt-shadow)"
      >
        {/* Globe outline */}
        <circle cx="48" cy="44" r="22" fill={accent} fillOpacity="0.1" stroke={accent} strokeOpacity="0.5" />

        {/* Longitude ellipse */}
        <ellipse cx="48" cy="44" rx="10" ry="22" fill="none" stroke={accent} strokeOpacity="0.3" />

        {/* Latitude curves */}
        <path d="M26 38 Q48 32 70 38" fill="none" stroke={accent} strokeOpacity="0.3" />
        <path d="M26 50 Q48 56 70 50" fill="none" stroke={accent} strokeOpacity="0.3" />

        {/* Equator */}
        <line x1="26" y1="44" x2="70" y2="44" stroke={accent} strokeOpacity="0.25" />
      </motion.g>

      {/* Transfer arrow — curved around bottom of globe */}
      <path
        d="M28 72 Q48 64 68 72"
        fill="none"
        stroke="url(#mt-accent)"
        strokeOpacity="0.85"
      />
      <polyline
        points="64,68 68,72 64,76"
        fill="none"
        stroke="url(#mt-accent)"
        strokeOpacity="0.85"
      />

      {/* Currency dots */}
      <circle cx="28" cy="72" r="4" fill={accent} fillOpacity="0.25" stroke={accent} strokeOpacity="0.55" />
      <circle cx="68" cy="72" r="4" fill={accent} fillOpacity="0.25" stroke={accent} strokeOpacity="0.55" />

      {/* Dollar sign on left dot */}
      <line x1="28" y1="70" x2="28" y2="74" stroke={accent} strokeOpacity="0.6" strokeWidth="1" />

      {/* Rupee-ish sign on right dot */}
      <line x1="66" y1="71" x2="70" y2="71" stroke={accent} strokeOpacity="0.6" strokeWidth="1" />
      <line x1="68" y1="70" x2="68" y2="74" stroke={accent} strokeOpacity="0.6" strokeWidth="1" />
    </BaseIllustration>
  );
}
