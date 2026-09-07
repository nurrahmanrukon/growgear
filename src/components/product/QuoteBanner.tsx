import { Product } from "@/lib/types";
import { getQuote } from "@/lib/data/landingContent";

export function QuoteBanner({ product }: { product: Product }) {
  const quote = getQuote(product);

  return (
    <section className="bg-foreground py-14">
      <div className="container-page">
        <p className="mx-auto max-w-2xl text-center font-display text-xl font-medium leading-relaxed text-background sm:text-2xl">
          &ldquo;{quote}&rdquo;
        </p>
      </div>
    </section>
  );
}
