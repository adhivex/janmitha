import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioView } from "@/components/portfolio/PortfolioView";
import { getPortfolio } from "@/lib/queries";

export async function generateStaticParams() {
  const { categories } = await getPortfolio();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getPortfolio()).categories.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: `${category.title} Portfolio`,
    description: `${category.title} work by Janmitha, model and content creator in Bangalore.`,
    alternates: { canonical: `/portfolio/${slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/portfolio/[slug]">) {
  const { slug } = await params;
  const data = await getPortfolio();
  if (!data.categories.some((c) => c.slug === slug)) notFound();
  return <PortfolioView data={data} activeSlug={slug} />;
}
