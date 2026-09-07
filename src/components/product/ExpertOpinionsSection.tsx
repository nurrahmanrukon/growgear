import { Quote } from "lucide-react";
import { Product } from "@/lib/types";
import { getExpertOpinions } from "@/lib/data/landingContent";

export function ExpertOpinionsSection({ product }: { product: Product }) {
  const experts = getExpertOpinions(product);

  return (
    <section className="container-page py-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">বিশেষজ্ঞদের মতামত</p>
        <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
          যারা কাজের জগতে আছেন, তারা কী বলছেন
        </h2>
      </div>

      <div className="mx-auto mt-7 grid max-w-4xl gap-4 sm:grid-cols-3">
        {experts.map((e) => (
          <div key={e.name} className="rounded-lg border border-border bg-surface p-5">
            <Quote size={18} className="text-primary" />
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">&ldquo;{e.quote}&rdquo;</p>
            <div className="mt-4 border-t border-border pt-3">
              <p className="text-xs font-medium text-foreground">{e.name}</p>
              <p className="text-[11px] text-ink-faint">{e.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
