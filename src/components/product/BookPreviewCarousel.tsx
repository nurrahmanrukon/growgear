"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { toBengaliNumber } from "@/lib/format";

export function BookPreviewCarousel({ pageUrls, title }: { pageUrls: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  function go(delta: number) {
    setActive((a) => (a + delta + pageUrls.length) % pageUrls.length);
  }

  useEffect(() => {
    if (!zoomOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setZoomOpen(false);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomOpen]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) go(delta < 0 ? 1 : -1);
    touchStartX.current = null;
  }

  const showDots = pageUrls.length <= 10;

  const dots = (activeColor: string, inactiveColor: string) =>
    pageUrls.map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setActive(i)}
        aria-label={`পাতা ${toBengaliNumber(i + 1)}`}
        className="h-1.5 rounded-full transition-all"
        style={{ width: i === active ? "20px" : "6px", background: i === active ? activeColor : inactiveColor }}
      />
    ));

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative w-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          aria-label="পাতা বড় করে দেখুন"
          className="block w-full overflow-hidden rounded-lg border border-border shadow-2xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded book page, served from /api/media */}
          <img
            src={pageUrls[active]}
            alt={`${title} — পাতা ${toBengaliNumber(active + 1)}`}
            className="aspect-[3/4] w-full object-cover transition hover:brightness-105"
          />
        </button>
        <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
          পাতা {toBengaliNumber(active + 1)}/{toBengaliNumber(pageUrls.length)}
        </span>
        <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/50 p-1.5 text-white">
          <Maximize2 size={13} />
        </span>
        {pageUrls.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="আগের পাতা"
              className="absolute left-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="পরের পাতা"
              className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {showDots ? (
        <div className="flex items-center gap-1.5">{dots("#000", "rgba(0,0,0,.25)")}</div>
      ) : (
        <p className="text-xs font-medium text-ink-soft">
          পাতা {toBengaliNumber(active + 1)} / {toBengaliNumber(pageUrls.length)}
        </p>
      )}

      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setZoomOpen(false)}
        >
          <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setZoomOpen(false)}
              aria-label="বন্ধ করুন"
              className="absolute -top-11 right-0 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <X size={18} />
            </button>
            <div className="relative" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded book page, served from /api/media */}
              <img
                src={pageUrls[active]}
                alt={`${title} — পাতা ${toBengaliNumber(active + 1)}`}
                className="aspect-[3/4] w-full rounded-lg object-cover shadow-2xl"
              />
              <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white">
                পাতা {toBengaliNumber(active + 1)}/{toBengaliNumber(pageUrls.length)}
              </span>
              {pageUrls.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="আগের পাতা"
                    className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="পরের পাতা"
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            {showDots && <div className="mt-3 flex items-center justify-center gap-1.5">{dots("#fff", "rgba(255,255,255,.35)")}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
