"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { Modal } from "@/components/ui/Modal";

interface Review {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

const TEXT_REVIEWS: Review[] = [
  {
    name: "তানভীর আহমেদ",
    role: "শিক্ষার্থী",
    quote: "সেশনটা এতটাই বাস্তবসম্মত ছিল যে সাথে সাথে নিজের রুটিনে প্রয়োগ করতে পেরেছি।",
    rating: 5,
  },
  {
    name: "নুসরাত জাহান",
    role: "প্রফেশনাল",
    quote: "নূর রহমান নিজেই প্রশ্নের উত্তর দিয়েছেন, একদমই কমার্শিয়াল মনে হয়নি।",
    rating: 5,
  },
  {
    name: "রাকিবুল হাসান",
    role: "উদ্যোক্তা",
    quote: "ব্যবসার সিদ্ধান্ত নেওয়ার একটা স্পষ্ট ফ্রেমওয়ার্ক পেয়েছি, একদম ফ্রি-তে।",
    rating: 4.5,
  },
  {
    name: "সাদিয়া ইসলাম",
    role: "শিক্ষার্থী",
    quote: "কমিউনিটি গ্রুপে যুক্ত হয়ে অনেক নতুন মানুষের সাথে পরিচয় হয়েছে।",
    rating: 5,
  },
];

const VIDEO_REVIEWS: Review[] = [
  {
    name: "ইশরাত হোসেন",
    role: "প্রফেশনাল",
    quote: "কর্মক্ষেত্রে সিদ্ধান্ত নেওয়ার ক্ষেত্রে এই ফ্রেমওয়ার্কটা সত্যিই কাজে লেগেছে।",
    rating: 4.5,
  },
  {
    name: "ফারহানা কবির",
    role: "উদ্যোক্তা",
    quote: "টিম নিয়ে এগিয়ে যাওয়ার ব্যাপারে অনেক প্র্যাক্টিক্যাল টিপস পেয়েছি।",
    rating: 5,
  },
];

function TextReviewCard({ r }: { r: Review }) {
  return (
    <div className="flex gap-4 rounded-lg border border-border bg-surface p-4">
      <div className="flex w-20 shrink-0 flex-col items-center gap-2 text-center sm:w-24">
        <span className="flex aspect-square w-full items-center justify-center rounded-full bg-primary-light text-lg font-semibold text-primary-dark">
          {r.name.charAt(0)}
        </span>
        <div>
          <p className="text-xs font-medium text-foreground">{r.name}</p>
          <p className="text-[11px] text-ink-faint">{r.role}</p>
        </div>
      </div>
      <div className="min-w-0 flex-1 border-l border-border pl-4">
        <StarRating rating={r.rating} size={13} />
        <p className="mt-2 text-sm text-ink-soft">&ldquo;{r.quote}&rdquo;</p>
      </div>
    </div>
  );
}

function VideoReviewCard({ r, onPlay }: { r: Review; onPlay: () => void }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <button
        onClick={onPlay}
        aria-label={`${r.name} এর ভিডিও রিভিউ চালু করুন`}
        className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg"
        style={{ background: "linear-gradient(135deg, #2a4570, #16294a)" }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface/90 shadow-sm transition group-hover:scale-105">
          <Play size={24} className="ml-1 text-foreground" fill="currentColor" />
        </div>
        <span className="absolute bottom-3 left-4 text-xs font-medium text-white/85">
          {r.name} — ভিডিও রিভিউ (শীঘ্রই যুক্ত হবে)
        </span>
      </button>

      <p className="mt-3 text-sm font-medium text-foreground">{r.name}</p>
      <p className="text-xs text-ink-faint">{r.role}</p>
      <div className="mt-2">
        <StarRating rating={r.rating} size={13} />
      </div>
      <p className="mt-2 text-sm text-ink-soft">&ldquo;{r.quote}&rdquo;</p>
    </div>
  );
}

export function GrowGuideReviewsSection() {
  const [playingVideo, setPlayingVideo] = useState<Review | null>(null);

  return (
    <section className="border-y border-border bg-surface-muted py-10">
      <div className="container-page">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">অংশগ্রহণকারীদের মতামত</p>
          <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
            যারা সেশনে যুক্ত হয়েছেন, তারা কী বলছেন
          </h2>
        </div>

        <div className="mx-auto mt-6 flex max-w-xl flex-col gap-4">
          {TEXT_REVIEWS.map((r) => (
            <TextReviewCard key={r.name} r={r} />
          ))}
          {VIDEO_REVIEWS.map((r) => (
            <VideoReviewCard key={r.name} r={r} onPlay={() => setPlayingVideo(r)} />
          ))}
        </div>
      </div>

      <Modal open={!!playingVideo} onClose={() => setPlayingVideo(null)}>
        {playingVideo && (
          <>
            <div
              className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border border-border"
              style={{ background: "linear-gradient(135deg, #2a4570, #16294a)" }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/90 shadow-sm">
                <Play size={28} className="ml-1 text-foreground" fill="currentColor" />
              </div>
              <span className="absolute bottom-3 left-4 text-xs font-medium text-white/85 sm:bottom-4 sm:left-5 sm:text-sm">
                {playingVideo.name} — ভিডিও রিভিউ (শীঘ্রই যুক্ত হবে)
              </span>
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">{playingVideo.name}</p>
            <p className="text-xs text-ink-faint">{playingVideo.role}</p>
          </>
        )}
      </Modal>
    </section>
  );
}
