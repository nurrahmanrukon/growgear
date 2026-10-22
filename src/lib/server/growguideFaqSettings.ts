import fs from "fs";
import path from "path";

export interface GrowGuideFaqItem {
  q: string;
  a: string;
}

export interface GrowGuideFaqSettings {
  eyebrow: string;
  heading: string;
  faqs: GrowGuideFaqItem[];
}

const FILE_PATH = path.join(process.cwd(), "data", "growguide-faq-settings.json");

const DEFAULTS: GrowGuideFaqSettings = {
  eyebrow: "সাধারণ জিজ্ঞাসা",
  heading: "সেশন নিয়ে যা জানা দরকার",
  faqs: [
    {
      q: "সেশন কতক্ষণ স্থায়ী হয়?",
      a: "প্রতিটি লাইভ ওয়েবিনার সাধারণত ৬০-৯০ মিনিট স্থায়ী হয়, যার মধ্যে প্রশ্নোত্তর পর্বও অন্তর্ভুক্ত।",
    },
    {
      q: "সেশনের রেকর্ডিং পাব কি?",
      a: "হ্যাঁ, লাইভে অংশ নিতে না পারলে পরে প্রাইভেট কমিউনিটি গ্রুপে রেকর্ডিং শেয়ার করা হয়।",
    },
    {
      q: "লাইভে সরাসরি প্রশ্ন করতে পারব?",
      a: "অবশ্যই — সেশন চলাকালীন সরাসরি প্রশ্ন করতে পারবেন, নূর রহমান নিজে উত্তর দেন।",
    },
    {
      q: "কোন প্ল্যাটফর্মে সেশন হয়?",
      a: "জুম বা গুগল মিট-এ লাইভ সেশন হয় — জয়েন করার পর সময়সূচি ও লিংক ইমেইলে পাঠানো হবে।",
    },
    {
      q: "এটা সম্পূর্ণ ফ্রি কেন?",
      a: "এটি নূর রহমানের ব্যক্তিগত কমিউনিটি গড়ে তোলা ও সমাজে অবদান রাখার একটা প্রচেষ্টা — কোনো লুকানো ফি নেই।",
    },
  ],
};

function cleanFaqs(raw: unknown): GrowGuideFaqItem[] {
  if (!Array.isArray(raw)) return DEFAULTS.faqs;
  const cleaned = raw
    .filter((f): f is Record<string, unknown> => typeof f === "object" && f !== null)
    .map((f) => ({
      q: typeof f.q === "string" ? f.q.trim() : "",
      a: typeof f.a === "string" ? f.a.trim() : "",
    }))
    .filter((f) => f.q.length > 0);
  return cleaned.length > 0 ? cleaned : DEFAULTS.faqs;
}

export function getGrowGuideFaqSettings(): GrowGuideFaqSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<GrowGuideFaqSettings>;
    return {
      eyebrow: typeof parsed.eyebrow === "string" && parsed.eyebrow.trim() ? parsed.eyebrow.trim() : DEFAULTS.eyebrow,
      heading: typeof parsed.heading === "string" && parsed.heading.trim() ? parsed.heading.trim() : DEFAULTS.heading,
      faqs: cleanFaqs(parsed.faqs),
    };
  } catch {
    return DEFAULTS;
  }
}

export function setGrowGuideFaqSettings(update: Partial<GrowGuideFaqSettings>): GrowGuideFaqSettings {
  const current = getGrowGuideFaqSettings();
  const next: GrowGuideFaqSettings = {
    eyebrow: update.eyebrow?.trim() || current.eyebrow,
    heading: update.heading?.trim() || current.heading,
    faqs: update.faqs !== undefined ? cleanFaqs(update.faqs) : current.faqs,
  };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}
