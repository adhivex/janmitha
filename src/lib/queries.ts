import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import {
  type HomeContent,
  type PortfolioCategory,
  type PortfolioItem,
  categories as fallbackCategories,
  fallbackHomeContent,
  fallbackPortfolioItems,
  profile as fallbackProfile,
} from "./content";
import { createPublicClient } from "./supabase/public";

/** Cache tags. Admin Server Actions call updateTag() with these after an edit. */
export const TAGS = { content: "content", portfolio: "portfolio" } as const;

/** ISR-style lifetime: refresh in the background every 5 minutes. */
const FIVE_MINUTES = { stale: 300, revalidate: 300, expire: 60 * 60 * 24 } as const;

/** Home page content from Supabase, or the static fallback if unavailable. */
export async function getHomeContent(): Promise<HomeContent> {
  "use cache";
  cacheTag(TAGS.content, TAGS.portfolio);
  cacheLife(FIVE_MINUTES);

  const db = createPublicClient();
  if (!db) return fallbackHomeContent;

  try {
    const [profile, stats, brands, services, categories] = await Promise.all([
      db.from("profile").select("*").eq("id", 1).maybeSingle(),
      db.from("stats").select("*").eq("is_visible", true).order("sort_order"),
      db.from("brands").select("*").eq("is_visible", true).order("sort_order"),
      db.from("services").select("*").eq("is_visible", true).order("sort_order"),
      db.from("portfolio_categories").select("*").eq("is_visible", true).order("sort_order"),
    ]);
    const failed = [profile, stats, brands, services, categories].find((r) => r.error);
    if (failed?.error) throw failed.error;

    return {
      profile: profile.data ?? fallbackProfile,
      stats: stats.data ?? [],
      brands: brands.data ?? [],
      services: services.data ?? [],
      categories: (categories.data ?? []).map(withCover),
    };
  } catch (error) {
    console.error("[queries] getHomeContent failed, using static fallback:", error);
    return fallbackHomeContent;
  }
}

export type PortfolioData = {
  categories: PortfolioCategory[];
  items: (PortfolioItem & { category: PortfolioCategory })[];
};

/** All visible categories and photos, newest-first within each category's order. */
export async function getPortfolio(): Promise<PortfolioData> {
  "use cache";
  cacheTag(TAGS.portfolio);
  cacheLife(FIVE_MINUTES);

  const db = createPublicClient();
  const fallback = () => joinItems(fallbackCategories, fallbackPortfolioItems);
  if (!db) return fallback();

  try {
    const [categories, items] = await Promise.all([
      db.from("portfolio_categories").select("*").eq("is_visible", true).order("sort_order"),
      db
        .from("portfolio_items")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order")
        .order("created_at", { ascending: false }),
    ]);
    if (categories.error) throw categories.error;
    if (items.error) throw items.error;
    return joinItems((categories.data ?? []).map(withCover), items.data ?? []);
  } catch (error) {
    console.error("[queries] getPortfolio failed, using static fallback:", error);
    return fallback();
  }
}

function joinItems(categories: PortfolioCategory[], items: PortfolioItem[]): PortfolioData {
  const byId = new Map(categories.map((c) => [c.id, c]));
  const order = new Map(categories.map((c, i) => [c.id, i]));
  return {
    categories,
    items: items
      .filter((item) => byId.has(item.category_id))
      .sort((a, b) => order.get(a.category_id)! - order.get(b.category_id)! || a.sort_order - b.sort_order)
      .map((item) => ({ ...item, category: byId.get(item.category_id)! })),
  };
}

/** Categories without an uploaded cover use the bundled placeholder photo. */
function withCover(category: PortfolioCategory): PortfolioCategory {
  if (category.cover_url) return category;
  const known = fallbackCategories.some((c) => c.slug === category.slug);
  return { ...category, cover_url: known ? `/placeholders/${category.slug}.jpg` : "/placeholders/editorials.jpg" };
}
