'use client';

/**
 * Education Illustration
 * 
 * Graduation cap (mortarboard) with tassel, book, and payment card.
 * Personality animation: tassel swings ±5°.
 * Accent: Slate #94A3B8
 */

import { motion } from "motion/react";
import type { IllustrationProps } from "./types";
import { BaseIllustration } from "./BaseIllustration";

export function EducationIllustration({
  size = 96,
  accent = "#94A3B8",
  animated = true,
  className,
}: IllustrationProps) {
  // Slate is naturally low-contrast, so we use darker tones
  const strokeColor = "#64748B"; // slate-500 for better visibility
  
  return (
    <BaseIllustration size={size} className={className}>
      <defs>
        <linearGradient id="ed-grad" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="ed-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={strokeColor} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
        <filter id="ed-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor={strokeColor} floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Background */}
      <circle cx="48" cy="48" r="38" fill="url(#ed-grad)" />

      {/* Graduation cap */}
      <g filter="url(#ed-shadow)">
        {/* Mortarboard top (diamond shape) */}
        <path
          d="M48 22 L74 34 L48 46 L22 34 Z"
          fill={strokeColor}
          fillOpacity="0.12"
          stroke={strokeColor}
          strokeOpacity="0.5"
        />

        {/* Cap band/curtain */}
        <path
          d="M30 34 L30 44 Q48 54 66 44 L66 34"
          fill={strokeColor}
          fillOpacity="0.08"
          stroke={strokeColor}
          strokeOpacity="0.35"
        />

        {/* Button on top center */}
        <circle cx="48" cy="34" r="2.5" fill={strokeColor} fillOpacity="0.6" />
      </g>

      {/* Tassel — personality animation: swing ±5° */}
      <motion.g
        initial={{ rotate: 0 }}
        animate={animated ? { rotate: [0, 5, 0, -3, 0] } : undefined}
        transition={animated ? { duration: 4.5, ease: "easeInOut", repeat: Infinity } : undefined}
        style={{ transformOrigin: "48px 34px" }}
      >
        <line x1="48" y1="34" x2="32" y2="50" stroke={strokeColor} strokeOpacity="0.65" />
        <circle cx="32" cy="52" r="2.5" fill={strokeColor} fillOpacity="0.5" stroke={strokeColor} strokeOpacity="0.65" />
      </motion.g>

      {/* Book underneath */}
      <g>
        <rect x="30" y="60" width="28" height="16" rx="2" fill={strokeColor} fillOpacity="0.1" stroke={strokeColor} strokeOpacity="0.35" />
        {/* Spine */}
        <line x1="44" y1="60" x2="44" y2="76" stroke={strokeColor} strokeOpacity="0.25" />
        {/* Pages */}
        <line x1="34" y1="65" x2="42" y2="65" stroke={strokeColor} strokeOpacity="0.2" />
        <line x1="34" y1="69" x2="40" y2="69" stroke={strokeColor} strokeOpacity="0.15" />
      </g>

      {/* Payment card */}
      <g transform="rotate(12 72 66)">
        <rect x="60" y="58" width="22" height="14" rx="2" fill={strokeColor} fillOpacity="0.15" stroke={strokeColor} strokeOpacity="0.4" />
        <line x1="63" y1="63" x2="72" y2="63" stroke={strokeColor} strokeOpacity="0.35" />
        <rect x="63" y="66" width="6" height="3" rx="0.5" fill={strokeColor} fillOpacity="0.25" />
      </g>
    </BaseIllustration>
  );
}
