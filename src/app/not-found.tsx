import type { Metadata } from "next";
import Link from "next/link";
import { StatusPage } from "@/components/StatusPage";
import { btn } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="This page is"
      accent="out of frame."
      body="The page you were looking for has moved or never existed. Explore the portfolio or head back home."
      action={
        <Link href="/portfolio" className={btn.ghost}>
          View Portfolio
        </Link>
      }
    />
  );
}
