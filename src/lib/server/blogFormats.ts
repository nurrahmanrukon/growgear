import fs from "fs";
import path from "path";
import { blogPosts } from "@/lib/data/blog";

export type ContentFormat = "text" | "audio";

const STORE_PATH = path.join(process.cwd(), "data", "blog-formats.json");
const DEFAULT_FORMATS: ContentFormat[] = ["text", "audio"];

function readStore(): Record<string, ContentFormat[]> {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function writeStore(data: Record<string, ContentFormat[]>) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
}

export function getBlogFormats(slug: string): ContentFormat[] {
  const store = readStore();
  return store[slug] ?? DEFAULT_FORMATS;
}

export function getAllBlogFormats(): { slug: string; title: string; topicSlug: string; formats: ContentFormat[] }[] {
  const store = readStore();
  return blogPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    topicSlug: post.topicSlug,
    formats: store[post.slug] ?? DEFAULT_FORMATS,
  }));
}

export function setBlogFormats(slug: string, formats: ContentFormat[]) {
  if (formats.length === 0) throw new Error("অন্তত একটি ফরম্যাট বেছে নিতে হবে");
  if (!blogPosts.some((p) => p.slug === slug)) throw new Error("পোস্ট পাওয়া যায়নি");
  const store = readStore();
  store[slug] = formats;
  writeStore(store);
}
