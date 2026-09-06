import Link from "next/link";
import { TOPICS, getPostsByTopic } from "@/lib/data/blog";
import { TOPIC_ICONS } from "./topicIcons";
import { toBengaliNumber } from "@/lib/format";

export function BlogCategoryTiles() {
  return (
    <section className="border-y border-border bg-surface-muted py-8">
      <div className="container-page">
        <h2 className="text-center font-display text-lg font-bold text-foreground sm:text-xl">
          বিষয় অনুযায়ী ব্লগ দেখুন
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {TOPICS.map((topic) => {
            const Icon = TOPIC_ICONS[topic.slug];
            const count = getPostsByTopic(topic.slug).length;
            return (
              <Link
                key={topic.slug}
                href={`/blog?topic=${topic.slug}`}
                className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface p-4 text-center transition hover:border-primary hover:shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
                  <Icon size={18} />
                </span>
                <span className="text-xs font-medium text-foreground">{topic.label}</span>
                <span className="text-[11px] text-ink-faint">{toBengaliNumber(count)} টি লেখা</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
