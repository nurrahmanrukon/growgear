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

function readStore(): string[] | null {
  try {
    const data = JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
    if (Array.isArray(data) && data.every((k) => typeof k === "string")) return data;
    return null;
  } catch {
    return null;
  }
}

function writeStore(order: string[]) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(order, null, 2));
}

export function getSectionOrder(): string[] {
  const stored = readStore();
  if (!stored) return DEFAULT_ORDER;

  const validKeys = new Set(DEFAULT_ORDER);
  const cleaned = stored.filter((k) => validKeys.has(k));
  const missing = DEFAULT_ORDER.filter((k) => !cleaned.includes(k));
  return [...cleaned, ...missing];
}

export function setSectionOrder(order: string[]) {
  const validKeys = new Set(DEFAULT_ORDER);
  if (order.length !== DEFAULT_ORDER.length || !order.every((k) => validKeys.has(k))) {
    throw new Error("অবৈধ সেকশন অর্ডার");
  }
  if (new Set(order).size !== order.length) {
    throw new Error("সেকশন একাধিকবার থাকতে পারবে না");
  }
  writeStore(order);
}

export function getDefaultSectionOrder(): string[] {
  return DEFAULT_ORDER;
}
