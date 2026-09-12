"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { toBengaliNumber } from "@/lib/format";

const ANGLE_LABELS = ["সামনে থেকে", "পাশ থেকে", "উপর থেকে", "প্যাকেজিং সহ", "ব্যবহারের দৃশ্য"];

export function ProductImageGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);

  function go(delta: number) {
    setActive((a) => (a + delta + ANGLE_LABELS.length) % ANGLE_LABELS.length);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <ProductImage
          title={product.title}
          category={product.category}
          colorFrom={product.colorFrom}
          colorTo={product.colorTo}
          iconSize={56}
          className="aspect-[3/4] w-48 rounded-lg shadow-2xl sm:w-56"
        />
        <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
          {ANGLE_LABELS[active]} · {toBengaliNumber(active + 1)}/{toBengaliNumber(ANGLE_LABELS.length)}
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

      <div className="flex items-center gap-1.5">
        {ANGLE_LABELS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setActive(i)}
            aria-label={label}
            className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-white" : "w-1.5 bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
