import fs from "fs";
import path from "path";

export interface HomeSectionMeta {
  key: string;
  label: string;
  note?: string;
}

export interface HomeSectionConfig {
  order: string[];
  hidden: string[];
}

interface StoredEntry {
  order?: string[];
  hidden?: string[];
}

export const HOME_SECTION_CATALOG: HomeSectionMeta[] = [
  { key: "hero", label: "হিরো ব্যানার" },
  { key: "trustStrip", label: "ট্রাস্ট স্ট্রিপ", note: "বিশ্বাসযোগ্যতার সংক্ষিপ্ত তথ্য (ডেলিভারি, পেমেন্ট ইত্যাদি)" },
  { key: "bestSellers", label: "বেস্ট সেলার সেকশন" },
  { key: "segmentRails", label: "বিভাগভিত্তিক প্রোডাক্ট সেকশন সমূহ", note: "ব্যবসা, প্রোডাক্টিভিটি, ফাইন্যান্স ইত্যাদি সব বিভাগ একসাথে" },
  { key: "courseTeaser", label: "কোর্স সেকশন" },
  { key: "blogTeaser", label: "ব্লগ সেকশন" },
];

const DEFAULT_ORDER: string[] = HOME_SECTION_CATALOG.map((s) => s.key);
const VALID_KEYS = new Set(DEFAULT_ORDER);

const STORE_PATH = path.join(process.cwd(), "data", "home-section-order.json");

function readStore(): StoredEntry {
  try {
    const data = JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    return data as StoredEntry;
  } catch {
    return {};
  }
}

function writeStore(data: StoredEntry) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
}

function sanitizeOrder(order: string[] | undefined): string[] {
  const cleaned = (order ?? []).filter((k) => VALID_KEYS.has(k));
  if (cleaned.length === 0) return DEFAULT_ORDER;

  // Insert any catalog keys missing from a stored (possibly older) order right after
  // their nearest preceding sibling from DEFAULT_ORDER, instead of dumping them at the
  // end — so newly-added sections land in their intended spot even for a previously
  // customized order.
  const result = [...cleaned];
  const missing = DEFAULT_ORDER.filter((k) => !cleaned.includes(k));
  for (const key of missing) {
    const catalogIndex = DEFAULT_ORDER.indexOf(key);
    let insertAt = result.length;
    for (let i = catalogIndex - 1; i >= 0; i--) {
      const idx = result.indexOf(DEFAULT_ORDER[i]);
      if (idx !== -1) {
        insertAt = idx + 1;
        break;
      }
    }
    result.splice(insertAt, 0, key);
  }
  return result;
}

function sanitizeHidden(hidden: string[] | undefined): string[] {
  return Array.from(new Set((hidden ?? []).filter((k) => VALID_KEYS.has(k))));
}

export function getHomeSectionConfig(): HomeSectionConfig {
  const entry = readStore();
  return {
    order: sanitizeOrder(entry.order),
    hidden: sanitizeHidden(entry.hidden),
  };
}

export function isHomeCustomized(): boolean {
  const entry = readStore();
  return Boolean(entry.order?.length) || Boolean(entry.hidden?.length);
}

export function setHomeSectionConfig(config: { order: string[]; hidden: string[] }) {
  if (config.order.length !== DEFAULT_ORDER.length || !config.order.every((k) => VALID_KEYS.has(k))) {
    throw new Error("অবৈধ সেকশন অর্ডার");
  }
  if (new Set(config.order).size !== config.order.length) {
    throw new Error("সেকশন একাধিকবার থাকতে পারবে না");
  }
  if (!config.hidden.every((k) => VALID_KEYS.has(k))) {
    throw new Error("অবৈধ সেকশন");
  }
  writeStore({ order: config.order, hidden: config.hidden });
}

export function resetHomeSectionOrder() {
  writeStore({});
}

export function getDefaultHomeSectionOrder(): string[] {
  return DEFAULT_ORDER;
}
