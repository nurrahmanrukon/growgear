"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PenLine } from "lucide-react";
import { TOPICS as ALL_TOPICS } from "@/lib/data/blog";

export function TopicNav({
  activeTopic,
  topics = ALL_TOPICS,
}: {
  activeTopic?: string;
  topics?: typeof ALL_TOPICS;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function update() {
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }
    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <nav className="border-b border-border bg-surface">
      <div className="container-page relative -mb-px">
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-none">
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
          {topics.map((topic) => (
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
        {canScrollLeft && (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-surface to-transparent" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface to-transparent" />
        )}
      </div>
    </nav>
  );
}
