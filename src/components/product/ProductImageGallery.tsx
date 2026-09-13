"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { toBengaliNumber } from "@/lib/format";

const ANGLE_LABELS = ["সামনে থেকে", "পাশ থেকে", "উপর থেকে", "প্যাকেজিং সহ", "ব্যবহারের দৃশ্য"];

export function ProductImageGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  function go(delta: number) {
    setActive((a) => (a + delta + ANGLE_LABELS.length) % ANGLE_LABELS.length);
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
  }, [zoomOpen]);

  const dots = (activeColor: string, inactiveColor: string) =>
    ANGLE_LABELS.map((label, i) => (
      <button
        key={label}
        type="button"
        onClick={() => setActive(i)}
        aria-label={label}
        className="h-1.5 rounded-full transition-all"
        style={{ width: i === active ? "20px" : "6px", background: i === active ? activeColor : inactiveColor }}
      />
    ));

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          aria-label="ছবি বড় করে দেখুন"
          className="block"
        >
          <ProductImage
            title={product.title}
            category={product.category}
            colorFrom={product.colorFrom}
            colorTo={product.colorTo}
            iconSize={76}
            className="aspect-[3/4] w-64 rounded-lg shadow-2xl transition hover:brightness-105 sm:w-80"
          />
        </button>
        <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
          {ANGLE_LABELS[active]} · {toBengaliNumber(active + 1)}/{toBengaliNumber(ANGLE_LABELS.length)}
        </span>
        <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/50 p-1.5 text-white">
          <Maximize2 size={13} />
        </span>
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="আগের ছবি"
          className="absolute left-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="পরের ছবি"
          className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1.5">{dots("#000", "rgba(0,0,0,.25)")}</div>

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
            <div className="relative">
              <ProductImage
                title={product.title}
                category={product.category}
                colorFrom={product.colorFrom}
                colorTo={product.colorTo}
                iconSize={120}
                className="aspect-[3/4] w-full rounded-lg shadow-2xl"
              />
              <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white">
                {ANGLE_LABELS[active]} · {toBengaliNumber(active + 1)}/{toBengaliNumber(ANGLE_LABELS.length)}
              </span>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="আগের ছবি"
                className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="পরের ছবি"
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5">{dots("#fff", "rgba(255,255,255,.35)")}</div>
          </div>
        </div>
      )}
    </div>
  );
}
