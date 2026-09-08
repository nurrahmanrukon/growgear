"use client";

import { useState } from "react";
import { BadgeCheck, Star, ThumbsUp } from "lucide-react";
import { Product } from "@/lib/types";
import { getReviewsForProduct, getRatingBreakdown, Review } from "@/lib/data/reviews";
import { toBengaliNumber } from "@/lib/format";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import { InlineReviewForm, SubmittedReview } from "@/components/product/InlineReviewForm";

const PER_SEGMENT = 5;

export function ReviewsSection({ product }: { product: Product }) {
  const generated = getReviewsForProduct(product);
  const breakdown = getRatingBreakdown(product);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [active, setActive] = useState(0);
  const [showWriteReview, setShowWriteReview] = useState(false);

  const reviews = [...userReviews, ...generated];
  const segments = Math.ceil(reviews.length / PER_SEGMENT);
  const visible = reviews.slice(active * PER_SEGMENT, active * PER_SEGMENT + PER_SEGMENT);
  const formatLabel = product.category === "ebook" ? "ইবুক" : product.category === "book" ? "হার্ডকভার" : "প্রোডাক্ট";

  function handleSubmitReview(submitted: SubmittedReview) {
    const newReview: Review = {
      name: submitted.name,
      location: "বাংলাদেশ",
      rating: submitted.rating,
      title: "আপনার রিভিউ",
      quote: submitted.text,
      daysAgo: 0,
      verified: false,
      hasPhoto: false,
      helpfulCount: 0,
    };
    setUserReviews((prev) => [newReview, ...prev]);
    setActive(0);
  }

  function toggleExpand(i: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
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

        <div className="mx-auto mt-6 flex max-w-md flex-col items-center gap-3 rounded-lg border border-border bg-surface p-5">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{product.rating}</span>
            <StarRating rating={product.rating} size={16} />
          </div>
          <p className="text-xs text-ink-faint">{toBengaliNumber(product.reviewCount)} টি রিভিউয়ের ভিত্তিতে</p>

          <div className="mt-1 w-full space-y-1">
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

          <Button variant="secondary" onClick={() => setShowWriteReview((v) => !v)} className="mt-1">
            রিভিউ লিখুন
          </Button>

          <InlineReviewForm
            open={showWriteReview}
            onSubmit={(r) => {
              handleSubmitReview(r);
              setShowWriteReview(false);
            }}
            onCancel={() => setShowWriteReview(false)}
          />
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: segments }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                active === i
                  ? "bg-primary text-white"
                  : "border border-border bg-surface text-ink-soft hover:border-primary hover:text-primary"
              }`}
            >
              সেগমেন্ট {toBengaliNumber(i + 1)}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-6 max-w-2xl divide-y divide-border rounded-lg border border-border bg-surface">
          {visible.map((r, i) => {
            const globalIndex = active * PER_SEGMENT + i;
            const isExpanded = expanded.has(globalIndex);
            const isLong = r.quote.length > 180;
            return (
              <div key={globalIndex} className="p-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary-dark">
                    {r.name.charAt(0)}
                  </div>
                  <p className="text-sm font-medium text-foreground">{r.name}</p>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <StarRating rating={r.rating} size={14} />
                  <h3 className="font-display text-sm font-bold text-foreground">{r.title}</h3>
                </div>

                <p className="mt-1 text-xs text-ink-faint">
                  {r.daysAgo === 0 ? "আজ" : `${toBengaliNumber(r.daysAgo)} দিন আগে`} — {r.location} থেকে রিভিউ করা হয়েছে
                </p>
                <p className="mt-0.5 text-xs text-ink-faint">
                  ফরম্যাট: {formatLabel}
                  {r.verified && (
                    <span className="ml-1.5 inline-flex items-center gap-0.5 font-medium text-success">
                      <BadgeCheck size={11} /> যাচাইকৃত ক্রয়
                    </span>
                  )}
                </p>

                <p className={`mt-2.5 text-sm leading-relaxed text-ink-soft ${!isExpanded && isLong ? "line-clamp-3" : ""}`}>
                  {r.quote}
                </p>
                {isLong && (
                  <button
                    onClick={() => toggleExpand(globalIndex)}
                    className="mt-1 text-xs font-medium text-primary hover:underline"
                  >
                    {isExpanded ? "কম দেখুন" : "আরও পড়ুন"}
                  </button>
                )}

                <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-xs text-ink-faint">
                  <span>{toBengaliNumber(r.helpfulCount)} জনের কাছে এটি সহায়ক মনে হয়েছে</span>
                  <span className="flex items-center gap-3">
                    <button className="flex items-center gap-1 hover:text-primary">
                      <ThumbsUp size={12} /> সহায়ক
                    </button>
                    <span className="text-border">|</span>
                    <button className="hover:text-primary">রিপোর্ট করুন</button>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
