"use client";

import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useCartStore, useHasHydrated } from "@/store/cart";
import { ProductImage } from "@/components/ui/ProductImage";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Button } from "@/components/ui/Button";
import { formatTaka, toBengaliNumber } from "@/lib/format";
import { categoryMeta } from "@/lib/data/products";

export default function CartPage() {
  const hydrated = useHasHydrated();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalItems = useCartStore((s) => s.totalItems());
  const totalPrice = useCartStore((s) => s.totalPrice());

  if (!hydrated) {
    return <div className="container-page py-10" />;
  }

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center justify-center gap-4 py-20 text-center">
        <ShoppingCart size={48} className="text-neutral-300" />
        <h1 className="text-lg font-semibold text-foreground">আপনার কার্ট খালি</h1>
        <p className="text-sm text-neutral-500">
          বই, ইবুক বা প্রোডাক্টিভিটি গিয়ার যোগ করে কেনাকাটা শুরু করুন।
        </p>
        <Link href="/">
          <Button variant="primary">কেনাকাটা শুরু করুন</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-6">
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">
        শপিং কার্ট ({toBengaliNumber(totalItems)} টি আইটেম)
      </h1>

      <div className="mt-4 flex flex-col gap-5 lg:flex-row">
        <div className="flex-1 divide-y divide-border rounded-lg border border-border bg-surface">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-3 p-3 sm:gap-4 sm:p-4">
              <Link href={`${categoryMeta[item.category].path}/${item.slug}`} className="shrink-0">
                <ProductImage
                  title={item.title}
                  category={item.category}
                  colorFrom={item.colorFrom}
                  colorTo={item.colorTo}
                  className="h-20 w-20 sm:h-24 sm:w-24"
                  iconSize={24}
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link
                  href={`${categoryMeta[item.category].path}/${item.slug}`}
                  className="text-sm font-medium text-foreground hover:text-link-hover"
                >
                  {item.title}
                </Link>
                <span className="mt-0.5 text-xs text-neutral-500">
                  {categoryMeta[item.category].label}
                </span>
                <p className="mt-1 text-sm font-bold text-price">{formatTaka(item.price)}</p>

                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <QuantityStepper
                    quantity={item.quantity}
                    onChange={(q) => updateQuantity(item.productId, q)}
                  />
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="flex items-center gap-1 text-xs text-link hover:text-link-hover"
                  >
                    <Trash2 size={14} /> সরান
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit w-full rounded-lg border border-border bg-surface p-4 lg:w-80">
          <p className="text-sm text-neutral-700">
            সাবটোটাল ({toBengaliNumber(totalItems)} টি আইটেম):{" "}
            <span className="font-bold text-price">{formatTaka(totalPrice)}</span>
          </p>
          <Link href="/checkout">
            <Button variant="primary" fullWidth className="mt-3">
              চেকআউট করুন
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
