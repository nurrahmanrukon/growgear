import { ChevronDown } from "lucide-react";
import { getGrowGuideFaqSettings } from "@/lib/server/growguideFaqSettings";

export function GrowGuideFaqSection() {
  const { eyebrow, heading, faqs } = getGrowGuideFaqSettings();
  return (
    <section className="container-page py-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">{eyebrow}</p>
        <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">{heading}</h2>
      </div>

      <div className="mx-auto mt-7 max-w-2xl space-y-2.5">
        {faqs.map((f, i) => (
          <details key={i} className="group rounded-lg border border-border bg-surface open:border-primary">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-medium text-foreground">
              {f.q}
              <ChevronDown size={16} className="shrink-0 text-ink-faint transition group-open:rotate-180" />
            </summary>
            <p className="px-4 pb-4 text-sm leading-relaxed text-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
