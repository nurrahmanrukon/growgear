import { AlertCircle } from "lucide-react";
import { Product } from "@/lib/types";
import { getPainPoints } from "@/lib/data/landingContent";

export function PainPointsSection({ product }: { product: Product }) {
  const points = getPainPoints(product);

  return (
    <section className="container-page py-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">আপনার কি এমন হয়?</p>
        <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
          অনেকের জীবনেই এই সমস্যাগুলো বারবার ফিরে আসে
        </h2>
      </div>

      <div className="mx-auto mt-7 grid max-w-4xl gap-4 sm:grid-cols-3">
        {points.map((p) => (
          <div key={p.title} className="rounded-lg border border-border bg-surface p-5">
            <AlertCircle size={18} className="text-price" />
            <h3 className="mt-3 font-display text-sm font-bold text-foreground">{p.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
