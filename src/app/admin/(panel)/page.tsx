import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";

export default async function AdminHome() {
  const { supabase, user } = await requireAdmin();
  const count = async (table: "enquiries" | "portfolio_items" | "brands", filter?: [string, string]) => {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    return (await q).count ?? 0;
  };
  const [fresh, photos, brands] = await Promise.all([
    count("enquiries", ["status", "new"]),
    count("portfolio_items"),
    count("brands"),
  ]);

  const cards = [
    { href: "/admin/enquiries", value: fresh, label: fresh === 1 ? "New enquiry" : "New enquiries" },
    { href: "/admin/portfolio", value: photos, label: "Portfolio photos" },
    { href: "/admin/brands", value: brands, label: "Brands listed" },
  ];

  return (
    <div>
      <h1 className="font-display text-[40px] leading-tight font-medium md:text-[52px]">
        Hello, <em className="gold-shimmer">Janmitha</em>
      </h1>
      <p className="mt-2 text-[14px] text-text-muted">Signed in as {user.email}</p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        {cards.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className="flex items-end justify-between rounded-[22px] border border-glass-border bg-ink-raised p-5 transition-colors hover:border-gold"
            >
              <span>
                <span className="gold-shimmer block font-display text-[44px] leading-none font-semibold">{c.value}</span>
                <span className="mt-2 block text-[11px] tracking-[0.2em] text-text-muted uppercase">{c.label}</span>
              </span>
              <ArrowUpRight className="h-5 w-5 text-gold" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded-[22px] border border-glass-border p-5 text-[14px] leading-[1.7] text-text-soft">
        <p className="font-display text-[22px] text-text">Quick guide</p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong className="font-medium text-text">Portfolio:</strong> add new shoot photos, choose the category,
            and mark favourites as featured.
          </li>
          <li>
            <strong className="font-medium text-text">Profile:</strong> change your text, contact links, videos, media kit
            and the main photos.
          </li>
          <li>Changes appear on the public site straight away.</li>
        </ul>
      </div>
    </div>
  );
}
