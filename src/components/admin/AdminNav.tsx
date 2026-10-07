"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/stats", label: "Stats" },
  { href: "/admin/brands", label: "Brands" },
  { href: "/admin/services", label: "Services" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin sections" className="-mx-4 md:mx-0">
      <ul className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-1 md:flex-wrap md:px-0">
        {LINKS.map((l) => {
          const current = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
          return (
            <li key={l.href} className="flex-none">
              <Link
                href={l.href}
                aria-current={current ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 text-[12px] tracking-[0.14em] uppercase transition-colors ${current ? "gold-fill border-transparent font-medium text-ink-text" : "border-glass-border text-text-soft hover:border-gold hover:text-text"}`}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
