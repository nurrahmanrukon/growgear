"use client";

import { useRef } from "react";
import { BadgeCheck, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { Product } from "@/lib/types";
import { getExpertOpinions } from "@/lib/data/landingContent";
import { toBengaliNumber } from "@/lib/format";
import { StarRating } from "@/components/ui/StarRating";

export function ExpertOpinionsSection({ product }: { product: Product }) {
  const experts = getExpertOpinions(product);
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-expert-card]");
    const step = (card?.offsetWidth ?? 260) + 16;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <section className="border-y border-border bg-surface-muted py-10">
      <div className="container-page">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">বিশেষজ্ঞদের মতামত</p>
          <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
            যারা কাজের জগতে আছেন, তারা কী বলছেন
          </h2>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-xs text-ink-faint">{toBengaliNumber(experts.length)} টি মতামত — স্লাইড করে দেখুন</p>
          <div className="flex gap-1.5">
            <button
              onClick={() => scrollByCard(-1)}
              aria-label="আগের মতামত"
              className="rounded-full border border-border bg-surface p-1.5 text-ink-soft hover:border-primary hover:text-primary"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollByCard(1)}
              aria-label="পরের মতামত"
              className="rounded-full border border-border bg-surface p-1.5 text-ink-soft hover:border-primary hover:text-primary"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-none"
        >
          {experts.map((e, i) => (
            <div
              key={i}
              data-expert-card
              className="w-64 shrink-0 snap-start overflow-hidden rounded-lg border border-border bg-surface sm:w-72"
            >
              {e.hasPhoto && (
                <div
                  className="flex h-28 items-center justify-center gap-1.5 text-white/80"
                  style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
                >
                  <ImageIcon size={16} />
                  <span className="text-[11px]">বিশেষজ্ঞের ছবি</span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <StarRating rating={e.rating} size={13} />
                <p className="mt-2 line-clamp-4 flex-1 text-sm text-ink-soft">&ldquo;{e.quote}&rdquo;</p>
                <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary-dark">
                    {e.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground">{e.name}</p>
                    <p className="flex items-center gap-1 text-[11px] text-ink-faint">
                      {e.title}
                      {e.verified && (
                        <span className="flex items-center gap-0.5 text-success">
                          <BadgeCheck size={11} /> স্বীকৃত বিশেষজ্ঞ
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
