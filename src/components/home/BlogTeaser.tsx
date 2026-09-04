import Link from "next/link";
import { Newspaper } from "lucide-react";
import { BlogPost } from "@/lib/types";

export function BlogTeaser({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="container-page py-6">
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[#0f1111]">
            <Newspaper size={20} className="text-navy-light" /> ব্লগ থেকে
          </h2>
          <Link href="/blog" className="text-sm text-link hover:text-link-hover hover:underline">
            সব পোস্ট দেখুন →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group rounded-lg border border-border p-3 transition hover:shadow-md"
            >
              <div
                className="flex h-28 items-center justify-center rounded-md p-3 text-center text-sm font-medium text-white/90"
                style={{ background: `linear-gradient(135deg, ${post.colorFrom}, ${post.colorTo})` }}
              >
                {post.category}
              </div>
              <p className="mt-2 line-clamp-2 text-sm font-medium text-[#0f1111] group-hover:text-link-hover">
                {post.title}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{post.excerpt}</p>
              <p className="mt-1.5 text-[11px] text-neutral-400">
                {post.author} · {post.date}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
