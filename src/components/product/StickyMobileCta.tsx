"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { formatTaka } from "@/lib/format";
import { ProductImage } from "@/components/ui/ProductImage";
import { QuickOrderModal } from "@/components/product/QuickOrderModal";

export function StickyMobileCta({ product }: { product: Product }) {
  const [showOrder, setShowOrder] = useState(false);

  if (!product.inStock) return null;

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
        onClick={() => setShowOrder(true)}
        className="shrink-0 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        এখনই কিনুন
      </button>
      <QuickOrderModal product={product} open={showOrder} onClose={() => setShowOrder(false)} />
    </div>
  );
}
