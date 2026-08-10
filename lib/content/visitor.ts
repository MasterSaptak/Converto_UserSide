// A stable per-browser key for impression dedupe.
//
// This is only ever a FALLBACK. Whenever the caller has a session, the RPC ignores
// whatever is sent here and uses auth.uid() instead — otherwise a signed-in user
// could inflate impression counts just by rotating the value in localStorage.
// It exists so the tracking code has one shape regardless of auth state.

const STORAGE_KEY = 'converto_visitor';

let cached: string | null = null;

export function getVisitorKey(): string {
  if (cached) return cached;

  // Safari in private mode throws on localStorage access rather than returning
  // null, and an analytics beacon must never be the thing that breaks a page.
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) {
      cached = existing;
      return existing;
    }
    const fresh = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, fresh);
    cached = fresh;
    return fresh;
  } catch {
    // Per-session only. Dedupe degrades to "once per page load" rather than
    // "once per day", which is the correct way to fail here.
    cached = cached ?? crypto.randomUUID();
    return cached;
  }
}
