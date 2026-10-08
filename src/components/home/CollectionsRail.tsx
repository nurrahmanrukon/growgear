"use client";

import { ReactNode, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toBengaliNumber } from "@/lib/format";

export interface CollectionTileData {
  slug: string;
  label: string;
  icon: ReactNode;
  colorFrom: string;
  colorTo: string;
  count: number;
}

export function CollectionsRail({ collections }: { collections: CollectionTileData[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByTile(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const tile = track.querySelector<HTMLElement>("[data-collection-tile]");
    const step = (tile?.offsetWidth ?? 140) + 12;
    track.scrollBy({ left: direction * step * 2, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="-mx-1 flex gap-3 overflow-x-auto px-1 py-1 scrollbar-none"
      >
        {collections.map((c) => (
          <Link
            key={c.slug}
            data-collection-tile
            href={`/search?topic=${c.slug}`}
            className="flex w-32 shrink-0 flex-col justify-between gap-5 rounded-xl p-4 text-white shadow-md ring-1 ring-white/15 transition hover:-translate-y-0.5 hover:shadow-lg sm:w-36"
            style={{ background: `linear-gradient(135deg, ${c.colorFrom}, ${c.colorTo})` }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              {c.icon}
            </span>
            <div>
              <p className="text-sm font-semibold leading-snug">{c.label}</p>
              <p className="mt-1 text-[11px] text-white/75">{toBengaliNumber(c.count)} টি প্রোডাক্ট</p>
            </div>
          </Link>
        ))}
      </div>
      <button
        type="button"
        onClick={() => scrollByTile(-1)}
        aria-label="আগের কালেকশন"
        className="absolute left-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-ink-soft shadow-sm hover:text-primary"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        type="button"
        onClick={() => scrollByTile(1)}
        aria-label="পরের কালেকশন"
        className="absolute right-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-ink-soft shadow-sm hover:text-primary"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
