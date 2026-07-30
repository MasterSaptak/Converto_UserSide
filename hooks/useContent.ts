import { useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import type { PublicContentItem } from '@/types/content';
import type { PlacementKey } from '@/types/placements';

/**
 * The column list UserSide is allowed to care about. Admin-only fields are omitted.
 *
 * `placements` is an inner join (v24): filtering on the embedded table only works
 * with `!inner`, and it also means an item with no surface simply does not appear
 * rather than arriving with an empty array to filter out client-side.
 */
const BASE_COLUMNS = `
  id, slug, content_type, title, subtitle, excerpt, body,
  icon_key, theme, tag,
  cta_label, cta_href, cta_style, priority, is_dismissible
`;

const PUBLIC_COLUMNS = `
  ${BASE_COLUMNS},
  placements:content_placements!inner(placement, service_slug, image_url, image_alt)
`;

/** Left join — the detail page renders whether or not the item has surfaces. */
const DETAIL_COLUMNS = `
  ${BASE_COLUMNS},
  placements:content_placements(placement, service_slug, image_url, image_alt)
`;

/**
 * Live content for one placement, best first.
 *
 * Note what this query does NOT do: it never filters on publish_at / expire_at and
 * never filters on audience. Both live in the RLS policy, which means
 *   · the time window is evaluated against the SERVER's clock, so a device with a
 *     skewed clock can neither reveal something early nor hide something just
 *     published; and
 *   · a customer physically cannot fetch content aimed at someone else, even by
 *     querying this table directly.
 * Re-applying either filter here would add a second, drifting source of truth.
 */
export function useContentPlacement(
  placement: PlacementKey,
  limit = 5,
  /** Required for a serviceScoped placement (service_hero, service_sidebar). */
  serviceSlug?: string,
) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // user.id belongs in the key: RLS output depends on who is asking, so a login
  // or logout must not serve the previous audience's cached content.
  const queryKey = useMemo(
    () => ['content_items', placement, serviceSlug ?? null, user?.id ?? 'anon', limit],
    [placement, serviceSlug, user?.id, limit]
  );

  const { data: items = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase
        .from('content_items')
        .select(PUBLIC_COLUMNS)
        .eq('content_placements.placement', placement);

      // Only constrain the service when the caller supplied one — a non-scoped
      // surface has service_slug NULL and must not be filtered on it.
      if (serviceSlug) query = query.eq('content_placements.service_slug', serviceSlug);

      const { data, error: fetchError } = await query
        .order('priority', { ascending: false })
        .order('publish_at', { ascending: false, nullsFirst: false })
        .limit(limit);

      if (fetchError) throw fetchError;
      return (data as unknown as PublicContentItem[]) || [];
    },
  });

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  useEffect(() => {
    // A per-instance suffix, because two components can request the same
    // placement on one page and a duplicate channel name would collide.
    // (useCases.ts gets away without one only because it is mounted once.)
    // Invalidate rather than patching the payload in: the realtime row arrives
    // before RLS has been re-evaluated for this viewer, so merging it could
    // surface an item this customer is not in the audience for.
    const invalidate = () => queryClient.invalidateQueries({ queryKey });

    const channel = supabase
      .channel(`content_${placement}_${Math.random().toString(36).slice(2)}`)
      // Unfiltered on the parent since v24: `placement` no longer lives on
      // content_items, so there is nothing on this table to filter by. Content
      // changes are rare (a staff member editing a promo), so the cost of
      // invalidating on any row is a single refetch.
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'content_items' },
        invalidate
      )
      // The child table is where a surface actually gets added or removed.
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'content_placements' },
        invalidate
      )
      // DELETE is subscribed UNFILTERED on purpose. Postgres ships only the
      // primary key in a delete payload unless the table is REPLICA IDENTITY
      // FULL, so `placement=eq.…` can never match one — with only the filtered
      // binding above, a deleted item stays on the dashboard until something else
      // triggers a refetch. Deletes are rare and carry no body, so this costs
      // nothing. A duplicate invalidate is harmless.
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'content_items' },
        invalidate
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [placement, queryClient, queryKey]);

  return {
    items,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    refetch,
  };
}

/** One item by slug, for /updates/[slug]. Returns null when it is not visible to this viewer. */
export function useContentItem(slug: string | null) {
  const { user } = useAuth();
  const queryKey = useMemo(() => ['content_item', slug, user?.id ?? 'anon'], [slug, user?.id]);

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!slug) return null;
      const { data: row, error: fetchError } = await supabase
        .from('content_items')
        // NOT the !inner list: an item's own page must render even when it runs
        // in no surface at all (a link-only announcement sent by notification).
        // An inner join would 404 it.
        .select(DETAIL_COLUMNS)
        .eq('slug', slug)
        // maybeSingle, not single: RLS hiding the row is a legitimate "not found",
        // not an error to throw at the customer.
        .maybeSingle();

      if (fetchError) throw fetchError;
      return (row as unknown as PublicContentItem) ?? null;
    },
    enabled: !!slug,
  });

  return {
    item: data ?? null,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
  };
}
