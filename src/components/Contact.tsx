import { Download, Mail, MapPin } from "lucide-react";
import type { Profile } from "@/lib/content";
import { isRealValue } from "@/lib/site";
import { toSiteHref } from "@/lib/supabase/config";
import { EnquiryDialog } from "./EnquiryDialog";
import { InstagramIcon, LinkedInIcon, btn } from "./ui";

const FOCUS_AREAS = ["Fashion", "Technology", "Lifestyle", "Positive Impact"];

export function Contact({ profile }: { profile: Profile }) {
  // Unfilled values like "[HANDLE]" stay visible as a tooltip but are not linked.
  const socials = [
    { value: profile.instagram_url, href: profile.instagram_url, placeholder: "[INSTAGRAM URL]", label: "Instagram", Icon: InstagramIcon, external: true },
    { value: profile.linkedin_url, href: profile.linkedin_url, placeholder: "[LINKEDIN URL]", label: "LinkedIn", Icon: LinkedInIcon, external: true },
    { value: profile.email, href: `mailto:${profile.email}`, placeholder: "[HER EMAIL]", label: "Email", Icon: Mail, external: false },
  ];

  return (
    <section id="contact" aria-labelledby="contact-heading" className="px-5 pt-6 pb-10 md:px-8 md:pt-10">
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[32px] border border-gold-line-strong bg-ink-raised shadow-[0_0_80px_-20px_rgb(217_176_115/0.25)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 -left-48 h-[480px] w-[480px] rounded-full bg-[radial-gradient(closest-side,rgb(217_176_115/0.2),transparent)]"
        />
        <div className="relative flex flex-col items-center px-5 py-12 text-center md:px-12 md:py-16">
          <h2 id="contact-heading" className="gold-shimmer font-script text-[60px] leading-[1.15] md:text-[72px]">
            Let&apos;s Collaborate
          </h2>
          <p className="mt-4 flex items-center justify-center gap-2 text-[11px] tracking-[0.3em] text-text-muted">
            <MapPin className="h-4 w-4 text-gold" strokeWidth={1.5} aria-hidden="true" />
            BASED IN {(profile.city ?? "[CITY]").toUpperCase()}
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Focus areas">
            {FOCUS_AREAS.map((area) => (
              <li
                key={area}
                className="rounded-full border border-gold-line-strong px-4 py-2 text-[12px] tracking-[0.08em] text-text-soft"
              >
                {area}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <EnquiryDialog />
            {profile.media_kit_url ? (
              <a href={toSiteHref(profile.media_kit_url)} download className={btn.ghost}>
                <Download className="h-4 w-4 text-gold" strokeWidth={1.5} aria-hidden="true" />
                Media Kit
              </a>
            ) : (
              <button type="button" disabled title="[MEDIA KIT PDF]" className={`${btn.ghost.replace("lift ", "")} cursor-not-allowed opacity-60`}>
                <Download className="h-4 w-4 text-gold" strokeWidth={1.5} aria-hidden="true" />
                Media Kit
                <span className="sr-only">(coming soon)</span>
              </button>
            )}
          </div>

          <ul className="mt-8 flex justify-center gap-3" aria-label="Social links">
            {socials.map(({ value, href, placeholder, label, Icon, external }) => (
              <li key={label}>
                {isRealValue(value) ? (
                  <a
                    href={href ?? undefined}
                    aria-label={label}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={`${btn.iconCircle} h-[50px] w-[50px] border-gold-line-strong text-gold hover:border-gold hover:bg-gold hover:text-ink-text`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </a>
                ) : (
                  <span
                    role="img"
                    aria-label={`${label} (coming soon)`}
                    title={value ?? placeholder}
                    className={`${btn.iconCircle} h-[50px] w-[50px] cursor-not-allowed border-gold-line-strong text-gold opacity-50`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
