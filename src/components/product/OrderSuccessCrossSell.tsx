"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";
import { formatTaka, toBengaliNumber } from "@/lib/format";
import { ProductImage } from "@/components/ui/ProductImage";
import { CrossSellModal } from "@/components/product/CrossSellModal";

export function OrderSuccessCrossSell({
  ebook,
  message,
  soldCount,
  customerName,
  customerPhone,
}: {
  ebook: Product;
  message: string;
  soldCount: number;
  customerName: string;
  customerPhone: string;
}) {
  const [open, setOpen] = useState(true);
  const text = message.replace("{count}", toBengaliNumber(soldCount));

  return (
    <>
      <div className="mt-8 w-full max-w-sm rounded-lg border border-border bg-surface p-4 text-left shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">আপনার জন্য বিশেষ সাজেশন</p>
        <div className="mt-2.5 flex items-center gap-3">
          <ProductImage
            title={ebook.title}
            category={ebook.category}
            colorFrom={ebook.colorFrom}
            colorTo={ebook.colorTo}
            imageUrl={ebook.coverImageUrl}
            hideLabel
            className="h-20 w-14 shrink-0 rounded-md"
          />
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold text-foreground">{ebook.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">{text}</p>
            <p className="mt-1.5 text-sm font-bold text-price">{formatTaka(ebook.price)}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-cta py-2 text-center text-sm font-semibold text-white hover:bg-cta-dark"
        >
          এখনই দেখুন <ArrowRight size={14} />
        </button>
      </div>

      <CrossSellModal
        ebook={ebook}
        message={message}
        soldCount={soldCount}
        customerName={customerName}
        customerPhone={customerPhone}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
