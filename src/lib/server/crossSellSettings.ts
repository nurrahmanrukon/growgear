import fs from "fs";
import path from "path";
import { ProductCategory } from "@/lib/types";

export interface CrossSellSettings {
  enabled: boolean;
  /** Slug of the ebook offered whenever the rotation calls for an ebook. */
  ebookSlug: string;
  /** Slug of the book offered whenever the rotation calls for a book. */
  bookSlug: string;
  /** Slug of the gear item offered whenever the rotation calls for gear. */
  gearSlug: string;
  soldCount: number;
  /** Promo copy — "{count}" is replaced with soldCount (Bengali numerals) when rendered. */
  message: string;
  /** Whether a second, lighter-touch suggestion shows after the main cross-sell purchase completes. */
  secondOfferEnabled: boolean;
}

const FILE_PATH = path.join(process.cwd(), "data", "cross-sell-settings.json");

const DEFAULTS: CrossSellSettings = {
  enabled: false,
  ebookSlug: "",
  bookSlug: "",
  gearSlug: "",
  soldCount: 5000,
  message: "আমাদের এই প্রোডাক্টটি এখন পর্যন্ত {count}+ মানুষ কিনেছেন — আপনিও নিতে পারেন!",
  secondOfferEnabled: false,
};

export function getCrossSellSettings(): CrossSellSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<CrossSellSettings>;
    return {
      enabled: typeof parsed.enabled === "boolean" ? parsed.enabled : DEFAULTS.enabled,
      ebookSlug: typeof parsed.ebookSlug === "string" ? parsed.ebookSlug.trim() : DEFAULTS.ebookSlug,
      bookSlug: typeof parsed.bookSlug === "string" ? parsed.bookSlug.trim() : DEFAULTS.bookSlug,
      gearSlug: typeof parsed.gearSlug === "string" ? parsed.gearSlug.trim() : DEFAULTS.gearSlug,
      soldCount:
        typeof parsed.soldCount === "number" && parsed.soldCount >= 0 ? parsed.soldCount : DEFAULTS.soldCount,
      message: typeof parsed.message === "string" && parsed.message.trim() ? parsed.message : DEFAULTS.message,
      secondOfferEnabled:
        typeof parsed.secondOfferEnabled === "boolean" ? parsed.secondOfferEnabled : DEFAULTS.secondOfferEnabled,
    };
  } catch {
    return DEFAULTS;
  }
}

export function setCrossSellSettings(update: Partial<CrossSellSettings>): CrossSellSettings {
  const current = getCrossSellSettings();
  const next: CrossSellSettings = {
    enabled: update.enabled ?? current.enabled,
    ebookSlug: update.ebookSlug !== undefined ? update.ebookSlug.trim() : current.ebookSlug,
    bookSlug: update.bookSlug !== undefined ? update.bookSlug.trim() : current.bookSlug,
    gearSlug: update.gearSlug !== undefined ? update.gearSlug.trim() : current.gearSlug,
    soldCount:
      update.soldCount !== undefined && update.soldCount >= 0 ? update.soldCount : current.soldCount,
    message: update.message !== undefined && update.message.trim() ? update.message : current.message,
    secondOfferEnabled: update.secondOfferEnabled ?? current.secondOfferEnabled,
  };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}

/**
 * Cross-sell rotation: across the originally bought category plus the two
 * offers, each of book/ebook/gear appears exactly once. An ebook is offered
 * first whenever possible (it's the easiest impulse buy — instant delivery,
 * no shipping friction) except when the customer just bought an ebook, in
 * which case a book leads instead. Whatever's left over fills the second,
 * lighter-touch slot.
 */
export function crossSellRotation(originalCategory: ProductCategory): {
  first: "ebook" | "book";
  second: "book" | "gear";
} {
  const first: "ebook" | "book" = originalCategory === "ebook" ? "book" : "ebook";
  const all: ProductCategory[] = ["book", "ebook", "gear"];
  const second = all.find((c) => c !== originalCategory && c !== first) as "book" | "gear";
  return { first, second };
}
