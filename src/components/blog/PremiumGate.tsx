"use client";

import { useState } from "react";
import { Lock, Smartphone, CreditCard, X, Eye } from "lucide-react";
import { BlogPost } from "@/lib/types";
import { getPremiumPurchaseCount } from "@/lib/data/blog";
import { toBengaliNumber } from "@/lib/format";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

const FREE_PREVIEW_RATIO = 0.25;

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function splitFreeContent(paragraphs: string[], ratio: number) {
  const totalWords = paragraphs.reduce((sum, p) => sum + countWords(p), 0);
  const targetWords = Math.max(1, Math.round(totalWords * ratio));

  let wordsSoFar = 0;
  let cut = 0;
  for (let i = 0; i < paragraphs.length; i++) {
    wordsSoFar += countWords(paragraphs[i]);
    cut = i + 1;
    if (wordsSoFar >= targetWords) break;
  }
  if (paragraphs.length > 1 && cut >= paragraphs.length) cut = paragraphs.length - 1;

  return { free: paragraphs.slice(0, cut), locked: paragraphs.slice(cut) };
}

export function PremiumGate({ post }: { post: BlogPost }) {
  const { content: paragraphs, premium } = post;
  const [unlocked, setUnlocked] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showSample, setShowSample] = useState(false);

  if (!premium || unlocked) {
    return (
      <>
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </>
    );
  }

  const { free, locked } = splitFreeContent(paragraphs, FREE_PREVIEW_RATIO);
  const purchaseCount = getPremiumPurchaseCount(post);

  function unlockAndCloseSample() {
    setUnlocked(true);
    setShowSample(false);
  }

  return (
    <>
      {free.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
      <div className="relative">
        <div aria-hidden className="pointer-events-none space-y-4 blur-sm select-none">
          {locked.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-background via-background/95 to-transparent pb-2 pt-10">
          {dismissed ? (
            <button
              onClick={() => setDismissed(false)}
              className="mb-2 flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-dark"
            >
              <Lock size={13} /> সম্পূর্ণ পড়তে আনলক করুন
            </button>
          ) : (
            <div className="relative w-full max-w-sm rounded-lg border border-border bg-surface p-5 text-center shadow-sm">
              <button
                onClick={() => setDismissed(true)}
                aria-label="বন্ধ করুন"
                className="absolute right-2 top-2 rounded-full p-1 text-ink-faint hover:bg-surface-muted hover:text-foreground"
              >
                <X size={16} />
              </button>
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
                <Lock size={18} />
              </div>
              <h3 className="mt-2.5 font-display text-sm font-bold text-foreground">এই লেখাটি প্রিমিয়াম</h3>
              <p className="mt-1 text-xs text-ink-soft">সম্পূর্ণ কনটেন্ট পড়তে আনলক করুন</p>
              <p className="mt-2 text-lg font-bold text-price">৪৯ টাকা</p>
              <p className="mt-1 text-[11px] text-ink-faint">{toBengaliNumber(purchaseCount)} জন এই লেখাটি কিনেছেন</p>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  onClick={() => setShowSample(true)}
                  className="flex items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600"
                >
                  <Eye size={13} /> একটু পড়ে দেখুন
                </button>
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
          )}
        </div>
      </div>

      <Modal open={showSample} onClose={() => setShowSample(false)}>
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary">
          <Eye size={14} /> সংক্ষিপ্ত প্রিভিউ
        </div>
        <h2 className="mt-1.5 font-display text-lg font-bold text-foreground">{post.title}</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
          <p>{locked[0]}</p>
        </div>
        <div className="mt-5 rounded-md border border-dashed border-border bg-surface-muted p-3 text-center">
          <p className="text-xs text-ink-faint">সম্পূর্ণ লেখা পড়তে আনলক করুন — মাত্র ৪৯ টাকা।</p>
          <div className="mt-3 flex flex-col gap-2">
            <Button variant="primary" fullWidth onClick={unlockAndCloseSample}>
              <Smartphone size={13} /> বিকাশে পে করুন
            </Button>
            <Button variant="secondary" fullWidth onClick={unlockAndCloseSample}>
              <CreditCard size={13} /> কার্ডে পে করুন
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
