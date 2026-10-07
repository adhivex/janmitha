import { ListEditor } from "@/components/admin/ListEditor";
import { requireAdmin } from "@/lib/admin/auth";

export default async function ServicesAdmin() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("services").select("*").order("sort_order");
  return (
    <div className="grid gap-5">
      <h1 className="font-display text-[40px] leading-tight font-medium">Services</h1>
      <p className="-mt-3 text-[14px] text-text-muted">The &ldquo;Ways we can collaborate&rdquo; list.</p>
      <ListEditor
        table="services"
        itemLabel="service"
        rows={data ?? []}
        fields={[
          { name: "title", label: "Title", maxLength: 80 },
          { name: "description", label: "Description", multiline: true, maxLength: 300 },
        ]}
      />
    </div>
  );
}
