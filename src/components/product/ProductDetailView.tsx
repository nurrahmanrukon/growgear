import { Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BuyBox } from "@/components/product/BuyBox";
import { VideoSection } from "@/components/product/VideoSection";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { StorySection } from "@/components/product/StorySection";
import { StickyMobileCta } from "@/components/product/StickyMobileCta";
import { ProductGrid } from "@/components/product/ProductGrid";
import { categoryMeta } from "@/lib/data/products";

export function ProductDetailView({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const meta = categoryMeta[product.category];

  return (
    <div className="pb-20 lg:pb-0">
      {/* Hero: product image + persuasive buy box */}
      <section className="container-page pt-4">
        <Breadcrumb
          items={[
            { label: "হোম", href: "/" },
            { label: meta.label, href: meta.path },
            { label: product.title },
          ]}
        />

        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="lg:flex-1">
            <ProductImage
              title={product.title}
              category={product.category}
              colorFrom={product.colorFrom}
              colorTo={product.colorTo}
              iconSize={72}
              className="aspect-square w-full"
            />
          </div>
          <BuyBox product={product} />
        </div>
      </section>

      <VideoSection product={product} />
      <ReviewsSection product={product} />
      <StorySection product={product} />

      {/* Specifications */}
      <section className="container-page py-10">
        <h2 className="font-display text-lg font-bold text-foreground">স্পেসিফিকেশন</h2>
        <table className="mt-4 w-full max-w-xl text-sm">
          <tbody>
            {product.specs.map((spec) => (
              <tr key={spec.label} className="border-b border-border">
                <td className="w-40 py-2.5 font-medium text-ink-soft">{spec.label}</td>
                <td className="py-2.5 text-foreground">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {related.length > 0 && (
        <section className="container-page border-t border-border py-10">
          <h2 className="mb-4 font-display text-lg font-bold text-foreground">আপনার পছন্দ হতে পারে</h2>
          <ProductGrid products={related} />
        </section>
      )}

      <StickyMobileCta product={product} />
    </div>
  );
}
