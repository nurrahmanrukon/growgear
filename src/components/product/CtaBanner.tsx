import Link from "next/link";
import { Product } from "@/lib/types";
import { formatTaka, discountPercent } from "@/lib/format";

export function CtaBanner({
  product,
  heading,
  sub,
}: {
  product: Product;
  heading: string;
  sub?: string;
}) {
  const discount = discountPercent(product.price, product.oldPrice);

  return (
    <section className="border-y border-border bg-primary-light">
      <div className="container-page flex flex-col items-center gap-3 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h3 className="font-display text-base font-bold text-foreground sm:text-lg">{heading}</h3>
          {sub && <p className="mt-0.5 text-sm text-ink-soft">{sub}</p>}
        </div>
        <Link
          href="#buy-box"
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-dark"
        >
          এখনই অর্ডার করুন — {formatTaka(product.price)}
          {discount && <span className="rounded bg-white/15 px-1.5 py-0.5 text-xs">-{discount}%</span>}
        </Link>
      </div>
    </section>
  );
}
