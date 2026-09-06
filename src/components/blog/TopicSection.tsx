import Link from "next/link";
import { BlogPost, BlogTopicSlug } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";
import { TOPIC_ICONS } from "./topicIcons";

export function TopicSection({
  topicSlug,
  label,
  posts,
}: {
  topicSlug: BlogTopicSlug;
  label: string;
  posts: BlogPost[];
}) {
  const Icon = TOPIC_ICONS[topicSlug];
  if (posts.length === 0) return null;

  return (
    <section className="container-page py-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
          <Icon size={18} className="text-primary" />
          {label}
        </h2>
        <Link href={`/blog?topic=${topicSlug}`} className="text-sm text-link hover:text-link-hover">
          সব দেখুন →
        </Link>
      </div>
      <div className="-mx-1 flex gap-4 overflow-x-auto pb-1 scrollbar-none sm:mx-0">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} variant="vertical" />
        ))}
      </div>
    </section>
  );
}
