import { ChevronDown } from "lucide-react";
import { Product } from "@/lib/types";
import { getFaqs } from "@/lib/data/landingContent";

export function FaqSection({ product }: { product: Product }) {
  const faqs = getFaqs(product);

  return (
    <section className="border-y border-border bg-surface-muted py-10">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">সাধারণ জিজ্ঞাসা</p>
          <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
            অর্ডার করার আগে যা জানা দরকার
          </h2>
        </div>

        <div className="mx-auto mt-7 max-w-2xl space-y-2.5">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-lg border border-border bg-surface open:border-primary"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-medium text-foreground">
                {f.q}
                <ChevronDown size={16} className="shrink-0 text-ink-faint transition group-open:rotate-180" />
              </summary>
              <p className="px-4 pb-4 text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
