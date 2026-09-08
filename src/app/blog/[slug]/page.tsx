import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import { blogPosts, getBlogPostBySlug, getPostsByTopic, TOPICS } from "@/lib/data/blog";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ArticleThumb } from "@/components/blog/ArticleThumb";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { NewsletterSection } from "@/components/blog/NewsletterSection";
import { PremiumGate } from "@/components/blog/PremiumGate";
import { BlogReviewsSection } from "@/components/blog/BlogReviewsSection";
import { TOPIC_ICONS } from "@/components/blog/topicIcons";
import { toBengaliNumber } from "@/lib/format";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  return { title: post ? `${post.title} — GrowGear ব্লগ` : "ব্লগ — GrowGear" };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const topicMeta = TOPICS.find((t) => t.slug === post.topicSlug);
  const TopicIcon = TOPIC_ICONS[post.topicSlug];
  const related = getPostsByTopic(post.topicSlug)
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  return (
    <>
      <article className="container-page max-w-3xl py-6">
        <Breadcrumb
          items={[
            { label: "হোম", href: "/" },
            { label: "ব্লগ", href: "/blog" },
            { label: topicMeta?.label ?? post.category, href: `/blog?topic=${post.topicSlug}` },
            { label: post.title },
          ]}
        />

        <ArticleThumb
          topicSlug={post.topicSlug}
          colorFrom={post.colorFrom}
          colorTo={post.colorTo}
          className="mt-4 h-40 w-full sm:h-56"
          iconSize={44}
          premium={post.premium}
        />

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link
            href={`/blog?topic=${post.topicSlug}`}
            className="flex w-fit items-center gap-1.5 rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary-dark"
          >
            <TopicIcon size={12} />
            {post.category}
          </Link>
          {post.premium && (
            <span className="flex w-fit items-center gap-1.5 rounded-full bg-foreground px-2.5 py-1 text-xs font-medium text-background">
              <Lock size={12} /> প্রিমিয়াম লেখা
            </span>
          )}
        </div>

        <h1 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">{post.title}</h1>
        <p className="mt-2 text-sm text-ink-faint">
          {post.author} · {post.date} · {toBengaliNumber(post.readMinutes)} মিনিট পড়া
        </p>

        <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink-soft sm:text-base">
          <PremiumGate paragraphs={post.content} premium={post.premium} />
        </div>

        <Link
          href="/blog"
          className="mt-8 inline-block text-sm text-link hover:text-link-hover hover:underline"
        >
          ← সব ব্লগ পোস্ট দেখুন
        </Link>
      </article>

      {related.length > 0 && (
        <section className="container-page border-t border-border py-8">
          <h2 className="mb-4 font-display text-lg font-bold text-foreground">
            {topicMeta?.label} বিষয়ে আরও লেখা
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
            {related.map((p) => (
              <ArticleCard key={p.id} post={p} variant="vertical" />
            ))}
          </div>
        </section>
      )}

      <NewsletterSection />
      <BlogReviewsSection post={post} />
    </>
  );
}
