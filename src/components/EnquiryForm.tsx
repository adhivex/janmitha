"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { btn } from "./ui";

const field =
  "mt-2 block min-h-12 w-full rounded-[14px] border border-glass-border bg-white/[0.04] px-4 py-3 text-[15px] text-text placeholder:text-text-fainter transition-[border-color,box-shadow] duration-300 focus:border-gold focus:shadow-[0_0_0_3px_rgb(217_176_115/0.25)] focus:outline-none";
const label = "block text-[12px] font-normal tracking-[0.22em] text-text-muted uppercase";

/**
 * Phase 1: markup, labels and client-side validation only.
 * Phase 3 replaces the submit handler with the Zod + Turnstile server action.
 */
export function EnquiryForm({ email }: { email: string | null }) {
  const [status, setStatus] = useState<"idle" | "pending">("idle");

  return (
    <form
      className="grid gap-5 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        setStatus("pending");
      }}
    >
      <div>
        <label htmlFor="enquiry-name" className={label}>
          Your Name
        </label>
        <input id="enquiry-name" name="name" required minLength={2} maxLength={100} autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor="enquiry-brand" className={label}>
          Brand / Company
        </label>
        <input id="enquiry-brand" name="brand" maxLength={120} autoComplete="organization" className={field} />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="enquiry-email" className={label}>
          Email
        </label>
        <input id="enquiry-email" name="email" type="email" required maxLength={200} autoComplete="email" className={field} />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="enquiry-message" className={label}>
          Tell me about the project
        </label>
        <textarea
          id="enquiry-message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          className={`${field} resize-y`}
        />
      </div>
      <div className="md:col-span-2">
        <button type="submit" className={`${btn.gold} w-full md:w-auto`}>
          Send Enquiry
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </button>
        <p aria-live="polite" className="mt-4 min-h-[1.5em] text-[14px] leading-[1.6] text-text-soft">
          {status === "pending" &&
            `Online enquiries are not connected yet. Please email ${email ?? "[HER EMAIL]"} for now.`}
        </p>
      </div>
    </form>
  );
}
