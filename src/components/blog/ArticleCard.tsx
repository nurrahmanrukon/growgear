import Link from "next/link";
import { BlogPost } from "@/lib/types";
import { ArticleThumb } from "./ArticleThumb";

export function ArticleCard({
  post,
  variant = "horizontal",
}: {
  post: BlogPost;
  variant?: "horizontal" | "vertical";
}) {
  if (variant === "vertical") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group w-48 shrink-0 sm:w-56"
      >
        <ArticleThumb
          topicSlug={post.topicSlug}
          colorFrom={post.colorFrom}
          colorTo={post.colorTo}
          className="aspect-video w-full"
          iconSize={26}
          premium={post.premium}
        />
        <p className="mt-2.5 line-clamp-2 text-sm font-medium text-foreground group-hover:text-link-hover">
          {post.title}
        </p>
        <p className="mt-1 text-xs text-ink-faint">
          {post.author} · {post.date}
        </p>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group flex gap-3">
      <ArticleThumb
        topicSlug={post.topicSlug}
        colorFrom={post.colorFrom}
        colorTo={post.colorTo}
        className="h-20 w-24 sm:h-24 sm:w-28"
        iconSize={22}
        premium={post.premium}
      />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-link-hover">
          {post.title}
        </p>
        <p className="mt-1 text-xs text-ink-faint">
          {post.author} · {post.date}
        </p>
      </div>
    </Link>
  );
}
