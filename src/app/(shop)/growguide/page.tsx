import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { GrowGuideHeroCarousel } from "@/components/growguide/GrowGuideHeroCarousel";
import { GrowGuideVideoSection } from "@/components/growguide/GrowGuideVideoSection";
import { GROWGUIDE_AUDIENCE } from "@/lib/data/growguideAudience";

export const metadata: Metadata = { title: "GrowGuide — GrowGear" };

export default function GrowGuidePage() {
  return (
    <>
      <div className="container-page pt-4">
        <Breadcrumb items={[{ label: "হোম", href: "/" }, { label: "GrowGuide" }]} />
      </div>

      <section className="border-b border-border bg-surface-muted">
        <div className="container-page py-10 text-center sm:py-14">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">GrowGuide</p>
          <h1
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clip: "rect(0,0,0,0)",
              whiteSpace: "nowrap",
            }}
          >
            শিক্ষার্থী, প্রফেশনাল ও উদ্যোক্তাদের গাইডেড ওয়েতে গ্রো করতে সাহায্য করি
          </h1>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            {GROWGUIDE_AUDIENCE.map((a) => (
              <Link
                key={a.slug}
                href={`/growguide/${a.slug}`}
                className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
              >
                <a.icon size={14} className="text-primary" /> {a.label}
              </Link>
            ))}
          </div>

          <GrowGuideHeroCarousel />
        </div>
      </section>

      <GrowGuideVideoSection />
    </>
  );
}
