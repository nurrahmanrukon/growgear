"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Product } from "@/lib/types";
import { getLiveDemand, getHeroHeadline } from "@/lib/data/landingContent";
import { toBengaliNumber } from "@/lib/format";
import { ProductImage } from "@/components/ui/ProductImage";
import { SampleReadModal } from "@/components/product/SampleReadModal";

export function LandingHero({ product }: { product: Product }) {
  const [showSample, setShowSample] = useState(false);
  const demand = getLiveDemand(product);
  const headline = getHeroHeadline(product);
  const isEbook = product.category === "ebook";
  const isReadable = product.category === "book" || product.category === "ebook";

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #2a4570 0%, #182a4a 55%, #0d1830 100%)" }}
    >
      <div className="container-page flex flex-wrap items-center justify-center gap-3 pt-6 pb-6">
        <span className="rounded-full bg-rose-500/90 px-3.5 py-1.5 text-xs font-semibold text-white">
          {isEbook ? "⚡ পেমেন্টের সাথে সাথেই ডাউনলোড লিংক" : "অল্প কিছু কপি বাকি"}
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          এখন {toBengaliNumber(demand.viewers)} জন এই পেজটি দেখছেন
        </span>
      </div>

      <div className="container-page flex justify-center pb-2">
        <ProductImage
          title={product.title}
          category={product.category}
          colorFrom={product.colorFrom}
          colorTo={product.colorTo}
          iconSize={56}
          className="aspect-[3/4] w-48 rounded-lg shadow-2xl sm:w-56"
        />
      </div>

      {isReadable && (
        <div className="container-page flex justify-center pb-8">
          <button
            onClick={() => setShowSample(true)}
            className="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
          >
            <Eye size={16} /> একটু পড়ে দেখুন
          </button>
        </div>
      )}

      <div className="container-page pb-8">
        <h2 className="mx-auto max-w-2xl text-center font-display text-lg font-bold leading-relaxed text-white sm:text-xl">
          {headline}
        </h2>

        {isEbook ? (
          <div className="mx-auto mt-6 max-w-xl text-center">
            <p className="text-xs font-medium text-white/85 sm:text-sm">
              📥 পেমেন্ট সম্পন্ন হওয়ার সাথে সাথেই সম্পূর্ণ ফাইল ডাউনলোড করতে পারবেন
            </p>
            <p className="mt-1.5 text-[11px] text-white/60">অপেক্ষা নেই — এখনই পড়া শুরু করতে পারবেন, যেকোনো ডিভাইসে</p>
          </div>
        ) : (
          <div className="mx-auto mt-6 max-w-xl">
            <div className="flex items-center justify-between text-xs font-medium text-white/85">
              <span>🔥 আজকের স্টক দ্রুত শেষ হচ্ছে</span>
              <span>অল্প কিছু কপি বাকি</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500"
                style={{ width: `${demand.stockSoldPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="mx-auto mt-5 flex max-w-xl items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {demand.recentOrderInitials.map((initial, i) => (
              <div
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#182a4a] bg-white/90 text-xs font-semibold text-slate-900"
              >
                {initial}
              </div>
            ))}
          </div>
          <p className="text-xs text-white/85">
            গত ২৪ ঘণ্টায় <span className="font-semibold text-white">{toBengaliNumber(demand.ordersLast24h)}</span> জন অর্ডার করেছেন
          </p>
        </div>
      </div>

      {isReadable && (
        <SampleReadModal product={product} open={showSample} onClose={() => setShowSample(false)} />
      )}
    </section>
  );
}
