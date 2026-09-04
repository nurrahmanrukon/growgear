"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { StarRating } from "@/components/ui/StarRating";
import { formatTaka, discountPercent } from "@/lib/format";
import { categoryMeta } from "@/lib/data/products";
import { useCartStore } from "@/store/cart";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const discount = discountPercent(product.price, product.oldPrice);
  const href = `${categoryMeta[product.category].path}/${product.slug}`;

  return (
    <div className="group flex h-full flex-col rounded-lg border border-border bg-surface p-3 transition hover:shadow-md">
      <Link href={href} className="relative block">
        <ProductImage
          title={product.title}
          category={product.category}
          colorFrom={product.colorFrom}
          colorTo={product.colorTo}
          className="aspect-square w-full"
        />
        {product.badge && (
          <span className="absolute left-1.5 top-1.5 rounded bg-price px-1.5 py-0.5 text-[10px] font-bold text-white">
            {product.badge}
          </span>
        )}
      </Link>

      <Link href={href} className="mt-2.5 line-clamp-2 text-sm font-medium text-foreground hover:text-link-hover">
        {product.title}
      </Link>
      {product.author && (
        <span className="mt-0.5 text-xs text-neutral-500">{product.author}</span>
      )}

      <div className="mt-1.5">
        <StarRating rating={product.rating} reviewCount={product.reviewCount} size={13} />
      </div>

      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="text-lg font-bold text-price">{formatTaka(product.price)}</span>
        {product.oldPrice && (
          <span className="text-xs text-neutral-500 line-through">
            {formatTaka(product.oldPrice)}
          </span>
        )}
        {discount && (
          <span className="text-xs font-semibold text-success">-{discount}%</span>
        )}
      </div>

      {!product.inStock ? (
        <span className="mt-2 text-xs font-medium text-price">স্টকে নেই</span>
      ) : (
        <button
          onClick={() => addItem(product)}
          className="mt-3 flex items-center justify-center gap-1.5 rounded-md border border-primary bg-surface px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-light"
        >
          <Plus size={14} /> কার্টে যোগ করুন
        </button>
      )}
    </div>
  );
}
