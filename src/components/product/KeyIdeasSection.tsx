import { Lightbulb } from "lucide-react";
import { Product } from "@/lib/types";
import { toBengaliNumber } from "@/lib/format";
import { getKeyIdeas } from "@/lib/data/landingContent";

export function KeyIdeasSection({ product }: { product: Product }) {
  const ideas = getKeyIdeas(product);

  return (
    <section className="container-page py-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">ভেতরে যা পাবেন</p>
        <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
          {toBengaliNumber(ideas.length)}টি মূল আইডিয়া যা বদলে দিতে পারে আপনার প্রতিদিনের কাজ
        </h2>
      </div>

      <div className="mx-auto mt-7 grid max-w-4xl gap-4 sm:grid-cols-2">
        {ideas.map((idea, i) => (
          <div key={idea.title} className="flex gap-3 rounded-lg border border-border bg-surface p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary-dark">
              <Lightbulb size={16} />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-foreground">
                {toBengaliNumber(i + 1)}. {idea.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{idea.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
