"use client";

import { createContext, useCallback, useEffect, useRef, useState } from "react";
import type { ActionState } from "@/lib/admin/types";

export const ToastContext = createContext<((state: NonNullable<ActionState>) => void) | null>(null);

/**
 * Admin-wide status message. Lives in the layout, so "Deleted." or "Marked as booked."
 * stays visible even when the card that triggered it disappears from the list.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<(NonNullable<ActionState> & { id: number }) | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const notify = useCallback((state: NonNullable<ActionState>) => {
    clearTimeout(timer.current);
    setToast({ ...state, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), state.ok ? 3500 : 7000);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext value={notify}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
        <p
          role="status"
          aria-live="polite"
          className={`rounded-full border px-5 py-3 text-[14px] shadow-[0_14px_34px_rgb(0_0_0/0.5)] transition-opacity duration-300 ${
            toast ? "opacity-100" : "opacity-0"
          } ${toast?.ok === false ? "border-[#F2B8A2]/50 bg-[#2A1814] text-[#F2B8A2]" : "border-[#A9D9B0]/40 bg-[#14211A] text-[#A9D9B0]"}`}
        >
          {toast?.message}
        </p>
      </div>
    </ToastContext>
  );
}
