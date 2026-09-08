"use client";

import { useState } from "react";
import { Lock, Smartphone, CreditCard } from "lucide-react";

export function PremiumGate({
  paragraphs,
  premium,
}: {
  paragraphs: string[];
  premium?: boolean;
}) {
  const [unlocked, setUnlocked] = useState(false);

  if (!premium || unlocked) {
    return (
      <>
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </>
    );
  }

  const [first, ...rest] = paragraphs;

  return (
    <>
      <p>{first}</p>
      <div className="relative">
        <div aria-hidden className="pointer-events-none space-y-4 blur-sm select-none">
          {rest.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-background via-background/95 to-transparent pb-2 pt-10">
          <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-5 text-center shadow-sm">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
              <Lock size={18} />
            </div>
            <h3 className="mt-2.5 font-display text-sm font-bold text-foreground">এই লেখাটি প্রিমিয়াম</h3>
            <p className="mt-1 text-xs text-ink-soft">সম্পূর্ণ কনটেন্ট পড়তে আনলক করুন</p>
            <p className="mt-2 text-lg font-bold text-price">৪৯ টাকা</p>
            <div className="mt-3 flex flex-col gap-2">
              <button
                onClick={() => setUnlocked(true)}
                className="flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark"
              >
                <Smartphone size={13} /> বিকাশে পে করুন
              </button>
              <button
                onClick={() => setUnlocked(true)}
                className="flex items-center justify-center gap-1.5 rounded-md border border-primary px-4 py-2 text-xs font-semibold text-primary hover:bg-primary-light"
              >
                <CreditCard size={13} /> কার্ডে পে করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
