import { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/data/blog";
import { toBengaliNumber } from "@/lib/format";

export const metadata: Metadata = { title: "ব্লগ — GrowGear" };

export default function BlogPage() {
  return (
    <div className="container-page py-6">
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">ব্লগ</h1>
      <p className="mt-1 text-sm text-neutral-600">
        মাইন্ডসেট, প্রোডাক্টিভিটি ও ক্যারিয়ার নিয়ে নিয়মিত লেখা
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group rounded-lg border border-border bg-surface p-3 transition hover:shadow-md"
          >
            <div
              className="flex h-32 items-center justify-center rounded-md p-3 text-center text-sm font-medium text-white/90"
              style={{ background: `linear-gradient(135deg, ${post.colorFrom}, ${post.colorTo})` }}
            >
              {post.category}
            </div>
            <h2 className="mt-2.5 line-clamp-2 text-sm font-semibold text-foreground group-hover:text-link-hover">
              {post.title}
            </h2>
            <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{post.excerpt}</p>
            <p className="mt-2 text-[11px] text-neutral-400">
              {post.author} · {post.date} · {toBengaliNumber(post.readMinutes)} মিনিট পড়া
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
