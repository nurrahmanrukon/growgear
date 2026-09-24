import { Metadata } from "next";
import Link from "next/link";
import { SEGMENTS, TOPICS } from "@/lib/data/blog";
import { blogPostsResolved, getFeaturedPostsResolved, getPostsByTopicResolved, getFeaturedProductsResolved } from "@/lib/server/contentText";
import { courses } from "@/lib/data/courses";
import { BlogTopicSlug } from "@/lib/types";
import { TopicNav } from "@/components/blog/TopicNav";
import { BlogHero } from "@/components/blog/BlogHero";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { TopicSection } from "@/components/blog/TopicSection";
import { BlogCategoryTiles } from "@/components/blog/BlogCategoryTiles";
import { NewsletterSection } from "@/components/blog/NewsletterSection";
import { Pagination } from "@/components/blog/Pagination";
import { ProductRail } from "@/components/home/ProductRail";
import { CourseTeaser } from "@/components/home/CourseTeaser";
import { TOPIC_ICONS } from "@/components/blog/topicIcons";
import { toBengaliNumber } from "@/lib/format";

export const metadata: Metadata = { title: "ব্লগ — GrowGear" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 6;
const TOPIC_PAGE_SIZE = 9;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; segment?: string; page?: string }>;
}) {
  const { topic, segment, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  if (topic) {
    const topicMeta = TOPICS.find((t) => t.slug === topic);
    if (!topicMeta) {
      return (
        <div className="container-page py-16 text-center">
          <p className="text-lg font-semibold text-foreground">এই বিষয়ের কোনো লেখা পাওয়া যায়নি।</p>
        </div>
      );
    }
    const segmentMeta = segment ? SEGMENTS[topicMeta.slug].find((s) => s.slug === segment) : undefined;
    const Icon = TOPIC_ICONS[topicMeta.slug];
    const all = getPostsByTopicResolved(topicMeta.slug, segmentMeta?.slug);
    const totalPages = Math.ceil(all.length / TOPIC_PAGE_SIZE);
    const pagePosts = all.slice((currentPage - 1) * TOPIC_PAGE_SIZE, currentPage * TOPIC_PAGE_SIZE);

    return (
      <>
        <TopicNav activeTopic={topicMeta.slug} />
        <div className="container-page py-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary">
              <Icon size={18} />
            </span>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                {topicMeta.label}
                {segmentMeta && <span className="text-ink-soft"> — {segmentMeta.label}</span>}
              </h1>
              <p className="text-xs text-ink-faint">{toBengaliNumber(all.length)} টি লেখা</p>
            </div>
          </div>

          {SEGMENTS[topicMeta.slug].length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/blog?topic=${topicMeta.slug}`}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  !segmentMeta
                    ? "border-primary bg-primary-light text-primary"
                    : "border-border bg-surface text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                সব
              </Link>
              {SEGMENTS[topicMeta.slug].map((seg) => (
                <Link
                  key={seg.slug}
                  href={`/blog?topic=${topicMeta.slug}&segment=${seg.slug}`}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    segmentMeta?.slug === seg.slug
                      ? "border-primary bg-primary-light text-primary"
                      : "border-border bg-surface text-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {seg.label}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {pagePosts.map((post) => (
              <ArticleCard key={post.id} post={post} variant="vertical" />
            ))}
          </div>

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            hrefFor={(p) =>
              `/blog?topic=${topicMeta.slug}${segmentMeta ? `&segment=${segmentMeta.slug}` : ""}${p > 1 ? `&page=${p}` : ""}`
            }
          />
        </div>
        <BlogCategoryTiles />
        <NewsletterSection />
      </>
    );
  }

  const allPosts = blogPostsResolved();
  const featured = getFeaturedPostsResolved(4);
  const totalPages = Math.ceil(allPosts.length / PAGE_SIZE);
  const pagePosts = allPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <TopicNav />
      <BlogHero featured={featured} />

      <section className="container-page py-8">
        <h2 className="mb-4 font-display text-lg font-bold text-foreground">সাম্প্রতিক লেখা</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {pagePosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          hrefFor={(p) => `/blog${p > 1 ? `?page=${p}` : ""}`}
        />
      </section>

      {TOPICS.map((t: { slug: BlogTopicSlug; label: string }) => (
        <TopicSection
          key={t.slug}
          topicSlug={t.slug}
          label={t.label}
          posts={getPostsByTopicResolved(t.slug).slice(0, 5)}
        />
      ))}

      <ProductRail title="পড়ার সাথে সাথে কিনুন" viewAllHref="/books" products={getFeaturedProductsResolved(8)} />
      <CourseTeaser courses={courses.slice(0, 6)} />
      <BlogCategoryTiles />
      <NewsletterSection />
    </>
  );
}
