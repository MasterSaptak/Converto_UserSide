'use client';

// The dashboard promo unit, driven by the database.
//
// Replaces components/dashboard/PromoCarousel.tsx, which rendered from a hardcoded
// PROMOS array and could not be touched from the admin panel. This version is
// deliberately the loudest thing on the dashboard — it is the only surface where
// Converto gets to promote itself, so it earns real estate rather than sitting in
// a thin strip.
//
// Two things the static version could take for granted and this one cannot:
//   1. `icon` was a live Lucide component; the DB holds a string → resolveIcon().
//   2. `color`/`textColor` were raw Tailwind classes; a class living only in a
//      database row is never emitted by Tailwind v4's scanner, so the DB holds a
//      theme TOKEN and resolveTheme() maps it to literal classes.

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useContentPlacement } from '@/hooks/useContent';
import { useImpression, useContentClick } from '@/hooks/useContentTracking';
import { resolveTheme } from '@/lib/content/theme';
import { resolveIcon } from '@/lib/content/icons';
import { imageFor, type PublicContentItem } from '@/types/content';
import type { PlacementKey } from '@/types/placements';

const ROTATE_MS = 6000;

export const ContentCarousel = React.memo(function ContentCarousel({
  placement = 'dashboard_carousel',
}: {
  placement?: PlacementKey;
}) {
  const { items, loading } = useContentPlacement(placement, 6);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Bumped on any manual navigation so the rotation timer and the progress bar
  // both restart — otherwise a manual pick gets yanked away a moment later.
  const [cycle, setCycle] = useState(0);

  const go = useCallback((next: number) => {
    setCurrentIndex(next);
    setCycle((c) => c + 1);
  }, []);

  // The static version could never go out of range because PROMOS.length was
  // fixed. A live list shrinks when an item expires, and an unclamped index
  // slides the track into empty space.
  useEffect(() => {
    if (items.length > 0 && currentIndex >= items.length) setCurrentIndex(0);
  }, [items.length, currentIndex]);

  useEffect(() => {
    if (items.length <= 1 || paused) return;

    const timer = setInterval(() => {
      // A hidden tab should not burn through the rotation; the customer would
      // come back to a random slide having seen none of them.
      if (document.visibilityState !== 'visible') return;
      setCurrentIndex((prev) => (prev + 1) % items.length);
      setCycle((c) => c + 1);
    }, ROTATE_MS);

    return () => clearInterval(timer);
  }, [items.length, paused, cycle]);

  // Render nothing rather than an empty frame — a blank bordered box between the
  // exchange rates and quick actions reads as broken.
  if (loading || items.length === 0) return null;

  const active = items[Math.min(currentIndex, items.length - 1)];
  const theme = resolveTheme(active.theme);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Offers and announcements"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative border-2 border-foreground bg-card w-full overflow-hidden rounded-xl shadow-brutal hover-lift mb-6"
    >
      {/* Accent rail: a solid theme-coloured bar so the unit reads as a promo
          block at a glance, even before the copy is read. */}
      <div className={cn('h-2 w-full border-b-2 border-foreground', theme.bar)} />

      {/* Track */}
      <div
        className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, idx) => (
          <Slide key={item.id} item={item} placement={placement} isActive={idx === currentIndex} />
        ))}
      </div>

      {/* Controls */}
      {items.length > 1 && (
        <>
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 border-t-2 border-foreground bg-card px-4 py-3 z-20">
            {/* Counter — makes it obvious there is more than one thing here. */}
            <span className="font-mono text-[11px] font-bold tracking-widest tabular-nums shrink-0">
              {String(currentIndex + 1).padStart(2, '0')}
              <span className="opacity-40"> / {String(items.length).padStart(2, '0')}</span>
            </span>

            <div className="flex items-center gap-2 flex-1 justify-center">
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => go(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${item.title}`}
                  aria-current={idx === currentIndex}
                  className={cn(
                    'h-2 border-2 border-foreground transition-all duration-300 rounded-full',
                    idx === currentIndex ? 'w-8 bg-foreground' : 'w-2 bg-transparent hover:bg-foreground/20'
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => go((currentIndex - 1 + items.length) % items.length)}
                aria-label="Previous"
                className="border-2 border-foreground p-1.5 hover:bg-foreground hover:text-background transition-colors rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => go((currentIndex + 1) % items.length)}
                aria-label="Next"
                className="border-2 border-foreground p-1.5 hover:bg-foreground hover:text-background transition-colors rounded-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rotation progress. Keyed on cycle so the CSS animation restarts from
              zero on every advance, manual or automatic. */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-transparent z-30 pointer-events-none">
            <div
              key={cycle}
              className={cn('h-full origin-left', theme.bar, !paused && 'animate-[carousel-progress_6s_linear_forwards]')}
              style={{ width: paused ? '100%' : undefined, opacity: paused ? 0.35 : 1 }}
            />
          </div>
        </>
      )}
    </section>
  );
});

function Slide({
  item, placement, isActive,
}: {
  item: PublicContentItem;
  placement: PlacementKey;
  isActive: boolean;
}) {
  const theme = resolveTheme(item.theme);
  const Icon = resolveIcon(item.icon_key);
  const trackRef = useImpression(item.id, placement);
  const logClick = useContentClick();

  // Every slide is in the DOM (the track is a translated flex row), so without
  // this the observer would count all of them as seen the moment the carousel
  // mounts. Only the visible slide is offered to the tracker.
  const setRefs = (node: HTMLDivElement | null) => trackRef(isActive ? node : null);

  const href = item.cta_href || `/updates/${item.slug}`;
  const label = item.cta_label || 'Learn More';
  const art = imageFor(item, placement);
  const hasImage = Boolean(art.url);

  return (
    <div
      ref={setRefs}
      aria-hidden={!isActive}
      aria-roledescription="slide"
      className="w-full shrink-0 grow-0 relative min-h-[180px] md:min-h-[300px] flex items-stretch"
    >
      {/* Visual background (always full width) */}
      <div className={cn(
        'absolute inset-0 z-0 overflow-hidden',
        !hasImage && theme.block
      )}>
        {hasImage ? (
          <Link href={href} onClick={() => logClick(item.id, placement, href)} className="absolute inset-0 z-10 group/link block">
            {/* Screen reader text for accessibility since the visual text is hidden */}
            <span className="sr-only">{item.title}. {item.excerpt}</span>
            {/* Responsive image loading based on screen size */}
            <picture>
              {art.urlMobile && (
                <source media="(max-width: 767px)" srcSet={art.urlMobile} />
              )}
              {art.urlTablet && (
                <source media="(max-width: 1023px)" srcSet={art.urlTablet} />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={art.url!}
                alt={art.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover/link:scale-[1.02]"
              />
            </picture>
          </Link>
        ) : (
          <div className="absolute inset-0 flex items-center justify-end pr-10 md:pr-20">
            {/* Oversized watermark of the same icon */}
            <Icon className="w-32 h-32 md:w-64 md:h-64 opacity-20" strokeWidth={1.5} />
            <div className="absolute -top-16 -right-16 w-64 h-64 border-2 border-foreground/20 rounded-full hidden md:block" />
            <div className="absolute -bottom-20 md:left-20 w-80 h-80 border-2 border-foreground/10 rounded-full hidden md:block" />
          </div>
        )}
      </div>

      {/* Copy overlay - ONLY shown when there is NO image */}
      {!hasImage && (
        <div className="flex-1 flex flex-col justify-center p-6 md:p-10 pb-20 md:pb-16 relative z-10 pointer-events-none">
          <div className="flex flex-col items-start gap-4 pointer-events-auto max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 border-2 border-foreground shrink-0 shadow-brutal bg-card rounded-xl">
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              {item.tag && (
                <span className={cn('border-2 border-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shadow-brutal rounded-lg', theme.chip)}>
                  {item.tag}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 min-w-0">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold uppercase tracking-tight leading-[0.95]">
                {item.title}
              </h2>
              {(item.excerpt || item.subtitle) && (
                <p className="text-sm md:text-base font-medium opacity-80 leading-relaxed max-w-xl">
                  {item.excerpt || item.subtitle}
                </p>
              )}
            </div>

            <Link
              href={href}
              tabIndex={isActive ? 0 : -1}
              onClick={() => logClick(item.id, placement, href)}
              className="group/cta inline-flex items-center gap-2.5 border-2 border-foreground bg-foreground text-background px-6 py-3.5 font-bold uppercase text-xs md:text-sm tracking-widest shadow-brutal rounded-xl hover-lift transition-all self-start mt-1"
            >
              {label}
              <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
