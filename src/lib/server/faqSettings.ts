import fs from "fs";
import path from "path";
import { Product, ProductCategory } from "@/lib/types";
import { Faq, BOOK_FAQS, EBOOK_FAQS, GEAR_FAQS } from "@/lib/data/landingContent";

export interface FaqSettings {
  eyebrow: string;
  heading: string;
  book: Faq[];
  ebook: Faq[];
  gear: Faq[];
}

const FILE_PATH = path.join(process.cwd(), "data", "faq-settings.json");

const DEFAULTS: FaqSettings = {
  eyebrow: "সাধারণ জিজ্ঞাসা",
  heading: "অর্ডার করার আগে যা জানা দরকার",
  book: BOOK_FAQS,
  ebook: EBOOK_FAQS,
  gear: GEAR_FAQS,
};

function cleanFaqList(raw: unknown, fallback: Faq[]): Faq[] {
  if (!Array.isArray(raw)) return fallback;
  const cleaned = raw
    .filter((f): f is Record<string, unknown> => typeof f === "object" && f !== null)
    .map((f) => ({
      q: typeof f.q === "string" ? f.q.trim() : "",
      a: typeof f.a === "string" ? f.a.trim() : "",
    }))
    .filter((f) => f.q && f.a);
  return cleaned.length > 0 ? cleaned : fallback;
}

export function getFaqSettings(): FaqSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<FaqSettings>;
    return {
      eyebrow: typeof parsed.eyebrow === "string" && parsed.eyebrow.trim() ? parsed.eyebrow.trim() : DEFAULTS.eyebrow,
      heading: typeof parsed.heading === "string" && parsed.heading.trim() ? parsed.heading.trim() : DEFAULTS.heading,
      book: cleanFaqList(parsed.book, DEFAULTS.book),
      ebook: cleanFaqList(parsed.ebook, DEFAULTS.ebook),
      gear: cleanFaqList(parsed.gear, DEFAULTS.gear),
    };
  } catch {
    return DEFAULTS;
  }
}

export function setFaqSettings(update: Partial<FaqSettings>): FaqSettings {
  const current = getFaqSettings();
  const next: FaqSettings = {
    eyebrow: update.eyebrow !== undefined && update.eyebrow.trim() ? update.eyebrow.trim() : current.eyebrow,
    heading: update.heading !== undefined && update.heading.trim() ? update.heading.trim() : current.heading,
    book: update.book !== undefined ? cleanFaqList(update.book, current.book) : current.book,
    ebook: update.ebook !== undefined ? cleanFaqList(update.ebook, current.ebook) : current.ebook,
    gear: update.gear !== undefined ? cleanFaqList(update.gear, current.gear) : current.gear,
  };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}

export function getFaqsResolved(product: Product): Faq[] {
  const settings = getFaqSettings();
  const key: ProductCategory = product.category;
  return settings[key];
}
