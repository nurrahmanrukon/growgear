"use client";

import { useState } from "react";
import { BadgeCheck, ImageIcon, Play } from "lucide-react";
import { Product } from "@/lib/types";
import { ExpertOpinion, getExpertOpinions, getExpertVideoOpinions } from "@/lib/data/landingContent";
import { toBengaliNumber } from "@/lib/format";
import { StarRating } from "@/components/ui/StarRating";
import { Modal } from "@/components/ui/Modal";

type Tab = "text" | "video" | "mixed";

const SEGMENT_COUNT = 7;
const MIXED_PREVIEW_COUNT = 3;

function ExpertCardShell({
  expert,
  children,
}: {
  expert: ExpertOpinion;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-lg border border-border bg-surface p-4">
      <div className="flex w-24 shrink-0 flex-col items-center gap-2 text-center sm:w-28">
        {children}
        <div>
          <p className="text-xs font-medium text-foreground">{expert.name}</p>
          <p className="text-[11px] text-ink-faint">{expert.title}</p>
          {expert.verified && (
            <p className="mt-0.5 flex items-center justify-center gap-0.5 text-[10px] text-success">
              <BadgeCheck size={10} /> স্বীকৃত বিশেষজ্ঞ
            </p>
          )}
        </div>
      </div>
      <div className="min-w-0 flex-1 border-l border-border pl-4">
        <StarRating rating={expert.rating} size={13} />
        <p className="mt-2 text-sm text-ink-soft">&ldquo;{expert.quote}&rdquo;</p>
      </div>
    </div>
  );
}

function TextReviewCard({ expert, product }: { expert: ExpertOpinion; product: Product }) {
  return (
    <ExpertCardShell expert={expert}>
      {expert.hasPhoto ? (
        <div
          className="flex aspect-square w-full items-center justify-center rounded-md text-white/80"
          style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
        >
          <ImageIcon size={20} />
        </div>
      ) : (
        <div className="flex aspect-square w-full items-center justify-center rounded-full bg-primary-light text-lg font-semibold text-primary-dark">
          {expert.name.charAt(0)}
        </div>
      )}
    </ExpertCardShell>
  );
}

function VideoReviewCard({
  expert,
  product,
  onPlay,
}: {
  expert: ExpertOpinion;
  product: Product;
  onPlay: () => void;
}) {
  return (
    <ExpertCardShell expert={expert}>
      <button
        onClick={onPlay}
        aria-label={`${expert.name} এর ভিডিও রিভিউ চালু করুন`}
        className="group flex aspect-square w-full items-center justify-center rounded-md"
        style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 shadow-sm transition group-hover:scale-105">
          <Play size={14} className="ml-0.5 text-foreground" fill="currentColor" />
        </div>
      </button>
    </ExpertCardShell>
  );
}

export function ExpertOpinionsSection({ product }: { product: Product }) {
  const textReviews = getExpertOpinions(product, SEGMENT_COUNT);
  const videoReviews = getExpertVideoOpinions(product, SEGMENT_COUNT);
  const [tab, setTab] = useState<Tab>("mixed");
  const [playingVideo, setPlayingVideo] = useState<ExpertOpinion | null>(null);

  const visibleText = tab === "video" ? [] : tab === "text" ? textReviews : textReviews.slice(0, MIXED_PREVIEW_COUNT);
  const visibleVideo = tab === "text" ? [] : tab === "video" ? videoReviews : videoReviews.slice(0, MIXED_PREVIEW_COUNT);

  return (
    <section className="border-y border-border bg-surface-muted py-10">
      <div className="container-page">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">বিশেষজ্ঞদের মতামত</p>
          <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
            যারা কাজের জগতে আছেন, তারা কী বলছেন
          </h2>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setTab("text")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              tab === "text"
                ? "bg-primary text-white"
                : "border border-border bg-surface text-ink-soft hover:border-primary hover:text-primary"
            }`}
          >
            টেক্সট রিভিউ ({toBengaliNumber(SEGMENT_COUNT)})
          </button>
          <button
            onClick={() => setTab("video")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              tab === "video"
                ? "bg-primary text-white"
                : "border border-border bg-surface text-ink-soft hover:border-primary hover:text-primary"
            }`}
          >
            ভিডিও রিভিউ ({toBengaliNumber(SEGMENT_COUNT)})
          </button>
          <button
            onClick={() => setTab("mixed")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              tab === "mixed"
                ? "bg-primary text-white"
                : "border border-border bg-surface text-ink-soft hover:border-primary hover:text-primary"
            }`}
          >
            সেগমেন্ট ৩
          </button>
        </div>

        <div className="mx-auto mt-6 flex max-w-xl flex-col gap-4">
          {visibleText.map((e, i) => (
            <TextReviewCard key={`t-${i}`} expert={e} product={product} />
          ))}
          {visibleVideo.map((e, i) => (
            <VideoReviewCard key={`v-${i}`} expert={e} product={product} onPlay={() => setPlayingVideo(e)} />
          ))}
        </div>
      </div>

      <Modal open={!!playingVideo} onClose={() => setPlayingVideo(null)}>
        {playingVideo && (
          <>
            <div
              className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border border-border"
              style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/90 shadow-sm">
                <Play size={28} className="ml-1 text-foreground" fill="currentColor" />
              </div>
              <span className="absolute bottom-3 left-4 text-xs font-medium text-white/85 sm:bottom-4 sm:left-5 sm:text-sm">
                {playingVideo.name} — ভিডিও রিভিউ (শীঘ্রই যুক্ত হবে)
              </span>
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">{playingVideo.name}</p>
            <p className="text-xs text-ink-faint">{playingVideo.title}</p>
          </>
        )}
      </Modal>
    </section>
  );
}
