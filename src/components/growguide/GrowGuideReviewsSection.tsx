"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { Modal } from "@/components/ui/Modal";
import { fillTemplate } from "@/lib/templateFill";

interface Review {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

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

function VideoReviewCard({ r, captionTemplate, onPlay }: { r: Review; captionTemplate: string; onPlay: () => void }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <button
        onClick={onPlay}
        aria-label={`${r.name} এর ভিডিও রিভিউ চালু করুন`}
        className="group relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-lg"
        style={{ background: "linear-gradient(135deg, #2a4570, #16294a)" }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface/90 shadow-sm transition group-hover:scale-105">
          <Play size={24} className="ml-1 text-foreground" fill="currentColor" />
        </div>
        <span className="absolute bottom-3 left-4 text-xs font-medium text-white/85">
          {fillTemplate(captionTemplate, { name: r.name })}
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

export function GrowGuideReviewsSection({
  eyebrow,
  heading,
  textReviews,
  videoReviews,
  videoReviewCaptionTemplate,
}: {
  eyebrow: string;
  heading: string;
  textReviews: Review[];
  videoReviews: Review[];
  videoReviewCaptionTemplate: string;
}) {
  const [playingVideo, setPlayingVideo] = useState<Review | null>(null);

  return (
    <section className="border-y border-border bg-surface-muted py-12">
      <div className="container-page">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">{eyebrow}</p>
          <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">{heading}</h2>
        </div>

        <div className="mx-auto mt-6 flex max-w-xl flex-col gap-4">
          {textReviews.map((r, i) => (
            <TextReviewCard key={i} r={r} />
          ))}
          {videoReviews.map((r, i) => (
            <VideoReviewCard
              key={i}
              r={r}
              captionTemplate={videoReviewCaptionTemplate}
              onPlay={() => setPlayingVideo(r)}
            />
          ))}
        </div>
      </div>

      <Modal open={!!playingVideo} onClose={() => setPlayingVideo(null)}>
        {playingVideo && (
          <>
            <div
              className="group relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-lg border border-border"
              style={{ background: "linear-gradient(135deg, #2a4570, #16294a)" }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/90 shadow-sm">
                <Play size={28} className="ml-1 text-foreground" fill="currentColor" />
              </div>
              <span className="absolute bottom-3 left-4 text-xs font-medium text-white/85 sm:bottom-4 sm:left-5 sm:text-sm">
                {fillTemplate(videoReviewCaptionTemplate, { name: playingVideo.name })}
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
