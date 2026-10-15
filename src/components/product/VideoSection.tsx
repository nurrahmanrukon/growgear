import { Check, Play } from "lucide-react";
import { Product } from "@/lib/types";
import { StarRating } from "@/components/ui/StarRating";

export function VideoSection({ product }: { product: Product }) {
  const isReadable = product.category === "book" || product.category === "ebook";

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

      <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-border bg-surface p-4">
        {product.videoUrl ? (
          <video
            src={product.videoUrl}
            controls
            preload="metadata"
            className="aspect-video w-full rounded-lg bg-black"
          />
        ) : (
          <div
            className="group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg"
            style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/90 shadow-sm transition group-hover:scale-105 sm:h-20 sm:w-20">
              <Play size={28} className="ml-1 text-foreground" fill="currentColor" />
            </div>
            <span className="absolute bottom-3 left-4 text-xs font-medium text-white/85 sm:bottom-4 sm:left-5 sm:text-sm">
              {product.title} — প্রোডাক্ট ভিডিও (শীঘ্রই যুক্ত হবে)
            </span>
          </div>
        )}

        <div className="mt-3">
          <p className="font-display text-sm font-bold text-foreground">{product.title}</p>
          {product.author && <p className="text-xs text-ink-faint">{product.author}</p>}
          <div className="mt-1.5">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size={13} />
          </div>
          <p className="mt-2 text-sm text-ink-soft">{product.shortDescription}</p>
        </div>
      </div>
    </section>
  );
}
