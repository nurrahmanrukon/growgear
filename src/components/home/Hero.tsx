import Link from "next/link";
import { TOPICS } from "@/lib/data/blog";
import { TOPIC_ICONS } from "@/components/blog/topicIcons";
import { getProductCountByTopic } from "@/lib/data/products";
import { toBengaliNumber } from "@/lib/format";

export function Hero() {
  return (
    <section className="border-b border-border bg-surface-muted">
      <div className="container-page py-10 sm:py-14">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">GrowGear</p>
        <h1 className="mt-2 max-w-2xl font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          ভালো বই, স্মার্ট টুলস — আপনার গ্রোথের জন্য সব একসাথে
        </h1>
        <p className="mt-3 max-w-xl text-sm text-ink-soft sm:text-base">
          ৯০+ বই, ইবুক ও প্রোডাক্টিভিটি গিয়ার, সারাদেশে ক্যাশ অন ডেলিভারিতে
        </p>
        <p className="mt-3 max-w-xl border-l-2 border-primary pl-3 text-sm font-medium text-primary-dark sm:text-base">
          আমাদের লক্ষ্য — প্রতিটি মানুষকে সঠিক দিকনির্দেশনার মাধ্যমে (guided way) নিজের জীবনে এগিয়ে যেতে সাহায্য করা।
        </p>

        <p className="mt-8 text-xs font-medium uppercase tracking-wide text-ink-faint">আপনার আগ্রহ অনুযায়ী খুঁজুন</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {TOPICS.map((topic) => {
            const Icon = TOPIC_ICONS[topic.slug];
            const count = getProductCountByTopic(topic.slug);
            return (
              <Link
                key={topic.slug}
                href={`/search?topic=${topic.slug}`}
                className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface p-4 text-center transition hover:border-primary hover:shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
                  <Icon size={18} />
                </span>
                <span className="text-xs font-medium text-foreground">{topic.label}</span>
                <span className="text-[11px] text-ink-faint">{toBengaliNumber(count)} টি প্রোডাক্ট</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
