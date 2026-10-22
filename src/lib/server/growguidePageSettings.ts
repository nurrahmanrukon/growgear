import fs from "fs";
import path from "path";

export interface GrowGuideHeroSlide {
  title: string;
  body: string;
}
export interface GrowGuideStep {
  title: string;
  body: string;
}
export interface GrowGuideTextReview {
  name: string;
  role: string;
  quote: string;
  rating: number;
}
export interface GrowGuideSocialPost {
  name: string;
  text: string;
  likes: number;
  hoursAgo: number;
}

export interface GrowGuidePageSettings {
  indexHiddenHeading: string;
  mainMessageEyebrow: string;
  mainMessageHeading: string;
  mainMessageParagraph: string;
  videoComingSoonSuffix: string;
  indexVideoCaption: string;
  whyJoinEyebrow: string;
  whyJoinHeading: string;
  testimonialsHeadingSuffix: string;

  heroSlides: GrowGuideHeroSlide[];

  joinFormEyebrow: string;
  joinFormWhatsIncludedLabel: string;
  joinFormNextSessionTemplate: string;
  joinFormNextSessionDate: string;
  joinFormNextSessionTime: string;
  joinFormSegmentLabel: string;
  joinFormSegmentTarget: number;
  joinFormSegmentJoined: number;
  joinFormJoinedCountTemplate: string;
  joinFormTargetCountTemplate: string;
  joinFormProgressCaptionTemplate: string;
  joinFormEmailPlaceholder: string;
  joinFormEmailErrorText: string;
  joinFormPhonePlaceholder: string;
  joinFormPhoneErrorText: string;
  joinFormSubmitButtonLabel: string;
  joinFormJoinedConfirmationTemplate: string;
  joinFormFooterNote: string;

  stepsHeading: string;
  steps: GrowGuideStep[];

  authorInitial: string;
  authorName: string;
  authorRole: string;
  authorBio: string;

  communityHeading: string;
  communityBody: string;

  reviewsEyebrow: string;
  reviewsHeading: string;
  textReviews: GrowGuideTextReview[];
  videoReviews: GrowGuideTextReview[];
  videoReviewCaptionTemplate: string;

  socialProofEyebrow: string;
  socialProofHeading: string;
  socialProofSubheading: string;
  socialPosts: GrowGuideSocialPost[];
}

const FILE_PATH = path.join(process.cwd(), "data", "growguide-page-settings.json");

const HERO_SLIDE_COUNT = 11;
const STEP_COUNT = 4;
const TEXT_REVIEW_COUNT = 4;
const VIDEO_REVIEW_COUNT = 2;
const SOCIAL_POST_COUNT = 6;

const DEFAULTS: GrowGuidePageSettings = {
  indexHiddenHeading: "শিক্ষার্থী, প্রফেশনাল ও উদ্যোক্তাদের গাইডেড ওয়েতে গ্রো করতে সাহায্য করি",
  mainMessageEyebrow: "মূল বার্তা",
  mainMessageHeading: "নূর রহমানের কাছ থেকে সরাসরি শুনুন",
  mainMessageParagraph:
    "প্রতি মাসে একটি নির্দিষ্ট সময়ে সম্পূর্ণ ফ্রি লাইভ ওয়েবিনার — শিক্ষার্থী, প্রফেশনাল ও উদ্যোক্তাদের জন্য। এটা আমার কমিউনিটি গড়ে তোলা এবং সমাজে অবদান রাখার একটা প্রচেষ্টা।",
  videoComingSoonSuffix: "(শীঘ্রই যুক্ত হবে)",
  indexVideoCaption: "নূর রহমানের বার্তা",
  whyJoinEyebrow: "কেন যোগ দেবেন",
  whyJoinHeading: "এই ওয়েবিনারে অংশ নিলে আপনার জীবনে যা বদলাবে",
  testimonialsHeadingSuffix: " রা যা বলছেন",

  heroSlides: [
    { title: "GrowGuide কী?", body: "শিক্ষার্থী, প্রফেশনাল ও উদ্যোক্তাদের গাইডেড ওয়েতে গ্রো করতে সাহায্য করার একটি উদ্যোগ।" },
    { title: "মাসে একটি ফ্রি লাইভ ওয়েবিনার", body: "প্রতি মাসে একটি নির্দিষ্ট সময়ে সম্পূর্ণ ফ্রি লাইভ সেশন আয়োজন করা হয়।" },
    { title: "শিক্ষার্থীদের জন্য", body: "পড়াশোনার পাশাপাশি ক্যারিয়ার প্রস্তুতি ও ব্যক্তিগত গ্রোথের গাইডেড রোডম্যাপ।" },
    { title: "প্রফেশনালদের জন্য", body: "কর্মক্ষেত্রে প্রোডাক্টিভিটি বাড়ানো ও সঠিক সিদ্ধান্ত নেওয়ার বাস্তবসম্মত কৌশল।" },
    { title: "উদ্যোক্তাদের জন্য", body: "ব্যবসা বড় করা ও ঝুঁকি কমিয়ে দ্রুত সিদ্ধান্ত নেওয়ার দিকনির্দেশনা।" },
    { title: "নূর রহমান সরাসরি হোস্ট করেন", body: "প্রতিটি সেশনে নূর রহমান নিজে সরাসরি অংশগ্রহণকারীদের সাথে কথা বলেন।" },
    { title: "লাইভ প্রশ্নোত্তর", body: "সেশন চলাকালীন সরাসরি প্রশ্ন করার সুযোগ পাবেন, নূর রহমান নিজে উত্তর দেন।" },
    { title: "প্রাইভেট কমিউনিটি গ্রুপ", body: "সেশন শেষে একটি প্রাইভেট গ্রুপে যুক্ত হবেন, যেখানে সবাই একে অপরকে সাহায্য করে।" },
    { title: "সম্পূর্ণ ফ্রি", body: "কোনো লুকানো ফি নেই — নিবন্ধন থেকে সেশন পর্যন্ত সবকিছুই বিনামূল্যে।" },
    { title: "কমিউনিটি গড়ে তোলার উদ্যোগ", body: "এটি নূর রহমানের ব্যক্তিগত কমিউনিটি গড়ে তোলা ও সমাজে অবদান রাখার একটা প্রচেষ্টা।" },
    { title: "এখনই জয়েন করুন", body: "নিচে ইমেইল দিয়ে ফ্রি-তে জয়েন করুন — পরবর্তী সেশনের সময়সূচি ইমেইলে পেয়ে যাবেন।" },
  ],

  joinFormEyebrow: "ফ্রি লাইভ ওয়েবিনার",
  joinFormWhatsIncludedLabel: "এই ওয়েবিনারে যা থাকছে",
  joinFormNextSessionTemplate: "পরবর্তী সেশন: {date}, {time}",
  joinFormNextSessionDate: "৩ অক্টোবর",
  joinFormNextSessionTime: "রাত ৮:৩০",
  joinFormSegmentLabel: "চলতি সেগমেন্ট",
  joinFormSegmentTarget: 500,
  joinFormSegmentJoined: 342,
  joinFormJoinedCountTemplate: "{count} জন যুক্ত হয়েছেন",
  joinFormTargetCountTemplate: "{count} জন প্রয়োজন",
  joinFormProgressCaptionTemplate: "{segmentLabel}-এ {target} জন হলেই ওয়েবিনার শুরু হবে",
  joinFormEmailPlaceholder: "আপনার ইমেইল ঠিকানা",
  joinFormEmailErrorText: "সঠিক ইমেইল ঠিকানা দিন",
  joinFormPhonePlaceholder: "আপনার হোয়াটসঅ্যাপ নম্বর",
  joinFormPhoneErrorText: "সঠিক হোয়াটসঅ্যাপ নম্বর দিন",
  joinFormSubmitButtonLabel: "ফ্রি-তে জয়েন করুন",
  joinFormJoinedConfirmationTemplate:
    "আপনি সফলভাবে যুক্ত হয়েছেন — {target} জন পূর্ণ হলে ওয়েবিনারের লিংক ইমেইল ও হোয়াটসঅ্যাপে পাঠানো হবে",
  joinFormFooterNote: "সম্পূর্ণ ফ্রি — কোনো পেমেন্ট লাগবে না",

  stepsHeading: "যেভাবে কাজ করে",
  steps: [
    {
      title: "ফ্রি-তে সেগমেন্টে জয়েন করুন",
      body: "আপনার ইমেইল দিয়ে চলতি সেগমেন্টে যুক্ত হন — সম্পূর্ণ বিনামূল্যে, কোনো পেমেন্ট লাগবে না।",
    },
    {
      title: "৫০০ জন হলেই ওয়েবিনার শুরু",
      body: "প্রতিটি সেগমেন্টে ৫০০ জন যুক্ত হওয়ার সাথে সাথে সেই সেগমেন্টের জন্য লাইভ ওয়েবিনারের সময়সূচি ইমেইলে পাঠানো হবে।",
    },
    {
      title: "ওয়েবিনারে ফ্রি রিসোর্স পাবেন",
      body: "নূর রহমান নিজে লাইভ ওয়েবিনারে জীবনে গাইডেড ওয়েতে গ্রো করার বাস্তবসম্মত রিসোর্স ও ধাপে ধাপে পরিকল্পনা শেয়ার করবেন।",
    },
    {
      title: "প্রাইভেট কমিউনিটি গ্রুপে যুক্ত হন",
      body: "ওয়েবিনার শেষে একটি প্রাইভেট কমিউনিটি গ্রুপে যুক্ত হবেন, যেখানে সবাই মিলে একে অপরকে সাহায্য করবে।",
    },
  ],

  authorInitial: "নূ",
  authorName: "নূর রহমান",
  authorRole: "প্রতিষ্ঠাতা, GrowGear · GrowGuide হোস্ট",
  authorBio:
    "প্রতিটি ওয়েবিনারে নূর রহমান সরাসরি নিজে অংশগ্রহণকারীদের সাথে কথা বলেন, তাদের প্রশ্নের উত্তর দেন এবং জীবনে গাইডেড ওয়েতে গ্রো করার জন্য বাস্তবসম্মত, ধাপে ধাপে দিকনির্দেশনা দেন — সম্পূর্ণ ফ্রি-তে।",

  communityHeading: "প্রাইভেট কমিউনিটি গ্রুপ",
  communityBody:
    "ওয়েবিনার শেষে আপনাকে একটি প্রাইভেট কমিউনিটি গ্রুপে যুক্ত করা হবে — সম্পূর্ণ ফ্রি। এখানে নূর রহমানসহ সবাই একে অপরকে সাহায্য করে, অভিজ্ঞতা শেয়ার করে এবং একসাথে জীবনে গ্রো করার পথে এগিয়ে যায়।",

  reviewsEyebrow: "অংশগ্রহণকারীদের মতামত",
  reviewsHeading: "যারা সেশনে যুক্ত হয়েছেন, তারা কী বলছেন",
  textReviews: [
    { name: "তানভীর আহমেদ", role: "শিক্ষার্থী", quote: "সেশনটা এতটাই বাস্তবসম্মত ছিল যে সাথে সাথে নিজের রুটিনে প্রয়োগ করতে পেরেছি।", rating: 5 },
    { name: "নুসরাত জাহান", role: "প্রফেশনাল", quote: "নূর রহমান নিজেই প্রশ্নের উত্তর দিয়েছেন, একদমই কমার্শিয়াল মনে হয়নি।", rating: 5 },
    { name: "রাকিবুল হাসান", role: "উদ্যোক্তা", quote: "ব্যবসার সিদ্ধান্ত নেওয়ার একটা স্পষ্ট ফ্রেমওয়ার্ক পেয়েছি, একদম ফ্রি-তে।", rating: 4.5 },
    { name: "সাদিয়া ইসলাম", role: "শিক্ষার্থী", quote: "কমিউনিটি গ্রুপে যুক্ত হয়ে অনেক নতুন মানুষের সাথে পরিচয় হয়েছে।", rating: 5 },
  ],
  videoReviews: [
    { name: "ইশরাত হোসেন", role: "প্রফেশনাল", quote: "কর্মক্ষেত্রে সিদ্ধান্ত নেওয়ার ক্ষেত্রে এই ফ্রেমওয়ার্কটা সত্যিই কাজে লেগেছে।", rating: 4.5 },
    { name: "ফারহানা কবির", role: "উদ্যোক্তা", quote: "টিম নিয়ে এগিয়ে যাওয়ার ব্যাপারে অনেক প্র্যাক্টিক্যাল টিপস পেয়েছি।", rating: 5 },
  ],
  videoReviewCaptionTemplate: "{name} — ভিডিও রিভিউ (শীঘ্রই যুক্ত হবে)",

  socialProofEyebrow: "সামাজিক মাধ্যমে আলোচনা",
  socialProofHeading: "GrowGuide নিয়ে সোশ্যাল মিডিয়ায় যা বলা হচ্ছে",
  socialProofSubheading: "ফেসবুক, ইনস্টাগ্রাম ও হোয়াটসঅ্যাপে অংশগ্রহণকারীদের আসল মন্তব্যের স্ক্রিনশট",
  socialPosts: [
    { name: "তানভীর আহমেদ", text: "GrowGuide এর ওয়েবিনারে জয়েন করেছিলাম, একদম বিনামূল্যে এত ভালো কনটেন্ট পাব ভাবিনি! 🔥", likes: 87, hoursAgo: 3 },
    { name: "নুসরাত জাহান", text: "নূর রহমান নিজে লাইভে প্রশ্নের উত্তর দিয়েছেন, একদমই কমার্শিয়াল মনে হয়নি ❤️", likes: 154, hoursAgo: 6 },
    { name: "রাকিবুল হাসান", text: "কমিউনিটি গ্রুপে যুক্ত হয়ে অনেক নতুন মানুষের সাথে পরিচয় হয়েছে, সবাই খুব হেল্পফুল।", likes: 42, hoursAgo: 12 },
    { name: "সাদিয়া ইসলাম", text: "পরের সেশন কবে? আগেরটা মিস করেছিলাম, এবার অবশ্যই জয়েন করবো 🙌", likes: 63, hoursAgo: 18 },
    { name: "ইশরাত হোসেন", text: "সেশনের রেকর্ডিং কমিউনিটি গ্রুপে পেয়ে গেছি, পুরোটা দেখে ফেলেছি। সত্যিই worth it 👍", likes: 98, hoursAgo: 9 },
    { name: "ফারহানা কবির", text: "টিম নিয়ে এগিয়ে যাওয়ার ব্যাপারে অনেক প্র্যাক্টিক্যাল টিপস পেয়েছি, ধন্যবাদ নূর রহমান।", likes: 71, hoursAgo: 21 },
  ],
};

function cleanString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}
function cleanNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function cleanFixedArray<T>(
  raw: unknown,
  fallback: T[],
  count: number,
  cleanItem: (item: unknown, fallbackItem: T) => T
): T[] {
  if (!Array.isArray(raw) || raw.length !== count) return fallback;
  return raw.map((item, i) => cleanItem(item, fallback[i]));
}

function cleanHeroSlide(raw: unknown, fallback: GrowGuideHeroSlide): GrowGuideHeroSlide {
  const c = (raw ?? {}) as Partial<GrowGuideHeroSlide>;
  return { title: cleanString(c.title, fallback.title), body: cleanString(c.body, fallback.body) };
}
function cleanStep(raw: unknown, fallback: GrowGuideStep): GrowGuideStep {
  const c = (raw ?? {}) as Partial<GrowGuideStep>;
  return { title: cleanString(c.title, fallback.title), body: cleanString(c.body, fallback.body) };
}
function cleanTextReview(raw: unknown, fallback: GrowGuideTextReview): GrowGuideTextReview {
  const c = (raw ?? {}) as Partial<GrowGuideTextReview>;
  return {
    name: cleanString(c.name, fallback.name),
    role: cleanString(c.role, fallback.role),
    quote: cleanString(c.quote, fallback.quote),
    rating: cleanNumber(c.rating, fallback.rating),
  };
}
function cleanSocialPost(raw: unknown, fallback: GrowGuideSocialPost): GrowGuideSocialPost {
  const c = (raw ?? {}) as Partial<GrowGuideSocialPost>;
  return {
    name: cleanString(c.name, fallback.name),
    text: cleanString(c.text, fallback.text),
    likes: cleanNumber(c.likes, fallback.likes),
    hoursAgo: cleanNumber(c.hoursAgo, fallback.hoursAgo),
  };
}

function cleanSettings(parsed: Partial<GrowGuidePageSettings>): GrowGuidePageSettings {
  return {
    indexHiddenHeading: cleanString(parsed.indexHiddenHeading, DEFAULTS.indexHiddenHeading),
    mainMessageEyebrow: cleanString(parsed.mainMessageEyebrow, DEFAULTS.mainMessageEyebrow),
    mainMessageHeading: cleanString(parsed.mainMessageHeading, DEFAULTS.mainMessageHeading),
    mainMessageParagraph: cleanString(parsed.mainMessageParagraph, DEFAULTS.mainMessageParagraph),
    videoComingSoonSuffix: cleanString(parsed.videoComingSoonSuffix, DEFAULTS.videoComingSoonSuffix),
    indexVideoCaption: cleanString(parsed.indexVideoCaption, DEFAULTS.indexVideoCaption),
    whyJoinEyebrow: cleanString(parsed.whyJoinEyebrow, DEFAULTS.whyJoinEyebrow),
    whyJoinHeading: cleanString(parsed.whyJoinHeading, DEFAULTS.whyJoinHeading),
    testimonialsHeadingSuffix: cleanString(parsed.testimonialsHeadingSuffix, DEFAULTS.testimonialsHeadingSuffix),

    heroSlides: cleanFixedArray(parsed.heroSlides, DEFAULTS.heroSlides, HERO_SLIDE_COUNT, cleanHeroSlide),

    joinFormEyebrow: cleanString(parsed.joinFormEyebrow, DEFAULTS.joinFormEyebrow),
    joinFormWhatsIncludedLabel: cleanString(parsed.joinFormWhatsIncludedLabel, DEFAULTS.joinFormWhatsIncludedLabel),
    joinFormNextSessionTemplate: cleanString(parsed.joinFormNextSessionTemplate, DEFAULTS.joinFormNextSessionTemplate),
    joinFormNextSessionDate: cleanString(parsed.joinFormNextSessionDate, DEFAULTS.joinFormNextSessionDate),
    joinFormNextSessionTime: cleanString(parsed.joinFormNextSessionTime, DEFAULTS.joinFormNextSessionTime),
    joinFormSegmentLabel: cleanString(parsed.joinFormSegmentLabel, DEFAULTS.joinFormSegmentLabel),
    joinFormSegmentTarget: cleanNumber(parsed.joinFormSegmentTarget, DEFAULTS.joinFormSegmentTarget),
    joinFormSegmentJoined: cleanNumber(parsed.joinFormSegmentJoined, DEFAULTS.joinFormSegmentJoined),
    joinFormJoinedCountTemplate: cleanString(parsed.joinFormJoinedCountTemplate, DEFAULTS.joinFormJoinedCountTemplate),
    joinFormTargetCountTemplate: cleanString(parsed.joinFormTargetCountTemplate, DEFAULTS.joinFormTargetCountTemplate),
    joinFormProgressCaptionTemplate: cleanString(
      parsed.joinFormProgressCaptionTemplate,
      DEFAULTS.joinFormProgressCaptionTemplate
    ),
    joinFormEmailPlaceholder: cleanString(parsed.joinFormEmailPlaceholder, DEFAULTS.joinFormEmailPlaceholder),
    joinFormEmailErrorText: cleanString(parsed.joinFormEmailErrorText, DEFAULTS.joinFormEmailErrorText),
    joinFormPhonePlaceholder: cleanString(parsed.joinFormPhonePlaceholder, DEFAULTS.joinFormPhonePlaceholder),
    joinFormPhoneErrorText: cleanString(parsed.joinFormPhoneErrorText, DEFAULTS.joinFormPhoneErrorText),
    joinFormSubmitButtonLabel: cleanString(parsed.joinFormSubmitButtonLabel, DEFAULTS.joinFormSubmitButtonLabel),
    joinFormJoinedConfirmationTemplate: cleanString(
      parsed.joinFormJoinedConfirmationTemplate,
      DEFAULTS.joinFormJoinedConfirmationTemplate
    ),
    joinFormFooterNote: cleanString(parsed.joinFormFooterNote, DEFAULTS.joinFormFooterNote),

    stepsHeading: cleanString(parsed.stepsHeading, DEFAULTS.stepsHeading),
    steps: cleanFixedArray(parsed.steps, DEFAULTS.steps, STEP_COUNT, cleanStep),

    authorInitial: cleanString(parsed.authorInitial, DEFAULTS.authorInitial),
    authorName: cleanString(parsed.authorName, DEFAULTS.authorName),
    authorRole: cleanString(parsed.authorRole, DEFAULTS.authorRole),
    authorBio: cleanString(parsed.authorBio, DEFAULTS.authorBio),

    communityHeading: cleanString(parsed.communityHeading, DEFAULTS.communityHeading),
    communityBody: cleanString(parsed.communityBody, DEFAULTS.communityBody),

    reviewsEyebrow: cleanString(parsed.reviewsEyebrow, DEFAULTS.reviewsEyebrow),
    reviewsHeading: cleanString(parsed.reviewsHeading, DEFAULTS.reviewsHeading),
    textReviews: cleanFixedArray(parsed.textReviews, DEFAULTS.textReviews, TEXT_REVIEW_COUNT, cleanTextReview),
    videoReviews: cleanFixedArray(parsed.videoReviews, DEFAULTS.videoReviews, VIDEO_REVIEW_COUNT, cleanTextReview),
    videoReviewCaptionTemplate: cleanString(parsed.videoReviewCaptionTemplate, DEFAULTS.videoReviewCaptionTemplate),

    socialProofEyebrow: cleanString(parsed.socialProofEyebrow, DEFAULTS.socialProofEyebrow),
    socialProofHeading: cleanString(parsed.socialProofHeading, DEFAULTS.socialProofHeading),
    socialProofSubheading: cleanString(parsed.socialProofSubheading, DEFAULTS.socialProofSubheading),
    socialPosts: cleanFixedArray(parsed.socialPosts, DEFAULTS.socialPosts, SOCIAL_POST_COUNT, cleanSocialPost),
  };
}

export function getGrowGuidePageSettings(): GrowGuidePageSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    return cleanSettings(JSON.parse(raw) as Partial<GrowGuidePageSettings>);
  } catch {
    return DEFAULTS;
  }
}

export function setGrowGuidePageSettings(update: Partial<GrowGuidePageSettings>): GrowGuidePageSettings {
  const current = getGrowGuidePageSettings();
  const next = cleanSettings({ ...current, ...update });
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}
