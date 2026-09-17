import { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { GrowGuideJoinForm } from "@/components/growguide/GrowGuideJoinForm";
import { GrowGuideVideoSection } from "@/components/growguide/GrowGuideVideoSection";
import { GrowGuidePastSessionsSection } from "@/components/growguide/GrowGuidePastSessionsSection";
import { GrowGuideFaqSection } from "@/components/growguide/GrowGuideFaqSection";
import { GROWGUIDE_AUDIENCE } from "@/lib/data/growguideAudience";

export const metadata: Metadata = { title: "GrowGuide — GrowGear" };

const STEPS = [
  {
    title: "ফ্রি-তে সেগমেন্টে জয়েন করুন",
    body: "আপনার ইমেইল দিয়ে চলতি সেগমেন্টে যুক্ত হন — সম্পূর্ণ বিনামূল্যে, কোনো পেমেন্ট লাগবে না।",
  },
  {
    title: "৫০০ জন হলেই ওয়েবিনার শুরু",
    body: "প্রতিটি সেগমেন্টে ৫০০ জন যুক্ত হওয়ার সাথে সাথে সেই সেগমেন্টের জন্য লাইভ ওয়েবিনারের সময়সূচি ইমেইলে পাঠানো হবে।",
  },
  {
    title: "ওয়েবিনারে ফ্রি রিসোর্স পাবেন",
    body: "নূর রহমান নিজে লাইভ ওয়েবিনারে জীবনে গাইডেড ওয়েতে গ্রো করার বাস্তবসম্মত রিসোর্স ও ধাপে ধাপে পরিকল্পনা শেয়ার করবেন।",
  },
  {
    title: "প্রাইভেট কমিউনিটি গ্রুপে যুক্ত হন",
    body: "ওয়েবিনার শেষে একটি প্রাইভেট কমিউনিটি গ্রুপে যুক্ত হবেন, যেখানে সবাই মিলে একে অপরকে সাহায্য করবে।",
  },
];

export default function GrowGuidePage() {
  return (
    <>
      <div className="container-page pt-4">
        <Breadcrumb items={[{ label: "হোম", href: "/" }, { label: "GrowGuide" }]} />
      </div>

      <section className="border-b border-border bg-surface-muted">
        <div className="container-page py-10 text-center sm:py-14">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">GrowGuide</p>
          <h1 className="mx-auto mt-2 max-w-2xl font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            শিক্ষার্থী, প্রফেশনাল ও উদ্যোক্তাদের গাইডেড ওয়েতে গ্রো করতে সাহায্য করি
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft sm:text-base">
            সম্পূর্ণ ফ্রি লাইভ ওয়েবিনার ও প্রাইভেট কমিউনিটির মাধ্যমে — নূর রহমান স্বয়ং হোস্ট করেন
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
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
        </div>
      </section>

      <GrowGuideVideoSection audience={GROWGUIDE_AUDIENCE} />
      <GrowGuidePastSessionsSection />
      <GrowGuideFaqSection />

      <section className="container-page py-10">
        <h2 className="text-center font-display text-xl font-bold text-foreground sm:text-2xl">যেভাবে কাজ করে</h2>
        <div className="mx-auto mt-7 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-lg border border-border bg-surface p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary-dark">
                {i + 1}
              </span>
              <h3 className="mt-3 text-sm font-bold text-foreground">{s.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface-muted py-10">
        <div className="container-page">
          <div className="mx-auto max-w-md text-center">
            <span
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
              style={{ background: "linear-gradient(135deg, #2a4570, #16294a)" }}
            >
              নূ
            </span>
            <h2 className="mt-3 font-display text-lg font-bold text-foreground">নূর রহমান</h2>
            <p className="text-sm text-ink-faint">প্রতিষ্ঠাতা, GrowGear · GrowGuide হোস্ট</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              প্রতিটি ওয়েবিনারে নূর রহমান সরাসরি নিজে অংশগ্রহণকারীদের সাথে কথা বলেন, তাদের প্রশ্নের উত্তর দেন এবং জীবনে
              গাইডেড ওয়েতে গ্রো করার জন্য বাস্তবসম্মত, ধাপে ধাপে দিকনির্দেশনা দেন — সম্পূর্ণ ফ্রি-তে।
            </p>
          </div>
        </div>
      </section>

      <GrowGuideJoinForm />

      <section className="container-page py-10">
        <div className="mx-auto max-w-2xl rounded-lg border border-border bg-surface p-6 text-center">
          <MessageCircle className="mx-auto text-primary" size={26} />
          <h2 className="mt-3 font-display text-lg font-bold text-foreground">প্রাইভেট কমিউনিটি গ্রুপ</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            ওয়েবিনার শেষে আপনাকে একটি প্রাইভেট কমিউনিটি গ্রুপে যুক্ত করা হবে — সম্পূর্ণ ফ্রি। এখানে নূর রহমানসহ সবাই একে
            অপরকে সাহায্য করে, অভিজ্ঞতা শেয়ার করে এবং একসাথে জীবনে গ্রো করার পথে এগিয়ে যায়।
          </p>
        </div>
      </section>
    </>
  );
}
