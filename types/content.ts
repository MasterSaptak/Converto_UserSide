// =====================================================
// CONVERTO — Content Engine shared types
// =====================================================
// Shared between UserSide and ServerSide.
// Keep this file identical in both projects.
// (Same contract as lib/notifications/types.ts.)
//
// Mirrors schema_v23_content_engine.sql. The taxonomy arrays below are the single
// source of truth the verify script diffs against the database CHECK constraints —
// see verify_v23_content.mjs. Adding a value here without adding it to the CHECK
// (or the reverse) is a test failure, not a runtime surprise.
// =====================================================

// ─────────────────────────────────────────────────────────────────────────────
// Content blocks
// ─────────────────────────────────────────────────────────────────────────────
// Deliberately FLAT — no nesting, no recursion. That means no z.lazy in the Zod
// schema, no unbounded depth to guard, and a renderer that is one switch.
//
// Every text field is rendered as a plain React text node. There is no `html`
// variant and there never will be one: structured blocks exist precisely so that
// nothing ever needs dangerouslySetInnerHTML.

export type ContentBlock =
  | { type: 'heading';   level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string; emphasis?: boolean }
  | { type: 'image';     url: string; alt: string; caption?: string; aspect?: ContentImageAspect }
  | { type: 'list';      style: 'bullet' | 'number'; items: string[] }
  | { type: 'cta';       label: string; href: string; style: ContentCtaStyle }
  | { type: 'divider' }
  | { type: 'callout';   tone: ContentCalloutTone; title?: string; text: string }
  | { type: 'stat';      label: string; value: string; hint?: string }
  | { type: 'quote';     text: string; attribution?: string }
  // ── v24 ──────────────────────────────────────────────────────────────────
  // Accordion, FAQ and table are structured DATA, which is exactly why they live
  // here rather than inside a rich-text editor: a WYSIWYG would store them as
  // markup and lose the structure the renderer needs.
  | { type: 'video';     url: string; poster?: string; caption?: string }
  | { type: 'gallery';   images: { url: string; alt: string }[]; columns?: 2 | 3 }
  | { type: 'accordion'; items: { title: string; body: string }[] }
  | { type: 'faq';       items: { question: string; answer: string }[] }
  | { type: 'table';     headers: string[]; rows: string[][]; caption?: string }
  | { type: 'buttons';   items: { label: string; href: string; style: ContentCtaStyle }[] };

export type ContentBlockType = ContentBlock['type'];

export const CONTENT_BLOCK_TYPES = [
  'heading', 'paragraph', 'image', 'list', 'cta', 'divider', 'callout', 'stat', 'quote',
  'video', 'gallery', 'accordion', 'faq', 'table', 'buttons',
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Taxonomies — must match the CHECK constraints in schema_v23_content_engine.sql
// ─────────────────────────────────────────────────────────────────────────────

export const CONTENT_TYPES = [
  'advertisement', 'announcement', 'banner', 'popup', 'promotion',
  'security_notice', 'maintenance', 'feature_release', 'seasonal', 'referral',
] as const;

/**
 * @deprecated Since v24. Placements moved to the `content_placements` child table
 * so one item can run in several surfaces, each with its own artwork. The live
 * vocabulary — plus every dimension, ratio and size cap — is in
 * `types/placements.ts`, which is the single source of truth.
 *
 * Retained only because `content_items.placement` still exists as a deprecated
 * column for rollout safety.
 */
export const CONTENT_PLACEMENTS = [
  'home_hero', 'dashboard_banner', 'dashboard_carousel', 'popup_modal',
  'services_banner', 'wallet_banner', 'support_notice', 'global_ticker', 'detail_only',
] as const;

/** `paused` = taken down now, schedule kept, resumable. */
export const CONTENT_STATUSES = ['draft', 'scheduled', 'published', 'archived', 'paused'] as const;

export const CONTENT_THEMES = [
  'neutral', 'primary', 'emerald', 'blue', 'amber', 'violet', 'rose', 'slate',
] as const;

export const CONTENT_CTA_STYLES = ['primary', 'ghost', 'link'] as const;

export const CONTENT_CALLOUT_TONES = ['info', 'success', 'warning', 'danger'] as const;

export const CONTENT_IMAGE_ASPECTS = ['wide', 'square', 'tall'] as const;

export const AUDIENCE_KINDS = [
  'all', 'customers', 'staff', 'service_users', 'specific_profiles',
] as const;

// Every key here is verified to exist in BOTH lucide-react ^0.553 (ServerSide)
// and ^1.24 (UserSide). Do not add one without checking both.
export const CONTENT_ICON_KEYS = [
  'zap', 'sparkles', 'shield', 'gift', 'megaphone', 'tag', 'calendar',
  'trending-up', 'alert-triangle', 'wrench', 'star', 'info', 'percent', 'rocket',
] as const;

export type ContentType         = typeof CONTENT_TYPES[number];
export type ContentPlacement    = typeof CONTENT_PLACEMENTS[number];
export type ContentStatus       = typeof CONTENT_STATUSES[number];
export type ContentTheme        = typeof CONTENT_THEMES[number];
export type ContentCtaStyle     = typeof CONTENT_CTA_STYLES[number];
export type ContentCalloutTone  = typeof CONTENT_CALLOUT_TONES[number];
export type ContentImageAspect  = typeof CONTENT_IMAGE_ASPECTS[number];
export type AudienceKind        = typeof AUDIENCE_KINDS[number];
export type ContentIconKey      = typeof CONTENT_ICON_KEYS[number];

// ─────────────────────────────────────────────────────────────────────────────
// The row
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A row of `content_placements` (v24): one surface this item runs in, with the
 * artwork cropped for that surface. `service_slug` is set only for a
 * serviceScoped placement and references `services.slug` BY VALUE — never a FK,
 * so retiring a service cannot break existing content.
 */
export interface ContentPlacementRow {
  id: string;
  content_item_id: string;
  /** A PlacementKey from types/placements.ts. */
  placement: string;
  service_slug: string | null;
  image_url: string | null;
  image_alt: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** What the editor submits per placement. No id — the server reconciles the set. */
export interface PlacementInput {
  placement: string;
  service_slug?: string | null;
  image_url?: string | null;
  image_alt?: string | null;
}

export interface ContentItem {
  id: string;
  slug: string;

  content_type: ContentType;
  /** @deprecated Since v24 — read `placements` instead. */
  placement: ContentPlacement;
  status: ContentStatus;

  title: string;
  subtitle: string | null;
  excerpt: string | null;
  body: ContentBlock[];

  /** Token, not a class name. Resolved through lib/content/icons.ts. */
  icon_key: ContentIconKey | null;
  /** Token, not a class name. Resolved through lib/content/theme.ts. */
  theme: ContentTheme;
  image_url: string | null;
  image_alt: string | null;
  tag: string | null;

  cta_label: string | null;
  cta_href: string | null;
  cta_style: ContentCtaStyle;

  details_description: string | null;
  details_requirements: string | null;
  details_process: string | null;
  details_costs: string | null;

  publish_at: string | null;
  expire_at: string | null;
  priority: number;
  is_dismissible: boolean;

  audience_kind: AudienceKind;
  audience_service_slugs: string[];
  audience_profile_ids: string[];
  audience_filter: Record<string, unknown>;
  /** v24. Free-text country names matched case-insensitively — profiles.country is not ISO. */
  audience_countries: string[];
  /** v24. Matched against user_rewards.tier. */
  audience_reward_tiers: string[];

  notify_on_publish: boolean;
  notified_at: string | null;
  notified_count: number;

  view_count: number;
  click_count: number;

  metadata: Record<string, unknown>;
  created_by: string | null;
  published_by: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;

  /** v24 soft delete. Non-null means it is in Trash, purged after 30 days. */
  deleted_at: string | null;
  deleted_by: string | null;

  /** Joined from content_placements. Absent when the query did not embed it. */
  placements?: ContentPlacementRow[];
}

/**
 * The column subset UserSide reads. Body is included; admin-only fields are not.
 *
 * Note there is no `image_url` here since v24 — artwork is per-surface, so the
 * renderer takes it from the matching `placements` entry. `imageFor()` below is
 * the accessor.
 */
export type PublicContentItem = Pick<ContentItem,
  | 'id' | 'slug' | 'content_type' | 'title' | 'subtitle' | 'excerpt'
  | 'body' | 'icon_key' | 'theme' | 'tag'
  | 'cta_label' | 'cta_href' | 'cta_style' | 'priority' | 'is_dismissible'
  | 'details_description' | 'details_requirements' | 'details_process' | 'details_costs'>
  & { placements?: Pick<ContentPlacementRow, 'placement' | 'service_slug' | 'image_url' | 'image_alt'>[] };

/**
 * The artwork for one surface. Returns nulls rather than throwing when the item
 * has no image there — every renderer already has a no-image fallback, and a
 * missing banner must never blank the whole component.
 */
export function imageFor(
  item: PublicContentItem,
  placement: string,
): { url: string | null; alt: string } {
  const match = item.placements?.find((p) => p.placement === placement);
  return { url: match?.image_url ?? null, alt: match?.image_alt ?? '' };
}

/** Row shape returned by the fn_content_analytics RPC. CTR is derived in TS. */
export interface ContentAnalyticsRow {
  content_item_id: string;
  title: string;
  slug: string;
  content_type: ContentType;
  placement: ContentPlacement;
  status: ContentStatus;
  views: number;
  clicks: number;
  unique_viewers: number;
}

/** JSONB returned by fn_publish_content_item. */
export interface PublishResult {
  status: ContentStatus;
  notified: number;
  audience_matched: number;
  /** True when the item is scheduled: nothing was sent, a manual send is offered later. */
  deferred: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Display helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The editorial `status` column is not the whole story: visibility is driven by
 * the publish/expire window, because there is no cron in this stack to flip a
 * flag. This derives what a human should actually see in the admin list.
 */
export type ContentDisplayState =
  | 'draft' | 'scheduled' | 'live' | 'expired' | 'archived' | 'paused' | 'trashed';

export function deriveDisplayState(
  item: Pick<ContentItem, 'status' | 'publish_at' | 'expire_at'> & { deleted_at?: string | null },
  now: Date = new Date(),
): ContentDisplayState {
  // Trash outranks everything: a soft-deleted item is not live no matter what its
  // schedule says, because fn_content_visible_to_me filters on deleted_at first.
  if (item.deleted_at) return 'trashed';
  if (item.status === 'draft') return 'draft';
  if (item.status === 'archived') return 'archived';
  if (item.status === 'paused') return 'paused';

  const t = now.getTime();
  if (item.expire_at && new Date(item.expire_at).getTime() <= t) return 'expired';
  if (item.publish_at && new Date(item.publish_at).getTime() > t) return 'scheduled';
  return 'live';
}

/** Default block for each type, used by the "add block" menu. */
export function defaultBlock(type: ContentBlockType): ContentBlock {
  switch (type) {
    case 'heading':   return { type: 'heading', level: 2, text: '' };
    case 'paragraph': return { type: 'paragraph', text: '' };
    case 'image':     return { type: 'image', url: '', alt: '', aspect: 'wide' };
    case 'list':      return { type: 'list', style: 'bullet', items: [''] };
    case 'cta':       return { type: 'cta', label: '', href: '', style: 'primary' };
    case 'divider':   return { type: 'divider' };
    case 'callout':   return { type: 'callout', tone: 'info', text: '' };
    case 'stat':      return { type: 'stat', label: '', value: '' };
    case 'quote':     return { type: 'quote', text: '' };
    case 'video':     return { type: 'video', url: '' };
    case 'gallery':   return { type: 'gallery', images: [], columns: 3 };
    case 'accordion': return { type: 'accordion', items: [{ title: '', body: '' }] };
    case 'faq':       return { type: 'faq', items: [{ question: '', answer: '' }] };
    case 'table':     return { type: 'table', headers: ['', ''], rows: [['', '']] };
    case 'buttons':   return { type: 'buttons', items: [{ label: '', href: '', style: 'primary' }] };
  }
}
