import { ExternalLink, LogOut } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { signOut } from "../actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-glass-border bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1000px] items-center justify-between gap-3 px-4 py-3 md:px-8">
          <Link href="/admin" className="inline-flex min-h-11 items-center gap-2">
            <span className="font-display text-[17px] font-semibold tracking-[0.3em]">JANMITHA</span>
            <span className="text-[10px] tracking-[0.24em] text-gold uppercase">Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-glass-border px-3 text-[12px] text-text-soft hover:border-gold md:px-4"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">View site</span>
              <span className="sr-only md:hidden">View site (opens in new tab)</span>
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-glass-border px-3 text-[12px] text-text-soft hover:border-gold md:px-4"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden md:inline">Sign out</span>
                <span className="sr-only md:hidden">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1000px] px-4 pt-5 pb-16 md:px-8 md:pt-8">
        <AdminNav />
        <main className="mt-6 md:mt-8">
          <Suspense fallback={<p className="py-16 text-center text-text-muted">Loading…</p>}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
