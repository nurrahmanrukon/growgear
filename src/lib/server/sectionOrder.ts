import fs from "fs";
import path from "path";

export interface SectionMeta {
  key: string;
  label: string;
  note?: string;
}

export const SECTION_CATALOG: SectionMeta[] = [
  { key: "video", label: "ভিডিও সেকশন" },
  { key: "socialProof", label: "সোশ্যাল মিডিয়া স্ক্রিনশট" },
  { key: "expertOpinions", label: "বিশেষজ্ঞদের মতামত" },
  { key: "painPoints", label: "সমস্যা তুলে ধরা (পেইন পয়েন্টস)" },
  { key: "transformation", label: "রূপান্তর (ট্রান্সফরমেশন)" },
  { key: "ctaBanner1", label: "সিটিএ ব্যানার — ১" },
  { key: "authorBio", label: "লেখকের পরিচিতি ও পাঠক মতামত", note: "শুধু বই/ইবুকে দেখা যাবে" },
  { key: "keyIdeas", label: "মূল আইডিয়াসমূহ" },
  { key: "ctaBanner2", label: "সিটিএ ব্যানার — ২" },
  { key: "faq", label: "সাধারণ জিজ্ঞাসা (FAQ)" },
  { key: "quoteBanner", label: "উক্তি ব্যানার" },
  { key: "finalOrder", label: "অর্ডার ফর্ম ও সম্পাদকীয় ভিডিও রিভিউ" },
  { key: "reviews", label: "গ্রাহক রিভিউ" },
];

const DEFAULT_ORDER: string[] = SECTION_CATALOG.map((s) => s.key);

const STORE_PATH = path.join(process.cwd(), "data", "section-order.json");

function readStore(): Record<string, string[]> {
  try {
    const data = JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
    if (data && typeof data === "object" && !Array.isArray(data)) return data;
    // migrate from the earlier single-shared-order format (a plain array)
    if (Array.isArray(data)) return { __default__: data };
    return {};
  } catch {
    return {};
  }
}

function writeStore(data: Record<string, string[]>) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
}

function sanitize(order: string[]): string[] {
  const validKeys = new Set(DEFAULT_ORDER);
  const cleaned = order.filter((k) => validKeys.has(k));
  const missing = DEFAULT_ORDER.filter((k) => !cleaned.includes(k));
  return [...cleaned, ...missing];
}

export function getSectionOrder(slug?: string): string[] {
  const store = readStore();
  if (slug && store[slug]) return sanitize(store[slug]);
  return DEFAULT_ORDER;
}

export function isCustomized(slug: string): boolean {
  const store = readStore();
  return Boolean(store[slug]);
}

export function setSectionOrder(slug: string, order: string[]) {
  if (!slug) throw new Error("প্রোডাক্ট নির্দিষ্ট করা হয়নি");
  const validKeys = new Set(DEFAULT_ORDER);
  if (order.length !== DEFAULT_ORDER.length || !order.every((k) => validKeys.has(k))) {
    throw new Error("অবৈধ সেকশন অর্ডার");
  }
  if (new Set(order).size !== order.length) {
    throw new Error("সেকশন একাধিকবার থাকতে পারবে না");
  }
  const store = readStore();
  store[slug] = order;
  writeStore(store);
}

export function resetSectionOrder(slug: string) {
  const store = readStore();
  if (slug in store) {
    delete store[slug];
    writeStore(store);
  }
}

export function getDefaultSectionOrder(): string[] {
  return DEFAULT_ORDER;
}
