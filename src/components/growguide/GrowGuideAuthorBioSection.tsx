import { getGrowGuidePageSettings } from "@/lib/server/growguidePageSettings";

export function GrowGuideAuthorBioSection() {
  const text = getGrowGuidePageSettings();
  return (
    <section className="border-y border-border bg-surface-muted py-12">
      <div className="container-page">
        <div className="mx-auto max-w-md text-center">
          <span
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
            style={{ background: "linear-gradient(135deg, #2a4570, #16294a)" }}
          >
            {text.authorInitial}
          </span>
          <h2 className="mt-3 font-display text-lg font-bold text-foreground">{text.authorName}</h2>
          <p className="text-sm text-ink-faint">{text.authorRole}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{text.authorBio}</p>
        </div>
      </div>
    </section>
  );
}
