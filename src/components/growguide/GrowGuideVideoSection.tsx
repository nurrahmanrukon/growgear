import Link from "next/link";
import { Play } from "lucide-react";
import { getGrowGuideAudiencesResolved } from "@/lib/server/growguideAudienceSettings";
import { getGrowGuidePageSettings } from "@/lib/server/growguidePageSettings";

export function GrowGuideVideoSection() {
  const text = getGrowGuidePageSettings();
  const audiences = getGrowGuideAudiencesResolved();
  return (
    <section className="border-b border-border py-10">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">{text.mainMessageEyebrow}</p>
          <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">{text.mainMessageHeading}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text.mainMessageParagraph}</p>
        </div>

        <div className="mx-auto mt-6 max-w-3xl">
          <div
            className="group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-border"
            style={{ background: "linear-gradient(135deg, #2a4570, #16294a)" }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/90 shadow-sm transition group-hover:scale-105 sm:h-20 sm:w-20">
              <Play size={28} className="ml-1 text-foreground" fill="currentColor" />
            </div>
            <span className="absolute bottom-3 left-4 text-xs font-medium text-white/85 sm:bottom-4 sm:left-5 sm:text-sm">
              {text.indexVideoCaption} {text.videoComingSoonSuffix}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {audiences.map((audience) => {
              const Icon = audience.icon;
              return (
                <Link
                  key={audience.slug}
                  href={`/growguide/${audience.slug}`}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
                >
                  <Icon size={14} />
                  {audience.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
