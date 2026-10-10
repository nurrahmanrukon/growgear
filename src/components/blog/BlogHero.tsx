"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Mail, TrendingUp } from "lucide-react";
import { BlogPost } from "@/lib/types";
import { blogPosts, getBlogReadCount } from "@/lib/data/blog";
import { toBengaliNumber } from "@/lib/format";
import { ArticleThumb } from "./ArticleThumb";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const giftPost = blogPosts.find((p) => p.premium) ?? blogPosts[0];

export function BlogHero({ popular }: { popular: BlogPost[] }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [subscribedTo, setSubscribedTo] = useState<string | null>(null);
  const [top, ...rest] = popular;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    setSubscribedTo(email.trim());
  }

  return (
    <div className="border-b border-border bg-surface-muted">
      <div className="container-page py-8 sm:py-10">
        <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-primary">
          <TrendingUp size={13} /> সবচেয়ে জনপ্রিয় লেখা
        </p>
        <h1 className="mt-1.5 font-display text-2xl font-bold text-foreground sm:text-3xl">
          যা পাঠকরা সবচেয়ে বেশি পড়ছেন
        </h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          এখান থেকেই শুরু করুন — আমাদের পাঠকদের মধ্যে সবচেয়ে জনপ্রিয় লেখাগুলো।
        </p>

        {top && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Link href={`/blog/${top.slug}`} className="group lg:col-span-2">
              <ArticleThumb
                topicSlug={top.topicSlug}
                colorFrom={top.colorFrom}
                colorTo={top.colorTo}
                imageUrl={top.coverImageUrl}
                className="aspect-[16/8] w-full"
                iconSize={40}
                premium={top.premium}
              />
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-primary">{top.category}</p>
              <h2 className="mt-1 text-xl font-bold text-foreground group-hover:text-link-hover sm:text-2xl">
                {top.title}
              </h2>
              <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">{top.excerpt}</p>
              <p className="mt-2 text-xs text-ink-faint">
                {top.author} · {top.date} ·{" "}
                <span className="font-medium text-primary">
                  {toBengaliNumber(getBlogReadCount(top))} বার পড়া হয়েছে
                </span>
              </p>
            </Link>

            <div>
              <h3 className="text-sm font-bold text-foreground">আরও জনপ্রিয় লেখা</h3>
              <div className="mt-3 space-y-4">
                {rest.map((post, i) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group flex gap-3">
                    <span className="flex w-7 shrink-0 items-center justify-center font-display text-lg font-bold text-ink-faint/60">
                      {toBengaliNumber(i + 2)}
                    </span>
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-link-hover">
                        {post.title}
                      </p>
                      <p className="mt-1 text-[11px] text-ink-faint">
                        {toBengaliNumber(getBlogReadCount(post))} বার পড়া হয়েছে
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col items-start gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">🎁 নিউজলেটার সাবস্ক্রাইব করুন</p>
            <p className="mt-0.5 text-xs text-ink-soft">সাবস্ক্রাইব করলে একটি প্রিমিয়াম ব্লগ সাথে সাথে আপনার ইমেইলে পাঠিয়ে দেওয়া হবে!</p>
          </div>
          <form onSubmit={handleSubmit} className="flex w-full max-w-md shrink-0 flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                inputMode="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(false);
                }}
                placeholder="আপনার ইমেইল"
                className={`w-full rounded-md border bg-surface-muted py-2 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-primary ${
                  emailError ? "border-price" : "border-border"
                }`}
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-md bg-cta px-4 py-2 text-sm font-semibold text-white hover:bg-cta-dark"
            >
              {subscribedTo ? "সাবস্ক্রাইব হয়েছে ✓" : "সাবস্ক্রাইব করুন"}
            </button>
          </form>
        </div>
        {emailError && <p className="mt-1.5 text-xs font-medium text-price">সঠিক ইমেইল ঠিকানা দিন</p>}
        {subscribedTo && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-primary">
            <CheckCircle2 size={13} /> &ldquo;{giftPost.title}&rdquo; প্রিমিয়াম ব্লগটি {subscribedTo} ঠিকানায় পাঠানো হয়েছে — ইনবক্স চেক করুন!
          </p>
        )}
      </div>
    </div>
  );
}
