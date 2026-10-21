import fs from "fs";
import path from "path";

export interface TrustStripItem {
  label: string;
  desc: string;
}

export interface NewsletterTopicCopy {
  title: string;
  desc: string;
}

export interface SiteTextSettings {
  heroHeadline: string;
  heroSubheading: string;
  heroMission: string;
  heroCollectionsLabel: string;

  trustStrip: TrustStripItem[];

  newsletterBadge: string;
  newsletterHeadline: string;
  newsletterDescription: string;
  newsletterTopics: NewsletterTopicCopy[];

  footerAboutTitle: string;
  footerShopTitle: string;
  footerLearnTitle: string;
  footerSupportTitle: string;
  footerCopyright: string;

  purchaseToastBoughtText: string;
  purchaseToastMinutesAgoSuffix: string;

  blogTopicTilesHeading: string;
}

const FILE_PATH = path.join(process.cwd(), "data", "site-text-settings.json");

const DEFAULTS: SiteTextSettings = {
  heroHeadline: "ভালো বই, স্মার্ট টুলস — আপনার গ্রোথের জন্য সব একসাথে",
  heroSubheading: "৯০+ বই, ইবুক ও প্রোডাক্টিভিটি গিয়ার, সারাদেশে ক্যাশ অন ডেলিভারিতে",
  heroMission: "আমাদের লক্ষ্য — প্রতিটি মানুষকে সঠিক দিকনির্দেশনার মাধ্যমে (guided way) নিজের জীবনে এগিয়ে যেতে সাহায্য করা।",
  heroCollectionsLabel: "আপনার দরকার অনুযায়ী কিনুন",

  trustStrip: [
    { label: "সারাদেশে ডেলিভারি", desc: "২৪-৭২ ঘণ্টায়" },
    { label: "ক্যাশ অন ডেলিভারি", desc: "হাতে পেয়ে টাকা দিন" },
    { label: "৭ দিনের রিপ্লেসমেন্ট", desc: "সমস্যা হলে পরিবর্তন" },
    { label: "কাস্টমার সাপোর্ট", desc: "প্রতিদিন সকাল ৯টা - রাত ১০টা" },
  ],

  newsletterBadge: "সাবস্ক্রাইব করলেই একটি প্রিমিয়াম ব্লগ সম্পূর্ণ ফ্রি",
  newsletterHeadline: "মিস করবেন না — GrowGear নিউজলেটারে যুক্ত হন",
  newsletterDescription: "প্রতি সপ্তাহে ব্যবসা, প্রোডাক্টিভিটি ও গ্রোথ নিয়ে সেরা লেখাগুলো সরাসরি আপনার ইনবক্সে — বিনামূল্যে।",
  newsletterTopics: [
    { title: "সাপ্তাহিক বিজনেস ইনসাইট", desc: "ব্যবসা ও উদ্যোক্তা হওয়ার বাস্তব শিক্ষা" },
    { title: "প্রোডাক্টিভিটি টিপস", desc: "প্রতি সপ্তাহে একটি করে কার্যকর কৌশল" },
    { title: "মার্কেটিং ও সেলস আপডেট", desc: "গ্রোথ, ব্র্যান্ডিং ও বিক্রি বাড়ানোর কৌশল" },
  ],

  footerAboutTitle: "GrowGear সম্পর্কে",
  footerShopTitle: "কিনুন",
  footerLearnTitle: "শিখুন",
  footerSupportTitle: "গ্রাহক সেবা",
  footerCopyright: "© ২০২৬ GrowGear. সর্বস্বত্ব সংরক্ষিত। সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা।",

  purchaseToastBoughtText: "কিনেছেন",
  purchaseToastMinutesAgoSuffix: "মিনিট আগে",

  blogTopicTilesHeading: "বিষয় অনুযায়ী ব্লগ দেখুন",
};

function cleanTrustStrip(raw: unknown): TrustStripItem[] {
  if (!Array.isArray(raw) || raw.length !== 4) return DEFAULTS.trustStrip;
  const cleaned = raw.map((item, i) => ({
    label: typeof item?.label === "string" && item.label.trim() ? item.label.trim() : DEFAULTS.trustStrip[i].label,
    desc: typeof item?.desc === "string" && item.desc.trim() ? item.desc.trim() : DEFAULTS.trustStrip[i].desc,
  }));
  return cleaned;
}

function cleanNewsletterTopics(raw: unknown): NewsletterTopicCopy[] {
  if (!Array.isArray(raw) || raw.length !== 3) return DEFAULTS.newsletterTopics;
  return raw.map((item, i) => ({
    title: typeof item?.title === "string" && item.title.trim() ? item.title.trim() : DEFAULTS.newsletterTopics[i].title,
    desc: typeof item?.desc === "string" && item.desc.trim() ? item.desc.trim() : DEFAULTS.newsletterTopics[i].desc,
  }));
}

function str(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function getSiteTextSettings(): SiteTextSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<SiteTextSettings>;
    return {
      heroHeadline: str(parsed.heroHeadline, DEFAULTS.heroHeadline),
      heroSubheading: str(parsed.heroSubheading, DEFAULTS.heroSubheading),
      heroMission: str(parsed.heroMission, DEFAULTS.heroMission),
      heroCollectionsLabel: str(parsed.heroCollectionsLabel, DEFAULTS.heroCollectionsLabel),
      trustStrip: cleanTrustStrip(parsed.trustStrip),
      newsletterBadge: str(parsed.newsletterBadge, DEFAULTS.newsletterBadge),
      newsletterHeadline: str(parsed.newsletterHeadline, DEFAULTS.newsletterHeadline),
      newsletterDescription: str(parsed.newsletterDescription, DEFAULTS.newsletterDescription),
      newsletterTopics: cleanNewsletterTopics(parsed.newsletterTopics),
      footerAboutTitle: str(parsed.footerAboutTitle, DEFAULTS.footerAboutTitle),
      footerShopTitle: str(parsed.footerShopTitle, DEFAULTS.footerShopTitle),
      footerLearnTitle: str(parsed.footerLearnTitle, DEFAULTS.footerLearnTitle),
      footerSupportTitle: str(parsed.footerSupportTitle, DEFAULTS.footerSupportTitle),
      footerCopyright: str(parsed.footerCopyright, DEFAULTS.footerCopyright),
      purchaseToastBoughtText: str(parsed.purchaseToastBoughtText, DEFAULTS.purchaseToastBoughtText),
      purchaseToastMinutesAgoSuffix: str(parsed.purchaseToastMinutesAgoSuffix, DEFAULTS.purchaseToastMinutesAgoSuffix),
      blogTopicTilesHeading: str(parsed.blogTopicTilesHeading, DEFAULTS.blogTopicTilesHeading),
    };
  } catch {
    return DEFAULTS;
  }
}

export function setSiteTextSettings(update: Partial<SiteTextSettings>): SiteTextSettings {
  const current = getSiteTextSettings();
  const next: SiteTextSettings = {
    heroHeadline: update.heroHeadline !== undefined ? str(update.heroHeadline, current.heroHeadline) : current.heroHeadline,
    heroSubheading:
      update.heroSubheading !== undefined ? str(update.heroSubheading, current.heroSubheading) : current.heroSubheading,
    heroMission: update.heroMission !== undefined ? str(update.heroMission, current.heroMission) : current.heroMission,
    heroCollectionsLabel:
      update.heroCollectionsLabel !== undefined
        ? str(update.heroCollectionsLabel, current.heroCollectionsLabel)
        : current.heroCollectionsLabel,
    trustStrip: update.trustStrip !== undefined ? cleanTrustStrip(update.trustStrip) : current.trustStrip,
    newsletterBadge:
      update.newsletterBadge !== undefined ? str(update.newsletterBadge, current.newsletterBadge) : current.newsletterBadge,
    newsletterHeadline:
      update.newsletterHeadline !== undefined
        ? str(update.newsletterHeadline, current.newsletterHeadline)
        : current.newsletterHeadline,
    newsletterDescription:
      update.newsletterDescription !== undefined
        ? str(update.newsletterDescription, current.newsletterDescription)
        : current.newsletterDescription,
    newsletterTopics:
      update.newsletterTopics !== undefined ? cleanNewsletterTopics(update.newsletterTopics) : current.newsletterTopics,
    footerAboutTitle:
      update.footerAboutTitle !== undefined ? str(update.footerAboutTitle, current.footerAboutTitle) : current.footerAboutTitle,
    footerShopTitle:
      update.footerShopTitle !== undefined ? str(update.footerShopTitle, current.footerShopTitle) : current.footerShopTitle,
    footerLearnTitle:
      update.footerLearnTitle !== undefined ? str(update.footerLearnTitle, current.footerLearnTitle) : current.footerLearnTitle,
    footerSupportTitle:
      update.footerSupportTitle !== undefined
        ? str(update.footerSupportTitle, current.footerSupportTitle)
        : current.footerSupportTitle,
    footerCopyright:
      update.footerCopyright !== undefined ? str(update.footerCopyright, current.footerCopyright) : current.footerCopyright,
    purchaseToastBoughtText:
      update.purchaseToastBoughtText !== undefined
        ? str(update.purchaseToastBoughtText, current.purchaseToastBoughtText)
        : current.purchaseToastBoughtText,
    purchaseToastMinutesAgoSuffix:
      update.purchaseToastMinutesAgoSuffix !== undefined
        ? str(update.purchaseToastMinutesAgoSuffix, current.purchaseToastMinutesAgoSuffix)
        : current.purchaseToastMinutesAgoSuffix,
    blogTopicTilesHeading:
      update.blogTopicTilesHeading !== undefined
        ? str(update.blogTopicTilesHeading, current.blogTopicTilesHeading)
        : current.blogTopicTilesHeading,
  };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}
