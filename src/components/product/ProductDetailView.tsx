"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { StarRating } from "@/components/ui/StarRating";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BuyBox } from "@/components/product/BuyBox";
import { ProductGrid } from "@/components/product/ProductGrid";
import { categoryMeta } from "@/lib/data/products";
import { CheckCircle2 } from "lucide-react";

type Tab = "description" | "specs" | "reviews";

export function ProductDetailView({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [tab, setTab] = useState<Tab>("description");
  const meta = categoryMeta[product.category];

  return (
    <div className="container-page py-4">
      <Breadcrumb
        items={[
          { label: "হোম", href: "/" },
          { label: meta.label, href: meta.path },
          { label: product.title },
        ]}
      />

      <div className="mt-4 flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-96">
          <ProductImage
            title={product.title}
            category={product.category}
            colorFrom={product.colorFrom}
            colorTo={product.colorTo}
            iconSize={72}
            className="aspect-square w-full"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-xl font-medium text-[#0f1111] sm:text-2xl">{product.title}</h1>
          {product.author && <p className="mt-1 text-sm text-link">{product.author}</p>}
          <div className="mt-2">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>
          <p className="mt-3 max-w-2xl text-sm text-neutral-700">{product.shortDescription}</p>

          <ul className="mt-4 space-y-1.5">
            {product.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2 text-sm text-neutral-700">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        <BuyBox product={product} />
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <div className="flex gap-6 border-b border-border">
          {(
            [
              ["description", "বিবরণ"],
              ["specs", "স্পেসিফিকেশন"],
              ["reviews", "রিভিউ"],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`-mb-px border-b-2 pb-2.5 text-sm font-medium ${
                tab === key
                  ? "border-orange text-[#0f1111]"
                  : "border-transparent text-neutral-500 hover:text-[#0f1111]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="py-5">
          {tab === "description" && (
            <p className="max-w-3xl text-sm leading-relaxed text-neutral-700">
              {product.description}
            </p>
          )}
          {tab === "specs" && (
            <table className="w-full max-w-xl text-sm">
              <tbody>
                {product.specs.map((spec) => (
                  <tr key={spec.label} className="border-b border-border">
                    <td className="w-40 py-2 font-medium text-neutral-600">{spec.label}</td>
                    <td className="py-2 text-neutral-800">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === "reviews" && (
            <div className="max-w-xl">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#0f1111]">{product.rating}</span>
                <div>
                  <StarRating rating={product.rating} size={16} />
                  <p className="text-xs text-neutral-500">{product.reviewCount} টি রিভিউ</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-neutral-500">
                রিভিউ শীঘ্রই যুক্ত করা হবে। প্রোডাক্টটি কিনে আপনিই প্রথম রিভিউ দিন।
              </p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-4 border-t border-border pt-6">
          <h2 className="mb-3 text-lg font-bold text-[#0f1111]">আপনার পছন্দ হতে পারে</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
