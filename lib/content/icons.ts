// =====================================================
// CONVERTO — Content icon resolution
// =====================================================
// The old PromoCarousel stored `icon` as a live Lucide COMPONENT reference
// (`icon: Zap`, rendered `<promo.icon />`). A database can only hold a string, so
// the column is a key and this maps it back to a component.
//
// Same idiom as the DOC_STATUS map in app/user/cases/[id]/page.tsx.
//
// The `Record<ContentIconKey, LucideIcon>` annotation is doing real work: adding a
// key to CONTENT_ICON_KEYS without adding the import here becomes a COMPILE error
// rather than a blank space on someone's dashboard.

import {
  Zap, Sparkles, ShieldCheck, Gift, Megaphone, Tag, Calendar,
  TrendingUp, AlertTriangle, Wrench, Star, Info, Percent, Rocket,
  type LucideIcon,
} from 'lucide-react';
import type { ContentIconKey } from '@/types/content';

export const CONTENT_ICONS: Record<ContentIconKey, LucideIcon> = {
  'zap': Zap,
  'sparkles': Sparkles,
  'shield': ShieldCheck,
  'gift': Gift,
  'megaphone': Megaphone,
  'tag': Tag,
  'calendar': Calendar,
  'trending-up': TrendingUp,
  'alert-triangle': AlertTriangle,
  'wrench': Wrench,
  'star': Star,
  'info': Info,
  'percent': Percent,
  'rocket': Rocket,
};

/** Megaphone is the fallback — a generic "announcement" mark rather than nothing. */
export function resolveIcon(key: string | null | undefined): LucideIcon {
  if (!key) return Megaphone;
  return CONTENT_ICONS[key as ContentIconKey] ?? Megaphone;
}
