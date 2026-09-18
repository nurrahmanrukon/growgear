import fs from "fs";
import path from "path";

export interface SectionMeta {
  key: string;
  label: string;
  note?: string;
}

export interface SectionConfig {
  order: string[];
  hidden: string[];
}

interface StoredEntry {
  order?: string[];
  hidden?: string[];
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
const VALID_KEYS = new Set(DEFAULT_ORDER);

const STORE_PATH = path.join(process.cwd(), "data", "section-order.json");

function readStore(): Record<string, StoredEntry> {
  try {
    const data = JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    const result: Record<string, StoredEntry> = {};
    for (const [slug, value] of Object.entries(data)) {
      // migrate from the earlier order-only format (a plain array per slug)
      if (Array.isArray(value)) {
        result[slug] = { order: value, hidden: [] };
      } else if (value && typeof value === "object") {
        result[slug] = value as StoredEntry;
      }
    }
    return result;
  } catch {
    return {};
  }
}

function writeStore(data: Record<string, StoredEntry>) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
}

function sanitizeOrder(order: string[] | undefined): string[] {
  const cleaned = (order ?? []).filter((k) => VALID_KEYS.has(k));
  const missing = DEFAULT_ORDER.filter((k) => !cleaned.includes(k));
  return [...cleaned, ...missing];
}

function sanitizeHidden(hidden: string[] | undefined): string[] {
  return Array.from(new Set((hidden ?? []).filter((k) => VALID_KEYS.has(k))));
}

export function getSectionConfig(slug?: string): SectionConfig {
  const store = readStore();
  const entry = slug ? store[slug] : undefined;
  return {
    order: sanitizeOrder(entry?.order),
    hidden: sanitizeHidden(entry?.hidden),
  };
}

export function getSectionOrder(slug?: string): string[] {
  return getSectionConfig(slug).order;
}

export function isCustomized(slug: string): boolean {
  const store = readStore();
  const entry = store[slug];
  if (!entry) return false;
  return Boolean(entry.order?.length) || Boolean(entry.hidden?.length);
}

export function setSectionConfig(slug: string, config: { order: string[]; hidden: string[] }) {
  if (!slug) throw new Error("প্রোডাক্ট নির্দিষ্ট করা হয়নি");
  if (config.order.length !== DEFAULT_ORDER.length || !config.order.every((k) => VALID_KEYS.has(k))) {
    throw new Error("অবৈধ সেকশন অর্ডার");
  }
  if (new Set(config.order).size !== config.order.length) {
    throw new Error("সেকশন একাধিকবার থাকতে পারবে না");
  }
  if (!config.hidden.every((k) => VALID_KEYS.has(k))) {
    throw new Error("অবৈধ সেকশন");
  }
  const store = readStore();
  store[slug] = { order: config.order, hidden: config.hidden };
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
