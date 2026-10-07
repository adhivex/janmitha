import type { SVGProps } from "react";

/**
 * Shared class strings so buttons stay identical across sections.
 * Padding and tracking live in the *Size variants so callers can override them
 * without two conflicting utilities on one element.
 */
const goldBase =
  "lift gold-fill inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full font-body text-[12px] font-medium uppercase text-ink-text";
const ghostBase =
  "lift inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full border border-gold-line-strong font-body text-[12px] font-normal uppercase text-text hover:border-gold";

export const btn = {
  goldBase,
  ghostBase,
  gold: `${goldBase} px-7 tracking-[0.2em]`,
  ghost: `${ghostBase} px-6 tracking-[0.2em]`,
  iconCircle:
    "inline-flex flex-none items-center justify-center rounded-full border transition-colors duration-300",
};

export function Eyebrow({
  children,
  tone = "dark",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "dark" | "cream";
  className?: string;
}) {
  return (
    <p className={`eyebrow ${tone === "cream" ? "text-cream-label!" : ""} ${className}`}>
      {children}
    </p>
  );
}

/** Two-line hamburger from the spec. */
export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden="true" {...props}>
      <path d="M4 9h16M8 15h12" />
    </svg>
  );
}

/** Small four-point star used between brand names. */
export function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M8 0c.5 4.2 3.8 7.5 8 8-4.2.5-7.5 3.8-8 8-.5-4.2-3.8-7.5-8-8 4.2-.5 7.5-3.8 8-8Z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10.5V16M8 7.5v.01M12 16v-5.5M12 13a2.5 2.5 0 0 1 5 0v3" />
    </svg>
  );
}
