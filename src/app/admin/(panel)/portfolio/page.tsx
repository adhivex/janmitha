import { ArrowDown, ArrowUp, Upload } from "lucide-react";
import Image from "next/image";
import { ActionForm, DefaultSave, SubmitButton } from "@/components/admin/ActionForm";
import { Checkbox, Field, Panel, inputClass, labelClass } from "@/components/admin/fields";
import { ListEditor } from "@/components/admin/ListEditor";
import { requireAdmin } from "@/lib/admin/auth";
import type { PortfolioCategory } from "@/lib/content";
import { mutatePhoto, uploadPhotos } from "../../actions";

function CategorySelect({ categories, id, defaultValue }: { categories: PortfolioCategory[]; id: string; defaultValue?: string }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        Category
      </label>
      <select id={id} name="category_id" defaultValue={defaultValue ?? ""} required className={inputClass}>
        <option value="" disabled>
          Choose a category
        </option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>
    </div>
  );
}

export default async function PortfolioAdmin() {
  const { supabase } = await requireAdmin();
  const [{ data: categoryRows }, { data: itemRows }] = await Promise.all([
    supabase.from("portfolio_categories").select("*").order("sort_order"),
    supabase.from("portfolio_items").select("*").order("sort_order").order("created_at", { ascending: false }),
  ]);
  const categories = categoryRows ?? [];
  const items = itemRows ?? [];

  return (
    <div className="grid gap-8">
      <h1 className="font-display text-[40px] leading-tight font-medium">Portfolio</h1>

      <Panel title="Add photos" description="Pick one or more photos from your phone. JPG, PNG, WebP or AVIF, up to 10 MB each.">
        <ActionForm action={uploadPhotos} className="grid gap-4" resetOnSuccess>
          <div>
            <label htmlFor="upload-photos" className={labelClass}>
              Photos
            </label>
            <input
              id="upload-photos"
              type="file"
              name="photos"
              multiple
              required
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="mt-2 block w-full text-[14px] text-text-soft file:mr-3 file:min-h-11 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:text-[12px] file:tracking-[0.12em] file:text-text file:uppercase"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <CategorySelect categories={categories} id="upload-category" />
            <Field label="Year (optional)" name="year" id="upload-year" maxLength={4} placeholder="2026" />
            <Field
              label="Describe the photo"
              name="alt_text"
              id="upload-alt"
              maxLength={200}
              hint="For screen readers and Google, e.g. “Janmitha in a red saree, jewellery shoot”."
            />
            <Field label="Caption (optional)" name="caption" id="upload-caption" maxLength={200} />
          </div>
          <Checkbox label="Featured" name="is_featured" id="upload-featured" />
          <div>
            <SubmitButton>
              <Upload className="h-4 w-4" aria-hidden="true" />
              Upload
            </SubmitButton>
          </div>
        </ActionForm>
      </Panel>

      {categories.map((category) => {
        const photos = items.filter((i) => i.category_id === category.id);
        return (
          <section key={category.id} aria-labelledby={`cat-${category.id}`}>
            <h2 id={`cat-${category.id}`} className="font-display text-[28px] font-medium">
              {category.title} <span className="text-[16px] text-text-muted">({photos.length})</span>
            </h2>
            {photos.length === 0 ? (
              <p className="mt-2 text-[14px] text-text-muted">No photos yet.</p>
            ) : (
              <ol className="mt-4 grid gap-4 md:grid-cols-2">
                {photos.map((photo, i) => (
                  <li key={photo.id}>
                    <ActionForm
                      action={mutatePhoto}
                      className={`grid gap-4 rounded-[22px] border p-4 ${photo.is_visible ? "border-glass-border bg-ink-raised" : "border-dashed border-glass-border opacity-80"}`}
                    >
                      <DefaultSave />
                      <input type="hidden" name="id" value={photo.id} />
                      <div className="flex gap-4">
                        <span className="relative aspect-[3/4] w-24 flex-none overflow-hidden rounded-[14px] bg-ink-raised-2">
                          <Image src={photo.image_url} alt={photo.alt_text} fill sizes="96px" className="object-cover" />
                        </span>
                        <div className="flex flex-1 flex-col justify-between gap-2">
                          <div className="flex justify-end gap-2">
                            <SubmitButton variant="icon" name="intent" value="up" aria-label={`Move photo ${i + 1} up`} disabled={i === 0}>
                              <ArrowUp className="h-4 w-4" aria-hidden="true" />
                            </SubmitButton>
                            <SubmitButton
                              variant="icon"
                              name="intent"
                              value="down"
                              aria-label={`Move photo ${i + 1} down`}
                              disabled={i === photos.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" aria-hidden="true" />
                            </SubmitButton>
                          </div>
                          <Checkbox label="Featured" name="is_featured" id={`${photo.id}-featured`} defaultChecked={photo.is_featured} />
                          <Checkbox label="Show on site" name="is_visible" id={`${photo.id}-visible`} defaultChecked={photo.is_visible} />
                        </div>
                      </div>
                      <CategorySelect categories={categories} id={`${photo.id}-category`} defaultValue={photo.category_id} />
                      <Field label="Describe the photo" name="alt_text" id={`${photo.id}-alt`} defaultValue={photo.alt_text} maxLength={200} />
                      <div className="grid grid-cols-[1fr_6rem] gap-3">
                        <Field label="Caption" name="caption" id={`${photo.id}-caption`} defaultValue={photo.caption} maxLength={200} />
                        <Field label="Year" name="year" id={`${photo.id}-year`} defaultValue={photo.year} maxLength={4} />
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <SubmitButton variant="danger" name="intent" value="delete" confirm="Delete this photo? This cannot be undone.">
                          Delete
                        </SubmitButton>
                        <SubmitButton name="intent" value="save">
                          Save
                        </SubmitButton>
                      </div>
                    </ActionForm>
                  </li>
                ))}
              </ol>
            )}
          </section>
        );
      })}

      <section aria-labelledby="categories-heading" className="grid gap-4">
        <h2 id="categories-heading" className="font-display text-[32px] font-medium">
          Categories
        </h2>
        <p className="-mt-2 text-[14px] text-text-muted">
          The four cards on the home page and the filters on /portfolio. Deleting a category deletes its photos.
        </p>
        <ListEditor
          table="portfolio_categories"
          itemLabel="category"
          rows={categories}
          withCover
          fields={[
            { name: "title", label: "Title", maxLength: 80 },
            { name: "slug", label: "Web address", maxLength: 80, hint: "Used in /portfolio/…, letters and dashes only." },
          ]}
        />
      </section>
    </div>
  );
}
