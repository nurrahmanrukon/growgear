import fs from "fs";
import path from "path";
import { getProductBySlug } from "@/lib/data/products";

const STORE_PATH = path.join(process.cwd(), "data", "ebook-download-settings.json");

function readStore(): Record<string, boolean> {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, boolean>) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

/** Default is OFF — buyers read on the website; an admin opts an ebook into downloads explicitly. */
export function isDownloadEnabled(slug: string): boolean {
  return readStore()[slug] === true;
}

export function setDownloadEnabled(slug: string, enabled: boolean) {
  const product = getProductBySlug(slug);
  if (!product || product.category !== "ebook") {
    throw new Error("শুধু ইবুকের জন্য এই সেটিং পরিবর্তন করা যাবে");
  }
  const store = readStore();
  if (enabled) store[slug] = true;
  else delete store[slug];
  writeStore(store);
}
