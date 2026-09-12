"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart";
import { QuickOrderModal } from "@/components/product/QuickOrderModal";

export function InlineCtaBar({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [showOrder, setShowOrder] = useState(false);

  if (!product.inStock) return null;

  function handleAddToCart() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="container-page flex flex-col items-center justify-center gap-2.5 py-6 sm:flex-row">
      <button
        onClick={() => setShowOrder(true)}
        className="w-full rounded-md bg-primary px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark sm:w-auto"
      >
        এখনই কিনুন
      </button>
      <button
        onClick={handleAddToCart}
        className="w-full rounded-md border border-primary px-8 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary-light sm:w-auto"
      >
        {added ? (
          <span className="flex items-center justify-center gap-1.5">
            <CheckCircle2 size={16} /> কার্টে যোগ হয়েছে
          </span>
        ) : (
          "কার্টে যোগ করুন"
        )}
      </button>

      <QuickOrderModal product={product} open={showOrder} onClose={() => setShowOrder(false)} />
    </div>
  );
}
