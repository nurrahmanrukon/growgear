"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toBengaliNumber } from "@/lib/format";

export function AuthorPhotoCarousel({ photoUrls, authorName }: { photoUrls: string[]; authorName: string }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByPhoto(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.querySelector<HTMLElement>("[data-author-photo]");
    const step = slide?.offsetWidth ?? 260;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <div className="relative mt-4">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth rounded-xl border-2 border-star p-1.5 scrollbar-none"
      >
        {photoUrls.map((url, i) => (
          <div key={url} data-author-photo className="w-full shrink-0 snap-center overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded author photo, served from /api/media */}
            <img
              src={url}
              alt={`${authorName} — ছবি ${toBengaliNumber(i + 1)}`}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        ))}
      </div>
      {photoUrls.length > 1 && (
        <>
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
        </>
      )}
    </div>
  );
}
