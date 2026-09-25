import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Play } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { StarRating } from "@/components/ui/StarRating";
import { GrowGuideHeroCarousel } from "@/components/growguide/GrowGuideHeroCarousel";
import { GrowGuideSocialProofSection } from "@/components/growguide/GrowGuideSocialProofSection";
import { GrowGuideReviewsSection } from "@/components/growguide/GrowGuideReviewsSection";
import { GrowGuideFaqSection } from "@/components/growguide/GrowGuideFaqSection";
import { GrowGuideStepsSection } from "@/components/growguide/GrowGuideStepsSection";
import { GrowGuideAuthorBioSection } from "@/components/growguide/GrowGuideAuthorBioSection";
import { GrowGuideCommunitySection } from "@/components/growguide/GrowGuideCommunitySection";
import { GrowGuideJoinForm } from "@/components/growguide/GrowGuideJoinForm";
import { GROWGUIDE_AUDIENCE, getGrowGuideAudience } from "@/lib/data/growguideAudience";

export function generateStaticParams() {
  return GROWGUIDE_AUDIENCE.map((a) => ({ audience: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ audience: string }>;
}): Promise<Metadata> {
  const { audience } = await params;
  const a = getGrowGuideAudience(audience);
  return { title: a ? `${a.label} — GrowGuide — GrowGear` : "GrowGuide — GrowGear" };
}

export default async function GrowGuideAudiencePage({
  params,
}: {
  params: Promise<{ audience: string }>;
}) {
  const { audience } = await params;
  const a = getGrowGuideAudience(audience);
  if (!a) notFound();

  const Icon = a.icon;

  return (
    <>
      <div className="container-page pt-4">
        <Breadcrumb items={[{ label: "হোম", href: "/" }, { label: "GrowGuide", href: "/growguide" }, { label: a.label }]} />
      </div>

      <section className="border-b border-border bg-surface-muted">
        <div className="container-page py-10 text-center sm:py-14">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">GrowGuide — {a.label}</p>
          <h1 className="mx-auto mt-2 max-w-2xl font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {a.heroHeading}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft sm:text-base">{a.heroSubtitle}</p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {GROWGUIDE_AUDIENCE.map((audience) => (
              <Link
                key={audience.slug}
                href={`/growguide/${audience.slug}`}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  audience.slug === a.slug
                    ? "border-primary bg-primary-light text-primary"
                    : "border-border bg-surface text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                <audience.icon size={14} className={audience.slug === a.slug ? "text-primary" : "text-primary"} />{" "}
                {audience.label}
              </Link>
            ))}
          </div>

          <GrowGuideHeroCarousel />
        </div>
      </section>

      <section className="container-page py-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">মূল বার্তা</p>
          <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
            নূর রহমানের কাছ থেকে সরাসরি শুনুন
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            প্রতি মাসে একটি নির্দিষ্ট সময়ে সম্পূর্ণ ফ্রি লাইভ ওয়েবিনার — শিক্ষার্থী, প্রফেশনাল ও উদ্যোক্তাদের জন্য। এটা
            আমার কমিউনিটি গড়ে তোলা এবং সমাজে অবদান রাখার একটা প্রচেষ্টা।
          </p>
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
              {a.videoCaption} (শীঘ্রই যুক্ত হবে)
            </span>
          </div>
        </div>
      </section>

      <GrowGuideJoinForm />

      <GrowGuideSocialProofSection />

      <section className="container-page py-10">
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
          {a.benefits.map((b) => (
            <div key={b.title} className="rounded-lg border border-border bg-surface p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary">
                <Icon size={16} />
              </span>
              <h3 className="mt-3 text-sm font-bold text-foreground">{b.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface-muted py-12">
        <div className="container-page">
          <h2 className="text-center font-display text-lg font-bold text-foreground sm:text-xl">
            {a.label} রা যা বলছেন
          </h2>
          <div className="mx-auto mt-6 grid max-w-2xl gap-4 sm:grid-cols-2">
            {a.testimonials.map((t) => (
              <div key={t.name} className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary-dark">
                    {t.name.charAt(0)}
                  </span>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                </div>
                <div className="mt-2">
                  <StarRating rating={t.rating} size={13} />
                </div>
                <p className="mt-2 text-sm text-ink-soft">&ldquo;{t.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GrowGuideReviewsSection />
      <GrowGuideFaqSection />
      <GrowGuideStepsSection />
      <GrowGuideAuthorBioSection />
      <GrowGuideCommunitySection />
    </>
  );
}
