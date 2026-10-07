import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
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

async function Category({ params }: { params: PageProps<"/portfolio/[slug]">["params"] }) {
  const { slug } = await params;
  const data = await getPortfolio();
  if (!data.categories.some((c) => c.slug === slug)) notFound();
  return <PortfolioView data={data} activeSlug={slug} />;
}

// Known categories are fully prerendered; a category added later in /admin
// streams in behind this boundary on its first visit.
export default function CategoryPage({ params }: PageProps<"/portfolio/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-dvh" aria-busy="true" />}>
      <Category params={params} />
    </Suspense>
  );
}
