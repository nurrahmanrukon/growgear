import fs from "fs";
import path from "path";
import { allProducts, getProductBySlug, getRelatedProducts, getBestSellers, getFeaturedProducts } from "@/lib/data/products";
import { books } from "@/lib/data/books";
import { ebooks } from "@/lib/data/ebooks";
import { gear } from "@/lib/data/gear";
import { blogPosts, getBlogPostBySlug, getPostsByTopic, getFeaturedPosts } from "@/lib/data/blog";
import { Product, BlogPost, ProductCategory } from "@/lib/types";
import { getBlogImageUrl, getProductImageUrl, getProductVideoUrl } from "@/lib/server/mediaAssets";

const STORE_PATH = path.join(process.cwd(), "data", "content-text.json");

export interface ProductTextOverride {
  title?: string;
  author?: string;
  shortDescription?: string;
  description?: string;
  bullets?: string[];
  badge?: string;
}

export interface BlogTextOverride {
  title?: string;
  excerpt?: string;
  content?: string[];
  author?: string;
  category?: string;
}

interface Store {
  products?: Record<string, ProductTextOverride>;
  blog?: Record<string, BlogTextOverride>;
}

function readStore(): Store {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function cleanStrings(arr: string[] | undefined): string[] | undefined {
  if (!arr) return undefined;
  const cleaned = arr.map((s) => s.trim()).filter(Boolean);
  return cleaned.length > 0 ? cleaned : undefined;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export function getProductOverride(slug: string): ProductTextOverride {
  return readStore().products?.[slug] ?? {};
}

export function isProductTextCustomized(slug: string): boolean {
  return Object.keys(getProductOverride(slug)).length > 0;
}

function mergeProduct(product: Product, override: ProductTextOverride): Product {
  const merged = Object.keys(override).length === 0 ? product : {
    ...product,
    title: override.title || product.title,
    author: override.author || product.author,
    shortDescription: override.shortDescription || product.shortDescription,
    description: override.description || product.description,
    bullets: override.bullets && override.bullets.length > 0 ? override.bullets : product.bullets,
    badge: override.badge ?? product.badge,
  };
  return {
    ...merged,
    coverImageUrl: getProductImageUrl(product.slug),
    videoUrl: getProductVideoUrl(product.slug),
  };
}

export function resolveProduct(product: Product): Product {
  return mergeProduct(product, getProductOverride(product.slug));
}

export function resolveProducts(products: Product[]): Product[] {
  const store = readStore().products ?? {};
  return products.map((p) => mergeProduct(p, store[p.slug] ?? {}));
}

export function getProductBySlugResolved(slug: string): Product | undefined {
  const product = getProductBySlug(slug);
  return product ? resolveProduct(product) : undefined;
}

export function getRelatedProductsResolved(product: Product, limit = 6): Product[] {
  return resolveProducts(getRelatedProducts(product, limit));
}

export function getBestSellersResolved(limit = 8): Product[] {
  return resolveProducts(getBestSellers(limit));
}

export function getFeaturedProductsResolved(limit = 8): Product[] {
  return resolveProducts(getFeaturedProducts(limit));
}

export function booksResolved(): Product[] {
  return resolveProducts(books);
}

export function ebooksResolved(): Product[] {
  return resolveProducts(ebooks);
}

export function gearResolved(): Product[] {
  return resolveProducts(gear);
}

export function allProductsResolved(): Product[] {
  return resolveProducts(allProducts);
}

export function getAllProductTextEntries(): { slug: string; title: string; category: ProductCategory; customized: boolean }[] {
  const store = readStore().products ?? {};
  return allProducts.map((p) => ({
    slug: p.slug,
    title: store[p.slug]?.title || p.title,
    category: p.category,
    customized: Boolean(store[p.slug] && Object.keys(store[p.slug]).length > 0),
  }));
}

export function setProductOverride(slug: string, fields: ProductTextOverride) {
  if (!allProducts.some((p) => p.slug === slug)) throw new Error("প্রোডাক্ট পাওয়া যায়নি");
  if (fields.title !== undefined && !fields.title.trim()) {
    throw new Error("শিরোনাম খালি রাখা যাবে না");
  }
  const clean: ProductTextOverride = {
    title: fields.title?.trim() || undefined,
    author: fields.author?.trim() || undefined,
    shortDescription: fields.shortDescription?.trim() || undefined,
    description: fields.description?.trim() || undefined,
    bullets: cleanStrings(fields.bullets),
    badge: fields.badge?.trim() || undefined,
  };
  const store = readStore();
  store.products = store.products ?? {};
  store.products[slug] = clean;
  writeStore(store);
}

export function resetProductOverride(slug: string) {
  const store = readStore();
  if (store.products) delete store.products[slug];
  writeStore(store);
}

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export function getBlogOverride(slug: string): BlogTextOverride {
  return readStore().blog?.[slug] ?? {};
}

export function isBlogTextCustomized(slug: string): boolean {
  return Object.keys(getBlogOverride(slug)).length > 0;
}

function mergeBlogPost(post: BlogPost, override: BlogTextOverride): BlogPost {
  const merged = Object.keys(override).length === 0 ? post : {
    ...post,
    title: override.title || post.title,
    excerpt: override.excerpt || post.excerpt,
    content: override.content && override.content.length > 0 ? override.content : post.content,
    author: override.author || post.author,
    category: override.category || post.category,
  };
  return { ...merged, coverImageUrl: getBlogImageUrl(post.slug) };
}

export function resolveBlogPost(post: BlogPost): BlogPost {
  return mergeBlogPost(post, getBlogOverride(post.slug));
}

export function resolveBlogPosts(posts: BlogPost[]): BlogPost[] {
  const store = readStore().blog ?? {};
  return posts.map((p) => mergeBlogPost(p, store[p.slug] ?? {}));
}

export function blogPostsResolved(): BlogPost[] {
  return resolveBlogPosts(blogPosts);
}

export function getBlogPostBySlugResolved(slug: string): BlogPost | undefined {
  const post = getBlogPostBySlug(slug);
  return post ? resolveBlogPost(post) : undefined;
}

export function getPostsByTopicResolved(topicSlug: string, segmentSlug?: string): BlogPost[] {
  return resolveBlogPosts(getPostsByTopic(topicSlug, segmentSlug));
}

export function getFeaturedPostsResolved(limit = 3): BlogPost[] {
  return resolveBlogPosts(getFeaturedPosts(limit));
}

export function getAllBlogTextEntries(): { slug: string; title: string; customized: boolean }[] {
  const store = readStore().blog ?? {};
  return blogPosts.map((p) => ({
    slug: p.slug,
    title: store[p.slug]?.title || p.title,
    customized: Boolean(store[p.slug] && Object.keys(store[p.slug]).length > 0),
  }));
}

export function setBlogOverride(slug: string, fields: BlogTextOverride) {
  if (!blogPosts.some((p) => p.slug === slug)) throw new Error("পোস্ট পাওয়া যায়নি");
  if (fields.title !== undefined && !fields.title.trim()) {
    throw new Error("শিরোনাম খালি রাখা যাবে না");
  }
  if (fields.content !== undefined && cleanStrings(fields.content) === undefined) {
    throw new Error("লেখার মূল অংশ খালি রাখা যাবে না");
  }
  const clean: BlogTextOverride = {
    title: fields.title?.trim() || undefined,
    excerpt: fields.excerpt?.trim() || undefined,
    content: cleanStrings(fields.content),
    author: fields.author?.trim() || undefined,
    category: fields.category?.trim() || undefined,
  };
  const store = readStore();
  store.blog = store.blog ?? {};
  store.blog[slug] = clean;
  writeStore(store);
}

export function resetBlogOverride(slug: string) {
  const store = readStore();
  if (store.blog) delete store.blog[slug];
  writeStore(store);
}
