import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatTaka, discountPercent } from "@/lib/format";

export function FinalOrderSection({ product }: { product: Product }) {
  const discount = discountPercent(product.price, product.oldPrice);

  return (
    <section className="bg-primary-dark py-12">
      <div className="container-page">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
            আজই &ldquo;{product.title}&rdquo; সংগ্রহ করুন
          </h2>
          <p className="mt-2 text-sm text-white/75">
            যে পরিবর্তনটা আনতে চান, সেটা শুরু হোক আজই — দেরি করলে সুযোগটাই হাতছাড়া হয়ে যায়।
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="text-3xl font-bold text-white">{formatTaka(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-white/50 line-through">{formatTaka(product.oldPrice)}</span>
            )}
            {discount && (
              <span className="rounded bg-white/15 px-2 py-0.5 text-xs font-bold text-white">-{discount}%</span>
            )}
          </div>

          <Link
            href="#buy-box"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-white px-8 py-3 text-sm font-semibold text-primary-dark shadow-sm transition hover:bg-white/90"
          >
            এখনই অর্ডার করুন
          </Link>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/70">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} /> ক্যাশ অন ডেলিভারি
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} /> ১০০% অরিজিনাল
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} /> সারাদেশে ডেলিভারি
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
