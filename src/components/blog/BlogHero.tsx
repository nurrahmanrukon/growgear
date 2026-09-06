"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { BlogPost } from "@/lib/types";
import { ArticleThumb } from "./ArticleThumb";

export function BlogHero({ featured }: { featured: BlogPost[] }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [hero, ...rest] = featured;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  }

  return (
    <div className="border-b border-border bg-surface-muted">
      <div className="container-page py-8 sm:py-10">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">GrowGear ব্লগ</p>
        <h1 className="mt-1.5 font-display text-2xl font-bold text-foreground sm:text-3xl">
          বিজনেস, প্রোডাক্টিভিটি ও গ্রোথ নিয়ে ইনসাইট
        </h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          ব্যবসা, প্রোডাক্টিভিটি, ফাইন্যান্স, ব্র্যান্ডিং, মার্কেটিং ও সেলস নিয়ে প্র্যাক্টিক্যাল লেখা — প্রতি সপ্তাহে।
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex max-w-md flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="আপনার ইমেইল"
              className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            {subscribed ? "সাবস্ক্রাইব হয়েছে ✓" : "সাবস্ক্রাইব করুন"}
          </button>
        </form>
        <p className="mt-1.5 text-[11px] text-ink-faint">
          সাবস্ক্রাইব করলে আপনি GrowGear-এর নিউজলেটার পাবেন। যেকোনো সময় unsubscribe করতে পারবেন।
        </p>

        {hero && (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Link href={`/blog/${hero.slug}`} className="group lg:col-span-2">
              <ArticleThumb
                topicSlug={hero.topicSlug}
                colorFrom={hero.colorFrom}
                colorTo={hero.colorTo}
                className="aspect-[16/8] w-full"
                iconSize={40}
              />
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-primary">{hero.category}</p>
              <h2 className="mt-1 text-xl font-bold text-foreground group-hover:text-link-hover sm:text-2xl">
                {hero.title}
              </h2>
              <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">{hero.excerpt}</p>
              <p className="mt-2 text-xs text-ink-faint">
                {hero.author} · {hero.date}
              </p>
            </Link>

            <div>
              <h3 className="text-sm font-bold text-foreground">ফিচার্ড আর্টিকেল</h3>
              <div className="mt-3 space-y-4">
                {rest.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group flex gap-3">
                    <ArticleThumb
                      topicSlug={post.topicSlug}
                      colorFrom={post.colorFrom}
                      colorTo={post.colorTo}
                      className="h-16 w-20 shrink-0"
                      iconSize={18}
                    />
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-link-hover">
                        {post.title}
                      </p>
                      <p className="mt-1 text-[11px] text-ink-faint">{post.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
