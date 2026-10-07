import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import { createListRow, mutateListRow } from "@/app/admin/actions";
import { ActionForm, DefaultSave, SubmitButton } from "./ActionForm";
import { Checkbox, Field, FileField, Panel } from "./fields";

export type ListField = { name: string; label: string; multiline?: boolean; maxLength?: number; hint?: string };
type Row = { id: string; is_visible: boolean; [key: string]: unknown };

/** Add / edit / reorder / hide / delete rows of a simple content table. */
export function ListEditor({
  table,
  rows,
  fields,
  itemLabel,
  withCover = false,
}: {
  table: "stats" | "brands" | "services" | "portfolio_categories";
  rows: Row[];
  fields: ListField[];
  itemLabel: string;
  withCover?: boolean;
}) {
  return (
    <div className="grid gap-5">
      <ol className="grid gap-4">
        {rows.map((row, i) => (
          <li key={row.id}>
            <ActionForm
              action={mutateListRow}
              className={`grid gap-4 rounded-[22px] border p-4 md:p-5 ${row.is_visible ? "border-glass-border bg-ink-raised" : "border-dashed border-glass-border bg-transparent opacity-80"}`}
            >
              <DefaultSave />
              <input type="hidden" name="table" value={table} />
              <input type="hidden" name="id" value={row.id} />
              <div className="flex items-center justify-between gap-3">
                <span className="font-display text-[18px] text-gold">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex gap-2">
                  <SubmitButton variant="icon" name="intent" value="up" aria-label={`Move ${itemLabel} ${i + 1} up`} disabled={i === 0}>
                    <ArrowUp className="h-4 w-4" aria-hidden="true" />
                  </SubmitButton>
                  <SubmitButton
                    variant="icon"
                    name="intent"
                    value="down"
                    aria-label={`Move ${itemLabel} ${i + 1} down`}
                    disabled={i === rows.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" aria-hidden="true" />
                  </SubmitButton>
                </div>
              </div>
              <div className={`grid gap-4 ${fields.length > 1 && !fields.some((f) => f.multiline) ? "md:grid-cols-2" : ""}`}>
                {fields.map((f) => (
                  <Field
                    key={f.name}
                    id={`${row.id}-${f.name}`}
                    label={f.label}
                    name={f.name}
                    defaultValue={row[f.name] as string}
                    multiline={f.multiline}
                    maxLength={f.maxLength}
                    hint={f.hint}
                  />
                ))}
              </div>
              {withCover && (
                <FileField
                  id={`${row.id}-cover`}
                  label="Cover photo"
                  name="cover"
                  current={(row.cover_url as string | null) ?? null}
                  placeholderNote="Using the bundled placeholder photo"
                />
              )}
              <div className="flex flex-wrap items-center gap-2">
                <Checkbox label="Show on site" name="is_visible" id={`${row.id}-visible`} defaultChecked={row.is_visible} />
                <span className="flex-1" />
                <SubmitButton
                  variant="danger"
                  name="intent"
                  value="delete"
                  confirm={`Delete this ${itemLabel}? This cannot be undone.`}
                >
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

      <Panel title={`Add ${itemLabel}`}>
        <ActionForm action={createListRow} className="grid gap-4" resetOnSuccess>
          <input type="hidden" name="table" value={table} />
          <div className={`grid gap-4 ${fields.length > 1 && !fields.some((f) => f.multiline) ? "md:grid-cols-2" : ""}`}>
            {fields.map((f) => (
              <Field
                key={f.name}
                id={`new-${table}-${f.name}`}
                label={f.label}
                name={f.name}
                multiline={f.multiline}
                maxLength={f.maxLength}
                hint={f.hint}
              />
            ))}
          </div>
          {withCover && (
            <FileField id={`new-${table}-cover`} label="Cover photo (optional)" name="cover" current={null} removable={false} />
          )}
          <div>
            <SubmitButton>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add {itemLabel}
            </SubmitButton>
          </div>
        </ActionForm>
      </Panel>
    </div>
  );
}
