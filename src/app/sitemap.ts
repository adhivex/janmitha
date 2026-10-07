import type { MetadataRoute } from "next";
import { getPortfolio } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories } = await getPortfolio();
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/portfolio`, changeFrequency: "weekly", priority: 0.8 },
    ...categories.map((c) => ({
      url: `${SITE_URL}/portfolio/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
