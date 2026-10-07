import { ListEditor } from "@/components/admin/ListEditor";
import { requireAdmin } from "@/lib/admin/auth";

export default async function StatsAdmin() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("stats").select("*").order("sort_order");
  return (
    <div className="grid gap-5">
      <h1 className="font-display text-[40px] leading-tight font-medium">Stats</h1>
      <p className="-mt-3 text-[14px] text-text-muted">The numbers under the hero, e.g. &ldquo;100K+ / SOCIAL REACH&rdquo;.</p>
      <ListEditor
        table="stats"
        itemLabel="stat"
        rows={data ?? []}
        fields={[
          { name: "value", label: "Number", maxLength: 20 },
          { name: "label", label: "Label", maxLength: 60 },
        ]}
      />
    </div>
  );
}
