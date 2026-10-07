import { Mail } from "lucide-react";
import Link from "next/link";
import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { requireAdmin } from "@/lib/admin/auth";
import { updateEnquiry } from "../../actions";

const FILTERS = ["new", "replied", "booked", "archived", "all"] as const;
type Filter = (typeof FILTERS)[number];

const STATUS_STYLE: Record<string, string> = {
  new: "bg-gold text-ink-text",
  replied: "border border-gold-line-strong text-text-soft",
  booked: "bg-[#A9D9B0] text-ink-text",
  archived: "border border-glass-border text-text-fainter",
};

const dateFormat = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export default async function EnquiriesAdmin({ searchParams }: PageProps<"/admin/enquiries">) {
  const { supabase } = await requireAdmin();
  const { status } = await searchParams;
  const filter: Filter = FILTERS.includes(status as Filter) ? (status as Filter) : "new";

  let query = supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(200);
  if (filter !== "all") query = query.eq("status", filter);
  const { data } = await query;
  const enquiries = data ?? [];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <h1 className="font-display text-[40px] leading-tight font-medium">Enquiries</h1>
      <nav aria-label="Filter enquiries" className="-mx-4 md:mx-0">
        <ul className="scrollbar-none flex gap-2 overflow-x-auto px-4 md:px-0">
          {FILTERS.map((f) => (
            <li key={f} className="flex-none">
              <Link
                href={`/admin/enquiries?status=${f}`}
                aria-current={f === filter ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 text-[12px] tracking-[0.14em] uppercase ${f === filter ? "border-gold text-gold" : "border-glass-border text-text-soft hover:border-gold"}`}
              >
                {f}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {enquiries.length === 0 ? (
        <p className="py-12 text-center text-text-muted">No {filter === "all" ? "" : filter} enquiries.</p>
      ) : (
        <ol className="grid grid-cols-[minmax(0,1fr)] gap-4">
          {enquiries.map((e) => (
            <li key={e.id} className="rounded-[22px] border border-glass-border bg-ink-raised p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-[24px] leading-tight">{e.name}</p>
                  {e.brand && <p className="text-[14px] text-text-soft">{e.brand}</p>}
                  <p className="mt-1 text-[12px] text-text-fainter">{dateFormat.format(new Date(e.created_at))}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] tracking-[0.14em] uppercase ${STATUS_STYLE[e.status]}`}>
                  {e.status}
                </span>
              </div>
              <p className="mt-4 text-[15px] leading-[1.65] whitespace-pre-wrap text-text-soft">{e.message}</p>
              <a
                href={`mailto:${e.email}?subject=${encodeURIComponent("Re: your enquiry")}`}
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-[14px] break-all text-gold underline-offset-4 hover:underline"
              >
                <Mail className="h-4 w-4 flex-none" aria-hidden="true" />
                {e.email}
              </a>
              <ActionForm action={updateEnquiry} className="mt-3 flex flex-wrap items-center gap-2 border-t border-glass-border pt-4">
                <input type="hidden" name="id" value={e.id} />
                {(["replied", "booked", "archived", "new"] as const)
                  .filter((s) => s !== e.status)
                  .map((s) => (
                    <SubmitButton key={s} variant={s === "booked" ? "gold" : "ghost"} name="status" value={s}>
                      {s === "new" ? "Mark as new" : `Mark ${s}`}
                    </SubmitButton>
                  ))}
              </ActionForm>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
