import Image from "next/image";

export const inputClass =
  "mt-1.5 block min-h-12 w-full rounded-[14px] border border-glass-border bg-white/[0.04] px-4 py-3 text-[16px] text-text placeholder:text-text-fainter focus:border-gold focus:shadow-[0_0_0_3px_rgb(217_176_115/0.25)] focus:outline-none";
export const labelClass = "block text-[11px] tracking-[0.2em] text-text-muted uppercase";

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  hint?: string;
  required?: boolean;
  type?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  placeholder?: string;
  autoComplete?: string;
  id?: string;
};

/** Labelled text input or textarea. 16px text so iOS doesn't zoom on focus. */
export function Field({ label, name, defaultValue, hint, multiline, rows = 3, id, ...rest }: FieldProps) {
  const fieldId = id ?? `f-${name}`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  return (
    <div>
      <label htmlFor={fieldId} className={labelClass}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={fieldId}
          name={name}
          rows={rows}
          defaultValue={defaultValue ?? ""}
          aria-describedby={hintId}
          className={`${inputClass} resize-y`}
          {...rest}
        />
      ) : (
        <input
          id={fieldId}
          name={name}
          defaultValue={defaultValue ?? ""}
          aria-describedby={hintId}
          className={inputClass}
          {...rest}
        />
      )}
      {hint && (
        <p id={hintId} className="mt-1.5 text-[12px] text-text-fainter">
          {hint}
        </p>
      )}
    </div>
  );
}

export function Checkbox({
  label,
  name,
  defaultChecked,
  id,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  id?: string;
}) {
  const fieldId = id ?? `c-${name}`;
  return (
    <label htmlFor={fieldId} className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-[14px] text-text-soft">
      <input
        id={fieldId}
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-5 w-5 accent-[#D9B073]"
      />
      {label}
    </label>
  );
}

/** File picker with a preview of the current image (or file link) and a remove option. */
export function FileField({
  label,
  name,
  current,
  accept = "image/jpeg,image/png,image/webp,image/avif",
  removable = true,
  placeholderNote,
  id,
}: {
  label: string;
  name: string;
  current: string | null;
  accept?: string;
  removable?: boolean;
  placeholderNote?: string;
  id?: string;
}) {
  const fieldId = id ?? `file-${name}`;
  const isImage = accept.startsWith("image");
  return (
    <div className="rounded-[18px] border border-glass-border p-4">
      <label htmlFor={fieldId} className={labelClass}>
        {label}
      </label>
      <div className="mt-3 flex items-center gap-4">
        {isImage && current ? (
          <span className="relative h-20 w-16 flex-none overflow-hidden rounded-[10px] bg-ink-raised-2">
            <Image src={current} alt="" fill sizes="64px" className="object-cover" />
          </span>
        ) : null}
        <div className="min-w-0 flex-1 text-[13px] text-text-fainter">
          {current ? (
            isImage ? (
              "Current photo"
            ) : (
              <a href={current} className="break-all text-gold underline underline-offset-4">
                Current file
              </a>
            )
          ) : (
            (placeholderNote ?? "Not set")
          )}
        </div>
      </div>
      <input
        id={fieldId}
        type="file"
        name={name}
        accept={accept}
        className="mt-3 block w-full text-[14px] text-text-soft file:mr-3 file:min-h-11 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:text-[12px] file:tracking-[0.12em] file:text-text file:uppercase"
      />
      {removable && current && (
        <div className="mt-2">
          <Checkbox label="Remove current file" name={`remove_${name}`} id={`${fieldId}-remove`} />
        </div>
      )}
    </div>
  );
}

export function Panel({ title, children, description }: { title: string; children: React.ReactNode; description?: string }) {
  return (
    <section className="rounded-[24px] border border-glass-border bg-ink-raised p-5 md:p-7">
      <h2 className="font-display text-[28px] leading-tight font-medium">{title}</h2>
      {description && <p className="mt-1 text-[14px] leading-[1.6] text-text-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
