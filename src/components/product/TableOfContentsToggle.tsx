"use client";

import { useState } from "react";
import { ChevronDown, ListOrdered } from "lucide-react";
import { Product } from "@/lib/types";
import { toBengaliNumber } from "@/lib/format";

export function TableOfContentsToggle({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const toc = product.tableOfContents;
  if (!toc || toc.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg border border-white/15 bg-white/5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-sm font-medium text-white"
      >
        <span className="flex items-center gap-2">
          <ListOrdered size={16} /> সূচিপত্র দেখুন
        </span>
        <ChevronDown size={16} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ol className="space-y-1.5 border-t border-white/10 px-4 py-3 text-left text-xs text-white/85">
          {toc.map((chapter, i) => (
            <li key={i} className="flex gap-2">
              <span className="shrink-0 font-semibold text-white/60">{toBengaliNumber(i + 1)}.</span>
              <span>{chapter}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
