"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { QuickOrderModal } from "@/components/product/QuickOrderModal";

function useHeaderHeight(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const header = document.getElementById("site-header");
    if (!header) return;
    const update = () => setHeight(header.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return height;
}

export function LandingHeroTitleBar({ product }: { product: Product }) {
  const headerHeight = useHeaderHeight();
  const [showOrder, setShowOrder] = useState(false);

  return (
    <div className="sticky z-30 bg-[#182a4a]/95 backdrop-blur" style={{ top: headerHeight }}>
      <div className="container-page flex items-center justify-between gap-3 py-3">
        <h1 className="truncate font-display text-base font-bold text-white sm:text-xl">{product.title}</h1>
        <button
          onClick={() => setShowOrder(true)}
          className="shrink-0 rounded-md bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-amber-300"
        >
          অর্ডার করুন
        </button>
      </div>
      <QuickOrderModal product={product} open={showOrder} onClose={() => setShowOrder(false)} />
    </div>
  );
}
