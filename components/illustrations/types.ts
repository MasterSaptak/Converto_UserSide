/**
 * Shared types for the Converto Illustration Design System.
 * Every illustration component must implement IllustrationProps
 * to ensure a consistent API across the entire system.
 */

export interface IllustrationProps {
  /** Illustration render size in pixels. Default: 96 (matches the 96×96 SVG canvas). */
  size?: number;
  /** Accent color override. Each illustration has a default accent. */
  accent?: string;
  /** Enable the illustration's personality micro-animation. */
  animated?: boolean;
  /** Additional CSS class for the SVG element. */
  className?: string;
}
