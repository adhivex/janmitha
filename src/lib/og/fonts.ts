import "server-only";
import { cacheLife } from "next/cache";

/**
 * Fetches a Google Font as TTF, subset to `text`, for ImageResponse. Returns null on
 * failure so image generation falls back to the default font instead of erroring.
 */
export async function loadGoogleFont(family: string, weight: number, text: string, italic = false) {
  "use cache";
  cacheLife("max");
  try {
    const axis = italic ? `ital,wght@1,${weight}` : `wght@${weight}`;
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${axis}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url, { signal: AbortSignal.timeout(8000) })).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    return await (await fetch(src, { signal: AbortSignal.timeout(8000) })).arrayBuffer();
  } catch {
    return null;
  }
}
