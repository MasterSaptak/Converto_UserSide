'use client';

// A once-per-session modal for placement='popup'.
//
// Mounted inside AppShell's authenticated branch, so it never appears over the
// login screen. Only the highest-priority item is shown — stacking two modals on
// someone opening their dashboard is hostile.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useContentPlacement } from '@/hooks/useContent';
import { useImpression, useContentClick } from '@/hooks/useContentTracking';
import { imageFor } from '@/types/content';
import { resolveTheme } from '@/lib/content/theme';
import { resolveIcon } from '@/lib/content/icons';

const SEEN_PREFIX = 'converto_popup_seen_';

export function ContentPopup() {
  const { items } = useContentPlacement('popup', 3);
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  const candidate = items[0] ?? null;

  // sessionStorage, not localStorage: "once per session" means the customer sees
  // it again tomorrow, which is the behaviour a marketing popup wants. Read in an
  // effect because sessionStorage does not exist during SSR.
  const [alreadySeen, setAlreadySeen] = useState(true);
  useEffect(() => {
    if (!candidate) return;
    try {
      setAlreadySeen(sessionStorage.getItem(`${SEEN_PREFIX}${candidate.id}`) === '1');
    } catch {
      setAlreadySeen(false);
    }
  }, [candidate]);

  const open = Boolean(candidate) && !alreadySeen && dismissedId !== candidate?.id;

  function dismiss() {
    if (!candidate) return;
    try { sessionStorage.setItem(`${SEEN_PREFIX}${candidate.id}`, '1'); } catch { /* private mode */ }
    setDismissedId(candidate.id);
  }

  // Escape closes it, like any other modal.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <AnimatePresence>
      {open && candidate && <PopupCard item={candidate} onDismiss={dismiss} />}
    </AnimatePresence>
  );
}

function PopupCard({
  item, onDismiss,
}: {
  item: NonNullable<ReturnType<typeof useContentPlacement>['items'][number]>;
  onDismiss: () => void;
}) {
  const art = imageFor(item, 'popup');
  const theme = resolveTheme(item.theme);
  const Icon = resolveIcon(item.icon_key);
  // The impression is logged when the modal actually opens, not when the hook
  // mounts — the ref only attaches on the rendered card.
  const trackRef = useImpression(item.id, 'popup');
  const logClick = useContentClick();

  const href = item.cta_href || `/updates/${item.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40"
      onClick={onDismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`popup-title-${item.id}`}
    >
      <motion.div
        ref={trackRef}
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md border-2 border-foreground bg-card shadow-[8px_8px_0px_var(--color-foreground)]"
      >
        {item.is_dismissible && (
          <button
            onClick={onDismiss}
            aria-label="Close"
            className="absolute top-2 right-2 border-2 border-foreground bg-card p-1.5 hover:bg-foreground hover:text-background transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {art.url && (
          <div className="w-full aspect-[16/9] border-b-2 border-foreground overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={art.url} alt={art.alt} loading="eager" decoding="async" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className={cn('p-2.5 border-2 border-foreground shrink-0', theme.block)}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1 min-w-0 pt-0.5">
              {item.tag && (
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{item.tag}</span>
              )}
              <h2 id={`popup-title-${item.id}`} className="text-lg font-heading font-bold uppercase tracking-wide leading-tight">
                {item.title}
              </h2>
            </div>
          </div>

          {(item.excerpt || item.subtitle) && (
            <p className="text-sm font-medium opacity-80 leading-relaxed">{item.excerpt || item.subtitle}</p>
          )}

          <Link
            href={href}
            onClick={() => { logClick(item.id, 'popup', href); onDismiss(); }}
            className="group flex items-center justify-center gap-2 border-2 border-foreground bg-foreground text-background px-5 py-3 font-bold uppercase text-xs tracking-widest hover:bg-card hover:text-foreground transition-colors mt-1"
          >
            {item.cta_label || 'Learn More'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
