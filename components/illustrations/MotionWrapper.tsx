'use client';

/**
 * MotionWrapper — animation layer for illustrations.
 * 
 * Handles all animation behaviors for any illustration:
 * - Breathing (slow scale 1 → 1.04 → 1)
 * - Floating (random amplitude, random delay)
 * - Mouse parallax (3px shift toward cursor on hover)
 * - Gradient glow behind illustration on hover (opacity 0.15)
 * - Idle shine sweep every 12–18s
 * - Hover scale-up (1.06)
 * 
 * Respects prefers-reduced-motion: disables all idle animations,
 * keeps hover effects.
 * 
 * Architecture: nested motion.divs — each layer animates one
 * property so transforms compose naturally via DOM nesting.
 * 
 *   Container (mouse tracking, glow, shine)
 *     └─ Float layer (y keyframes)
 *         └─ Breathe layer (scale keyframes)
 *             └─ Parallax layer (x/y offset + hover scale)
 *                 └─ {children} (the illustration)
 */

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { floating, breathing } from "@/lib/motion/quick-actions";

interface MotionWrapperProps {
  children: React.ReactNode;
  /** Accent color for the glow effect. */
  accent: string;
  /** Enable idle animations (breathing, floating, shine). */
  animated?: boolean;
  /** Size in pixels. */
  size: number;
  /** Additional CSS class. */
  className?: string;
}

export function MotionWrapper({
  children,
  accent,
  animated = true,
  size,
  className = "",
}: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [showShine, setShowShine] = useState(false);

  const shouldAnimate = animated && !prefersReducedMotion;

  // ─── Hydration-safe random values (computed once per mount) ───
  const motionConfig = useMemo(() => {
    const floatAmp = -(2 + Math.random() * 3);     // -2 to -5
    const floatDel = Math.random() * 2;
    const breathDel = Math.random() * 2;
    const shineInt = 12000 + Math.random() * 6000;  // 12–18s

    return {
      float: floating(floatAmp, floatDel),
      breathe: breathing(breathDel),
      shineInterval: shineInt,
    };
  }, []);

  // ─── Mouse parallax ──────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = ((e.clientX - centerX) / (rect.width / 2)) * 3;
    const y = ((e.clientY - centerY) / (rect.height / 2)) * 3;
    setMouseOffset({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
  }, []);

  // ─── Shine timer ─────────────────────────────────────────────
  useEffect(() => {
    if (!shouldAnimate) return;

    let shineTimeout: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setShowShine(true);
      shineTimeout = setTimeout(() => setShowShine(false), 800);
    }, motionConfig.shineInterval);

    return () => {
      clearInterval(interval);
      clearTimeout(shineTimeout);
    };
  }, [shouldAnimate, motionConfig.shineInterval]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient glow behind illustration on hover */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          inset: -8,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.15 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Float layer */}
      <motion.div
        initial={motionConfig.float.initial}
        animate={shouldAnimate ? motionConfig.float.animate : motionConfig.float.initial}
        transition={shouldAnimate ? motionConfig.float.transition : undefined}
      >
        {/* Breathe layer */}
        <motion.div
          initial={motionConfig.breathe.initial}
          animate={shouldAnimate ? motionConfig.breathe.animate : motionConfig.breathe.initial}
          transition={shouldAnimate ? motionConfig.breathe.transition : undefined}
        >
          {/* Parallax + hover scale layer */}
          <motion.div
            initial={{ x: 0, y: 0, scale: 1 }}
            animate={{
              x: isHovered ? mouseOffset.x : 0,
              y: isHovered ? mouseOffset.y : 0,
              scale: isHovered ? 1.06 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 15,
              mass: 0.5,
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Shine sweep */}
      {showShine && shouldAnimate && (
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ borderRadius: "50%" }}
        >
          <div
            className="absolute"
            style={{
              top: "-100%",
              left: "-100%",
              width: "300%",
              height: "300%",
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
              animation: "illustration-shine 0.8s ease-in-out forwards",
            }}
          />
        </div>
      )}
    </div>
  );
}
