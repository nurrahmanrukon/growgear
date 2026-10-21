import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { LegalPageContent } from "@/lib/server/legalPages";
import { renderWithBold } from "@/lib/richText";

export function LegalPageView({ content }: { content: LegalPageContent }) {
  return (
    <>
      <div className="container-page pt-4">
        <Breadcrumb items={[{ label: "হোম", href: "/" }, { label: content.title }]} />
      </div>

      <section className="container-page py-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{content.title}</h1>
          <p className="mt-1.5 text-xs text-ink-faint">{content.updatedLabel}</p>

          <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink-soft">
            {content.intro && <p>{renderWithBold(content.intro, "text-foreground")}</p>}

            {content.sections.map((section, i) => (
              <div key={i}>
                <h2 className="font-display text-base font-bold text-foreground">{section.heading}</h2>
                {section.items.length > 1 ? (
                  <ul className="mt-2 list-disc space-y-1.5 pl-5">
                    {section.items.map((item, j) => (
                      <li key={j}>{renderWithBold(item, "text-foreground")}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2">{renderWithBold(section.items[0], "text-foreground")}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
