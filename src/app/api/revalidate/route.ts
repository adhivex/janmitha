import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { TAGS } from "@/lib/queries";

/**
 * On-demand revalidation for edits made outside /admin (e.g. the Supabase dashboard).
 * POST /api/revalidate with header `x-revalidate-secret: <REVALIDATE_SECRET>`
 * and optional ?tag=content|portfolio (defaults to both).
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }
  const tag = request.nextUrl.searchParams.get("tag");
  const tags = tag ? [tag] : Object.values(TAGS);
  if (!tags.every((t) => (Object.values(TAGS) as string[]).includes(t))) {
    return Response.json({ revalidated: false, message: "Unknown tag" }, { status: 400 });
  }
  tags.forEach((t) => revalidateTag(t, "max"));
  return Response.json({ revalidated: true, tags, now: Date.now() });
}
