import Link from "next/link";
import { BlogPost } from "@/lib/types";
import { toBengaliNumber } from "@/lib/format";
import { ArticleThumb } from "./ArticleThumb";

function MetaLine({ post }: { post: BlogPost }) {
  return (
    <p className="mt-1 text-xs text-ink-faint">
      {post.author} · {post.date} ·{" "}
      <span className="font-medium text-primary">{toBengaliNumber(post.readCount ?? 0)} বার পড়া হয়েছে</span>
    </p>
  );
}

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
          imageUrl={post.coverImageUrl}
          className="aspect-video w-full"
          iconSize={26}
          premium={post.premium}
        />
        <p className="mt-2.5 line-clamp-2 text-sm font-medium text-foreground group-hover:text-link-hover">
          {post.title}
        </p>
        <MetaLine post={post} />
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group flex gap-3">
      <ArticleThumb
        topicSlug={post.topicSlug}
        colorFrom={post.colorFrom}
        colorTo={post.colorTo}
        imageUrl={post.coverImageUrl}
        className="h-20 w-24 sm:h-24 sm:w-28"
        iconSize={22}
        premium={post.premium}
      />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-link-hover">
          {post.title}
        </p>
        <MetaLine post={post} />
      </div>
    </Link>
  );
}
