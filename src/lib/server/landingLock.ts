import fs from "fs";
import path from "path";
import { getProductBySlugResolved, getBlogPostBySlugResolved, allProductsResolved, blogPostsResolved } from "@/lib/server/contentText";

export type LockableKind = "book" | "ebook" | "gear" | "blog";
export type LandingLockMode = "off" | "full" | "curated";

export interface AllowedItemRef {
  kind: LockableKind;
  slug: string;
}

export interface LandingLockConfig {
  mode: LandingLockMode;
  allowed: AllowedItemRef[];
}

export interface LandingLockEntry {
  kind: LockableKind;
  slug: string;
  title: string;
  category: string;
  mode: LandingLockMode;
  allowedCount: number;
}

const DEFAULT_CONFIG: LandingLockConfig = { mode: "off", allowed: [] };
const FILE_PATH = path.join(process.cwd(), "data", "landing-lock.json");

const KIND_PATH: Record<LockableKind, string> = {
  book: "/books",
  ebook: "/ebooks",
  gear: "/gear",
  blog: "/blog",
};

function itemKey(kind: LockableKind, slug: string): string {
  return `${kind}:${slug}`;
}

function readStore(): Record<string, LandingLockConfig> {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(raw) as Record<string, LandingLockConfig>;
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, LandingLockConfig>) {
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(store, null, 2));
}

export function parseContentPath(pathname: string): { kind: LockableKind; slug: string } | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length !== 2) return null;
  const [segment, slug] = parts;
  const kindBySegment: Record<string, LockableKind> = { books: "book", ebooks: "ebook", gear: "gear", blog: "blog" };
  const kind = kindBySegment[segment];
  if (!kind) return null;
  return { kind, slug };
}

export function getLandingLockConfig(kind: LockableKind, slug: string): LandingLockConfig {
  const store = readStore();
  return store[itemKey(kind, slug)] ?? DEFAULT_CONFIG;
}

export function setLandingLockConfig(kind: LockableKind, slug: string, config: LandingLockConfig) {
  const store = readStore();
  if (config.mode === "off") {
    delete store[itemKey(kind, slug)];
  } else {
    store[itemKey(kind, slug)] = config;
  }
  writeStore(store);
}

export function resetLandingLockConfig(kind: LockableKind, slug: string) {
  const store = readStore();
  delete store[itemKey(kind, slug)];
  writeStore(store);
}

function titleFor(kind: LockableKind, slug: string): string | null {
  if (kind === "blog") {
    return getBlogPostBySlugResolved(slug)?.title ?? null;
  }
  const product = getProductBySlugResolved(slug);
  if (!product || product.category !== kind) return null;
  return product.title;
}

export function hrefFor(kind: LockableKind, slug: string): string {
  return `${KIND_PATH[kind]}/${slug}`;
}

export function resolveAllowedLinks(allowed: AllowedItemRef[]): { label: string; href: string }[] {
  return allowed
    .map((item) => {
      const title = titleFor(item.kind, item.slug);
      if (!title) return null;
      return { label: title, href: hrefFor(item.kind, item.slug) };
    })
    .filter((x): x is { label: string; href: string } => x !== null);
}

export function getAllLandingLockEntries(): LandingLockEntry[] {
  const store = readStore();
  const products = allProductsResolved().map((p) => ({
    kind: p.category as LockableKind,
    slug: p.slug,
    title: p.title,
    category: p.category,
  }));
  const posts = blogPostsResolved().map((post) => ({
    kind: "blog" as LockableKind,
    slug: post.slug,
    title: post.title,
    category: "blog",
  }));
  return [...products, ...posts].map((item) => {
    const config = store[itemKey(item.kind, item.slug)] ?? DEFAULT_CONFIG;
    return { ...item, mode: config.mode, allowedCount: config.allowed.length };
  });
}

export function getPickableItems(): { kind: LockableKind; slug: string; title: string; category: string }[] {
  const products = allProductsResolved().map((p) => ({
    kind: p.category as LockableKind,
    slug: p.slug,
    title: p.title,
    category: p.category,
  }));
  const posts = blogPostsResolved().map((post) => ({
    kind: "blog" as LockableKind,
    slug: post.slug,
    title: post.title,
    category: "blog",
  }));
  return [...products, ...posts];
}
