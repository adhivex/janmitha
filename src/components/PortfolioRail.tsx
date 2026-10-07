import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PortfolioCategory } from "@/lib/content";
import { PLACEHOLDER_IMAGES } from "@/lib/content";
import { Eyebrow, btn } from "./ui";

export function PortfolioRail({ categories }: { categories: PortfolioCategory[] }) {
  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="py-14 md:py-24">
      <div className="relative mx-auto max-w-[1200px] px-5 md:flex md:items-end md:justify-between md:gap-4 md:px-8">
        <div>
          <Eyebrow>02 / PORTFOLIO</Eyebrow>
          <h2 id="gallery-heading" className="mt-5 font-display text-[46px] leading-[1] font-medium md:text-[64px]">
            A Glimpse Into
            <br />
            <em className="gold-shimmer">My World</em>
          </h2>
        </div>
        <Link href="/portfolio" className={`${btn.ghostBase} absolute right-5 bottom-0 min-h-11 px-5 tracking-[0.2em] md:static md:min-h-[54px] md:flex-none`}>
          View All
        </Link>
      </div>

      {/* Mobile: scroll-snap rail. md+: 4-column grid. */}
      <ul className="scrollbar-none mt-9 flex snap-x snap-mandatory gap-[14px] overflow-x-auto scroll-px-5 px-5 pb-2 md:mx-auto md:grid md:max-w-[1200px] md:grid-cols-4 md:gap-5 md:overflow-visible md:px-8">
        {categories.map((category, i) => (
          <li key={category.id} className="w-[236px] flex-none snap-start md:w-auto">
            <Link
              href={`/portfolio/${category.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-[26px] bg-ink-raised-2"
            >
              <Image
                src={category.cover_url ?? PLACEHOLDER_IMAGES.category(category.slug)}
                alt=""
                fill
                sizes="(min-width: 1248px) 285px, (min-width: 768px) 23vw, 236px"
                className="object-cover transition-transform duration-[800ms] ease-editorial group-hover:scale-[1.07]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,rgb(11_8_6/0.35),transparent_30%,transparent_60%,rgb(11_8_6/0.55))]"
              />
              <span aria-hidden="true" className="absolute top-4 left-5 font-display text-[20px] text-text">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="glass absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-[18px] py-2.5 pr-2.5 pl-4 md:inset-x-2 md:bottom-2 md:pl-3 lg:inset-x-3 lg:bottom-3 lg:pl-4">
                <span className="text-[11px] leading-[1.35] font-normal tracking-[0.16em] text-text uppercase md:text-[10px] lg:text-[11px]">
                  {category.title}
                </span>
                <span className="gold-fill flex h-9 w-9 flex-none md:h-8 md:w-8 lg:h-9 lg:w-9 items-center justify-center rounded-full text-ink-text">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
