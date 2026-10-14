import { NextRequest, NextResponse } from "next/server";
import { blogPostsResolved } from "@/lib/server/contentText";
import { searchPosts, relevantTopicsForQuery } from "@/lib/data/blog";

// Public, read-only — powers the live "while you type" suggestions in the
// blog search bar. Full search-results pages filter directly server-side
// instead of calling this.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ posts: [], topics: [] });

  const all = blogPostsResolved();
  const posts = searchPosts(all, q)
    .slice(0, 6)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      topicSlug: p.topicSlug,
    }));
  const topics = relevantTopicsForQuery(all, q, 5);

  return NextResponse.json({ posts, topics });
}
