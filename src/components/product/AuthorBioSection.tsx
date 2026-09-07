"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { Product } from "@/lib/types";
import { getAuthorProfile } from "@/lib/data/landingContent";
import { toBengaliNumber } from "@/lib/format";

const PHOTO_COUNT = 10;

export function AuthorBioSection({ product }: { product: Product }) {
  const author = getAuthorProfile(product);
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByPhoto(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.querySelector<HTMLElement>("[data-author-photo]");
    const step = slide?.offsetWidth ?? 260;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <section className="border-y border-border bg-surface-muted py-10">
      <div className="container-page">
        <div className="mx-auto max-w-md text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">যিনি লিখেছেন</p>

          <div className="relative mt-4">
            <div
              ref={trackRef}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth rounded-xl border-2 border-star p-1.5 scrollbar-none"
            >
              {Array.from({ length: PHOTO_COUNT }).map((_, i) => (
                <div
                  key={i}
                  data-author-photo
                  className="flex aspect-[4/5] w-full shrink-0 snap-center flex-col items-center justify-center gap-1.5 rounded-lg text-white/85"
                  style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
                >
                  <ImageIcon size={22} />
                  <span className="text-xs">{author.name} — ছবি {toBengaliNumber(i + 1)}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => scrollByPhoto(-1)}
              aria-label="আগের ছবি"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-surface/90 p-1.5 text-ink-soft shadow-sm hover:text-primary"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollByPhoto(1)}
              aria-label="পরের ছবি"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-surface/90 p-1.5 text-ink-soft shadow-sm hover:text-primary"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <h2 className="mt-4 font-display text-lg font-bold text-foreground">{author.name}</h2>
          <p className="text-sm text-ink-faint">{author.title}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{author.bio}</p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {author.stats.map((s) => (
              <div key={s.label} className="rounded-lg border-b-4 border-star bg-surface p-3">
                <p className="font-display text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-ink-faint">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
