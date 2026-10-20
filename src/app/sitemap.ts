import type { MetadataRoute } from "next";
import { allProducts, categoryMeta } from "@/lib/data/products";
import { blogPosts } from "@/lib/data/blog";

// Set NEXT_PUBLIC_SITE_URL to the real production domain once it's known — this
// placeholder only matters until then.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://growgear.example.com").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/books`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/ebooks`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/gear`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/course`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/decisionmaster`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const productPages: MetadataRoute.Sitemap = allProducts
    .filter((p) => p.inStock)
    .map((p) => ({
      url: `${SITE_URL}${categoryMeta[p.category].path}/${p.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
