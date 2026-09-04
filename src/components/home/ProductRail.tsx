import Link from "next/link";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";

export function ProductRail({
  title,
  viewAllHref,
  products,
}: {
  title: string;
  viewAllHref: string;
  products: Product[];
}) {
  return (
    <section className="container-page py-6">
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <Link href={viewAllHref} className="text-sm text-link hover:text-link-hover hover:underline">
            সব দেখুন →
          </Link>
        </div>
        <div className="-mx-1 flex gap-3 overflow-x-auto pb-1 scrollbar-none sm:mx-0">
          {products.map((product) => (
            <div key={product.id} className="w-40 shrink-0 sm:w-48">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
