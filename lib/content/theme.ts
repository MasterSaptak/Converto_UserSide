// =====================================================
// CONVERTO — Content theme tokens (CUSTOMER palette)
// =====================================================
// The database stores a TOKEN ('emerald'), never a class name ('bg-emerald-400').
//
// This is a hard constraint, not a preference. Tailwind v4 builds its stylesheet
// by scanning source files, so a class that exists only in a database row is never
// emitted and the element renders completely unstyled. This app has no
// tailwind.config at all (CSS-first @theme in app/globals.css), so there is no
// `safelist` escape hatch either. Every class below is written as a literal the
// scanner can see.
//
// ServerSide has its own copy (app/(admin)/content/theme.ts) with the SAME KEYS
// and DIFFERENT VALUES — the admin preview should look like the admin. The shared
// Record<ContentTheme, …> type is what stops the key sets drifting apart.

import type { ContentTheme } from '@/types/content';

export interface ThemeClasses {
  /** The icon tile — matches the old PromoCarousel `color`/`textColor` pair. */
  block: string;
  /** The small tag chip above the title. */
  chip: string;
  /** A solid accent bar. */
  bar: string;
}

export const CONTENT_THEME_CLASSES: Record<ContentTheme, ThemeClasses> = {
  neutral: {
    block: 'bg-secondary text-secondary-foreground',
    chip: 'bg-secondary text-secondary-foreground',
    bar: 'bg-foreground',
  },
  primary: {
    // The original PROMOS[1] used exactly this pair.
    block: 'bg-primary text-primary-foreground',
    chip: 'bg-primary text-primary-foreground',
    bar: 'bg-primary',
  },
  emerald: {
    // PROMOS[0]
    block: 'bg-emerald-400 text-emerald-950',
    chip: 'bg-emerald-200 text-emerald-950',
    bar: 'bg-emerald-500',
  },
  blue: {
    // PROMOS[2] — the "Bank-Grade Security" slide.
    block: 'bg-blue-400 text-blue-950',
    chip: 'bg-blue-200 text-blue-950',
    bar: 'bg-blue-500',
  },
  amber: {
    block: 'bg-amber-400 text-amber-950',
    chip: 'bg-amber-200 text-amber-950',
    bar: 'bg-amber-500',
  },
  violet: {
    block: 'bg-violet-400 text-violet-950',
    chip: 'bg-violet-200 text-violet-950',
    bar: 'bg-violet-500',
  },
  rose: {
    block: 'bg-rose-400 text-rose-950',
    chip: 'bg-rose-200 text-rose-950',
    bar: 'bg-rose-500',
  },
  slate: {
    block: 'bg-slate-300 text-slate-950',
    chip: 'bg-slate-200 text-slate-950',
    bar: 'bg-slate-500',
  },
};

/** Falls back to neutral rather than rendering unstyled if the DB holds an unknown token. */
export function resolveTheme(token: string | null | undefined): ThemeClasses {
  if (!token) return CONTENT_THEME_CLASSES.neutral;
  return CONTENT_THEME_CLASSES[token as ContentTheme] ?? CONTENT_THEME_CLASSES.neutral;
}
