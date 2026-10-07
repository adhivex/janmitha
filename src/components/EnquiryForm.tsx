"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import Script from "next/script";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { submitEnquiry } from "@/app/actions/enquiry";
import { type EnquiryInput, type EnquiryState, enquirySchema } from "@/lib/enquiry-schema";
import { btn } from "./ui";

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const field =
  "mt-2 block min-h-12 w-full rounded-[14px] border bg-white/[0.04] px-4 py-3 text-[15px] text-text placeholder:text-text-fainter transition-[border-color,box-shadow] duration-300 focus:border-gold focus:shadow-[0_0_0_3px_rgb(217_176_115/0.25)] focus:outline-none";
const label = "block text-[12px] font-normal tracking-[0.22em] text-text-muted uppercase";
const errorText = "mt-2 text-[13px] text-[#F2B8A2]";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const FIELDS = ["name", "brand", "email", "message"] as const;

export function EnquiryForm() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  // Load Turnstile only once the form is close to the viewport, so the spam check
  // never competes with the hero for bandwidth or main-thread time.
  const [nearby, setNearby] = useState(false);

  useEffect(() => {
    const el = widgetRef.current;
    if (!SITE_KEY || !el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearby(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const [state, dispatch, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, { status: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: "", brand: "", email: "", message: "" },
  });

  const renderTurnstile = () => {
    if (!SITE_KEY || !window.turnstile || !widgetRef.current || widgetId.current) return;
    widgetId.current = window.turnstile.render(widgetRef.current, { sitekey: SITE_KEY, theme: "dark" });
  };

  useEffect(renderTurnstile, []);

  useEffect(() => {
    if (state.status === "success") reset();
    if (state.status === "error" && state.fieldErrors) {
      for (const key of FIELDS) {
        const message = state.fieldErrors[key];
        if (message) setError(key, { message });
      }
    }
    if (state.status !== "idle" && widgetId.current) window.turnstile?.reset(widgetId.current);
  }, [state, reset, setError]);

  const onValid = (_values: EnquiryInput, event?: React.BaseSyntheticEvent) => {
    const form = event?.target;
    if (!(form instanceof HTMLFormElement)) return;
    const data = new FormData(form);
    startTransition(() => dispatch(data));
  };

  const describe = (name: keyof EnquiryInput) => (errors[name] ? `enquiry-${name}-error` : undefined);

  return (
    <form noValidate onSubmit={handleSubmit(onValid)} className="grid gap-5 md:grid-cols-2">
      {SITE_KEY && nearby && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={renderTurnstile}
        />
      )}

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="enquiry-website">Website</label>
        <input id="enquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="enquiry-name" className={label}>
          Your Name
        </label>
        <input
          id="enquiry-name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={describe("name")}
          className={`${field} ${errors.name ? "border-[#F2B8A2]" : "border-glass-border"}`}
          {...register("name")}
        />
        {errors.name && <p id="enquiry-name-error" className={errorText}>{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="enquiry-brand" className={label}>
          Brand / Company
        </label>
        <input
          id="enquiry-brand"
          autoComplete="organization"
          aria-invalid={!!errors.brand}
          aria-describedby={describe("brand")}
          className={`${field} ${errors.brand ? "border-[#F2B8A2]" : "border-glass-border"}`}
          {...register("brand")}
        />
        {errors.brand && <p id="enquiry-brand-error" className={errorText}>{errors.brand.message}</p>}
      </div>
      <div className="md:col-span-2">
        <label htmlFor="enquiry-email" className={label}>
          Email
        </label>
        <input
          id="enquiry-email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={describe("email")}
          className={`${field} ${errors.email ? "border-[#F2B8A2]" : "border-glass-border"}`}
          {...register("email")}
        />
        {errors.email && <p id="enquiry-email-error" className={errorText}>{errors.email.message}</p>}
      </div>
      <div className="md:col-span-2">
        <label htmlFor="enquiry-message" className={label}>
          Tell me about the project
        </label>
        <textarea
          id="enquiry-message"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={describe("message")}
          className={`${field} resize-y ${errors.message ? "border-[#F2B8A2]" : "border-glass-border"}`}
          {...register("message")}
        />
        {errors.message && <p id="enquiry-message-error" className={errorText}>{errors.message.message}</p>}
      </div>

      {SITE_KEY && <div ref={widgetRef} className="md:col-span-2" />}

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className={`${btn.gold} w-full disabled:cursor-wait disabled:opacity-70 md:w-auto`}
        >
          {pending ? "Sending" : "Send Enquiry"}
          {pending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
        <p
          aria-live="polite"
          role="status"
          className={`mt-4 min-h-[1.5em] text-[14px] leading-[1.6] ${state.status === "error" ? "text-[#F2B8A2]" : "text-text-soft"}`}
        >
          {state.status !== "idle" && state.message}
        </p>
      </div>
    </form>
  );
}
