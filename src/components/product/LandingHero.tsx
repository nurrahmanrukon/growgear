"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { Product } from "@/lib/types";
import { getLiveDemand } from "@/lib/data/landingContent";
import { toBengaliNumber } from "@/lib/format";
import { ProductImage } from "@/components/ui/ProductImage";
import { SampleReadModal } from "@/components/product/SampleReadModal";
import { useCartStore } from "@/store/cart";

export function LandingHero({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [showSample, setShowSample] = useState(false);
  const demand = getLiveDemand(product);

  function handleOrderNow() {
    addItem(product, 1);
    router.push("/checkout");
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #2a4570 0%, #182a4a 55%, #0d1830 100%)" }}
    >
      <div className="container-page flex items-center justify-between gap-3 py-4">
        <h1 className="truncate font-display text-lg font-bold text-white sm:text-xl">{product.title}</h1>
        <button
          onClick={handleOrderNow}
          className="shrink-0 rounded-md bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-amber-300"
        >
          অর্ডার করুন
        </button>
      </div>

      <div className="container-page flex flex-wrap items-center justify-center gap-3 pb-6">
        <span className="rounded-full bg-rose-500/90 px-3.5 py-1.5 text-xs font-semibold text-white">
          অল্প কিছু কপি বাকি
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

      <div className="container-page flex justify-center pb-8">
        <button
          onClick={() => setShowSample(true)}
          className="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
        >
          <Eye size={16} /> একটু পড়ে দেখুন
        </button>
      </div>

      <SampleReadModal product={product} open={showSample} onClose={() => setShowSample(false)} />
    </section>
  );
}
