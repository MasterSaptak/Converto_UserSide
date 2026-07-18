/**
 * BaseIllustration — shared SVG wrapper.
 * 
 * Normalizes all illustration SVGs to a consistent 96×96 canvas
 * with GPU-accelerated rendering. Every illustration component
 * renders its paths/shapes as children of this wrapper.
 */

import type { ReactNode } from "react";

interface BaseIllustrationProps {
  /** Render size in pixels. */
  size?: number;
  /** Additional CSS class. */
  className?: string;
  /** SVG content (paths, shapes, defs, etc.) */
  children: ReactNode;
}

export function BaseIllustration({
  size = 96,
  className,
  children,
}: BaseIllustrationProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        willChange: "transform",
        transform: "translateZ(0)",
      }}
      // SVG quality standards: 2px stroke, round caps/joins
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}
