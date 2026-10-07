"use client";

import "./globals.css";

/** Last-resort error page when the root layout itself fails. Kept dependency-free. */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center justify-center bg-ink px-5 text-center text-text">
        <main>
          <p className="font-display text-[110px] leading-none text-gold">500</p>
          <h1 className="mt-4 font-display text-[40px]">Something went off script.</h1>
          <p className="mt-4 text-text-soft">Please try again in a moment.</p>
          <button
            type="button"
            onClick={retry}
            className="mt-8 min-h-[54px] rounded-full border border-gold-line-strong px-6 text-[12px] tracking-[0.2em] uppercase"
          >
            Try Again
          </button>
        </main>
      </body>
    </html>
  );
}
