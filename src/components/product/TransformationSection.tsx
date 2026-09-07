import { Sparkles } from "lucide-react";
import { Product } from "@/lib/types";
import { getTransformations } from "@/lib/data/landingContent";

export function TransformationSection({ product }: { product: Product }) {
  const items = getTransformations(product);

  return (
    <section className="border-y border-border bg-surface-muted py-10">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">যে পরিবর্তন আসবে</p>
          <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
            পড়া শেষ করার পর আপনার জীবনে যা বদলাবে
          </h2>
        </div>

        <div className="mx-auto mt-7 grid max-w-4xl gap-4 sm:grid-cols-2">
          {items.map((t) => (
            <div key={t.title} className="flex gap-3 rounded-lg border border-border bg-surface p-4">
              <Sparkles size={18} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <h3 className="font-display text-sm font-bold text-foreground">{t.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
