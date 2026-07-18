'use client';

/**
 * Tracking Illustration
 * 
 * Delivery parcel with GPS pin and dotted route line.
 * Personality animation: GPS pin bounces every ~10 seconds.
 * Accent: Orange #F97316
 */

import { motion } from "motion/react";
import type { IllustrationProps } from "./types";
import { BaseIllustration } from "./BaseIllustration";

export function TrackingIllustration({
  size = 96,
  accent = "#F97316",
  animated = true,
  className,
}: IllustrationProps) {
  return (
    <BaseIllustration size={size} className={className}>
      <defs>
        <linearGradient id="tr-grad" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accent} stopOpacity="0.2" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="tr-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={accent} stopOpacity="0.75" />
        </linearGradient>
        <filter id="tr-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor={accent} floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Background */}
      <circle cx="48" cy="48" r="38" fill="url(#tr-grad)" />

      {/* Delivery parcel */}
      <g filter="url(#tr-shadow)">
        <rect x="16" y="38" width="34" height="30" rx="4" fill={accent} fillOpacity="0.12" stroke={accent} strokeOpacity="0.5" />

        {/* Tape cross */}
        <line x1="33" y1="38" x2="33" y2="68" stroke={accent} strokeOpacity="0.4" />
        <line x1="16" y1="53" x2="50" y2="53" stroke={accent} strokeOpacity="0.4" />

        {/* Shipping label */}
        <rect x="20" y="42" width="12" height="8" rx="1" fill={accent} fillOpacity="0.2" stroke={accent} strokeOpacity="0.35" />
        <line x1="22" y1="45" x2="30" y2="45" stroke={accent} strokeOpacity="0.3" strokeWidth="1" />
        <line x1="22" y1="47.5" x2="28" y2="47.5" stroke={accent} strokeOpacity="0.25" strokeWidth="1" />
      </g>

      {/* Dotted route line */}
      <path
        d="M50 58 Q60 58 66 50 Q72 42 72 36"
        fill="none"
        stroke={accent}
        strokeOpacity="0.35"
        strokeDasharray="3 3"
      />

      {/* GPS pin — personality animation: tiny bounce every 10s */}
      <motion.g
        initial={{ y: 0 }}
        animate={animated ? { y: [0, -2, 0] } : undefined}
        transition={animated ? { duration: 0.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 10 } : undefined}
      >
        {/* Pin body (teardrop) */}
        <path
          d="M72 34 C72 28 68 22 64 22 C60 22 56 28 56 34 C56 38 64 48 64 48 C64 48 72 38 72 34 Z"
          fill={accent}
          fillOpacity="0.25"
          stroke={accent}
          strokeOpacity="0.6"
        />
        {/* Inner dot */}
        <circle cx="64" cy="32" r="4" fill={accent} fillOpacity="0.35" stroke={accent} strokeOpacity="0.5" />
      </motion.g>

      {/* Small route dots */}
      <circle cx="54" cy="56" r="1.5" fill={accent} fillOpacity="0.5" />
      <circle cx="62" cy="48" r="1.5" fill={accent} fillOpacity="0.5" />
    </BaseIllustration>
  );
}
