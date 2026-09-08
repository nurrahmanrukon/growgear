"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart";

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
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const headerHeight = useHeaderHeight();

  function handleOrderNow() {
    addItem(product, 1);
    router.push("/checkout");
  }

  return (
    <div className="sticky z-30 bg-[#182a4a]/95 backdrop-blur" style={{ top: headerHeight }}>
      <div className="container-page flex items-center justify-between gap-3 py-3">
        <h1 className="truncate font-display text-base font-bold text-white sm:text-xl">{product.title}</h1>
        <button
          onClick={handleOrderNow}
          className="shrink-0 rounded-md bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-amber-300"
        >
          অর্ডার করুন
        </button>
      </div>
    </div>
  );
}
