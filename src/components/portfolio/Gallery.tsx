"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { btn } from "../ui";

export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string | null;
  category: string;
  year: number | null;
};

const SWIPE_THRESHOLD = 50;

/** Responsive photo grid with an accessible lightbox (native modal <dialog>). */
export function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipeStart = useRef<number | null>(null);
  const [index, setIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <p className="py-24 text-center font-display text-[28px] italic text-text-soft">New work is coming soon.</p>
    );
  }

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = (delta: number) =>
    setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length));

  const current = index === null ? null : photos[index];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {photos.map((photo, i) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => open(i)}
              aria-haspopup="dialog"
              aria-label={`${photo.category}: open photo ${i + 1} of ${photos.length}${photo.alt ? `, ${photo.alt}` : ""}`}
              className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[22px] bg-ink-raised-2 md:rounded-[26px]"
            >
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="(min-width: 1248px) 285px, (min-width: 1024px) 23vw, (min-width: 768px) 31vw, 46vw"
                className="object-cover transition-transform duration-[800ms] ease-editorial group-hover:scale-[1.07]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(transparent,rgb(11_8_6/0.6))]"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-3 left-4 text-[12px] tracking-[0.14em] text-text uppercase md:bottom-4 md:left-5"
              >
                {photo.category}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        onClose={() => setIndex(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-text backdrop:bg-transparent"
      >
        {current && index !== null && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 pt-4 md:px-8 md:pt-6">
              <p aria-live="polite" className="text-[11px] tracking-[0.3em] text-text-muted">
                {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
                <span className="sr-only">: {current.alt}</span>
              </p>
              <button
                type="button"
                onClick={close}
                aria-label="Close photo viewer"
                className={`${btn.iconCircle} h-11 w-11 border-glass-border text-text hover:border-gold hover:text-gold`}
              >
                <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <div
              className="relative mx-4 my-4 flex-1 touch-pan-y md:mx-24"
              onPointerDown={(e) => {
                swipeStart.current = e.clientX;
              }}
              onPointerUp={(e) => {
                if (swipeStart.current === null) return;
                const dx = e.clientX - swipeStart.current;
                swipeStart.current = null;
                if (Math.abs(dx) > SWIPE_THRESHOLD) step(dx < 0 ? 1 : -1);
              }}
            >
              <Image
                key={current.id}
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                draggable={false}
                className="object-contain select-none"
              />
            </div>

            <div className="flex items-center justify-between gap-4 px-4 pb-6 md:px-8 md:pb-8">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className={`${btn.iconCircle} h-12 w-12 border-gold-line-strong text-gold hover:border-gold`}
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <div className="min-w-0 flex-1 text-center">
                <p className="text-[11px] tracking-[0.2em] text-text-muted uppercase">
                  {current.category}
                  {current.year ? ` · ${current.year}` : ""}
                </p>
                {current.caption && (
                  <p className="mt-1 truncate font-display text-[20px] italic text-text-soft">{current.caption}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className={`${btn.iconCircle} h-12 w-12 border-gold-line-strong text-gold hover:border-gold`}
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
