"use client";

import { useMemo, useState } from "react";
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
}: {
  title: string;
  description: string;
  products: Product[];
}) {
  const [sortBy, setSortBy] = useState<SortKey>("featured");
  const [priceBandIndex, setPriceBandIndex] = useState(0);
  const [minRating, setMinRating] = useState(0);

  const filtered = useMemo(() => {
    const band = priceBands[priceBandIndex];
    let list = products.filter(
      (p) => p.price >= band.min && p.price <= band.max && p.rating >= minRating
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
  }, [products, sortBy, priceBandIndex, minRating]);

  return (
    <div className="container-page py-5">
      <h1 className="text-xl font-bold text-[#0f1111] sm:text-2xl">{title}</h1>
      <p className="mt-1 text-sm text-neutral-600">{description}</p>

      <div className="mt-4 flex flex-col gap-5 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-56">
          <div className="rounded-lg border border-border bg-surface p-4">
            <h2 className="text-sm font-bold text-[#0f1111]">দাম</h2>
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

            <h2 className="mt-5 text-sm font-bold text-[#0f1111]">রেটিং</h2>
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
                        <span className="text-xs text-neutral-600">ও তার বেশি</span>
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-3 flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
            <span className="text-xs text-neutral-600">
              {toBengaliNumber(filtered.length)} টি ফলাফল
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="rounded border border-border bg-white px-2 py-1 text-xs outline-none"
            >
              <option value="featured">সাজান: ফিচার্ড</option>
              <option value="price-asc">দাম: কম থেকে বেশি</option>
              <option value="price-desc">দাম: বেশি থেকে কম</option>
              <option value="rating">রেটিং</option>
            </select>
          </div>

          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
