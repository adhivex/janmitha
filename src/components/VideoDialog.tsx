"use client";

import { Play, X } from "lucide-react";
import { useRef, useState } from "react";
import { btn } from "./ui";

type Props = {
  url: string | null;
  label: string;
  /** Tooltip on the disabled button while the video URL has not been supplied yet. */
  placeholder: string;
  className?: string;
};

function toEmbed(url: string): { kind: "video" | "iframe"; src: string } {
  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return { kind: "video", src: url };
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0` };
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { kind: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1` };
  return { kind: "iframe", src: url };
}

/** Ghost pill with a round play icon that opens a video in a modal dialog. */
export function VideoDialog({ url, label, placeholder, className = "" }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  // Only mount the player while open so closing the dialog stops playback.
  const [open, setOpen] = useState(false);
  const embed = url && open ? toEmbed(url) : null;

  // Spec: without a video URL the button is shown disabled rather than opening an empty player.
  if (!url) {
    return (
      <button
        type="button"
        disabled
        title={placeholder}
        className={`${btn.ghostBase.replace("lift ", "")} cursor-not-allowed opacity-60 ${className || "pr-6 pl-2 tracking-[0.2em]"}`}
      >
        <span className="gold-fill inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-text">
          <Play className="ml-0.5 h-4 w-4" fill="currentColor" strokeWidth={0} aria-hidden="true" />
        </span>
        {label}
        <span className="sr-only">(coming soon)</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          ref.current?.showModal();
          setOpen(true);
        }}
        aria-haspopup="dialog"
        className={`${btn.ghostBase} ${className || "pr-6 pl-2 tracking-[0.2em]"}`}
      >
        <span className="gold-fill inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-text">
          <Play className="ml-0.5 h-4 w-4" fill="currentColor" strokeWidth={0} aria-hidden="true" />
        </span>
        {label}
      </button>

      <dialog
        ref={ref}
        aria-label={label}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) ref.current?.close();
        }}
        className="m-auto w-[min(92vw,960px)] max-w-none overflow-visible bg-transparent p-0 text-text"
      >
        <div className="relative overflow-hidden rounded-[24px] border border-gold-line-strong bg-ink-raised">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close video"
            className={`${btn.iconCircle} glass absolute top-3 right-3 z-10 h-11 w-11 text-text hover:border-gold hover:text-gold`}
          >
            <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
          <div className="aspect-video w-full">
            {embed?.kind === "video" && (
              <video src={embed.src} controls autoPlay playsInline className="h-full w-full bg-black" />
            )}
            {embed?.kind === "iframe" && (
              <iframe
                src={embed.src}
                title={label}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
