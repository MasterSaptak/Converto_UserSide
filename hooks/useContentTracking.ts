import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { getVisitorKey } from '@/lib/content/visitor';

// Impression + click logging.
//
// Rule for everything in this file: analytics must never be visible to the
// customer. Errors are swallowed, nothing is awaited on a navigation path, and
// no failure here can produce a toast or block a click.

/** An impression needs this much continuous visibility before it counts. */
const DWELL_MS = 1000;
const VISIBLE_RATIO = 0.5;

/**
 * Suppresses repeats within a single page load. The authoritative dedupe is the
 * unique index on (content_item_id, visitor_key, day) in the database — this just
 * avoids pointless round trips as a carousel rotates back around.
 */
const loggedThisPageview = new Set<string>();

/**
 * Returns a ref callback. Attach it to the element whose visibility should count
 * as "seen":
 *
 *   const trackRef = useImpression(item.id, 'dashboard_carousel');
 *   <div ref={trackRef}>…</div>
 */
export function useImpression(contentItemId: string | null, placement: string) {
  const elementRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const log = useCallback(() => {
    if (!contentItemId || loggedThisPageview.has(contentItemId)) return;
    loggedThisPageview.add(contentItemId);

    // Not awaited: this is fire-and-forget telemetry.
    void supabase
      .rpc('fn_log_content_view', {
        p_content_item_id: contentItemId,
        p_placement: placement,
        p_surface: typeof window !== 'undefined' ? window.location.pathname : null,
        p_visitor_key: getVisitorKey(),
      })
      .then(({ error }) => {
        // debug, not error: a missing table before the migration is applied, or an
        // offline customer, should not fill the console with red.
        if (error) console.debug('[content] impression not logged:', error.message);
      });
  }, [contentItemId, placement]);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || !contentItemId) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const clear = () => {
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        // A background tab still reports elements as intersecting, so the
        // visibility check is what stops a hidden tab logging impressions.
        if (entry.isIntersecting && document.visibilityState === 'visible') {
          if (!timerRef.current) timerRef.current = setTimeout(log, DWELL_MS);
        } else {
          clear();
        }
      },
      { threshold: VISIBLE_RATIO }
    );

    observer.observe(el);
    return () => { clear(); observer.disconnect(); };
  }, [contentItemId, log]);

  return useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);
}

/**
 * Click logging. Call it in the CTA's onClick BEFORE navigation — it is not
 * awaited, so it cannot delay or block the link.
 */
export function useContentClick() {
  return useCallback((contentItemId: string, placement: string, target: string) => {
    void supabase
      .rpc('fn_log_content_click', {
        p_content_item_id: contentItemId,
        p_placement: placement,
        p_target: target,
        p_visitor_key: getVisitorKey(),
      })
      .then(({ error }) => {
        if (error) console.debug('[content] click not logged:', error.message);
      });
  }, []);
}
