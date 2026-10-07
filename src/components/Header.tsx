import { ArrowUpRight } from "lucide-react";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="relative z-30 px-4 pt-4 md:px-8 md:pt-6">
      <div className="glass mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-2 rounded-full pr-2 pl-5 md:pl-7">
        <a
          href="#top"
          className="inline-flex min-h-11 items-center font-display text-[19px] font-semibold tracking-[0.34em] text-text"
          aria-label="Janmitha, back to top"
        >
          JANMITHA
        </a>
        <div className="flex items-center gap-1.5">
          <a
            href="#contact"
            className="lift gold-fill inline-flex min-h-11 items-center gap-1 rounded-full px-3.5 text-[12px] whitespace-nowrap font-medium tracking-[0.06em] text-ink-text md:px-5 md:text-[13px]"
          >
            Let&apos;s Connect
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </a>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
