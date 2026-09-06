import Link from "next/link";
import { TOPICS } from "@/lib/data/blog";

export function TopicNav({ activeTopic }: { activeTopic?: string }) {
  return (
    <nav className="border-b border-border bg-surface">
      <div className="container-page -mb-px flex gap-5 overflow-x-auto scrollbar-none">
        <Link
          href="/blog"
          className={`shrink-0 border-b-2 py-3 text-sm font-medium ${
            !activeTopic
              ? "border-primary text-foreground"
              : "border-transparent text-ink-soft hover:text-foreground"
          }`}
        >
          সব লেখা
        </Link>
        {TOPICS.map((topic) => (
          <Link
            key={topic.slug}
            href={`/blog?topic=${topic.slug}`}
            className={`shrink-0 border-b-2 py-3 text-sm font-medium ${
              activeTopic === topic.slug
                ? "border-primary text-foreground"
                : "border-transparent text-ink-soft hover:text-foreground"
            }`}
          >
            {topic.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
