"use client";

import { LoaderCircle } from "lucide-react";
import { createContext, startTransition, use, useActionState, useEffect, useRef, useState } from "react";
import { MAX_REQUEST_BYTES, downscaleImage, prepareFormData } from "@/lib/admin/prepare-upload";
import type { ActionState } from "@/lib/admin/types";
import { ToastContext } from "./Toast";

type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

const FormStatus = createContext<{ pending: boolean; submitter: string | null }>({ pending: false, submitter: null });

/**
 * Form wired to a Server Action with an inline, announced success/error message.
 * Submits via onSubmit (not the `action` prop) so React does not clear what the
 * user typed when the server reports an error. Pass `resetOnSuccess` for "add"
 * and upload forms.
 */
export function ActionForm({
  action,
  children,
  className = "",
  messageClassName = "",
  resetOnSuccess = false,
  shrinkFiles = false,
}: {
  action: Action;
  children: React.ReactNode;
  className?: string;
  messageClassName?: string;
  resetOnSuccess?: boolean;
  /** Scale photos down in the browser before sending (keeps requests under Vercel's 4.5 MB). */
  shrinkFiles?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const toast = use(ToastContext);
  // Report through the toast as soon as the server answers: the form itself may be
  // removed in the same update (e.g. after "Delete"), so an effect would never run.
  const [state, dispatch, pending] = useActionState(async (prev: ActionState, formData: FormData) => {
    const result = await action(prev, formData);
    if (result) toast?.(result);
    return result;
  }, null);
  const [submitter, setSubmitter] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);

  useEffect(() => {
    if (resetOnSuccess && state?.ok) formRef.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <form
      ref={formRef}
      className={className}
      onSubmit={async (event) => {
        event.preventDefault();
        const button = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        const confirmText = button?.dataset.confirm;
        if (confirmText && !window.confirm(confirmText)) return;
        let data = new FormData(event.currentTarget, button);
        setSubmitter(button?.name ? `${button.name}=${button.value}` : null);
        if (shrinkFiles) {
          setPreparing(true);
          const prepared = await prepareFormData(data);
          setPreparing(false);
          if ("error" in prepared) {
            toast?.({ ok: false, message: prepared.error });
            return;
          }
          data = prepared.data;
        }
        startTransition(() => dispatch(data));
      }}
    >
      <FormStatus value={{ pending: pending || preparing, submitter }}>{children}</FormStatus>
      {/* Inside the admin the layout's toast shows the message; elsewhere (login) it shows inline. */}
      {!toast && (
        <p
          role="status"
          aria-live="polite"
          className={`min-h-[1.25em] text-[13px] empty:hidden ${state?.ok ? "text-[#A9D9B0]" : "text-[#F2B8A2]"} ${messageClassName}`}
        >
          {pending ? "" : state?.message}
        </p>
      )}
    </form>
  );
}

/** Submit button that shows a spinner while its own submission is running. */
export function SubmitButton({
  children,
  name,
  value,
  variant = "gold",
  className = "",
  confirm,
  disabled,
  ...rest
}: {
  children: React.ReactNode;
  name?: string;
  value?: string;
  variant?: "gold" | "ghost" | "danger" | "icon";
  className?: string;
  confirm?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "name" | "value">) {
  const { pending, submitter } = use(FormStatus);
  const mine = pending && (!name || submitter === `${name}=${value}`);
  const styles = {
    gold: "gold-fill min-h-11 rounded-full px-5 text-[12px] font-medium tracking-[0.14em] text-ink-text uppercase",
    ghost:
      "min-h-11 rounded-full border border-gold-line-strong px-4 text-[12px] tracking-[0.14em] text-text uppercase hover:border-gold",
    danger:
      "min-h-11 rounded-full border border-[#F2B8A2]/40 px-4 text-[12px] tracking-[0.14em] text-[#F2B8A2] uppercase hover:border-[#F2B8A2]",
    icon: "h-11 w-11 justify-center rounded-full border border-glass-border text-text-soft hover:border-gold hover:text-gold",
  }[variant];
  return (
    <button
      type="submit"
      name={name}
      value={value}
      data-confirm={confirm}
      {...rest}
      disabled={pending || disabled}
      className={`inline-flex items-center gap-2 transition-colors disabled:opacity-40 ${styles} ${className}`}
    >
      {mine && variant !== "icon" ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

/**
 * Forms with several submit buttons submit with the first one when Enter is pressed.
 * Put this first so Enter means "save", not "move up" or "delete".
 */
export function DefaultSave() {
  return (
    <button type="submit" name="intent" value="save" tabIndex={-1} aria-hidden="true" className="sr-only">
      Save
    </button>
  );
}

/**
 * Multi-photo upload: every photo is scaled down in the browser and sent in its own
 * request (all other fields repeated), so a batch from a phone never exceeds the
 * per-request limit on Vercel. Progress and the result are reported via the toast.
 */
export function PhotoUploadForm({
  action,
  fileField,
  children,
  className = "",
}: {
  action: Action;
  fileField: string;
  children: React.ReactNode;
  className?: string;
}) {
  const toast = use(ToastContext);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const all = new FormData(form);
        const files = all.getAll(fileField).filter((f): f is File => f instanceof File && f.size > 0);
        all.delete(fileField);
        if (files.length === 0) {
          toast?.({ ok: false, message: "Choose at least one photo." });
          return;
        }
        setBusy(true);
        startTransition(async () => {
          let added = 0;
          let failure: string | null = null;
          for (const [i, original] of files.entries()) {
            setProgress(`Uploading ${i + 1} of ${files.length}`);
            const file = await downscaleImage(original);
            if (file.size > MAX_REQUEST_BYTES) {
              failure = `${original.name} is too large to upload.`;
              break;
            }
            const one = new FormData();
            for (const [key, value] of all.entries()) one.append(key, value);
            one.append(fileField, file, file.name);
            const result = await action(null, one);
            if (!result?.ok) {
              failure = result?.message ?? "Upload failed.";
              break;
            }
            added++;
          }
          setBusy(false);
          setProgress(null);
          const summary = added === 1 ? "1 photo added to the site." : `${added} photos added to the site.`;
          if (failure) toast?.({ ok: false, message: added ? `${summary} Then: ${failure}` : failure });
          else {
            toast?.({ ok: true, message: summary });
            form.reset();
          }
        });
      }}
    >
      <FormStatus value={{ pending: busy, submitter: null }}>{children}</FormStatus>
      <p aria-live="polite" className="text-[13px] text-text-muted empty:hidden">
        {progress}
      </p>
    </form>
  );
}
