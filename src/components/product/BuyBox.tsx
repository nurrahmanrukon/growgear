"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { Product } from "@/lib/types";
import { formatTaka, discountPercent } from "@/lib/format";
import { StarRating } from "@/components/ui/StarRating";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cart";

export function BuyBox({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const discount = discountPercent(product.price, product.oldPrice);

  function handleAddToCart() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    addItem(product, quantity);
    router.push("/checkout");
  }

  return (
    <div className="w-full rounded-lg border border-border bg-surface p-4 lg:w-80">
      <h1 className="text-lg font-medium text-[#0f1111]">{product.title}</h1>
      {product.author && (
        <p className="mt-1 text-sm text-link hover:text-link-hover">{product.author}</p>
      )}
      <div className="mt-1.5">
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
      </div>

      <div className="mt-3 border-t border-border pt-3">
        {discount && (
          <span className="mr-2 rounded bg-price/10 px-1.5 py-0.5 text-xs font-bold text-price">
            -{discount}%
          </span>
        )}
        <span className="text-2xl font-bold text-price">{formatTaka(product.price)}</span>
        {product.oldPrice && (
          <div className="text-xs text-neutral-500">
            এমআরপি: <span className="line-through">{formatTaka(product.oldPrice)}</span>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1.5 text-xs text-neutral-700">
        <div className="flex items-center gap-2">
          <Truck size={15} className="text-navy-light" />
          সারাদেশে হোম ডেলিভারি, ক্যাশ অন ডেলিভারি সুবিধা
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={15} className="text-navy-light" />
          ১০০% অরিজিনাল প্রোডাক্টের নিশ্চয়তা
        </div>
      </div>

      <div className="mt-4">
        {product.inStock ? (
          <p className="text-lg text-success">স্টকে আছে</p>
        ) : (
          <p className="text-lg text-price">স্টকে নেই</p>
        )}
      </div>

      {product.inStock && (
        <>
          <div className="mt-3">
            <span className="mb-1.5 block text-xs text-neutral-600">পরিমাণ</span>
            <QuantityStepper quantity={quantity} onChange={setQuantity} />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Button variant="secondary" onClick={handleAddToCart}>
              {added ? (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} /> কার্টে যোগ হয়েছে
                </span>
              ) : (
                "কার্টে যোগ করুন"
              )}
            </Button>
            <Button variant="primary" onClick={handleBuyNow}>
              এখনই কিনুন
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
