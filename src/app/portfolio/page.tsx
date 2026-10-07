import type { Metadata } from "next";
import { PortfolioView } from "@/components/portfolio/PortfolioView";
import { getPortfolio } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Fashion, brand campaigns, lifestyle and editorial work by Janmitha, model and content creator in Bangalore.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const data = await getPortfolio();
  return <PortfolioView data={data} activeSlug={null} />;
}
