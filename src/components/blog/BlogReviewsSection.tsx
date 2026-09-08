"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { BlogPost } from "@/lib/types";
import { getBlogReviews, BlogReview } from "@/lib/data/blogReviews";
import { toBengaliNumber } from "@/lib/format";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import { InlineReviewForm, SubmittedReview } from "@/components/product/InlineReviewForm";

export function BlogReviewsSection({ post }: { post: BlogPost }) {
  const generated = getBlogReviews(post);
  const [userReviews, setUserReviews] = useState<BlogReview[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [showWriteReview, setShowWriteReview] = useState(false);

  const reviews = [...userReviews, ...generated];
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  function handleSubmitReview(submitted: SubmittedReview) {
    const newReview: BlogReview = {
      name: submitted.name,
      location: "বাংলাদেশ",
      rating: submitted.rating,
      title: "আপনার মতামত",
      quote: submitted.text,
      daysAgo: 0,
      helpfulCount: 0,
    };
    setUserReviews((prev) => [newReview, ...prev]);
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
    <section className="container-page border-t border-border py-10">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">পাঠকদের মতামত</p>
        <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
          এই লেখা নিয়ে যা বলছেন পাঠকরা
        </h2>
      </div>

      <div className="mx-auto mt-6 flex max-w-md flex-col items-center gap-2 rounded-lg border border-border bg-surface p-5">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">{avgRating.toFixed(1)}</span>
          <StarRating rating={avgRating} size={16} />
        </div>
        <p className="text-xs text-ink-faint">{toBengaliNumber(reviews.length)} টি মতামতের ভিত্তিতে</p>
        <Button variant="secondary" onClick={() => setShowWriteReview((v) => !v)} className="mt-1">
          মতামত লিখুন
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

      <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-border bg-surface">
        {reviews.map((r, i) => {
          const isLong = r.quote.length > 180;
          const isExpanded = expanded.has(i);
          return (
            <div key={i} className={`p-5 ${i > 0 ? "border-t border-border" : ""}`}>
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
                {r.daysAgo === 0 ? "আজ" : `${toBengaliNumber(r.daysAgo)} দিন আগে`} — {r.location} থেকে
              </p>

              <p className={`mt-2.5 text-sm leading-relaxed text-ink-soft ${!isExpanded && isLong ? "line-clamp-3" : ""}`}>
                {r.quote}
              </p>
              {isLong && (
                <button
                  onClick={() => toggleExpand(i)}
                  className="mt-1 text-xs font-medium text-primary hover:underline"
                >
                  {isExpanded ? "কম দেখুন" : "আরও পড়ুন"}
                </button>
              )}

              <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-xs text-ink-faint">
                <span>{toBengaliNumber(r.helpfulCount)} জনের কাছে এটি সহায়ক মনে হয়েছে</span>
                <button className="flex items-center gap-1 hover:text-primary">
                  <ThumbsUp size={12} /> সহায়ক
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
