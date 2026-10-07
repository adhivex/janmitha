import type { Brand } from "@/lib/content";
import { StarIcon } from "./ui";

/**
 * CSS-only marquee: the list renders twice so translateX(-50%) loops seamlessly.
 * With reduced motion it becomes a static, wrapped list.
 */
export function BrandMarquee({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;

  const row = (hidden: boolean) => (
    <ul
      className={`flex shrink-0 items-center motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 ${hidden ? "motion-reduce:hidden" : ""}`}
      aria-hidden={hidden || undefined}
    >
      {brands.map((brand) => (
        <li key={brand.id} className="flex items-center">
          <span className="px-7 font-display text-[32px] font-medium whitespace-nowrap text-cream-card italic">
            {brand.name}
          </span>
          <StarIcon className="h-2.5 w-2.5 text-gold" />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-labelledby="brands-heading" className="mt-16 md:mt-24">
      <h2 id="brands-heading" className="flex justify-center px-5">
        <span className="eyebrow">BRANDS I&apos;VE WORKED WITH</span>
      </h2>
      <div className="mt-6 border-y border-gold-line py-6 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] motion-reduce:[mask-image:none]">
        <div className="group flex overflow-hidden">
          <div className="animate-marquee flex w-max group-hover:[animation-play-state:paused] motion-reduce:w-full">
            {row(false)}
            {row(true)}
          </div>
        </div>
      </div>
    </section>
  );
}
