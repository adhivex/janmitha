"use client";

import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EnquiryForm } from "./EnquiryForm";
import { btn } from "./ui";

/**
 * "Send an Enquiry" button that opens the enquiry form in a modal dialog
 * (full-screen sheet on phones, centred panel from md up).
 */
export function EnquiryDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = open ? "hidden" : "";
    return () => {
      root.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => {
          ref.current?.showModal();
          setOpen(true);
        }}
        className={btn.gold}
      >
        Send an Enquiry
        <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      </button>

      <dialog
        ref={ref}
        aria-labelledby="enquiry-dialog-title"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) ref.current?.close();
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink-raised p-0 text-left text-text md:m-auto md:h-auto md:max-h-[92dvh] md:w-[min(92vw,720px)] md:rounded-[32px] md:border md:border-gold-line-strong"
      >
        <div className="relative flex h-full flex-col overflow-y-auto px-5 pt-5 pb-8 md:px-10 md:pt-8 md:pb-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">ENQUIRY</p>
              <h2 id="enquiry-dialog-title" className="gold-shimmer mt-2 font-script text-[48px] leading-[1.15] md:text-[56px]">
                Let&apos;s Collaborate
              </h2>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close enquiry form"
              className={`${btn.iconCircle} h-11 w-11 border-glass-border text-text hover:border-gold hover:text-gold`}
            >
              <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-2 mb-7 text-[15px] leading-[1.6] text-text-soft">
            Tell me about your brand and the project, and I&apos;ll get back to you soon.
          </p>
          <EnquiryForm />
        </div>
      </dialog>
    </>
  );
}
