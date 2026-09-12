"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductGrid } from "./ProductGrid";
import { StarRating } from "@/components/ui/StarRating";
import { toBengaliNumber } from "@/lib/format";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

const priceBands: { label: string; min: number; max: number }[] = [
  { label: "সব দাম", min: 0, max: Infinity },
  { label: "০ - ৩০০ টাকা", min: 0, max: 300 },
  { label: "৩০০ - ৬০০ টাকা", min: 300, max: 600 },
  { label: "৬০০ - ১০০০ টাকা", min: 600, max: 1000 },
  { label: "১০০০+ টাকা", min: 1000, max: Infinity },
];

export function ProductListing({
  title,
  description,
  products,
  basePath,
  initialBadge,
  initialSubcategory,
  subcategoryLabel,
}: {
  title: string;
  description: string;
  products: Product[];
  basePath?: string;
  initialBadge?: string;
  initialSubcategory?: string;
  subcategoryLabel?: string;
}) {
  const [sortBy, setSortBy] = useState<SortKey>("featured");
  const [priceBandIndex, setPriceBandIndex] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const band = priceBands[priceBandIndex];
    let list = products.filter(
      (p) =>
        p.price >= band.min &&
        p.price <= band.max &&
        p.rating >= minRating &&
        (!initialBadge || p.badge === initialBadge) &&
        (!initialSubcategory || p.subcategorySlug === initialSubcategory)
    );
    switch (sortBy) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [products, sortBy, priceBandIndex, minRating, initialBadge, initialSubcategory]);

  const activeFilterCount = (priceBandIndex > 0 ? 1 : 0) + (minRating > 0 ? 1 : 0);

  return (
    <div className="container-page py-5">
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
      <p className="mt-1 text-sm text-ink-soft">{description}</p>

      {(initialBadge || subcategoryLabel) && (
        <div className="mt-2 flex items-center gap-1.5">
          {subcategoryLabel && (
            <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary-dark">
              {subcategoryLabel}
            </span>
          )}
          {initialBadge && (
            <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary-dark">
              {initialBadge}
            </span>
          )}
          {basePath && (
            <Link href={basePath} className="flex items-center gap-0.5 text-xs text-ink-faint hover:text-foreground">
              <X size={12} /> ফিল্টার সরান
            </Link>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2">
        <span className="text-xs text-ink-soft">{toBengaliNumber(filtered.length)} টি ফলাফল</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded border border-border px-2.5 py-1.5 text-xs font-medium text-foreground lg:hidden"
          >
            <SlidersHorizontal size={13} />
            ফিল্টার
            {activeFilterCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {toBengaliNumber(activeFilterCount)}
              </span>
            )}
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="rounded border border-border bg-surface px-2 py-1 text-xs outline-none"
          >
            <option value="featured">সাজান: ফিচার্ড</option>
            <option value="price-asc">দাম: কম থেকে বেশি</option>
            <option value="price-desc">দাম: বেশি থেকে কম</option>
            <option value="rating">রেটিং</option>
          </select>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-5 lg:mt-4 lg:flex-row">
        <aside className={`w-full shrink-0 lg:block lg:w-56 ${filtersOpen ? "block" : "hidden"}`}>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between lg:hidden">
              <h2 className="text-sm font-bold text-foreground">ফিল্টার</h2>
              <button onClick={() => setFiltersOpen(false)} aria-label="বন্ধ করুন" className="text-ink-soft">
                <X size={16} />
              </button>
            </div>

            <h2 className="hidden text-sm font-bold text-foreground lg:block">দাম</h2>
            <ul className="mt-2 space-y-1.5">
              {priceBands.map((band, i) => (
                <li key={band.label}>
                  <button
                    onClick={() => setPriceBandIndex(i)}
                    className={`text-xs ${
                      priceBandIndex === i
                        ? "font-semibold text-link-hover"
                        : "text-link hover:text-link-hover hover:underline"
                    }`}
                  >
                    {band.label}
                  </button>
                </li>
              ))}
            </ul>

            <h2 className="mt-5 text-sm font-bold text-foreground">রেটিং</h2>
            <ul className="mt-2 space-y-1.5">
              {[0, 4, 4.5].map((r) => (
                <li key={r}>
                  <button
                    onClick={() => setMinRating(r)}
                    className={`flex items-center gap-1.5 ${
                      minRating === r ? "font-semibold" : ""
                    }`}
                  >
                    {r === 0 ? (
                      <span className="text-xs text-link hover:text-link-hover hover:underline">
                        সব রেটিং
                      </span>
                    ) : (
                      <>
                        <StarRating rating={r} size={12} />
                        <span className="text-xs text-ink-soft">ও তার বেশি</span>
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-4 w-full rounded-md bg-primary py-2 text-xs font-semibold text-white lg:hidden"
            >
              ফলাফল দেখুন ({toBengaliNumber(filtered.length)})
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
