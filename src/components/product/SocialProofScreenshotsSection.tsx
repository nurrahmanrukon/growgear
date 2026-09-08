import { ImagePlus } from "lucide-react";
import { Product } from "@/lib/types";

export function SocialProofScreenshotsSection({ product }: { product: Product }) {
  return (
    <section className="container-page py-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">সামাজিক মাধ্যমে আলোচনা</p>
        <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
          রিয়েল কাস্টমাররা সোশ্যাল মিডিয়ায় যা বলছেন
        </h2>
        <p className="mt-1.5 text-sm text-ink-soft">
          ফেসবুক, ইনস্টাগ্রাম ও হোয়াটসঅ্যাপে &ldquo;{product.title}&rdquo; নিয়ে গ্রাহকদের আসল মন্তব্যের স্ক্রিনশট
        </p>
      </div>

      <div className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex aspect-[3/4] flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-border bg-surface-muted p-3 text-center text-ink-faint"
          >
            <ImagePlus size={20} />
            <span className="text-[11px]">স্ক্রিনশট যোগ করুন</span>
          </div>
        ))}
      </div>
    </section>
  );
}
