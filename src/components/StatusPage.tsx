import Link from "next/link";
import { btn } from "./ui";

/** Shared look for the 404 and error pages. */
export function StatusPage({
  code,
  title,
  accent,
  body,
  action,
}: {
  code: string;
  title: string;
  accent: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-dvh items-center overflow-hidden px-5 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(217_176_115/0.2),transparent)]"
      />
      <div className="relative mx-auto w-full max-w-[640px] text-center">
        <p className="gold-shimmer font-display text-[110px] leading-none font-semibold md:text-[160px]">{code}</p>
        <h1 className="mt-4 font-display text-[40px] leading-[1.05] font-medium md:text-[56px]">
          {title} <em className="gold-shimmer">{accent}</em>
        </h1>
        <p className="mx-auto mt-5 max-w-[26rem] text-[16px] leading-[1.6] text-text-soft">{body}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {action}
          <Link href="/" className={btn.gold}>
            Back to Home
          </Link>
        </div>
        <p className="mt-14 text-[10px] tracking-[0.3em] text-text-fainter">© JANMITHA · BEAUTY. INTELLIGENCE. IMPACT.</p>
      </div>
    </main>
  );
}
