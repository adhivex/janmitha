import { About } from "@/components/About";
import { BrandMarquee } from "@/components/BrandMarquee";
import { Collaborations } from "@/components/Collaborations";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { PersonJsonLd } from "@/components/PersonJsonLd";
import { Philosophy } from "@/components/Philosophy";
import { PortfolioRail } from "@/components/PortfolioRail";
import { StatsBar } from "@/components/StatsBar";
import { getHomeContent } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const { profile, stats, brands, services, categories } = await getHomeContent();

  return (
    <>
      <PersonJsonLd profile={profile} />
      <main>
        <Hero profile={profile} />
        <StatsBar stats={stats} />
        <BrandMarquee brands={brands} />
        <About profile={profile} />
        <PortfolioRail categories={categories} />
        <Collaborations services={services} />
        <Philosophy profile={profile} />
        <Contact profile={profile} />
      </main>
      <Footer />
    </>
  );
}
