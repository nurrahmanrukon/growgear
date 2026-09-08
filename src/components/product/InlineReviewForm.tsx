"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface SubmittedReview {
  name: string;
  rating: number;
  text: string;
}

export function InlineReviewForm({
  open,
  onSubmit,
  onCancel,
}: {
  open: boolean;
  onSubmit: (review: SubmittedReview) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    onSubmit({ name: name.trim(), rating, text: text.trim() });
    setName("");
    setRating(5);
    setText("");
  }

  return (
    <div className="mt-4 w-full rounded-lg border border-border bg-surface p-4 text-left">
      <p className="text-sm font-semibold text-foreground">আপনার মতামত লিখুন</p>
      <form onSubmit={handleSubmit} className="mt-3 space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft">রেটিং</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n} স্টার`}
                className="text-star"
              >
                <Star size={20} fill={n <= rating ? "currentColor" : "none"} strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="আপনার নাম লিখুন"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={3}
          placeholder="আপনার মতামত লিখুন..."
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />

        <div className="flex gap-2">
          <Button type="submit" variant="primary">
            রিভিউ জমা দিন
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            বাতিল
          </Button>
        </div>
      </form>
    </div>
  );
}
