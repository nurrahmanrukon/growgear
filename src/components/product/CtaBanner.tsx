"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Product } from "@/lib/types";
import { formatTaka, discountPercent } from "@/lib/format";
import { useCartStore } from "@/store/cart";

export function CtaBanner({
  product,
  heading,
  sub,
}: {
  product: Product;
  heading: string;
  sub?: string;
}) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const discount = discountPercent(product.price, product.oldPrice);

  function handleBuyNow() {
    addItem(product, 1);
    router.push("/checkout");
  }

  function handleAddToCart() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <section className="border-y border-border bg-primary-light">
      <div className="container-page flex flex-col items-center gap-4 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h3 className="font-display text-base font-bold text-foreground sm:text-lg">{heading}</h3>
          {sub && <p className="mt-0.5 text-sm text-ink-soft">{sub}</p>}
          <p className="mt-1.5 text-lg font-bold text-price">
            {formatTaka(product.price)}
            {discount && <span className="ml-2 rounded bg-price/10 px-1.5 py-0.5 text-xs">-{discount}%</span>}
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
          <button
            onClick={handleBuyNow}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-dark"
          >
            এখনই কিনুন
          </button>
          <button
            onClick={handleAddToCart}
            className="rounded-md border border-primary bg-surface px-5 py-2.5 text-sm font-medium text-primary transition hover:bg-primary-light"
          >
            {added ? (
              <span className="flex items-center justify-center gap-1.5">
                <CheckCircle2 size={16} /> যোগ হয়েছে
              </span>
            ) : (
              "কার্টে যোগ করুন"
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
