import fs from "fs";
import path from "path";

export interface CrossSellSettings {
  enabled: boolean;
  /** Slug of the ebook to promote on the order-success page. Empty = not configured. */
  ebookSlug: string;
  soldCount: number;
  /** Promo copy — "{count}" is replaced with soldCount (Bengali numerals) when rendered. */
  message: string;
}

const FILE_PATH = path.join(process.cwd(), "data", "cross-sell-settings.json");

const DEFAULTS: CrossSellSettings = {
  enabled: false,
  ebookSlug: "",
  soldCount: 5000,
  message: "আমাদের এই ইবুকটি এখন পর্যন্ত {count}+ মানুষ কিনেছেন — আপনিও নিতে পারেন!",
};

export function getCrossSellSettings(): CrossSellSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<CrossSellSettings>;
    return {
      enabled: typeof parsed.enabled === "boolean" ? parsed.enabled : DEFAULTS.enabled,
      ebookSlug: typeof parsed.ebookSlug === "string" ? parsed.ebookSlug.trim() : DEFAULTS.ebookSlug,
      soldCount:
        typeof parsed.soldCount === "number" && parsed.soldCount >= 0 ? parsed.soldCount : DEFAULTS.soldCount,
      message: typeof parsed.message === "string" && parsed.message.trim() ? parsed.message : DEFAULTS.message,
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
    soldCount:
      update.soldCount !== undefined && update.soldCount >= 0 ? update.soldCount : current.soldCount,
    message: update.message !== undefined && update.message.trim() ? update.message : current.message,
  };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}
