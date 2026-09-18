import fs from "fs";
import path from "path";
import { allProducts } from "@/lib/data/products";
import { blogPosts } from "@/lib/data/blog";
import { ProductCategory } from "@/lib/types";

export interface PaymentMethodMeta {
  key: string;
  label: string;
}

export const PAYMENT_METHOD_CATALOG: PaymentMethodMeta[] = [
  { key: "cod", label: "ক্যাশ অন ডেলিভারি" },
  { key: "bkash", label: "বিকাশ" },
  { key: "card", label: "কার্ড" },
];

const VALID_KEYS = new Set(PAYMENT_METHOD_CATALOG.map((m) => m.key));
const STORE_PATH = path.join(process.cwd(), "data", "payment-methods.json");

export type ItemKind = ProductCategory | "blog";

interface StoredEntry {
  hidden?: string[];
}

function sanitizeHidden(hidden: string[]): string[] {
  return Array.from(new Set(hidden.filter((k) => VALID_KEYS.has(k))));
}

function readStore(): Record<string, string[]> {
  let raw: Record<string, StoredEntry>;
  try {
    raw = JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return {};
  }
  const out: Record<string, string[]> = {};
  for (const [slug, value] of Object.entries(raw)) {
    out[slug] = sanitizeHidden(value?.hidden ?? []);
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

/** The payment methods that even exist for a given content type, before any admin hiding. */
export function getOfferedMethods(kind: ItemKind): string[] {
  return kind === "ebook" || kind === "blog" ? ["bkash", "card"] : ["cod", "bkash", "card"];
}

function findKind(slug: string): ItemKind | undefined {
  const product = allProducts.find((p) => p.slug === slug);
  if (product) return product.category;
  const post = blogPosts.find((p) => p.slug === slug && p.premium);
  if (post) return "blog";
  return undefined;
}

export function getHiddenPaymentMethods(slug: string): string[] {
  const store = readStore();
  return sanitizeHidden(store[slug] ?? []);
}

export function isPaymentCustomized(slug: string): boolean {
  return getHiddenPaymentMethods(slug).length > 0;
}

export interface PaymentItemRow {
  slug: string;
  title: string;
  kind: ItemKind;
  offered: string[];
  hidden: string[];
}

export function getAllPaymentEntries(): PaymentItemRow[] {
  const store = readStore();
  const productRows: PaymentItemRow[] = allProducts.map((p) => ({
    slug: p.slug,
    title: p.title,
    kind: p.category,
    offered: getOfferedMethods(p.category),
    hidden: sanitizeHidden(store[p.slug] ?? []),
  }));
  const blogRows: PaymentItemRow[] = blogPosts
    .filter((b) => b.premium)
    .map((b) => ({
      slug: b.slug,
      title: b.title,
      kind: "blog" as const,
      offered: getOfferedMethods("blog"),
      hidden: sanitizeHidden(store[b.slug] ?? []),
    }));
  return [...productRows, ...blogRows];
}

export function setHiddenPaymentMethods(slug: string, hidden: string[]) {
  const kind = findKind(slug);
  if (!kind) throw new Error("আইটেম পাওয়া যায়নি");
  const offered = getOfferedMethods(kind);
  const clean = sanitizeHidden(hidden).filter((k) => offered.includes(k));
  if (clean.length >= offered.length) {
    throw new Error("সব পেমেন্ট পদ্ধতি একসাথে লুকানো যাবে না — অন্তত একটা চালু রাখতে হবে");
  }
  const store = readStore();
  store[slug] = clean;
  writeStore(store);
}

export function resetPaymentMethods(slug: string) {
  const store = readStore();
  delete store[slug];
  writeStore(store);
}
