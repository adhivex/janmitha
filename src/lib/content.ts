/**
 * Static content fallback.
 *
 * Every type mirrors a table in supabase/migrations/0001_init.sql (same column
 * names), and the values mirror supabase/seed.sql. In Phase 2 `getHomeContent`
 * reads from Supabase and falls back to this data when env vars are missing or
 * a query fails.
 *
 * Values in [BRACKETS] are placeholders the client still has to supply.
 * Stats and brand names come from the client's reference: confirm before launch.
 */

export type Profile = {
  id: number;
  display_name: string;
  hero_eyebrow: string | null;
  hero_intro: string | null;
  tagline: string | null;
  bio: string | null;
  beyond_frame: string | null;
  city: string | null;
  email: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  showreel_url: string | null;
  story_video_url: string | null;
  media_kit_url: string | null;
  hero_image_url: string | null;
  about_image_url: string | null;
  philosophy_image_url: string | null;
  philosophy_headline: string | null;
  philosophy_sub: string | null;
  philosophy_quote: string | null;
  updated_at: string;
};

export type Stat = {
  id: string;
  label: string;
  value: string;
  sort_order: number;
  is_visible: boolean;
};

export type Brand = {
  id: string;
  name: string;
  logo_url: string | null;
  sort_order: number;
  is_visible: boolean;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  sort_order: number;
  is_visible: boolean;
};

export type PortfolioCategory = {
  id: string;
  slug: string;
  title: string;
  cover_url: string | null;
  sort_order: number;
  is_visible: boolean;
};

export type PortfolioItem = {
  id: string;
  category_id: string;
  brand_id: string | null;
  image_url: string;
  alt_text: string;
  caption: string | null;
  year: number | null;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
};

export type HomeContent = {
  profile: Profile;
  stats: Stat[];
  brands: Brand[];
  services: Service[];
  categories: PortfolioCategory[];
};

export const PLACEHOLDER_IMAGES = {
  hero: "/placeholders/hero.jpg",
  about: "/placeholders/about.jpg",
  philosophy: "/placeholders/philosophy.jpg",
  category: (slug: string) => `/placeholders/${slug}.jpg`,
} as const;

export const profile: Profile = {
  id: 1,
  display_name: "Janmitha",
  hero_eyebrow: "MODEL · CONTENT CREATOR · BRAND FACE",
  hero_intro:
    "A model and content creator who brings style, a sharp mind and purpose to every brand story.",
  tagline: "Beauty. Intelligence. Impact.",
  bio: "I'm Janmitha, a model and content creator. I love fashion, storytelling and purpose, and believe in continuous learning, creative freedom and using my platform to inspire positivity.",
  beyond_frame:
    "With a background in IT and software, I understand products, platforms and audiences, which makes me an easy, informed partner for brands.",
  city: "Bangalore",
  email: "[HER EMAIL]",
  instagram_url: "https://instagram.com/[HANDLE]",
  linkedin_url: "https://linkedin.com/in/[HANDLE]",
  showreel_url: null,
  story_video_url: null,
  media_kit_url: null,
  hero_image_url: PLACEHOLDER_IMAGES.hero,
  about_image_url: PLACEHOLDER_IMAGES.about,
  philosophy_image_url: PLACEHOLDER_IMAGES.philosophy,
  philosophy_headline: "Creating a Brighter and Bolder Tomorrow",
  philosophy_sub: "Through fashion, technology and purpose.",
  philosophy_quote:
    "Style is a form of self-expression and I choose to express with purpose.",
  updated_at: "2026-10-07T00:00:00.000Z",
};

export const stats: Stat[] = [
  { id: "stat-reach", label: "SOCIAL REACH", value: "100K+", sort_order: 1, is_visible: true },
  { id: "stat-collabs", label: "BRAND COLLABS", value: "50+", sort_order: 2, is_visible: true },
  { id: "stat-years", label: "YEARS MODELING", value: "4+", sort_order: 3, is_visible: true },
];

export const brands: Brand[] = [
  "Tanishq",
  "Swarovski",
  "Nykaa",
  "Ajio",
  "Myntra",
  "Amazon",
  "Flipkart",
].map((name, i) => ({
  id: `brand-${name.toLowerCase()}`,
  name,
  logo_url: null,
  sort_order: i + 1,
  is_visible: true,
}));

export const services: Service[] = [
  {
    id: "service-brand-campaigns",
    title: "Brand Campaigns",
    description: "Fashion, jewellery and beauty shoots, lookbooks and ad films.",
    sort_order: 1,
    is_visible: true,
  },
  {
    id: "service-content-reels",
    title: "Content & Reels",
    description: "Instagram reels, UGC and product storytelling in her own voice.",
    sort_order: 2,
    is_visible: true,
  },
  {
    id: "service-tech-gadget",
    title: "Tech & Gadget Brands",
    description: "Product launches presented with real understanding, not just a script.",
    sort_order: 3,
    is_visible: true,
  },
  {
    id: "service-purpose",
    title: "Purpose Projects",
    description: "Cause-led campaigns that put positivity and impact first.",
    sort_order: 4,
    is_visible: true,
  },
];

export const categories: PortfolioCategory[] = [
  { slug: "fashion-modeling", title: "Fashion & Modeling" },
  { slug: "brand-campaigns", title: "Brand Campaigns" },
  { slug: "lifestyle", title: "Lifestyle" },
  { slug: "editorials", title: "Editorials" },
].map((c, i) => ({
  id: `category-${c.slug}`,
  ...c,
  cover_url: PLACEHOLDER_IMAGES.category(c.slug),
  sort_order: i + 1,
  is_visible: true,
}));

const visibleSorted = <T extends { is_visible: boolean; sort_order: number }>(rows: T[]) =>
  rows.filter((r) => r.is_visible).sort((a, b) => a.sort_order - b.sort_order);

/** Single entry point for home page content. Phase 2 swaps the body for Supabase queries. */
export async function getHomeContent(): Promise<HomeContent> {
  return {
    profile,
    stats: visibleSorted(stats),
    brands: visibleSorted(brands),
    services: visibleSorted(services),
    categories: visibleSorted(categories),
  };
}
