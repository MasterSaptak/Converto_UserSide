/**
 * Centralized animation system for Quick Actions.
 * 
 * Single source of truth for all Quick Action motion variants.
 * Every card imports the same variants — no duplicated animation code.
 * 
 * Exported:
 *   - entranceContainer / entranceItem  — staggered entrance
 *   - cardHover / cardTap               — card interaction
 *   - floating() / breathing()          — idle illustration animations
 */

import type { Variants } from "motion/react";

// ─── Entrance ──────────────────────────────────────────────

/** Container variant — staggers children by 80ms */
export const entranceContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Item variant — opacity + scale + blur + translateY */
export const entranceItem: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    filter: "blur(8px)",
    y: 24,
  },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

// ─── Card Interaction ──────────────────────────────────────

/** Desktop hover: scale + rotateX + lift + premium shadow */
export const cardHover = {
  scale: 1.015,
  rotateX: 2,
  y: -6,
  boxShadow: "0 18px 60px rgba(0,0,0,0.12)",
  transition: { duration: 0.3, ease: "easeOut" as const },
};

/** Mobile tap: spring press-down */
export const cardTap = {
  scale: 0.97,
  transition: { type: "spring" as const, stiffness: 400, damping: 17 },
};

// ─── Idle Illustration Animations ──────────────────────────

/**
 * Generate a floating animation config.
 * 
 * @param amplitude — negative px value (e.g. -3 = float up 3px)
 * @param delay     — seconds before the animation starts
 * 
 * @example
 * const config = floating(-3.5, 0.8);
 * <motion.div {...config} />
 */
export function floating(amplitude: number, delay: number) {
  return {
    initial: { y: 0 } as const,
    animate: { y: [0, amplitude, 0] },
    transition: {
      duration: 6 + Math.abs(amplitude) * 0.4,
      ease: "easeInOut" as const,
      repeat: Infinity,
      delay,
    },
  };
}

/**
 * Generate a breathing (scale) animation config.
 * 
 * @param delay — seconds before the animation starts
 * 
 * @example
 * const config = breathing(1.2);
 * <motion.div {...config} />
 */
export function breathing(delay: number) {
  return {
    initial: { scale: 1 } as const,
    animate: { scale: [1, 1.04, 1] },
    transition: {
      duration: 5.5,
      ease: "easeInOut" as const,
      repeat: Infinity,
      delay,
    },
  };
}
