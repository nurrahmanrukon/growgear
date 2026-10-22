import { getGrowGuidePageSettings } from "@/lib/server/growguidePageSettings";

export function GrowGuideStepsSection() {
  const text = getGrowGuidePageSettings();
  return (
    <section className="container-page py-10">
      <h2 className="text-center font-display text-xl font-bold text-foreground sm:text-2xl">{text.stepsHeading}</h2>
      <div className="mx-auto mt-7 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {text.steps.map((s, i) => (
          <div key={i} className="rounded-lg border border-border bg-surface p-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary-dark">
              {i + 1}
            </span>
            <h3 className="mt-3 text-sm font-bold text-foreground">{s.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
