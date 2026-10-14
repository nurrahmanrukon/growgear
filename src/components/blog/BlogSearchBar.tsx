"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { BlogTopicSlug } from "@/lib/types";
import { TOPIC_ICONS } from "./topicIcons";

interface SuggestedPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  topicSlug: BlogTopicSlug;
}

interface SuggestedTopic {
  slug: BlogTopicSlug;
  label: string;
  description: string;
  count: number;
}

export function BlogSearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState<SuggestedPost[]>([]);
  const [topics, setTopics] = useState<SuggestedTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/blog-search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setPosts(data.posts ?? []);
        setTopics(data.topics ?? []);
      } catch {
        setPosts([]);
        setTopics([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  function goToResults(q: string) {
    setOpen(false);
    router.push(q.trim() ? `/blog?q=${encodeURIComponent(q.trim())}` : "/blog");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    goToResults(query);
  }

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={wrapRef} className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="বিষয় বা লেখা সার্চ করুন — যেমন: বাজেট, নেতৃত্ব, ফোকাস..."
          className="w-full rounded-md border border-border bg-surface py-2.5 pl-9 pr-9 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            aria-label="সার্চ মুছুন"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-foreground"
          >
            <X size={15} />
          </button>
        )}
      </form>

      {showDropdown && (
        <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
          {loading && topics.length === 0 && posts.length === 0 ? (
            <p className="px-4 py-3 text-sm text-ink-faint">খোঁজা হচ্ছে...</p>
          ) : topics.length === 0 && posts.length === 0 ? (
            <p className="px-4 py-3 text-sm text-ink-faint">কোনো ফলাফল পাওয়া যায়নি।</p>
          ) : (
            <>
              {topics.length > 0 && (
                <div className="border-b border-border p-3">
                  <p className="px-1 text-[11px] font-medium uppercase tracking-wide text-ink-faint">প্রাসঙ্গিক বিষয়</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {topics.map((t) => {
                      const Icon = TOPIC_ICONS[t.slug];
                      return (
                        <Link
                          key={t.slug}
                          href={`/blog?topic=${t.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
                        >
                          <Icon size={12} /> {t.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {posts.length > 0 && (
                <div className="max-h-72 overflow-y-auto">
                  {posts.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      onClick={() => setOpen(false)}
                      className="block border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-surface-muted"
                    >
                      <p className="line-clamp-1 text-sm font-medium text-foreground">{p.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-ink-faint">{p.excerpt}</p>
                    </Link>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => goToResults(query)}
                className="block w-full border-t border-border bg-surface-muted px-4 py-2.5 text-center text-xs font-medium text-primary hover:text-primary-dark"
              >
                &ldquo;{query.trim()}&rdquo; এর সব ফলাফল দেখুন →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
