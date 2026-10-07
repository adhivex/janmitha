"use client";

import { LoaderCircle } from "lucide-react";
import { createContext, startTransition, use, useActionState, useEffect, useRef, useState } from "react";
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
}: {
  action: Action;
  children: React.ReactNode;
  className?: string;
  messageClassName?: string;
  resetOnSuccess?: boolean;
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

  useEffect(() => {
    if (resetOnSuccess && state?.ok) formRef.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <form
      ref={formRef}
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        const button = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        const confirmText = button?.dataset.confirm;
        if (confirmText && !window.confirm(confirmText)) return;
        const data = new FormData(event.currentTarget, button);
        setSubmitter(button?.name ? `${button.name}=${button.value}` : null);
        startTransition(() => dispatch(data));
      }}
    >
      <FormStatus value={{ pending, submitter }}>{children}</FormStatus>
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
