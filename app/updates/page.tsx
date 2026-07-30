'use client';

// A browsable archive of everything the customer is entitled to see.
//
// This exists mainly so a notification whose item has scrolled off the carousel
// still leads somewhere sensible, and so /updates/[slug]'s "not available" state
// has a destination. It is not linked from the sidebar.

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { staggerContainer, fadeUp, fadeUpItem } from '@/lib/animations';
import { useContentPlacement } from '@/hooks/useContent';
import { resolveTheme } from '@/lib/content/theme';
import { resolveIcon } from '@/lib/content/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { PublicContentItem } from '@/types/content';

/**
 * Pulls from every customer-facing placement rather than one. An announcement
 * only ever shown as a popup should still be findable here afterwards.
 */
function useAllUpdates() {
  const carousel = useContentPlacement('dashboard_carousel', 20);
  const card = useContentPlacement('dashboard_card', 20);
  const hero = useContentPlacement('homepage_hero', 20);
  const popup = useContentPlacement('popup', 20);
  const bar = useContentPlacement('announcement_bar', 20);

  // One item can now run in several surfaces, so the same row arrives from more
  // than one hook — dedupe by id before rendering.
  const seen = new Set<string>();
  const items = [...carousel.items, ...card.items, ...hero.items, ...popup.items, ...bar.items]
    .filter((i) => (seen.has(i.id) ? false : (seen.add(i.id), true)))
    .sort((a, b) => b.priority - a.priority);

  return {
    items,
    loading: carousel.loading || card.loading || hero.loading || popup.loading || bar.loading,
  };
}

export default function UpdatesPage() {
  const { items, loading } = useAllUpdates();

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex-1 flex flex-col gap-6 pb-10">
      <motion.div variants={fadeUp}>
        <Link href="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>
      </motion.div>

      <motion.h1 variants={fadeUp} className="text-2xl md:text-3xl font-heading font-bold uppercase tracking-wide leading-none">
        Updates
      </motion.h1>

      {loading && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      )}

      {!loading && items.length === 0 && (
        <motion.div variants={fadeUp} className="border-2 border-foreground bg-card p-8 text-center">
          <p className="font-heading font-bold uppercase tracking-wide">Nothing new right now</p>
          <p className="text-xs opacity-60 mt-2 font-medium">Offers and announcements will show up here.</p>
        </motion.div>
      )}

      <div className="flex flex-col gap-4">
        {items.map((item) => <UpdateCard key={item.id} item={item} />)}
      </div>
    </motion.div>
  );
}

function UpdateCard({ item }: { item: PublicContentItem }) {
  const theme = resolveTheme(item.theme);
  const Icon = resolveIcon(item.icon_key);

  return (
    <motion.div variants={fadeUpItem}>
      <Link
        href={`/updates/${item.slug}`}
        className="group flex items-start gap-4 border-2 border-foreground bg-card p-5 shadow-[4px_4px_0px_var(--color-foreground)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
      >
        <div className={cn('p-3 border-2 border-foreground shrink-0', theme.block)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {item.tag && (
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">{item.tag}</span>
          )}
          <h2 className="font-heading font-bold uppercase tracking-wide leading-tight">{item.title}</h2>
          {(item.excerpt || item.subtitle) && (
            <p className="text-xs md:text-sm font-medium opacity-70 line-clamp-2">
              {item.excerpt || item.subtitle}
            </p>
          )}
        </div>
        <ArrowRight className="w-4 h-4 shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}
