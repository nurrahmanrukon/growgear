import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/lib/types";
import { PERSON_NAMES, hashString } from "@/lib/data/social";
import { getProductBySlug } from "@/lib/data/products";
import { createMultiImageStore } from "./multiImageStore";

export type SocialPlatform = "facebook" | "instagram" | "whatsapp";

export interface SocialProofPost {
  id: string;
  name: string;
  platform: SocialPlatform;
  text: string;
  likes: number;
  hoursAgo: number;
  imageId?: string;
}

export interface ResolvedSocialProofPost {
  id: string;
  name: string;
  platform: SocialPlatform;
  text: string;
  likes: number;
  hoursAgo: number;
  imageUrl?: string;
}

export const MAX_POSTS = 12;
export const MAX_IMAGE_BYTES = 6 * 1024 * 1024; // 6MB

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "social-proof-posts.json");

const imageStore = createMultiImageStore({
  storeFile: "social-proof-images.json",
  mediaDirName: "social-proof",
  urlPrefix: "/api/media/social-proof",
  maxBytes: MAX_IMAGE_BYTES,
  maxCount: MAX_POSTS,
  maxCountError: `সর্বোচ্চ ${MAX_POSTS}টি স্ক্রিনশট যোগ করা যাবে`,
  validateSlug: (slug) => Boolean(getProductBySlug(slug)),
  invalidSlugError: "প্রোডাক্ট পাওয়া যায়নি",
});

type Store = Record<string, SocialProofPost[]>;

function readStore(): Store {
  try {
    const data = JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
    return data && typeof data === "object" && !Array.isArray(data) ? data : {};
  } catch {
    return {};
  }
}

function writeStore(data: Store) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
}

export function getPosts(slug: string): SocialProofPost[] {
  return readStore()[slug] ?? [];
}

export function isCustomized(slug: string): boolean {
  return getPosts(slug).length > 0;
}

export function setPosts(slug: string, posts: SocialProofPost[]) {
  if (!getProductBySlug(slug)) throw new Error("প্রোডাক্ট পাওয়া যায়নি");
  if (posts.length > MAX_POSTS) throw new Error(`সর্বোচ্চ ${MAX_POSTS}টি পোস্ট রাখা যাবে`);
  for (const post of posts) {
    if (!post.name.trim()) throw new Error("প্রতিটি পোস্টে নাম আবশ্যক");
    if (!post.text.trim()) throw new Error("প্রতিটি পোস্টে কমেন্ট টেক্সট আবশ্যক");
    if (!["facebook", "instagram", "whatsapp"].includes(post.platform)) throw new Error("অবৈধ প্ল্যাটফর্ম");
  }

  // Remove uploaded images that are no longer referenced by any post, so they don't
  // linger on disk once a post is deleted or its image is swapped for a new upload.
  const keepImageIds = new Set(posts.map((p) => p.imageId).filter(Boolean) as string[]);
  for (const entry of imageStore.getEntries(slug)) {
    if (!keepImageIds.has(entry.id)) {
      try {
        imageStore.removeEntry(slug, entry.id);
      } catch {
        // already gone — ignore
      }
    }
  }

  const store = readStore();
  store[slug] = posts;
  writeStore(store);
}

export function resetPosts(slug: string) {
  const store = readStore();
  if (slug in store) {
    delete store[slug];
    writeStore(store);
  }
  for (const entry of imageStore.getEntries(slug)) {
    try {
      imageStore.removeEntry(slug, entry.id);
    } catch {
      // already gone — ignore
    }
  }
}

export function handleImageUpload(slug: string, req: NextRequest) {
  return imageStore.handleUpload(slug, req);
}

export function serveImageFile(slug: string, id: string): NextResponse {
  return imageStore.serveFile(slug, id);
}

function imageUrl(slug: string, imageId: string): string {
  const entry = imageStore.getEntries(slug).find((e) => e.id === imageId);
  if (!entry) return "";
  return `/api/media/social-proof/${slug}/${imageId}?v=${encodeURIComponent(entry.uploadedAt)}`;
}

export function getPostImageUrl(slug: string, imageId: string): string {
  return imageUrl(slug, imageId);
}

/** The auto-generated placeholder shown for a product that has no admin-curated posts yet
 *  — deterministic per product so the same "demo" content shows consistently until replaced. */
const DEMO_COMMENT_TEMPLATES: ((title: string) => string)[] = [
  (t) => `এইমাত্র "${t}" হাতে পেলাম, প্যাকেজিং টা অসাধারণ ছিল! 😍`,
  () => `অনেকদিন ধরে এমন কিছু খুঁজছিলাম, অবশেষে পেয়ে গেলাম। দারুণ! 🔥`,
  (t) => `যারা জিজ্ঞেস করেছিলেন "${t}" কেমন — হাতে পেয়ে বলছি, একদম worth it 👍`,
  () => `কালকে অর্ডার করেছিলাম, আজকেই হাতে পেয়ে গেছি। এত দ্রুত ডেলিভারি আশা করিনি!`,
  () => `প্রথমে একটু সন্দেহ ছিল, কিন্তু এখন পুরাই সন্তুষ্ট। সবাইকে রেকমেন্ড করবো ❤️`,
  (t) => `"${t}" নিয়ে আমার রিভিউ — সত্যিই দাম উসুল, কোনো কমপ্লেইন নাই।`,
];
const DEMO_POST_COUNT = 6;

function demoPosts(product: Product): ResolvedSocialProofPost[] {
  const base = hashString(product.id + "social");
  const platforms: SocialPlatform[] = ["facebook", "instagram", "whatsapp"];
  return Array.from({ length: DEMO_POST_COUNT }).map((_, i) => {
    const seed = base + i * 41;
    return {
      id: `demo-${i}`,
      name: PERSON_NAMES[seed % PERSON_NAMES.length],
      platform: platforms[i % platforms.length],
      text: DEMO_COMMENT_TEMPLATES[Math.floor(seed / 7) % DEMO_COMMENT_TEMPLATES.length](product.title),
      likes: 8 + (seed % 140),
      hoursAgo: 1 + (seed % 20),
    };
  });
}

/** Real admin-curated posts if any exist for this product, else the deterministic demo
 *  placeholder — so every product page always has something to show. */
export function getResolvedSocialProofPosts(product: Product): ResolvedSocialProofPost[] {
  const curated = getPosts(product.slug);
  if (curated.length === 0) return demoPosts(product);
  return curated.map((post) => ({
    id: post.id,
    name: post.name,
    platform: post.platform,
    text: post.text,
    likes: post.likes,
    hoursAgo: post.hoursAgo,
    imageUrl: post.imageId ? imageUrl(product.slug, post.imageId) || undefined : undefined,
  }));
}
