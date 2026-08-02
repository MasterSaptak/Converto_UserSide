// =====================================================
// CONVERTO — Placement configuration (SINGLE SOURCE OF TRUTH)
// =====================================================
// Shared between UserSide and ServerSide.
// Keep this file identical in both projects.
//
// EVERY image dimension, aspect ratio, size cap and format rule in the platform
// comes from this file. Nothing else may hardcode a pixel size.
//
// Change a placement's design? Edit the entry here and the admin guidance, the
// validation warnings, the preview frames and the aspect-ratio boxes on the
// customer side all follow. That is the whole point of the indirection.
//
// A placement is NEVER a service. There is deliberately no `medical` or
// `education` placement: surfaces that belong to a service are marked
// `serviceScoped`, and the service itself is chosen at edit time from the live
// `services` table. Adding a new Converto service must never require a change to
// this file, a migration, or any frontend code.

export const PLACEMENTS = {
  homepage_hero: {
    label: 'Homepage Hero',
    description: 'Large panel at the top of the dashboard.',
    width: 1920,
    height: 650,
    maxBytes: 2 * 1024 * 1024,
    serviceScoped: false,
    /** Rendered on the customer side today. Slots for unbuilt surfaces stay false. */
    live: false,
  },
  dashboard_carousel: {
    label: 'Dashboard Carousel',
    description: 'The rotating promo panel on the customer dashboard.',
    width: 1600,
    height: 500,
    tabletWidth: 1024,
    tabletHeight: 400,
    mobileWidth: 600,
    mobileHeight: 600,
    maxBytes: 2 * 1024 * 1024,
    serviceScoped: false,
    live: true,
  },
  dashboard_card: {
    label: 'Dashboard Card',
    description: 'Compact card in the dashboard grid.',
    width: 800,
    height: 500,
    maxBytes: 1 * 1024 * 1024,
    serviceScoped: false,
    live: false,
  },
  service_hero: {
    label: 'Service Hero',
    description: 'Banner at the top of a specific service page.',
    width: 1600,
    height: 500,
    maxBytes: 2 * 1024 * 1024,
    serviceScoped: true,
    live: false,
  },
  service_sidebar: {
    label: 'Service Sidebar',
    description: 'Tall panel beside a specific service page.',
    width: 600,
    height: 750,
    maxBytes: 1 * 1024 * 1024,
    serviceScoped: true,
    live: false,
  },
  popup: {
    label: 'Popup',
    description: 'Modal shown once per session over the dashboard.',
    width: 900,
    height: 700,
    maxBytes: 1 * 1024 * 1024,
    serviceScoped: false,
    live: true,
  },
  checkout_banner: {
    label: 'Checkout Banner',
    description: 'Strip above the checkout summary.',
    width: 1200,
    height: 300,
    maxBytes: 1 * 1024 * 1024,
    serviceScoped: false,
    live: false,
  },
  announcement_bar: {
    label: 'Announcement Bar',
    description: 'Thin line across the top of every page. Text only — no image.',
    width: 0,
    height: 0,
    maxBytes: 0,
    serviceScoped: false,
    live: false,
  },
} as const satisfies Record<string, PlacementSpec>;

export interface PlacementSpec {
  label: string;
  description: string;
  /** 0 means this placement takes no image. */
  width: number;
  height: number;
  tabletWidth?: number;
  tabletHeight?: number;
  mobileWidth?: number;
  mobileHeight?: number;
  maxBytes: number;
  /** True when the surface belongs to one service, chosen from the live services table. */
  serviceScoped: boolean;
  /** False = defined but nothing renders it yet. The editor greys these out. */
  live: boolean;
}

export type PlacementKey = keyof typeof PLACEMENTS;

export const PLACEMENT_KEYS = Object.keys(PLACEMENTS) as PlacementKey[];

/** Formats are uniform across placements — they match the storage bucket's allowlist. */
export const PLACEMENT_FORMATS = ['image/png', 'image/jpeg', 'image/webp'] as const;
export const PLACEMENT_FORMAT_LABEL = 'PNG, JPG or WEBP';

export function getPlacement(key: string): PlacementSpec | null {
  return (PLACEMENTS as Record<string, PlacementSpec>)[key] ?? null;
}

export function takesImage(key: string): boolean {
  const spec = getPlacement(key);
  return Boolean(spec && spec.width > 0);
}

/** "2.95 : 1" — derived, never stored, so it can't disagree with the dimensions. */
export function aspectRatioLabel(key: string, device: 'desktop' | 'tablet' | 'mobile' = 'desktop'): string {
  const spec = getPlacement(key);
  if (!spec) return '—';
  let w = spec.width;
  let h = spec.height;
  if (device === 'tablet' && spec.tabletWidth && spec.tabletHeight) {
    w = spec.tabletWidth;
    h = spec.tabletHeight;
  }
  if (device === 'mobile' && spec.mobileWidth && spec.mobileHeight) {
    w = spec.mobileWidth;
    h = spec.mobileHeight;
  }
  if (!w || !h) return '—';
  const r = w / h;
  return r >= 1 ? `${r.toFixed(2)} : 1` : `1 : ${(1 / r).toFixed(2)}`;
}

/** CSS aspect-ratio value for preview frames, e.g. "1600 / 500". */
export function aspectRatioCss(key: string, device: 'desktop' | 'tablet' | 'mobile' = 'desktop'): string | undefined {
  const spec = getPlacement(key);
  if (!spec) return undefined;
  let w = spec.width;
  let h = spec.height;
  if (device === 'tablet' && spec.tabletWidth && spec.tabletHeight) {
    w = spec.tabletWidth;
    h = spec.tabletHeight;
  }
  if (device === 'mobile' && spec.mobileWidth && spec.mobileHeight) {
    w = spec.mobileWidth;
    h = spec.mobileHeight;
  }
  if (!w || !h) return undefined;
  return `${w} / ${h}`;
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '—';
  if (bytes >= 1024 * 1024) return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────
// Warnings, never hard blocks. A staff member with a slightly-off crop should be
// able to ship it and fix it later; refusing the upload just means the promo does
// not go out at all.

export type ImageIssueLevel = 'warning' | 'error';

export interface ImageIssue {
  level: ImageIssueLevel;
  message: string;
}

export function validateImage(
  key: string,
  info: { width: number; height: number; bytes: number; type: string },
  device: 'desktop' | 'tablet' | 'mobile' = 'desktop'
): ImageIssue[] {
  const spec = getPlacement(key);
  if (!spec) return [];
  const issues: ImageIssue[] = [];

  // Format and size are hard limits — the storage bucket rejects them anyway, so
  // catching them here just produces a better message than a 413.
  if (!(PLACEMENT_FORMATS as readonly string[]).includes(info.type)) {
    issues.push({ level: 'error', message: `Use ${PLACEMENT_FORMAT_LABEL}.` });
  }
  if (spec.maxBytes > 0 && info.bytes > spec.maxBytes) {
    issues.push({
      level: 'error',
      message: `This file is ${formatBytes(info.bytes)}. The limit for ${spec.label} is ${formatBytes(spec.maxBytes)}.`,
    });
  }

  let expectedWidth = spec.width;
  let expectedHeight = spec.height;
  if (device === 'tablet' && spec.tabletWidth && spec.tabletHeight) {
    expectedWidth = spec.tabletWidth;
    expectedHeight = spec.tabletHeight;
  }
  if (device === 'mobile' && spec.mobileWidth && spec.mobileHeight) {
    expectedWidth = spec.mobileWidth;
    expectedHeight = spec.mobileHeight;
  }

  if (!expectedWidth || !info.width || !info.height) return issues;

  if (info.width < expectedWidth || info.height < expectedHeight) {
    issues.push({
      level: 'warning',
      message: `Smaller than recommended (${info.width}×${info.height} vs ${expectedWidth}×${expectedHeight}). It will still work, but may look soft on large screens.`,
    });
  }

  // 2% tolerance: a 1600×499 export is not worth a warning.
  const target = expectedWidth / expectedHeight;
  const actual = info.width / info.height;
  if (Math.abs(actual - target) / target > 0.02) {
    issues.push({
      level: 'warning',
      message: `Different shape to ${aspectRatioLabel(key, device)}. The image will be cropped to fit — check the preview below.`,
    });
  }

  return issues;
}

/** Reads intrinsic dimensions from a File. Browser only. */
export function readImageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    // Resolving 0×0 rather than rejecting: a dimension read failing must not stop
    // someone uploading a perfectly good file.
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}
