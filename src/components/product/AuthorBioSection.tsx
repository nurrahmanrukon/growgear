import { Product } from "@/lib/types";
import { getAuthorProfile } from "@/lib/data/landingContent";

export function AuthorBioSection({ product }: { product: Product }) {
  const author = getAuthorProfile(product);

  return (
    <section className="border-y border-border bg-surface-muted py-10">
      <div className="container-page">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white/90"
            style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
          >
            {author.name.charAt(0)}
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">যিনি লিখেছেন</p>
            <h2 className="mt-1 font-display text-lg font-bold text-foreground">{author.name}</h2>
            <p className="text-sm text-ink-faint">{author.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{author.bio}</p>

            <div className="mt-5 flex flex-wrap justify-center gap-6 sm:justify-start">
              {author.stats.map((s) => (
                <div key={s.label} className="text-center sm:text-left">
                  <p className="font-display text-xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-ink-faint">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
