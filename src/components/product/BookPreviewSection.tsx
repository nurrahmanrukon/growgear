import { ImageIcon } from "lucide-react";
import { Product } from "@/lib/types";
import { getPreviewPageUrls } from "@/lib/server/bookPreviewPages";
import { BookPreviewCarousel } from "@/components/product/BookPreviewCarousel";

export function BookPreviewSection({ product }: { product: Product }) {
  const pageUrls = getPreviewPageUrls(product.slug);

  return (
    <section className="border-y border-border bg-surface-muted py-12">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">একটু উঁকি দিন</p>
          <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
            বইয়ের ভেতরের কিছু পাতা
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            কেনার আগেই বইয়ের ভেতরের কয়েকটা পাতা দেখে নিন — স্লাইড করে পরের/আগের পাতায় যেতে পারবেন।
          </p>
        </div>

        <div className="mt-6">
          {pageUrls.length > 0 ? (
            <BookPreviewCarousel pageUrls={pageUrls} title={product.title} />
          ) : (
            <div
              className="mx-auto flex aspect-[3/4] w-64 flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-star text-white/85 sm:w-80"
              style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
            >
              <ImageIcon size={22} />
              <span className="text-xs">পাতার ছবি শীঘ্রই আসছে</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
