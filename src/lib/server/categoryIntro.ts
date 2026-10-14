import fs from "fs";
import path from "path";
import { ProductCategory } from "@/lib/types";

export interface CategoryIntro {
  eyebrow: string;
  headline: string;
  subtext: string;
  quote: string;
}

export type CategoryIntroSettings = Record<ProductCategory, CategoryIntro>;

const FILE_PATH = path.join(process.cwd(), "data", "category-intro.json");

const SHARED_DEFAULT: CategoryIntro = {
  eyebrow: "GrowGear",
  headline: "ভালো বই, স্মার্ট টুলস — আপনার গ্রোথের জন্য সব একসাথে",
  subtext: "৯০+ বই, ইবুক ও প্রোডাক্টিভিটি গিয়ার, সারাদেশে ক্যাশ অন ডেলিভারিতে",
  quote: "আমাদের লক্ষ্য — প্রতিটি মানুষকে সঠিক দিকনির্দেশনার মাধ্যমে (guided way) নিজের জীবনে এগিয়ে যেতে সাহায্য করা।",
};

const DEFAULTS: CategoryIntroSettings = {
  book: { ...SHARED_DEFAULT },
  ebook: { ...SHARED_DEFAULT },
  gear: { ...SHARED_DEFAULT },
};

function cleanIntro(raw: unknown, fallback: CategoryIntro): CategoryIntro {
  if (typeof raw !== "object" || raw === null) return fallback;
  const r = raw as Record<string, unknown>;
  return {
    eyebrow: typeof r.eyebrow === "string" && r.eyebrow.trim() ? r.eyebrow.trim() : fallback.eyebrow,
    headline: typeof r.headline === "string" && r.headline.trim() ? r.headline.trim() : fallback.headline,
    subtext: typeof r.subtext === "string" && r.subtext.trim() ? r.subtext.trim() : fallback.subtext,
    quote: typeof r.quote === "string" ? r.quote.trim() : fallback.quote,
  };
}

export function getCategoryIntroSettings(): CategoryIntroSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<Record<ProductCategory, unknown>>;
    return {
      book: cleanIntro(parsed.book, DEFAULTS.book),
      ebook: cleanIntro(parsed.ebook, DEFAULTS.ebook),
      gear: cleanIntro(parsed.gear, DEFAULTS.gear),
    };
  } catch {
    return DEFAULTS;
  }
}

export function getCategoryIntro(category: ProductCategory): CategoryIntro {
  return getCategoryIntroSettings()[category];
}

export function setCategoryIntroSettings(update: Partial<CategoryIntroSettings>): CategoryIntroSettings {
  const current = getCategoryIntroSettings();
  const next: CategoryIntroSettings = {
    book: update.book ? cleanIntro(update.book, current.book) : current.book,
    ebook: update.ebook ? cleanIntro(update.ebook, current.ebook) : current.ebook,
    gear: update.gear ? cleanIntro(update.gear, current.gear) : current.gear,
  };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}
