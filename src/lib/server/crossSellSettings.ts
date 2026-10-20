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

  // --- Marketing copy for the cross-sell modal flow. "**text**" renders bold. ---
  offerAppreciation: string;
  offerEyebrow: string;
  offerHeading: string;
  secondOfferEyebrow: string;
  /** "{count}" is replaced with the second offer's review count (Bengali numerals). */
  secondOfferSocialProof: string;
  successAppreciation: string;
  top1PctHeading: string;
  top1PctBody: string;
  giftEyebrow: string;
  giftHeading: string;
  giftBody: string;
  giftCta: string;
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

  offerAppreciation:
    "হাজারো মানুষ শুধু স্বপ্ন দেখে বসে থাকে, কিন্তু আপনি আজ আপনার স্বপ্নের দিকে একটা পা বাড়ালেন। এটা প্রমাণ করে, আপনি নিজের ভেতরের সম্ভাবনাটা বিশ্বাস করেন। আর যারা নিজেকে বিশ্বাস করতে পারে, তাদের থামানো যায় না।",
  offerEyebrow: "সীমিত সময়ের বিশেষ অফার",
  offerHeading: "আপনার জন্য বিশেষভাবে বাছাই করা",
  secondOfferEyebrow: "আপনার জন্য আরও একটি সুযোগ",
  secondOfferSocialProof: "ইতিমধ্যে {count}+ জন এটি ব্যবহার করছেন — আজকের অর্ডারের সাথেই যোগ করে নিন।",
  successAppreciation:
    "একটানা দুইটা দারুণ পদক্ষেপ! এই ধারাবাহিকতাই বলে দিচ্ছে, আপনি নিজের স্বপ্নপূরণের ব্যাপারে কতটা সিরিয়াস। আপনি পিছিয়ে থাকার মানুষ নন!",
  top1PctHeading: "অভিনন্দন! আপনি টপ ১% মানুষের একজন!",
  top1PctBody:
    "বেশিরভাগ মানুষ নিজের জন্য খরচ করাকে অপচয় ভাবে। কিন্তু আপনি জানেন, এটাই আসল বিনিয়োগ। আজকের এই **INVESTMENT** কাল হয়ে উঠবে আপনার অনেকগুলো **INCOME**-এর নতুন উৎস। এই বোঝাপড়াটাই আপনাকে আলাদা করে তোলে। মাত্র টপ ১% মানুষ এমন সিদ্ধান্ত নিতে পারে, আর তারাই জীবনে সবার চেয়ে এগিয়ে থাকে। আপনার এই যাত্রায় পাশে থাকতে পেরে আমরা সত্যিই আনন্দিত। এগিয়ে যান, আরও বড় সাফল্য আপনার অপেক্ষায়!",
  giftEyebrow: "আপনার জন্য একটা উপহার",
  giftHeading: "আপনার জন্য রাখা আছে হাই ভ্যালু রিসোর্স",
  giftBody:
    "ইতিমধ্যে **১০ লক্ষেরও বেশি মানুষ** এই লেখাগুলো পড়ে উপকৃত হয়েছেন। প্রোডাক্টিভিটি, ক্যারিয়ার এবং বিজনেস নিয়ে গবেষণাভিত্তিক এই লেখাগুলো আপনার চিন্তার দুয়ার খুলে দিবে। প্রতিটি লেখার শেষে দেয়া আছে একশন প্ল্যান যা আপনার গ্রোথের জন্য আজ থেকেই ব্যবহার করতে পারবেন। শেখার জার্নিতে স্বাগতম!",
  giftCta: "ফ্রি রিসোর্সটি এখনই দেখি",
};

const STRING_FIELDS = [
  "ebookSlug",
  "bookSlug",
  "gearSlug",
  "message",
  "offerAppreciation",
  "offerEyebrow",
  "offerHeading",
  "secondOfferEyebrow",
  "secondOfferSocialProof",
  "successAppreciation",
  "top1PctHeading",
  "top1PctBody",
  "giftEyebrow",
  "giftHeading",
  "giftBody",
  "giftCta",
] as const satisfies readonly (keyof CrossSellSettings)[];

export function getCrossSellSettings(): CrossSellSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<CrossSellSettings>;
    const result = { ...DEFAULTS };
    for (const field of STRING_FIELDS) {
      const value = parsed[field];
      if (typeof value === "string" && value.trim()) result[field] = field.endsWith("Slug") ? value.trim() : value;
    }
    result.enabled = typeof parsed.enabled === "boolean" ? parsed.enabled : DEFAULTS.enabled;
    result.secondOfferEnabled =
      typeof parsed.secondOfferEnabled === "boolean" ? parsed.secondOfferEnabled : DEFAULTS.secondOfferEnabled;
    result.soldCount =
      typeof parsed.soldCount === "number" && parsed.soldCount >= 0 ? parsed.soldCount : DEFAULTS.soldCount;
    return result;
  } catch {
    return DEFAULTS;
  }
}

export function setCrossSellSettings(update: Partial<CrossSellSettings>): CrossSellSettings {
  const current = getCrossSellSettings();
  const next = { ...current };
  for (const field of STRING_FIELDS) {
    const value = update[field];
    if (value === undefined) continue;
    const trimmed = field.endsWith("Slug") ? value.trim() : value;
    // Slug fields may be intentionally cleared; copy fields fall back to the
    // current value rather than being saved blank.
    if (field.endsWith("Slug") || trimmed.trim()) next[field] = trimmed;
  }
  next.enabled = update.enabled ?? current.enabled;
  next.secondOfferEnabled = update.secondOfferEnabled ?? current.secondOfferEnabled;
  next.soldCount = update.soldCount !== undefined && update.soldCount >= 0 ? update.soldCount : current.soldCount;

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
