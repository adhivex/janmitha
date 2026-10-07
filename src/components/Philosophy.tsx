import Image from "next/image";
import type { Profile } from "@/lib/content";
import { PLACEHOLDER_IMAGES } from "@/lib/content";
import { VideoDialog } from "./VideoDialog";
import { Eyebrow } from "./ui";

/** Renders the headline with its final word ("Bolder") as the gold italic accent. */
function Headline({ text }: { text: string }) {
  const accent = "Bolder";
  const at = text.indexOf(accent);
  if (at === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <em className="gold-shimmer">{accent}</em>
      {text.slice(at + accent.length)}
    </>
  );
}

export function Philosophy({ profile }: { profile: Profile }) {
  return (
    <section aria-labelledby="philosophy-heading" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={profile.philosophy_image_url ?? PLACEHOLDER_IMAGES.philosophy}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-ink)_0%,rgb(11_8_6/0.35)_22%,rgb(11_8_6/0.45)_70%,var(--color-ink)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgb(11_8_6/0.7),transparent_70%)]"
        />
      </div>

      <div className="relative mx-auto flex min-h-[680px] max-w-[1200px] flex-col px-5 pt-20 pb-14 md:min-h-[720px] md:px-8 md:pt-28 md:pb-20">
        <Eyebrow>04 / MY PHILOSOPHY</Eyebrow>
        <h2
          id="philosophy-heading"
          className="mt-5 max-w-[22rem] font-display text-[46px] leading-[1.02] font-medium md:max-w-[36rem] md:text-[66px]"
        >
          <Headline text={profile.philosophy_headline ?? ""} />
        </h2>
        <p className="mt-5 text-[16px] leading-[1.6] text-text-soft">{profile.philosophy_sub}</p>
        <div className="mt-8">
          <VideoDialog url={profile.story_video_url} label="Watch My Story" placeholder="[STORY VIDEO URL]" />
        </div>

        <div className="mt-auto flex justify-end pt-12">
          <figure className="glass w-full max-w-[300px] rounded-[24px] px-6 pt-4 pb-6 md:max-w-[340px]">
            <span aria-hidden="true" className="gold-shimmer block font-display text-[64px] leading-[0.8]">
              &ldquo;
            </span>
            <blockquote className="mt-1 font-display text-[20px] leading-[1.35] italic text-text">
              {profile.philosophy_quote}
            </blockquote>
          </figure>
        </div>
      </div>
    </section>
  );
}
