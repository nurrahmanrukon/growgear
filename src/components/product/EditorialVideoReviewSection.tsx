import { Play } from "lucide-react";
import { Product } from "@/lib/types";

export function EditorialVideoReviewSection({ product }: { product: Product }) {
  return (
    <section className="container-page py-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">স্বাধীন পর্যালোচনা</p>
        <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
          সম্পাদকীয় ভিডিও রিভিউ
        </h2>
        <p className="mt-1.5 text-sm text-ink-soft">
          স্বতন্ত্র পর্যালোচকরা &ldquo;{product.title}&rdquo; নিয়ে কী বলছেন, দেখে নিন
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-3xl">
        <div
          className="group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-border"
          style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/90 shadow-sm transition group-hover:scale-105 sm:h-20 sm:w-20">
            <Play size={28} className="ml-1 text-foreground" fill="currentColor" />
          </div>
          <span className="absolute bottom-3 left-4 text-xs font-medium text-white/85 sm:bottom-4 sm:left-5 sm:text-sm">
            সম্পাদকীয় ভিডিও রিভিউ (শীঘ্রই যুক্ত হবে)
          </span>
        </div>
      </div>
    </section>
  );
}
