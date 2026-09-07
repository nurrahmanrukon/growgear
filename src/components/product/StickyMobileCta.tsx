"use client";

import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { formatTaka } from "@/lib/format";
import { useCartStore } from "@/store/cart";
import { ProductImage } from "@/components/ui/ProductImage";

export function StickyMobileCta({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  if (!product.inStock) return null;

  function handleBuyNow() {
    addItem(product, 1);
    router.push("/checkout");
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-border bg-surface/95 p-3 backdrop-blur lg:hidden">
      <ProductImage
        title={product.title}
        category={product.category}
        colorFrom={product.colorFrom}
        colorTo={product.colorTo}
        className="h-11 w-11 shrink-0 rounded-md"
        iconSize={18}
        hideLabel
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-ink-soft">{product.title}</p>
        <span className="text-base font-bold text-price">{formatTaka(product.price)}</span>
      </div>
      <button
        onClick={handleBuyNow}
        className="shrink-0 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        এখনই কিনুন
      </button>
    </div>
  );
}
