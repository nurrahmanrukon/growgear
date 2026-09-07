"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export interface SubmittedReview {
  name: string;
  rating: number;
  text: string;
}

export function WriteReviewModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (review: SubmittedReview) => void;
}) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    onSubmit({ name: name.trim(), rating, text: text.trim() });
    setName("");
    setRating(5);
    setText("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <p className="text-xs font-medium uppercase tracking-wide text-primary">রিভিউ লিখুন</p>
      <h2 className="mt-1.5 font-display text-lg font-bold text-foreground">আপনার অভিজ্ঞতা শেয়ার করুন</h2>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft">আপনার নাম</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="আপনার নাম লিখুন"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

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
                <Star size={22} fill={n <= rating ? "currentColor" : "none"} strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft">আপনার রিভিউ</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={4}
            placeholder="প্রোডাক্টটি সম্পর্কে আপনার মতামত লিখুন..."
            className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <Button type="submit" variant="primary" fullWidth>
          রিভিউ জমা দিন
        </Button>
      </form>
    </Modal>
  );
}
