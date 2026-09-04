import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { blogPosts, getBlogPostBySlug } from "@/lib/data/blog";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
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

  return (
    <article className="container-page max-w-3xl py-6">
      <Breadcrumb
        items={[
          { label: "হোম", href: "/" },
          { label: "ব্লগ", href: "/blog" },
          { label: post.title },
        ]}
      />

      <div
        className="mt-4 flex h-40 items-center justify-center rounded-lg text-lg font-semibold text-white/90 sm:h-56"
        style={{ background: `linear-gradient(135deg, ${post.colorFrom}, ${post.colorTo})` }}
      >
        {post.category}
      </div>

      <h1 className="mt-5 text-2xl font-bold text-[#0f1111] sm:text-3xl">{post.title}</h1>
      <p className="mt-2 text-sm text-neutral-500">
        {post.author} · {post.date} · {toBengaliNumber(post.readMinutes)} মিনিট পড়া
      </p>

      <div className="mt-5 space-y-4 text-sm leading-relaxed text-neutral-700 sm:text-base">
        {post.content.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <Link
        href="/blog"
        className="mt-8 inline-block text-sm text-link hover:text-link-hover hover:underline"
      >
        ← সব ব্লগ পোস্ট দেখুন
      </Link>
    </article>
  );
}
