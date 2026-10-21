import fs from "fs";
import path from "path";

export interface LegalSection {
  heading: string;
  /** One entry = one paragraph (or, with 2+ entries, a bulleted list). May contain
   *  "**bold**" markers (see src/lib/richText.tsx). */
  items: string[];
}

export interface LegalPageContent {
  title: string;
  updatedLabel: string;
  intro: string;
  sections: LegalSection[];
}

export interface LegalPagesSettings {
  privacy: LegalPageContent;
  terms: LegalPageContent;
  refund: LegalPageContent;
}

const FILE_PATH = path.join(process.cwd(), "data", "legal-pages.json");

const DEFAULTS: LegalPagesSettings = {
  privacy: {
    title: "প্রাইভেসি পলিসি",
    updatedLabel: "সর্বশেষ হালনাগাদ: ২০২৬",
    intro:
      "GrowGear (“আমরা”, “আমাদের”) আপনার ব্যক্তিগত তথ্যের গোপনীয়তাকে গুরুত্ব সহকারে দেখে। এই পেজে আমরা জানাচ্ছি কী ধরনের তথ্য সংগ্রহ করি, কেন করি, এবং কীভাবে তা সুরক্ষিত রাখি।",
    sections: [
      {
        heading: "আমরা যে তথ্য সংগ্রহ করি",
        items: [
          "অর্ডার করার সময়: নাম, ফোন নম্বর, ঠিকানা, ইমেইল (প্রযোজ্য ক্ষেত্রে)",
          "প্রোফাইল তৈরি/ইবুক কেনার সময়: নাম, ইমেইল, হোয়াটসঅ্যাপ নম্বর",
          "ওয়েবসাইট ব্যবহারের সাধারণ তথ্য (যেমন কোন পেজ ভিজিট করা হয়েছে) — সেবার মান উন্নত করতে",
        ],
      },
      {
        heading: "তথ্য কী কাজে ব্যবহার করা হয়",
        items: [
          "অর্ডার প্রসেস ও ডেলিভারি করতে",
          "ইমেইল ভেরিফিকেশন (OTP) ও অ্যাকাউন্ট সুরক্ষার জন্য",
          "কেনা ইবুক আপনার প্রোফাইলে সংরক্ষণ করতে, যাতে পরে যেকোনো সময় অ্যাক্সেস করতে পারেন",
          "অর্ডার সংক্রান্ত যোগাযোগ করতে (ডেলিভারি আপডেট, কনফার্মেশন ইত্যাদি)",
        ],
      },
      {
        heading: "তথ্য কারো সাথে শেয়ার করা হয় কি",
        items: [
          "আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের কাছে বিক্রি করা হয় না। শুধুমাত্র অর্ডার ডেলিভারি (কুরিয়ার সার্ভিস) এবং পেমেন্ট প্রসেসিং-এর জন্য প্রয়োজনীয় তথ্য সংশ্লিষ্ট সার্ভিস প্রোভাইডারের সাথে শেয়ার করা হয়।",
        ],
      },
      {
        heading: "তথ্যের সুরক্ষা",
        items: [
          "আপনার তথ্য সুরক্ষিতভাবে সংরক্ষণ করা হয় এবং পাসওয়ার্ড/সেশন এনক্রিপশন ব্যবহার করা হয়। তবে ইন্টারনেটের মাধ্যমে কোনো তথ্য আদান-প্রদান শতভাগ ঝুঁকিমুক্ত নয় — আমরা যথাসাধ্য সুরক্ষা নিশ্চিত করি।",
        ],
      },
      {
        heading: "আপনার অধিকার",
        items: [
          "আপনি যেকোনো সময় আপনার সংরক্ষিত তথ্য দেখতে, সংশোধন করতে বা মুছে ফেলতে অনুরোধ করতে পারেন — আমাদের সাথে যোগাযোগ করে।",
        ],
      },
      {
        heading: "যোগাযোগ",
        items: ["প্রাইভেসি সংক্রান্ত কোনো প্রশ্ন থাকলে আমাদের হোয়াটসঅ্যাপে বা ওয়েবসাইটে দেওয়া যোগাযোগ মাধ্যমে জানান।"],
      },
    ],
  },
  terms: {
    title: "ব্যবহারের শর্তাবলী",
    updatedLabel: "সর্বশেষ হালনাগাদ: ২০২৬",
    intro: "GrowGear ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি নিচের শর্তাবলীতে সম্মত হচ্ছেন। অনুগ্রহ করে অর্ডার করার আগে এগুলো পড়ে নিন।",
    sections: [
      {
        heading: "অর্ডার ও মূল্য",
        items: [
          "ওয়েবসাইটে দেখানো মূল্য সঠিক রাখার চেষ্টা করা হয়, তবে কোনো ত্রুটি হলে অর্ডার কনফার্ম করার আগে জানানো হবে",
          "স্টক সীমিত থাকলে অর্ডার প্রত্যাখ্যান বা বিলম্বিত হতে পারে — এক্ষেত্রে আপনাকে জানানো হবে",
          "প্রোমো কোড/ছাড় নির্দিষ্ট শর্তসাপেক্ষে প্রযোজ্য, এবং যেকোনো সময় পরিবর্তন বা বাতিল করার অধিকার সংরক্ষিত",
        ],
      },
      {
        heading: "পেমেন্ট",
        items: ["ক্যাশ অন ডেলিভারি, বিকাশ এবং কার্ড পেমেন্ট গ্রহণ করা হয়। অনলাইন পেমেন্টের ক্ষেত্রে লেনদেন সুরক্ষিত পেমেন্ট গেটওয়ের মাধ্যমে প্রসেস করা হয়।"],
      },
      {
        heading: "ডেলিভারি",
        items: [
          "শারীরিক পণ্যের (বই, গিয়ার) ক্ষেত্রে ডেলিভারি চার্জ ও সময় এলাকাভেদে পরিবর্তিত হয় — চেকআউটের সময় স্পষ্টভাবে দেখানো হয়। ইবুকের ক্ষেত্রে অর্ডার সম্পন্ন হওয়ার সাথে সাথেই আপনার প্রোফাইলে অ্যাক্সেস পাওয়া যায়, কোনো শিপিং প্রয়োজন নেই।",
        ],
      },
      {
        heading: "মেধাস্বত্ব",
        items: [
          "ওয়েবসাইটের সব কনটেন্ট (লেখা, ডিজাইন, ইবুক, কোর্স কনটেন্ট) GrowGear-এর মেধাস্বত্বের অন্তর্ভুক্ত। কেনা ইবুক/কনটেন্ট শুধুমাত্র ব্যক্তিগত ব্যবহারের জন্য — পুনর্বিতরণ বা পুনর্বিক্রয় নিষিদ্ধ।",
        ],
      },
      {
        heading: "অ্যাকাউন্ট ও নিরাপত্তা",
        items: ["প্রোফাইল লগইন তথ্য গোপন রাখার দায়িত্ব আপনার। সন্দেহজনক কোনো কার্যকলাপ দেখলে সাথে সাথে আমাদের জানান।"],
      },
      {
        heading: "শর্তাবলীর পরিবর্তন",
        items: ["সময়ে সময়ে এই শর্তাবলী হালনাগাদ করা হতে পারে। বড় কোনো পরিবর্তন হলে ওয়েবসাইটে জানিয়ে দেওয়া হবে।"],
      },
      {
        heading: "যোগাযোগ",
        items: ["কোনো প্রশ্ন থাকলে আমাদের হোয়াটসঅ্যাপে যোগাযোগ করুন।"],
      },
    ],
  },
  refund: {
    title: "রিটার্ন ও রিফান্ড পলিসি",
    updatedLabel: "সর্বশেষ হালনাগাদ: ২০২৬",
    intro: "",
    sections: [
      {
        heading: "বই ও গিয়ার (শারীরিক পণ্য)",
        items: [
          "পণ্য ড্যামেজড বা ভুল অবস্থায় পেলে, **ডেলিভারির ২৪ ঘণ্টার মধ্যে** আমাদের জানালে বিনামূল্যে রিপ্লেসমেন্ট ব্যবস্থা করা হবে।",
          "প্রোডাক্টিভিটি গিয়ারের ক্ষেত্রে অতিরিক্তভাবে ৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি প্রযোজ্য — ম্যানুফ্যাকচারিং ত্রুটি থাকলে।",
          "রিপ্লেসমেন্টের জন্য প্যাকেজিং, পণ্যের অবস্থা অপরিবর্তিত থাকতে হবে।",
          "ক্যাশ অন ডেলিভারিতে কেনা পণ্যের ক্ষেত্রে, ডেলিভারির সময় পণ্য যাচাই করে না নিলে কোনো পেমেন্ট করতে হয় না — এক্ষেত্রে আলাদা রিফান্ডের প্রয়োজন হয় না।",
          "অনলাইন পেমেন্টে (বিকাশ/কার্ড) করা অর্ডার বাতিল বা প্রত্যাখ্যাত হলে, যাচাই সাপেক্ষে ৫-৭ কার্যদিবসের মধ্যে রিফান্ড প্রসেস করা হবে।",
        ],
      },
      {
        heading: "ইবুক (ডিজিটাল পণ্য)",
        items: [
          "ইবুক কেনার সাথে সাথে তাৎক্ষণিকভাবে আপনার প্রোফাইলে অ্যাক্সেস দেওয়া হয় বলে, সাধারণত **ডাউনলোড/অ্যাক্সেসের পর রিফান্ড প্রযোজ্য নয়** — এটা ডিজিটাল পণ্যের ক্ষেত্রে সাধারণ নিয়ম। তবে টেকনিক্যাল সমস্যার কারণে (যেমন ফাইল ওপেন না হওয়া, ভুল প্রোডাক্ট ডেলিভারি) আমাদের সাথে যোগাযোগ করলে সমাধান বা প্রযোজ্য ক্ষেত্রে রিফান্ড বিবেচনা করা হবে।",
        ],
      },
      {
        heading: "রিফান্ড কীভাবে পাবেন",
        items: [
          "রিফান্ড অনুমোদিত হলে, যে মাধ্যমে পেমেন্ট করা হয়েছিল সেই একই মাধ্যমে (বিকাশ/কার্ড) ফেরত পাঠানো হবে। প্রসেসিং সময় পেমেন্ট মাধ্যমের উপর নির্ভর করে কিছুটা ভিন্ন হতে পারে।",
        ],
      },
      {
        heading: "কীভাবে যোগাযোগ করবেন",
        items: [
          "রিটার্ন/রিপ্লেসমেন্ট/রিফান্ড সংক্রান্ত যেকোনো অনুরোধের জন্য আপনার অর্ডার আইডি সহ আমাদের হোয়াটসঅ্যাপে যোগাযোগ করুন — যত দ্রুত সম্ভব সমাধান করার চেষ্টা করা হবে।",
        ],
      },
    ],
  },
};

function cleanSection(raw: unknown): LegalSection | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const heading = typeof r.heading === "string" ? r.heading.trim() : "";
  const items = Array.isArray(r.items)
    ? r.items.filter((x): x is string => typeof x === "string" && x.trim().length > 0).map((x) => x.trim())
    : [];
  if (!heading || items.length === 0) return null;
  return { heading, items };
}

function cleanPage(raw: unknown, fallback: LegalPageContent): LegalPageContent {
  if (typeof raw !== "object" || raw === null) return fallback;
  const r = raw as Record<string, unknown>;
  const sections = Array.isArray(r.sections)
    ? r.sections.map(cleanSection).filter((s): s is LegalSection => s !== null)
    : [];
  return {
    title: typeof r.title === "string" && r.title.trim() ? r.title.trim() : fallback.title,
    updatedLabel: typeof r.updatedLabel === "string" && r.updatedLabel.trim() ? r.updatedLabel.trim() : fallback.updatedLabel,
    intro: typeof r.intro === "string" ? r.intro : fallback.intro,
    sections: sections.length > 0 ? sections : fallback.sections,
  };
}

export function getLegalPagesSettings(): LegalPagesSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<Record<keyof LegalPagesSettings, unknown>>;
    return {
      privacy: cleanPage(parsed.privacy, DEFAULTS.privacy),
      terms: cleanPage(parsed.terms, DEFAULTS.terms),
      refund: cleanPage(parsed.refund, DEFAULTS.refund),
    };
  } catch {
    return DEFAULTS;
  }
}

export function getLegalPage(page: keyof LegalPagesSettings): LegalPageContent {
  return getLegalPagesSettings()[page];
}

export function setLegalPage(page: keyof LegalPagesSettings, content: LegalPageContent): LegalPagesSettings {
  const current = getLegalPagesSettings();
  const next: LegalPagesSettings = { ...current, [page]: cleanPage(content, current[page]) };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}
