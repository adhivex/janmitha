/** Public Supabase settings. Returns null when the site runs on static fallback content. */
export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || url.includes("YOUR-PROJECT")) return null;
  return { url, anonKey };
}

export const STORAGE_BUCKET = "portfolio";

/**
 * Maps a public Storage URL to the same-origin /media/* rewrite (see next.config.ts),
 * so downloads work even when Supabase itself is not publicly reachable.
 */
export function toSiteHref(url: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const prefix = base ? `${base}/storage/v1/object/public/${STORAGE_BUCKET}/` : null;
  return prefix && url.startsWith(prefix) ? `/media/${url.slice(prefix.length)}` : url;
}
