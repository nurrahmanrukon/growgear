import { CategoryIntro } from "@/lib/server/categoryIntro";

export function CategoryHero({ intro }: { intro: CategoryIntro }) {
  return (
    <section className="border-b border-border bg-surface-muted">
      <div className="container-page pb-8 pt-8 sm:pb-10 sm:pt-10">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">{intro.eyebrow}</p>
        <h1 className="mt-2 max-w-2xl font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
          {intro.headline}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-ink-soft sm:text-base">{intro.subtext}</p>
        {intro.quote && (
          <p className="mt-3 max-w-xl border-l-2 border-primary pl-3 text-sm font-medium text-primary-dark sm:text-base">
            {intro.quote}
          </p>
        )}
      </div>
    </section>
  );
}
