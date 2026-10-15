"use client";

import { useState } from "react";
import { Check, Play } from "lucide-react";
import { Product } from "@/lib/types";
import { StarRating } from "@/components/ui/StarRating";
import { Modal } from "@/components/ui/Modal";
import { getProductVideoSlots, ProductVideoSlot, PRODUCT_VIDEO_POOL_SIZE } from "@/lib/data/landingContent";

const THUMB_COUNT = 3;
const DEFAULT_ORDER = Array.from({ length: PRODUCT_VIDEO_POOL_SIZE }, (_, i) => i);

function VideoPlaceholder({
  product,
  caption,
  iconSize = 28,
  iconWrapClassName = "h-16 w-16 sm:h-20 sm:w-20",
}: {
  product: Product;
  caption: string;
  iconSize?: number;
  iconWrapClassName?: string;
}) {
  return (
    <div
      className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg"
      style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
    >
      <div className={`flex items-center justify-center rounded-full bg-surface/90 shadow-sm transition group-hover:scale-105 ${iconWrapClassName}`}>
        <Play size={iconSize} className="ml-1 text-foreground" fill="currentColor" />
      </div>
      <span className="absolute bottom-3 left-4 text-xs font-medium text-white/85 sm:bottom-4 sm:left-5 sm:text-sm">
        {caption} (শীঘ্রই যুক্ত হবে)
      </span>
    </div>
  );
}

function VideoThumb({
  product,
  slot,
  onPlay,
}: {
  product: Product;
  slot: ProductVideoSlot;
  onPlay: () => void;
}) {
  return (
    <button
      onClick={onPlay}
      aria-label={`${slot.caption} দেখুন`}
      className="group flex w-28 shrink-0 flex-col gap-1.5 sm:w-32"
    >
      <div
        className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg"
        style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 shadow-sm transition group-hover:scale-105 sm:h-9 sm:w-9">
          <Play size={14} className="ml-0.5 text-foreground" fill="currentColor" />
        </div>
      </div>
      <p className="w-full truncate text-left text-[11px] font-medium text-foreground">{slot.caption}</p>
    </button>
  );
}

export function VideoSection({ product, order }: { product: Product; order?: number[] }) {
  const isReadable = product.category === "book" || product.category === "ebook";

  const videoOrder = order && order.length > 0 ? order : DEFAULT_ORDER;
  const allSlots = getProductVideoSlots();
  const orderedSlots = videoOrder.map((i) => allSlots[i]).filter((s): s is ProductVideoSlot => Boolean(s));
  const featured = orderedSlots[0];
  const thumbs = orderedSlots.slice(1, 1 + THUMB_COUNT);
  const [playing, setPlaying] = useState<ProductVideoSlot | null>(null);

  return (
    <section className="container-page py-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">ভিডিওতে দেখুন</p>
        <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
          {product.title} — কাছ থেকে দেখে নিন
        </h2>
      </div>

      {isReadable && product.bullets.length > 0 && (
        <div className="mx-auto mt-5 max-w-xl rounded-lg border border-border bg-surface-muted p-4">
          <p className="text-sm font-semibold text-foreground">
            এই {product.category === "ebook" ? "ইবুকটি" : "বইটি"} নিলে যা পাবেন
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {product.bullets.slice(0, 6).map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-ink-soft">
                <Check size={15} className="mt-0.5 shrink-0 text-success" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {featured && (
        <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-border bg-surface p-4">
          {featured.isPrimary && product.videoUrl ? (
            <video
              src={product.videoUrl}
              controls
              preload="metadata"
              className="aspect-video w-full rounded-lg bg-black"
            />
          ) : (
            <button
              onClick={() => setPlaying(featured)}
              aria-label={`${featured.caption} চালু করুন`}
              className="group block w-full cursor-pointer"
            >
              <VideoPlaceholder product={product} caption={featured.caption} />
            </button>
          )}

          <div className="mt-3">
            <p className="font-display text-sm font-bold text-foreground">{product.title}</p>
            {product.author && <p className="text-xs text-ink-faint">{product.author}</p>}
            <div className="mt-1.5">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} size={13} />
            </div>
            <p className="mt-2 text-sm text-ink-soft">{product.shortDescription}</p>
          </div>

          {thumbs.length > 0 && (
            <div className="-mx-1 mt-4 flex gap-3 overflow-x-auto border-t border-border px-1 pb-1 pt-4 scrollbar-none">
              {thumbs.map((slot, i) => (
                <VideoThumb key={`${slot.caption}-${i}`} product={product} slot={slot} onPlay={() => setPlaying(slot)} />
              ))}
            </div>
          )}
        </div>
      )}

      <Modal open={!!playing} onClose={() => setPlaying(null)}>
        {playing && (
          <>
            {playing.isPrimary && product.videoUrl ? (
              <video
                src={product.videoUrl}
                controls
                autoPlay
                preload="metadata"
                className="aspect-video w-full rounded-lg bg-black"
              />
            ) : (
              <VideoPlaceholder
                product={product}
                caption={playing.caption}
                iconSize={28}
                iconWrapClassName="h-16 w-16 sm:h-20 sm:w-20"
              />
            )}
            <div className="mt-3">
              <p className="font-display text-sm font-bold text-foreground">{product.title}</p>
              <p className="mt-0.5 text-xs text-ink-faint">{playing.caption}</p>
              {product.author && <p className="text-xs text-ink-faint">{product.author}</p>}
              <div className="mt-1.5">
                <StarRating rating={product.rating} reviewCount={product.reviewCount} size={13} />
              </div>
              <p className="mt-2 text-sm text-ink-soft">{product.shortDescription}</p>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
