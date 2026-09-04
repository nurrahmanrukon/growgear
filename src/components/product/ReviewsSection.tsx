"use client";

import { useRef } from "react";
import { BadgeCheck, ChevronLeft, ChevronRight, ImageIcon, Star } from "lucide-react";
import { Product } from "@/lib/types";
import { getReviewsForProduct, getRatingBreakdown } from "@/lib/data/reviews";
import { toBengaliNumber } from "@/lib/format";
import { StarRating } from "@/components/ui/StarRating";

export function ReviewsSection({ product }: { product: Product }) {
  const reviews = getReviewsForProduct(product);
  const breakdown = getRatingBreakdown(product);
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-review-card]");
    const step = (card?.offsetWidth ?? 260) + 16;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <section className="border-y border-border bg-surface-muted py-10">
      <div className="container-page">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">গ্রাহকদের মতামত</p>
          <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
            যারা কিনেছেন, তারা কী বলছেন
          </h2>
        </div>

        <div className="mx-auto mt-6 flex max-w-md flex-col items-center gap-2 rounded-lg border border-border bg-surface p-5">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{product.rating}</span>
            <StarRating rating={product.rating} size={16} />
          </div>
          <p className="text-xs text-ink-faint">{toBengaliNumber(product.reviewCount)} টি রিভিউয়ের ভিত্তিতে</p>

          <div className="mt-2 w-full space-y-1">
            {breakdown.map((b) => (
              <div key={b.star} className="flex items-center gap-2 text-xs text-ink-soft">
                <span className="flex w-8 items-center gap-0.5">
                  {b.star} <Star size={10} className="text-star" fill="currentColor" />
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted">
                  <div className="h-full rounded-full bg-star" style={{ width: `${b.pct}%` }} />
                </div>
                <span className="w-8 text-right text-ink-faint">{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-xs text-ink-faint">{toBengaliNumber(reviews.length)} টি রিভিউ — স্লাইড করে দেখুন</p>
          <div className="flex gap-1.5">
            <button
              onClick={() => scrollByCard(-1)}
              aria-label="আগের রিভিউ"
              className="rounded-full border border-border bg-surface p-1.5 text-ink-soft hover:border-primary hover:text-primary"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollByCard(1)}
              aria-label="পরের রিভিউ"
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
          {reviews.map((r, i) => (
            <div
              key={i}
              data-review-card
              className="w-64 shrink-0 snap-start overflow-hidden rounded-lg border border-border bg-surface sm:w-72"
            >
              {r.hasPhoto && (
                <div
                  className="flex h-28 items-center justify-center gap-1.5 text-white/80"
                  style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
                >
                  <ImageIcon size={16} />
                  <span className="text-[11px]">রিভিউ ছবি</span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <StarRating rating={r.rating} size={13} />
                <p className="mt-2 line-clamp-4 flex-1 text-sm text-ink-soft">&ldquo;{r.quote}&rdquo;</p>
                <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary-dark">
                    {r.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground">{r.name}</p>
                    <p className="flex items-center gap-1 text-[11px] text-ink-faint">
                      {r.location}
                      {r.verified && (
                        <span className="flex items-center gap-0.5 text-success">
                          <BadgeCheck size={11} /> যাচাইকৃত ক্রেতা
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
