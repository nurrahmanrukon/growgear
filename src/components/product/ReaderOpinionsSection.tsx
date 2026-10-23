"use client";

import { useState } from "react";
import { BadgeCheck, ImageIcon, Play } from "lucide-react";
import { Product } from "@/lib/types";
import {
  ReaderOpinion,
  getReaderOpinions,
  getReaderVideoOpinions,
  VIDEO_REVIEW_POOL_SIZE,
} from "@/lib/data/landingContent";
import { StarRating } from "@/components/ui/StarRating";
import { Modal } from "@/components/ui/Modal";

const TEXT_THUMB_COUNT = 5;
const TEXT_EXTRA_COUNT = 3;
const VIDEO_THUMB_COUNT = 5;
const VIDEO_EXTRA_COUNT = 3;
const DEFAULT_VIDEO_ORDER = Array.from({ length: VIDEO_REVIEW_POOL_SIZE }, (_, i) => i);

function ReaderCardShell({
  reader,
  children,
  onClick,
}: {
  reader: ReaderOpinion;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div className="flex w-24 shrink-0 flex-col items-center gap-2 text-center sm:w-28">
        {children}
        <div>
          <p className="text-xs font-medium text-foreground">{reader.name}</p>
          <p className="text-[11px] text-ink-faint">{reader.location}</p>
          {reader.verified && (
            <p className="mt-0.5 flex items-center justify-center gap-0.5 text-[10px] text-success">
              <BadgeCheck size={10} /> যাচাইকৃত পাঠক
            </p>
          )}
        </div>
      </div>
      <div className="min-w-0 flex-1 border-l border-border pl-4">
        <StarRating rating={reader.rating} size={13} />
        <p className="mt-2 text-sm text-ink-soft">&ldquo;{reader.quote}&rdquo;</p>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`${reader.name} এর মতামত বড় করে দেখুন`}
        className="flex w-full gap-4 rounded-lg border border-border bg-surface p-4 text-left transition hover:border-primary/40"
      >
        {content}
      </button>
    );
  }
  return <div className="flex gap-4 rounded-lg border border-border bg-surface p-4">{content}</div>;
}

function TextReaderCard({
  reader,
  product,
  onClick,
}: {
  reader: ReaderOpinion;
  product: Product;
  onClick?: () => void;
}) {
  return (
    <ReaderCardShell reader={reader} onClick={onClick}>
      {reader.hasPhoto ? (
        <div
          className="flex aspect-square w-full items-center justify-center rounded-md text-white/80"
          style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
        >
          <ImageIcon size={20} />
        </div>
      ) : (
        <div className="flex aspect-square w-full items-center justify-center rounded-full bg-primary-light text-lg font-semibold text-primary-dark">
          {reader.name.charAt(0)}
        </div>
      )}
    </ReaderCardShell>
  );
}

function TextReaderThumb({
  reader,
  product,
  onClick,
}: {
  reader: ReaderOpinion;
  product: Product;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`${reader.name} এর মতামত দেখুন`}
      className="group flex w-20 shrink-0 flex-col items-center gap-1.5 sm:w-24"
    >
      {reader.hasPhoto ? (
        <div
          className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg text-white/80 transition group-hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
        >
          <ImageIcon size={18} />
        </div>
      ) : (
        <div className="flex aspect-square w-full items-center justify-center rounded-full bg-primary-light text-base font-semibold text-primary-dark transition group-hover:scale-105">
          {reader.name.charAt(0)}
        </div>
      )}
      <p className="w-full truncate text-center text-[11px] font-medium text-foreground">{reader.name}</p>
    </button>
  );
}

function FeaturedVideoReaderCard({
  reader,
  product,
  onPlay,
}: {
  reader: ReaderOpinion;
  product: Product;
  onPlay: () => void;
}) {
  return (
    <div className="mb-3 rounded-lg border border-border bg-surface p-4">
      <button
        onClick={onPlay}
        aria-label={`${reader.name} এর ভিডিও রিভিউ চালু করুন`}
        className="group relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-lg"
        style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface/90 shadow-sm transition group-hover:scale-105">
          <Play size={24} className="ml-1 text-foreground" fill="currentColor" />
        </div>
        <span className="absolute bottom-3 left-4 text-xs font-medium text-white/85">
          {reader.name} — ভিডিও রিভিউ (শীঘ্রই যুক্ত হবে)
        </span>
      </button>

      <div className="mt-3 flex items-center gap-2">
        <p className="text-sm font-medium text-foreground">{reader.name}</p>
        {reader.verified && (
          <span className="flex items-center gap-0.5 text-[10px] text-success">
            <BadgeCheck size={10} /> যাচাইকৃত পাঠক
          </span>
        )}
      </div>
      <p className="text-xs text-ink-faint">{reader.location}</p>
      <div className="mt-2">
        <StarRating rating={reader.rating} size={13} />
      </div>
      <p className="mt-2 text-sm text-ink-soft">&ldquo;{reader.quote}&rdquo;</p>
    </div>
  );
}

function VideoReaderThumb({
  reader,
  product,
  onPlay,
}: {
  reader: ReaderOpinion;
  product: Product;
  onPlay: () => void;
}) {
  return (
    <button
      onClick={onPlay}
      aria-label={`${reader.name} এর ভিডিও রিভিউ দেখুন`}
      className="group flex w-20 shrink-0 flex-col items-center gap-1.5 sm:w-24"
    >
      <div
        className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg"
        style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 shadow-sm transition group-hover:scale-105 sm:h-9 sm:w-9">
          <Play size={14} className="ml-0.5 text-foreground" fill="currentColor" />
        </div>
      </div>
      <p className="w-full truncate text-center text-[11px] font-medium text-foreground">{reader.name}</p>
    </button>
  );
}

export function ReaderOpinionsSection({ product, order }: { product: Product; order?: number[] }) {
  const textReviews = getReaderOpinions(product, 1 + TEXT_THUMB_COUNT + TEXT_EXTRA_COUNT);
  const featuredText = textReviews[0];
  const thumbTexts = textReviews.slice(1, 1 + TEXT_THUMB_COUNT);
  const extraTexts = textReviews.slice(1 + TEXT_THUMB_COUNT, 1 + TEXT_THUMB_COUNT + TEXT_EXTRA_COUNT);
  const videoOrder = order && order.length > 0 ? order : DEFAULT_VIDEO_ORDER;
  const allVideos = getReaderVideoOpinions(product, VIDEO_REVIEW_POOL_SIZE);
  const orderedVideos = videoOrder.map((i) => allVideos[i]).filter((v): v is ReaderOpinion => Boolean(v));
  const featuredVideo = orderedVideos[0];
  const thumbVideos = orderedVideos.slice(1, 1 + VIDEO_THUMB_COUNT);
  const extraVideos = orderedVideos.slice(1 + VIDEO_THUMB_COUNT, 1 + VIDEO_THUMB_COUNT + VIDEO_EXTRA_COUNT);
  const [playingVideo, setPlayingVideo] = useState<ReaderOpinion | null>(null);
  const [expandedText, setExpandedText] = useState<ReaderOpinion | null>(null);

  return (
    <section className="border-y border-border bg-surface-muted py-12">
      <div className="container-page">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">পাঠকদের মতামত</p>
          <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
            যারা ইতিমধ্যে পড়েছেন, তারা কী বলছেন
          </h2>
        </div>

        <div className="mx-auto mt-6 max-w-xl">
          {featuredText && (
            <div>
              <p className="mb-2.5 text-xs font-medium text-ink-soft">মতামত</p>
              <TextReaderCard reader={featuredText} product={product} onClick={() => setExpandedText(featuredText)} />
              {thumbTexts.length > 0 && (
                <div className="-mx-1 mt-3 flex gap-3 overflow-x-auto px-1 pb-1 scrollbar-none">
                  {thumbTexts.map((r, i) => (
                    <TextReaderThumb key={`tt-${i}`} reader={r} product={product} onClick={() => setExpandedText(r)} />
                  ))}
                </div>
              )}
              {extraTexts.length > 0 && (
                <div className="mt-3 flex flex-col gap-4">
                  {extraTexts.map((r, i) => (
                    <TextReaderCard key={`et-${i}`} reader={r} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}

          {featuredVideo && (
            <div className="mt-5">
              <p className="mb-2.5 text-xs font-medium text-ink-soft">ভিডিও রিভিউ</p>
              <FeaturedVideoReaderCard
                reader={featuredVideo}
                product={product}
                onPlay={() => setPlayingVideo(featuredVideo)}
              />
              <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 scrollbar-none">
                {thumbVideos.map((r, i) => (
                  <VideoReaderThumb key={`v-${i}`} reader={r} product={product} onPlay={() => setPlayingVideo(r)} />
                ))}
              </div>
              {extraVideos.length > 0 && (
                <div className="mt-3 flex flex-col gap-3">
                  {extraVideos.map((r, i) => (
                    <FeaturedVideoReaderCard key={`ev-${i}`} reader={r} product={product} onPlay={() => setPlayingVideo(r)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal open={!!playingVideo} onClose={() => setPlayingVideo(null)}>
        {playingVideo && (
          <>
            <div
              className="group relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-lg border border-border"
              style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/90 shadow-sm">
                <Play size={28} className="ml-1 text-foreground" fill="currentColor" />
              </div>
              <span className="absolute bottom-3 left-4 text-xs font-medium text-white/85 sm:bottom-4 sm:left-5 sm:text-sm">
                {playingVideo.name} — ভিডিও রিভিউ (শীঘ্রই যুক্ত হবে)
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">{playingVideo.name}</p>
              {playingVideo.verified && (
                <span className="flex items-center gap-0.5 text-[10px] text-success">
                  <BadgeCheck size={10} /> যাচাইকৃত পাঠক
                </span>
              )}
            </div>
            <p className="text-xs text-ink-faint">{playingVideo.location}</p>
            <div className="mt-2">
              <StarRating rating={playingVideo.rating} size={13} />
            </div>
            <p className="mt-2 text-sm text-ink-soft">&ldquo;{playingVideo.quote}&rdquo;</p>
          </>
        )}
      </Modal>

      <Modal open={!!expandedText} onClose={() => setExpandedText(null)}>
        {expandedText && (
          <>
            <div className="flex items-center gap-3">
              {expandedText.hasPhoto ? (
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white/80"
                  style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
                >
                  <ImageIcon size={20} />
                </div>
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-light text-lg font-semibold text-primary-dark">
                  {expandedText.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-foreground">{expandedText.name}</p>
                <p className="text-xs text-ink-faint">{expandedText.location}</p>
                {expandedText.verified && (
                  <p className="mt-0.5 flex items-center gap-0.5 text-[10px] text-success">
                    <BadgeCheck size={10} /> যাচাইকৃত পাঠক
                  </p>
                )}
              </div>
            </div>
            <div className="mt-3">
              <StarRating rating={expandedText.rating} size={13} />
            </div>
            <p className="mt-2 text-sm text-ink-soft">&ldquo;{expandedText.quote}&rdquo;</p>
          </>
        )}
      </Modal>
    </section>
  );
}
