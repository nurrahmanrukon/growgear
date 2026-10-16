"use client";

import { useState } from "react";
import { ChevronDown, ListOrdered } from "lucide-react";
import { Product } from "@/lib/types";
import { toBengaliNumber } from "@/lib/format";

export function TableOfContentsToggle({
  product,
  variant = "dark",
}: {
  product: Product;
  variant?: "light" | "dark";
}) {
  const [open, setOpen] = useState(false);
  const toc = product.tableOfContents;
  if (!toc || toc.length === 0) return null;
  const isDark = variant === "dark";

  return (
    <div
      className={`mx-auto w-full max-w-md overflow-hidden rounded-lg border ${
        isDark ? "border-white/15 bg-white/5" : "border-border bg-surface-muted"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-sm font-medium ${
          isDark ? "text-white" : "text-foreground"
        }`}
      >
        <span className="flex items-center gap-2">
          <ListOrdered size={16} /> সূচিপত্র দেখুন
        </span>
        <ChevronDown size={16} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className={`border-t ${isDark ? "border-white/10" : "border-border"}`}>
          <ol
            className={`space-y-1.5 px-4 py-3 text-left text-xs ${
              isDark ? "text-white/85" : "text-ink-soft"
            }`}
          >
            {toc.map((chapter, i) => (
              <li key={i} className="flex gap-2">
                <span className={`shrink-0 font-semibold ${isDark ? "text-white/60" : "text-ink-faint"}`}>
                  {toBengaliNumber(i + 1)}.
                </span>
                <span>{chapter}</span>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={`flex w-full items-center justify-center gap-1 border-t py-2 text-xs font-medium ${
              isDark ? "border-white/10 text-white/70 hover:text-white" : "border-border text-ink-faint hover:text-foreground"
            }`}
          >
            <ChevronDown size={14} className="rotate-180" /> উপরে ফিরে যান
          </button>
        </div>
      )}
    </div>
  );
}
