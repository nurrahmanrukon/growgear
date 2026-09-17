"use client";

import { useEffect, useState } from "react";
import { Clock, Star } from "lucide-react";
import { Product } from "@/lib/types";
import { formatTaka, discountPercent, toBengaliNumber } from "@/lib/format";
import { OrderForm } from "@/components/product/OrderForm";
import { ProductImage } from "@/components/ui/ProductImage";

function msUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${toBengaliNumber(h)}h:${toBengaliNumber(m)}m:${toBengaliNumber(s)}s`;
}

function UrgencyOrderCard({ product }: { product: Product }) {
  const discount = discountPercent(product.price, product.oldPrice);

  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-left">
      <div className="flex items-center gap-3">
        <ProductImage
          title={product.title}
          category={product.category}
          colorFrom={product.colorFrom}
          colorTo={product.colorTo}
          hideLabel
          className="h-16 w-12 shrink-0 rounded-md"
        />
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold text-white">{product.title}</p>
          <p className="truncate text-xs text-white/60">{product.shortDescription}</p>
          <div className="mt-1 flex items-center gap-1">
            <Star size={12} className="text-star" fill="currentColor" strokeWidth={0} />
            <span className="text-xs font-medium text-white/85">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-white/50">({toBengaliNumber(product.reviewCount)}+ রিভিউ)</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-xl font-bold text-white">{formatTaka(product.price)}</span>
        {product.oldPrice && (
          <span className="text-sm text-white/50 line-through">{formatTaka(product.oldPrice)}</span>
        )}
        {discount && (
          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">
            -{discount}% ছাড়
          </span>
        )}
      </div>
    </div>
  );
}

function OrderFormUrgencyBanner({ product }: { product: Product }) {
  const [msLeft, setMsLeft] = useState<number | null>(null);
  const isEbook = product.category === "ebook";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only clock value, avoids SSR/client time mismatch
    setMsLeft(msUntilMidnight());
    const timer = setInterval(() => setMsLeft(msUntilMidnight()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-t-lg border-t-4 border-price bg-surface px-4 py-2.5 text-left">
      {!isEbook && (
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-price">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-price opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-price" />
          </span>
          সীমিত স্টক - আজকের অফার চলছে
        </div>
      )}
      <div className={`flex items-center gap-1.5 text-xs font-semibold text-price ${!isEbook ? "mt-1.5" : ""}`}>
        <Clock size={12} />
        আজকের অফার শেষ হতে বাকি: {msLeft !== null ? formatCountdown(msLeft) : "..."}
      </div>
    </div>
  );
}

export function FinalOrderSection({ product }: { product: Product }) {
  return (
    <section className="bg-primary-dark py-12">
      <div className="container-page">
        <div className="mx-auto max-w-sm">
          <UrgencyOrderCard product={product} />
        </div>

        <div className="mx-auto mt-3 max-w-sm">
          <OrderFormUrgencyBanner product={product} />
          <div className="rounded-b-lg bg-surface p-5 text-left shadow-lg">
            <OrderForm product={product} />
          </div>
        </div>
      </div>
    </section>
  );
}
