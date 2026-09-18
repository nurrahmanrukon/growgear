import fs from "fs";
import path from "path";
import { blogPosts } from "@/lib/data/blog";

export interface FormatMeta {
  key: string;
  label: string;
  note?: string;
}

export const FORMAT_CATALOG: FormatMeta[] = [
  { key: "text", label: "টেক্সট" },
  { key: "audio", label: "অডিও" },
  { key: "both", label: "উভয়ই (কম্বো অফার)", note: "শুধু প্রিমিয়াম লেখায় প্রযোজ্য" },
];

const VALID_KEYS = new Set(FORMAT_CATALOG.map((f) => f.key));
const STORE_PATH = path.join(process.cwd(), "data", "blog-formats.json");

interface StoredEntry {
  hidden?: string[];
}

function sanitizeHidden(hidden: string[]): string[] {
  return Array.from(new Set(hidden.filter((k) => VALID_KEYS.has(k))));
}

function readStore(): Record<string, string[]> {
  let raw: Record<string, StoredEntry | string[]>;
  try {
    raw = JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return {};
  }
  const out: Record<string, string[]> = {};
  for (const [slug, value] of Object.entries(raw)) {
    if (Array.isArray(value)) {
      // legacy shape: list of ALLOWED formats (text/audio only) — invert to hidden
      out[slug] = sanitizeHidden(["text", "audio"].filter((k) => !value.includes(k)));
    } else if (value && Array.isArray(value.hidden)) {
      out[slug] = sanitizeHidden(value.hidden);
    }
  }
  return out;
}

function writeStore(store: Record<string, string[]>) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  const out: Record<string, StoredEntry> = {};
  for (const [slug, hidden] of Object.entries(store)) {
    if (hidden.length > 0) out[slug] = { hidden };
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(out, null, 2));
}

export function getHiddenFormats(slug: string): string[] {
  const store = readStore();
  return sanitizeHidden(store[slug] ?? []);
}

export function isFormatsCustomized(slug: string): boolean {
  return getHiddenFormats(slug).length > 0;
}

export function getAllBlogFormats(): {
  slug: string;
  title: string;
  topicSlug: string;
  premium: boolean;
  hidden: string[];
}[] {
  const store = readStore();
  return blogPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    topicSlug: post.topicSlug,
    premium: Boolean(post.premium),
    hidden: sanitizeHidden(store[post.slug] ?? []),
  }));
}

export function setHiddenFormats(slug: string, hidden: string[]) {
  if (!blogPosts.some((p) => p.slug === slug)) throw new Error("পোস্ট পাওয়া যায়নি");
  const clean = sanitizeHidden(hidden);
  if (clean.includes("text") && clean.includes("audio")) {
    throw new Error("টেক্সট আর অডিও দুটোই একসাথে লুকানো যাবে না — অন্তত একটা ফরম্যাট দৃশ্যমান রাখতে হবে");
  }
  const store = readStore();
  store[slug] = clean;
  writeStore(store);
}

export function resetBlogFormats(slug: string) {
  const store = readStore();
  delete store[slug];
  writeStore(store);
}
