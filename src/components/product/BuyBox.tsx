"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, CheckCircle2, ShieldCheck, Truck, Users } from "lucide-react";
import { Product } from "@/lib/types";
import { formatTaka, discountPercent } from "@/lib/format";
import { StarRating } from "@/components/ui/StarRating";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Button } from "@/components/ui/Button";
import { SampleReadModal } from "@/components/product/SampleReadModal";
import { useCartStore } from "@/store/cart";

function weeklyBuyers(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 24 + (h % 140);
}

export function BuyBox({ product, compact = false }: { product: Product; compact?: boolean }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const discount = discountPercent(product.price, product.oldPrice);
  const isReadable = product.category === "book" || product.category === "ebook";

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
    <div id="buy-box" className="w-full rounded-lg border border-border bg-surface p-5 lg:w-[22rem]">
      {!compact && (
        <>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {product.category === "book" ? "হার্ডকভার বই" : product.category === "ebook" ? "ইনস্ট্যান্ট ইবুক" : "প্রোডাক্টিভিটি গিয়ার"}
          </p>
          <h1 className="mt-1.5 font-display text-2xl font-bold text-foreground">{product.title}</h1>
          {product.author && <p className="mt-1 text-sm text-ink-soft">{product.author}</p>}
          <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{product.shortDescription}</p>

          {isReadable && (
            <button
              onClick={() => setShowSample(true)}
              className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark hover:underline"
            >
              <BookOpen size={13} /> একটু পড়ে দেখুন
            </button>
          )}
        </>
      )}

      <div className={compact ? "flex items-center gap-3" : "mt-3 flex items-center gap-3"}>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
      </div>

      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-faint">
        <Users size={13} />
        গত ৭ দিনে {weeklyBuyers(product.id)}+ জন কিনেছেন
      </div>

      <div className="mt-4 border-t border-border pt-4">
        {discount && (
          <span className="mr-2 rounded bg-price/10 px-1.5 py-0.5 text-xs font-bold text-price">
            -{discount}%
          </span>
        )}
        <span className="text-2xl font-bold text-price">{formatTaka(product.price)}</span>
        {product.oldPrice && (
          <div className="text-xs text-ink-faint">
            নিয়মিত মূল্য: <span className="line-through">{formatTaka(product.oldPrice)}</span>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1.5 text-xs text-ink-soft">
        <div className="flex items-center gap-2">
          <Truck size={15} className="text-primary" />
          সারাদেশে হোম ডেলিভারি, ক্যাশ অন ডেলিভারি সুবিধা
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={15} className="text-primary" />
          ১০০% অরিজিনাল প্রোডাক্টের নিশ্চয়তা
        </div>
      </div>

      <div className="mt-4">
        {product.inStock ? (
          <p className="text-sm font-medium text-success">স্টকে আছে</p>
        ) : (
          <p className="text-sm font-medium text-price">স্টকে নেই</p>
        )}
      </div>

      {product.inStock && (
        <>
          <div className="mt-3">
            <span className="mb-1.5 block text-xs text-ink-soft">পরিমাণ</span>
            <QuantityStepper quantity={quantity} onChange={setQuantity} />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Button variant="primary" onClick={handleBuyNow}>
              এখনই কিনুন
            </Button>
            <Button variant="secondary" onClick={handleAddToCart}>
              {added ? (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} /> কার্টে যোগ হয়েছে
                </span>
              ) : (
                "কার্টে যোগ করুন"
              )}
            </Button>
          </div>
        </>
      )}

      {isReadable && !compact && (
        <SampleReadModal product={product} open={showSample} onClose={() => setShowSample(false)} />
      )}
    </div>
  );
}
