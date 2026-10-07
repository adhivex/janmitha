import { ArrowRight, CodeXml } from "lucide-react";
import Image from "next/image";
import type { Profile } from "@/lib/content";
import { PLACEHOLDER_IMAGES } from "@/lib/content";
import { Eyebrow } from "./ui";

export function About({ profile }: { profile: Profile }) {
  return (
    <section id="story" aria-labelledby="about-heading" className="mt-16 bg-cream text-cream-body md:mt-24">
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-5 py-14 md:grid-cols-[44fr_56fr] md:gap-16 md:px-8 md:py-24">
        {/* Arch portrait */}
        <div className="relative mx-auto w-[82%] max-w-[420px] md:w-full">
          <div
            aria-hidden="true"
            className="absolute -top-3 -left-3 h-full w-full rounded-[220px_220px_28px_28px] border border-gold"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[220px_220px_28px_28px] shadow-[0_30px_60px_-20px_rgb(58_47_34/0.45)]">
            <Image
              src={profile.about_image_url ?? PLACEHOLDER_IMAGES.about}
              alt={`${profile.display_name}, editorial portrait`}
              fill
              sizes="(min-width: 768px) 420px, 82vw"
              className="object-cover object-[50%_30%]"
            />
          </div>
          <p className="animate-float absolute -right-5 bottom-8 inline-flex items-center gap-2.5 rounded-full bg-ink px-4 py-3 text-[10px] font-normal tracking-[0.2em] whitespace-nowrap text-text md:-right-8">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
            AUTHENTIC · VERSATILE · REAL
          </p>
        </div>

        <div>
          <Eyebrow tone="cream">01 / ABOUT</Eyebrow>
          <h2
            id="about-heading"
            className="mt-5 font-display text-[50px] leading-[1] font-medium text-cream-heading md:text-[66px]"
          >
            More than
            <br />
            <em className="text-cream-accent">a look.</em>
          </h2>
          <p className="mt-6 max-w-[34rem] text-[16px] leading-[1.7]">{profile.bio}</p>

          <div className="mt-8 flex max-w-[34rem] gap-4 rounded-[18px] border border-cream-border bg-cream-card p-5">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-cream-border text-cream-accent">
              <CodeXml className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[11px] font-medium tracking-[0.26em] text-cream-label">BEYOND THE FRAME</p>
              <p className="mt-2 text-[14px] leading-[1.65]">{profile.beyond_frame}</p>
            </div>
          </div>

          <a
            href="#contact"
            className="lift mt-8 inline-flex min-h-[54px] items-center gap-3 rounded-full bg-ink px-7 text-[12px] font-medium tracking-[0.2em] text-text uppercase"
          >
            Know My Story
            <ArrowRight className="h-4 w-4 text-gold" strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
