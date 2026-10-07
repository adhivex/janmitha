/** Absolute site URL for metadata, sitemap and JSON-LD. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3100").replace(/\/$/, "");

export const SITE_TITLE = "Janmitha | Model, Content Creator & Brand Face, Bangalore";

/** Ignore unfilled placeholder values such as "https://instagram.com/[HANDLE]". */
export const isRealValue = (value: string | null | undefined): value is string =>
  !!value && !value.includes("[");
