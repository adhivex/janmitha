"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MenuIcon, btn } from "./ui";

const LINKS = [
  { href: "#story", label: "About" },
  { href: "#gallery", label: "Portfolio", page: "/portfolio" },
  { href: "#collaborate", label: "Collaborate" },
  { href: "#contact", label: "Contact" },
];

/** Full-screen menu sheet built on native <dialog> (focus containment + Esc for free). */
export function MobileMenu({ onHome = true }: { onHome?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = open ? "hidden" : "";
    return () => {
      root.style.overflow = "";
    };
  }, [open]);

  const show = () => {
    ref.current?.showModal();
    setOpen(true);
  };
  const close = () => ref.current?.close();

  // Close first, then jump: otherwise the dialog's focus restore to the menu
  // button would scroll the page back to the top.
  const go = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    close();
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      history.pushState(null, "", href);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      target.scrollIntoView();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`${btn.iconCircle} h-11 w-11 border-glass-border text-text hover:border-gold hover:text-gold`}
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        aria-label="Site menu"
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-text backdrop:bg-transparent"
      >
        <div className="mx-auto flex h-full max-w-[1200px] flex-col px-6 pt-6 pb-10">
          <div className="flex items-center justify-between">
            <span className="font-display text-[19px] font-semibold tracking-[0.34em]">JANMITHA</span>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className={`${btn.iconCircle} h-11 w-11 border-glass-border text-text hover:border-gold hover:text-gold`}
            >
              <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Primary" className="mt-16 flex-1">
            <ul className="flex flex-col">
              {LINKS.map((l, i) => (
                <li key={l.href} className="border-t border-gold-line last:border-b">
                  <a
                    href={onHome ? l.href : (l.page ?? `/${l.href}`)}
                    onClick={onHome ? (e) => go(e, l.href) : close}
                    className="flex min-h-[72px] items-center gap-5 font-display text-[40px] font-medium leading-none transition-[padding,color] duration-300 hover:pl-3 hover:text-gold"
                  >
                    <span className="w-8 font-display text-[16px] text-gold">0{i + 1}</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-center text-[11px] uppercase tracking-[0.34em] text-text-faint">
            Beauty. Intelligence. Impact.
          </p>
        </div>
      </dialog>
    </>
  );
}
