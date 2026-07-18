'use client';

/**
 * BuyForMe Illustration
 * 
 * Shopping bag with handles and a small price tag.
 * Personality animation: bag squash/stretch 1% on scaleY.
 * Accent: Amber #F59E0B
 */

import { motion } from "motion/react";
import type { IllustrationProps } from "./types";
import { BaseIllustration } from "./BaseIllustration";

export function BuyForMeIllustration({
  size = 96,
  accent = "#F59E0B",
  animated = true,
  className,
}: IllustrationProps) {
  return (
    <BaseIllustration size={size} className={className}>
      <defs>
        <linearGradient id="bf-grad" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accent} stopOpacity="0.2" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="bf-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={accent} stopOpacity="0.75" />
        </linearGradient>
        <filter id="bf-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor={accent} floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Background */}
      <circle cx="48" cy="48" r="38" fill="url(#bf-grad)" />

      {/* Shopping bag — personality animation: squash */}
      <motion.g
        initial={{ scaleY: 1 }}
        animate={animated ? { scaleY: [1, 0.99, 1, 1.01, 1] } : undefined}
        transition={animated ? { duration: 5, ease: "easeInOut", repeat: Infinity } : undefined}
        style={{ transformOrigin: "48px 54px" }}
        filter="url(#bf-shadow)"
      >
        {/* Bag body */}
        <rect x="28" y="38" width="40" height="36" rx="4" fill={accent} fillOpacity="0.12" stroke={accent} strokeOpacity="0.5" />

        {/* Bag fold line at top */}
        <line x1="28" y1="46" x2="68" y2="46" stroke={accent} strokeOpacity="0.25" />

        {/* Handles */}
        <path d="M38 38 Q38 26 48 26 Q58 26 58 38" fill="none" stroke={accent} strokeOpacity="0.55" />
      </motion.g>

      {/* Price tag hanging from handle */}
      <g>
        <rect x="60" y="24" width="14" height="10" rx="2" fill={accent} fillOpacity="0.25" stroke={accent} strokeOpacity="0.55" />
        <circle cx="63" cy="29" r="1.5" fill={accent} fillOpacity="0.6" />
        <line x1="66" y1="27" x2="72" y2="27" stroke={accent} strokeOpacity="0.45" />
        <line x1="66" y1="30" x2="70" y2="30" stroke={accent} strokeOpacity="0.35" />
      </g>

      {/* Small package to the right */}
      <g>
        <rect x="64" y="56" width="16" height="14" rx="2" fill={accent} fillOpacity="0.08" stroke={accent} strokeOpacity="0.3" />
        <line x1="72" y1="56" x2="72" y2="70" stroke={accent} strokeOpacity="0.35" />
        <line x1="64" y1="63" x2="80" y2="63" stroke={accent} strokeOpacity="0.35" />
      </g>
    </BaseIllustration>
  );
}
