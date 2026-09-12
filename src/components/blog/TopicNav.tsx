import Link from "next/link";
import { PenLine } from "lucide-react";
import { SEGMENTS, TOPICS } from "@/lib/data/blog";
import { BlogTopicSlug } from "@/lib/types";

export function TopicNav({ activeTopic, activeSegment }: { activeTopic?: string; activeSegment?: string }) {
  const segments = activeTopic ? SEGMENTS[activeTopic as BlogTopicSlug] : undefined;

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
        <Link
          href="/blog/author-note"
          className="ml-auto flex shrink-0 items-center gap-1.5 border-b-2 border-transparent py-3 text-sm font-medium text-primary hover:text-primary-dark"
        >
          <PenLine size={14} /> লেখকের কথা
        </Link>
      </div>

      {segments && segments.length > 0 && (
        <div className="border-t border-border bg-surface-muted">
          <div className="container-page flex items-center gap-4 overflow-x-auto py-2 text-xs scrollbar-none">
            <Link
              href={`/blog?topic=${activeTopic}`}
              className={`shrink-0 font-medium ${
                !activeSegment ? "text-primary" : "text-ink-soft hover:text-foreground"
              }`}
            >
              সব
            </Link>
            {segments.map((seg) => (
              <Link
                key={seg.slug}
                href={`/blog?topic=${activeTopic}&segment=${seg.slug}`}
                className={`shrink-0 font-medium ${
                  activeSegment === seg.slug ? "text-primary" : "text-ink-soft hover:text-foreground"
                }`}
              >
                {seg.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
