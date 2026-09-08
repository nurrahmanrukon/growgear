"use client";

import { useState } from "react";
import { BadgeCheck, ImageIcon } from "lucide-react";
import { Product } from "@/lib/types";
import { getExpertOpinions } from "@/lib/data/landingContent";
import { toBengaliNumber } from "@/lib/format";
import { StarRating } from "@/components/ui/StarRating";

const PER_SEGMENT = 5;

export function ExpertOpinionsSection({ product }: { product: Product }) {
  const experts = getExpertOpinions(product);
  const segments = Math.ceil(experts.length / PER_SEGMENT);
  const [active, setActive] = useState(0);
  const visible = experts.slice(active * PER_SEGMENT, active * PER_SEGMENT + PER_SEGMENT);

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
          {Array.from({ length: segments }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                active === i
                  ? "bg-primary text-white"
                  : "border border-border bg-surface text-ink-soft hover:border-primary hover:text-primary"
              }`}
            >
              সেগমেন্ট {toBengaliNumber(i + 1)}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-6 flex max-w-xl flex-col gap-4">
          {visible.map((e, i) => (
            <div key={i} className="flex gap-4 rounded-lg border border-border bg-surface p-4">
              <div className="flex w-24 shrink-0 flex-col items-center gap-2 text-center sm:w-28">
                {e.hasPhoto ? (
                  <div
                    className="flex aspect-square w-full items-center justify-center rounded-md text-white/80"
                    style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
                  >
                    <ImageIcon size={20} />
                  </div>
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center rounded-full bg-primary-light text-lg font-semibold text-primary-dark">
                    {e.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-foreground">{e.name}</p>
                  <p className="text-[11px] text-ink-faint">{e.title}</p>
                  {e.verified && (
                    <p className="mt-0.5 flex items-center justify-center gap-0.5 text-[10px] text-success">
                      <BadgeCheck size={10} /> স্বীকৃত বিশেষজ্ঞ
                    </p>
                  )}
                </div>
              </div>
              <div className="min-w-0 flex-1 border-l border-border pl-4">
                <StarRating rating={e.rating} size={13} />
                <p className="mt-2 text-sm text-ink-soft">&ldquo;{e.quote}&rdquo;</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
