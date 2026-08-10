'use client';

/**
 * MoneyExchange Illustration
 * 
 * Two overlapping currency banknotes with bidirectional exchange arrows.
 * Personality animation: arrows slide ±1.5px horizontally.
 * Accent: Pink #EC4899
 */

import { motion } from "motion/react";
import type { IllustrationProps } from "./types";
import { BaseIllustration } from "./BaseIllustration";

export function MoneyExchangeIllustration({
  size = 96,
  accent = "#EC4899",
  animated = true,
  className,
}: IllustrationProps) {
  return (
    <BaseIllustration size={size} className={className}>
      <defs>
        <linearGradient id="me-grad" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accent} stopOpacity="0.2" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="me-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={accent} stopOpacity="0.75" />
        </linearGradient>
        <filter id="me-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor={accent} floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Background */}
      <circle cx="48" cy="48" r="38" fill="url(#me-grad)" />

      {/* Back banknote — rotated slightly */}
      <g transform="rotate(-7 44 40)" filter="url(#me-shadow)">
        <rect x="20" y="26" width="48" height="30" rx="5" fill={accent} fillOpacity="0.1" stroke={accent} strokeOpacity="0.45" />
        {/* Decorative lines */}
        <line x1="28" y1="36" x2="44" y2="36" stroke={accent} strokeOpacity="0.3" />
        <line x1="28" y1="42" x2="38" y2="42" stroke={accent} strokeOpacity="0.2" />
        {/* Currency circle */}
        <circle cx="58" cy="41" r="6" fill={accent} fillOpacity="0.25" stroke={accent} strokeOpacity="0.55" />
      </g>

      {/* Front banknote — rotated opposite */}
      <g transform="rotate(5 52 48)" filter="url(#me-shadow)">
        <rect x="28" y="34" width="48" height="30" rx="5" fill={accent} fillOpacity="0.12" stroke={accent} strokeOpacity="0.5" />
        {/* Decorative lines */}
        <line x1="36" y1="44" x2="52" y2="44" stroke={accent} strokeOpacity="0.3" />
        <line x1="36" y1="50" x2="46" y2="50" stroke={accent} strokeOpacity="0.2" />
        {/* Currency circle */}
        <circle cx="66" cy="49" r="6" fill={accent} fillOpacity="0.3" stroke={accent} strokeOpacity="0.6" />
      </g>

      {/* Exchange arrows — personality animation: slide ±1.5px */}
      <motion.g
        initial={{ x: 0 }}
        animate={animated ? { x: [0, 1.5, 0, -1.5, 0] } : undefined}
        transition={animated ? { duration: 4, ease: "easeInOut", repeat: Infinity } : undefined}
      >
        {/* Left-to-right arrow */}
        <line x1="22" y1="78" x2="38" y2="78" stroke="url(#me-accent)" />
        <polyline points="34,74 38,78 34,82" stroke="url(#me-accent)" fill="none" />

        {/* Right-to-left arrow */}
        <line x1="74" y1="78" x2="58" y2="78" stroke="url(#me-accent)" />
        <polyline points="62,74 58,78 62,82" stroke="url(#me-accent)" fill="none" />
      </motion.g>
    </BaseIllustration>
  );
}
