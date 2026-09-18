import fs from "fs";
import path from "path";
import { allProducts } from "@/lib/data/products";
import { ProductCategory } from "@/lib/types";

interface InventoryEntry {
  stockCount: number;
  updatedAt: string;
}

const STORE_PATH = path.join(process.cwd(), "data", "inventory.json");

function readStore(): Record<string, InventoryEntry> {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, InventoryEntry>) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

/** null means the admin has never set a number for this product — the static default inStock flag still applies. */
export function getStockOverride(slug: string): number | null {
  return readStore()[slug]?.stockCount ?? null;
}

export function resolveInStock(slug: string, defaultInStock: boolean): boolean {
  const override = getStockOverride(slug);
  return override !== null ? override > 0 : defaultInStock;
}

export function setStockCount(slug: string, count: number) {
  if (!allProducts.some((p) => p.slug === slug)) throw new Error("প্রোডাক্ট পাওয়া যায়নি");
  if (!Number.isInteger(count) || count < 0) throw new Error("স্টক সংখ্যা অবশ্যই ০ বা তার বেশি পূর্ণসংখ্যা হতে হবে");
  const store = readStore();
  store[slug] = { stockCount: count, updatedAt: new Date().toISOString() };
  writeStore(store);
}

export function resetStockOverride(slug: string) {
  const store = readStore();
  delete store[slug];
  writeStore(store);
}

/** Decrements stock for an order's items — only for products where the admin has opted into numeric tracking. */
export function decrementStockForItems(items: { slug?: string; quantity: number }[]) {
  const store = readStore();
  let changed = false;
  for (const item of items) {
    if (!item.slug) continue;
    const entry = store[item.slug];
    if (!entry) continue; // not opted into numeric tracking — leave the static flag alone
    entry.stockCount = Math.max(0, entry.stockCount - item.quantity);
    entry.updatedAt = new Date().toISOString();
    changed = true;
  }
  if (changed) writeStore(store);
}

export interface InventoryRow {
  slug: string;
  title: string;
  category: ProductCategory;
  stockCount: number | null;
  defaultInStock: boolean;
  effectiveInStock: boolean;
}

export function getAllInventoryEntries(): InventoryRow[] {
  const store = readStore();
  return allProducts.map((p) => {
    const stockCount = store[p.slug]?.stockCount ?? null;
    return {
      slug: p.slug,
      title: p.title,
      category: p.category,
      stockCount,
      defaultInStock: p.inStock,
      effectiveInStock: stockCount !== null ? stockCount > 0 : p.inStock,
    };
  });
}
