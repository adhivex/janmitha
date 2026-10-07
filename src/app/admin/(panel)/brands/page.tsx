import { ListEditor } from "@/components/admin/ListEditor";
import { requireAdmin } from "@/lib/admin/auth";

export default async function BrandsAdmin() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("brands").select("*").order("sort_order");
  return (
    <div className="grid gap-5">
      <h1 className="font-display text-[40px] leading-tight font-medium">Brands</h1>
      <p className="-mt-3 text-[14px] text-text-muted">Names in the &ldquo;Brands I&apos;ve worked with&rdquo; strip.</p>
      <ListEditor
        table="brands"
        itemLabel="brand"
        rows={data ?? []}
        fields={[{ name: "name", label: "Brand name", maxLength: 80 }]}
      />
    </div>
  );
}
