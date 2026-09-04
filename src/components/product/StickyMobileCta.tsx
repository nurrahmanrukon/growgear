"use client";

import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { formatTaka } from "@/lib/format";
import { useCartStore } from "@/store/cart";

export function StickyMobileCta({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  if (!product.inStock) return null;

  function handleBuyNow() {
    addItem(product, 1);
    router.push("/checkout");
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-border bg-surface/95 p-3 backdrop-blur lg:hidden">
      <span className="text-base font-bold text-price">{formatTaka(product.price)}</span>
      <button
        onClick={handleBuyNow}
        className="flex-1 rounded-md bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        এখনই কিনুন
      </button>
    </div>
  );
}
