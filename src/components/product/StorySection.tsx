import { ImagePlus } from "lucide-react";
import { Product } from "@/lib/types";
import { getStorySections } from "@/lib/data/story";
import { ProductImage } from "@/components/ui/ProductImage";

export function StorySection({ product }: { product: Product }) {
  const sections = getStorySections(product);

  return (
    <section className="container-page py-10">
      <div className="space-y-10 sm:space-y-14">
        {sections.map((s, i) => {
          const reverse = i % 2 === 1;
          return (
            <div
              key={s.heading}
              className={`flex flex-col items-center gap-6 sm:gap-10 lg:flex-row ${reverse ? "lg:flex-row-reverse" : ""}`}
            >
              <div className="grid w-full grid-cols-2 gap-2 lg:w-2/5" style={{ gridTemplateRows: "repeat(2, minmax(0,1fr))" }}>
                <div className="row-span-2">
                  <ProductImage
                    title={product.title}
                    category={product.category}
                    colorFrom={product.colorFrom}
                    colorTo={product.colorTo}
                    className="h-full w-full"
                    iconSize={40}
                  />
                </div>
                <ProductImage
                  title={product.title}
                  category={product.category}
                  colorFrom={product.colorTo}
                  colorTo={product.colorFrom}
                  className="aspect-square w-full"
                  iconSize={20}
                  hideLabel
                />
                <div className="relative aspect-square w-full overflow-hidden rounded-md border border-dashed border-border bg-surface-muted">
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-ink-faint">
                    <ImagePlus size={18} />
                    <span className="text-[10px]">আরও ছবি যোগ করুন</span>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-3/5">
                <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">{s.heading}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">{s.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
