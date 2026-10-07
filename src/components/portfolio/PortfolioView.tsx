import Link from "next/link";
import type { PortfolioData } from "@/lib/queries";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { Eyebrow, btn } from "../ui";
import { Gallery, type GalleryPhoto } from "./Gallery";

const chip =
  "inline-flex min-h-11 items-center rounded-full border px-5 text-[12px] tracking-[0.16em] whitespace-nowrap uppercase transition-colors duration-300";

/** Shared layout for /portfolio and /portfolio/[slug]. `activeSlug` null = all work. */
export function PortfolioView({ data, activeSlug }: { data: PortfolioData; activeSlug: string | null }) {
  const active = activeSlug ? data.categories.find((c) => c.slug === activeSlug) : null;
  const photos: GalleryPhoto[] = data.items
    .filter((item) => !activeSlug || item.category.slug === activeSlug)
    .map((item) => ({
      id: item.id,
      src: item.image_url,
      alt: item.alt_text || `Janmitha, ${item.category.title}`,
      caption: item.caption,
      category: item.category.title,
      year: item.year,
    }));

  const chips = [{ href: "/portfolio", label: "All", slug: null as string | null }].concat(
    data.categories.map((c) => ({ href: `/portfolio/${c.slug}`, label: c.title, slug: c.slug })),
  );

  return (
    <>
      <div className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[400px] overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(217_176_115/0.18),transparent)]" />
        </div>
        <Header onHome={false} />
      </div>
      <main className="mx-auto max-w-[1200px] px-5 pt-12 pb-16 md:px-8 md:pt-20 md:pb-24">
        <Eyebrow>02 / PORTFOLIO</Eyebrow>
        <h1 className="mt-5 font-display text-[50px] leading-[1] font-medium md:text-[76px]">
          {active ? (
            <em className="gold-shimmer">{active.title}</em>
          ) : (
            <>
              A Glimpse Into <em className="gold-shimmer">My World</em>
            </>
          )}
        </h1>

        <nav aria-label="Portfolio categories" className="-mx-5 mt-8 md:mx-0 md:mt-10">
          <ul className="scrollbar-none flex gap-2.5 overflow-x-auto px-5 pb-1 md:flex-wrap md:overflow-visible md:px-0">
            {chips.map((c) => {
              const current = c.slug === activeSlug;
              return (
                <li key={c.href} className="flex-none">
                  <Link
                    href={c.href}
                    aria-current={current ? "page" : undefined}
                    className={`${chip} ${current ? "gold-fill border-transparent font-medium text-ink-text" : "border-gold-line-strong text-text-soft hover:border-gold hover:text-text"}`}
                  >
                    {c.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-8 md:mt-12">
          <Gallery photos={photos} />
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-gold-line pt-10">
          <p className="font-display text-[30px] leading-[1.1] md:text-[40px]">
            Like what you see? <em className="gold-shimmer">Let&apos;s collaborate.</em>
          </p>
          <Link href="/#contact" className={btn.gold}>
            Start a Project
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
