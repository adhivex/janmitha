import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import type { Profile } from "@/lib/content";
import { PLACEHOLDER_IMAGES } from "@/lib/content";
import { Header } from "./Header";
import { VideoDialog } from "./VideoDialog";
import { btn } from "./ui";

const delay = (s: number) => ({ animationDelay: `${s}s` });

export function Hero({ profile }: { profile: Profile }) {
  const taglineLines = (profile.tagline ?? "").split(/(?<=\.)\s+/).filter(Boolean);
  const city = profile.city ?? "[CITY]";

  return (
    <section id="top" className="relative min-h-[810px] overflow-hidden md:min-h-[860px]">
      {/* Portrait, top right, fading out at the bottom */}
      <div className="pointer-events-none absolute top-0 right-0 h-[720px] w-[92%] [mask-image:linear-gradient(to_bottom,#000_62%,transparent)] md:h-[820px] md:w-[56%]">
        <Image
          src={profile.hero_image_url ?? PLACEHOLDER_IMAGES.hero}
          alt={`${profile.display_name}, portrait`}
          fill
          preload
          fetchPriority="high"
          sizes="(min-width: 768px) 56vw, 92vw"
          className="object-cover object-[62%_18%]"
        />
        {/* md+: soften the photo's left edge into the ink background */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--color-ink),transparent_40%)] md:block" />
      </div>
      {/* Legibility overlay + soft gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--color-ink)_12%,rgb(11_8_6/0.6)_52%,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(217_176_115/0.22),transparent)]"
      />

      <Header />

      <div className="relative z-10 mx-auto max-w-[1200px] px-5 pt-10 md:px-8 md:pt-20">
        <div className="animate-fade-up" style={delay(0.1)}>
          <p className="glass inline-flex h-9 items-center gap-3 rounded-full px-4 text-[10px] font-normal tracking-[0.26em] text-text-soft">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-pulse-ring absolute inset-0 rounded-full bg-gold" />
              <span className="relative h-2 w-2 rounded-full bg-gold" />
            </span>
            OPEN FOR COLLABORATIONS
          </p>
          <p className="mt-6 text-[11px] tracking-[0.3em] text-text-muted md:text-[12px]">
            {profile.hero_eyebrow}
          </p>
        </div>

        <h1
          className="animate-fade-up mt-3 font-display text-[68px] leading-[0.9] font-semibold whitespace-nowrap md:text-[min(150px,16.5vw)]"
          style={delay(0.25)}
        >
          <span className="text-text">JAN</span>
          <span className="gold-shimmer">MITHA</span>
        </h1>

        <div className="animate-fade-up" style={delay(0.4)}>
          <p className="mt-5 flex flex-col text-[15px] md:mt-10 leading-[1.6] font-normal tracking-[0.38em] text-text">
            {taglineLines.map((line) => (
              <span key={line}>{line.toUpperCase()}</span>
            ))}
          </p>
          <p className="mt-5 max-w-[17.5rem] text-[16px] leading-[1.6] text-text-soft md:max-w-[26rem]">
            {profile.hero_intro}
          </p>
        </div>

        <div className="animate-fade-up" style={delay(0.55)}>
          <p className="mt-5 flex items-center gap-2 text-[11px] tracking-[0.3em] text-text-muted">
            <MapPin className="h-4 w-4 text-gold" strokeWidth={1.5} aria-hidden="true" />
            BASED IN {city.toUpperCase()}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-2.5 md:gap-4">
            <a href="#gallery" className={`${btn.goldBase} px-5 tracking-[0.12em] md:px-7 md:tracking-[0.2em]`}>
              Explore My World
              <ArrowRight className="hidden h-4 w-4 md:block" strokeWidth={1.5} aria-hidden="true" />
            </a>
            <VideoDialog
              url={profile.showreel_url}
              label="Showreel"
              placeholder="[SHOWREEL URL]"
              className="pr-5 pl-2 tracking-[0.12em] md:pr-6 md:tracking-[0.2em]"
            />
          </div>
        </div>
      </div>

      {/* Floating quote card */}
      <figure className="animate-float glass absolute top-[596px] right-4 z-10 w-[198px] rounded-[18px] px-5 py-4 md:top-[560px] md:right-[max(2rem,calc((100vw-1200px)/2+2rem))] md:w-[240px]">
        <blockquote className="font-display text-[18px] leading-[1.25] italic text-text md:text-[20px]">
          More than a look, it&apos;s a mindset.
        </blockquote>
        <figcaption className="gold-shimmer mt-1 text-right font-script text-[28px] leading-none">
          {profile.display_name}
        </figcaption>
      </figure>

      {/* Scroll hint */}
      <div
        aria-hidden="true"
        className="absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.34em] text-text-faint"
      >
        SCROLL
        <span className="animate-scroll-line block h-[34px] w-px bg-gold" />
      </div>
    </section>
  );
}
