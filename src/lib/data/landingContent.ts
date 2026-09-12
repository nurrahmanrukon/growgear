import { Product } from "@/lib/types";
import { hashString, PERSON_NAMES, BD_LOCATIONS } from "@/lib/data/social";

/** Deterministic long-form landing-page content generators for book/ebook product pages.
 *  Everything here is generic (no real third-party names/claims) and seeded from the
 *  product id so each of the 30 books / 30 ebooks gets a stable but varied page. */

export interface PainPoint {
  title: string;
  body: string;
}

const PAIN_POINT_POOL: PainPoint[] = [
  {
    title: "প্রতিদিন ব্যস্ত, তবুও আগাচ্ছেন না",
    body: "সারাদিন কাজ করেও মনে হয় জায়গায় দাঁড়িয়ে আছেন — মাসের পর মাস একই বৃত্তে ঘুরপাক খাচ্ছেন।",
  },
  {
    title: "সঠিক সিদ্ধান্ত নিতে ভয় লাগে",
    body: "প্রতিটা গুরুত্বপূর্ণ মুহূর্তে দ্বিধায় পড়ে যান — ভুল হয়ে গেলে কী হবে, এই ভয়ে সময় নষ্ট হয়।",
  },
  {
    title: "জানেন কী করতে হবে, কিন্তু করে উঠতে পারেন না",
    body: "থিওরি সবই জানা আছে, কিন্তু বাস্তবে প্রয়োগ করার মতো একটা স্পষ্ট, ধাপে ধাপে সিস্টেম হাতে নেই।",
  },
  {
    title: "চারদিকে তথ্যের ভিড়, কিন্তু দিকনির্দেশনা নেই",
    body: "হাজারো আর্টিকেল, ভিডিও পড়ে-দেখেও কোনটা আসলে কাজে লাগবে সেটা বুঝে উঠতে পারছেন না।",
  },
  {
    title: "একা একা লড়াই করছেন মনে হয়",
    body: "যাদের কাছ থেকে শেখা যায়, এমন একজন গাইড বা মেন্টর পাশে নেই — সব কিছু ট্রায়াল অ্যান্ড এরর দিয়ে শিখতে হচ্ছে।",
  },
  {
    title: "সময় দ্রুত ফুরিয়ে যাচ্ছে",
    body: "বয়স বাড়ছে, দায়িত্ব বাড়ছে — কিন্তু যে পরিবর্তনটা দরকার সেটা শুরু করার সাহস বা সময় জোগাড় করা হচ্ছে না।",
  },
  {
    title: "ছোট ছোট ভুল বারবার হচ্ছে",
    body: "একই ধরনের ভুল বারবার করছেন, কারণ ভুলগুলো ঠিক কোথায় হচ্ছে সেটা চিহ্নিত করার কোনো ফ্রেমওয়ার্ক নেই।",
  },
  {
    title: "অন্যদের এগিয়ে যেতে দেখছেন",
    body: "আশেপাশের মানুষ এগিয়ে যাচ্ছে, অথচ নিজের অগ্রগতি থমকে আছে — এই তুলনাটা প্রতিদিন কষ্ট দেয়।",
  },
];

export function getPainPoints(product: Product, count = 3): PainPoint[] {
  const seed = hashString(product.id + ":pain");
  const start = seed % PAIN_POINT_POOL.length;
  const picked: PainPoint[] = [];
  for (let i = 0; i < count; i++) {
    picked.push(PAIN_POINT_POOL[(start + i) % PAIN_POINT_POOL.length]);
  }
  return picked;
}

export interface AuthorProfile {
  name: string;
  title: string;
  bio: string;
  stats: { label: string; value: string }[];
}

export function getAuthorProfile(product: Product): AuthorProfile {
  const name = product.author ?? "গ্রোগিয়ার টিম";
  const seed = hashString(product.id + ":author");
  const years = 6 + (seed % 12);
  const readers = 8 + (Math.floor(seed / 7) % 40);
  const sessions = 30 + (Math.floor(seed / 13) % 250);

  if (product.category === "gear") {
    return {
      name,
      title: "প্রোডাক্ট ডিজাইন টিম",
      bio: `${name} দীর্ঘদিন ধরে প্রোডাক্টিভিটি এক্সেসরি নিয়ে কাজ করছে — প্রতিদিনের ব্যবহারকারীদের ফিডব্যাক, মানসম্পন্ন উপকরণ আর সহজ ডিজাইনের সমন্বয়ে তৈরি হয়েছে "${product.title}"। কোনো অপ্রয়োজনীয় ফিচার নেই, যা রাখা হয়েছে তার প্রতিটাই কাজে লাগে।`,
      stats: [
        { label: "বছরের অভিজ্ঞতা", value: `${years}+` },
        { label: "হাজার ব্যবহারকারী", value: `${readers}+` },
        { label: "কোয়ালিটি চেক", value: `${sessions}+` },
      ],
    };
  }

  return {
    name,
    title:
      product.category === "book"
        ? "লেখক ও কনটেন্ট ক্রিয়েটর"
        : "প্র্যাক্টিশনার ও প্রশিক্ষক",
    bio: `${name} দীর্ঘদিন ধরে এই বিষয় নিয়ে কাজ করছেন — বাস্তব অভিজ্ঞতা, গবেষণা আর হাজারো মানুষের সাথে কাজ করার শিক্ষা মিলিয়ে তৈরি হয়েছে "${product.title}"। এখানে কোনো তত্ত্বকথা নেই, যা লেখা হয়েছে তার প্রতিটা লাইন বাস্তবে পরীক্ষিত।`,
    stats: [
      { label: "বছরের অভিজ্ঞতা", value: `${years}+` },
      { label: "হাজার পাঠক/শিক্ষার্থী", value: `${readers}+` },
      { label: "ওয়ার্কশপ/সেশন", value: `${sessions}+` },
    ],
  };
}

export interface KeyIdea {
  title: string;
  body: string;
}

const KEY_IDEA_POOL: KeyIdea[] = [
  {
    title: "ছোট সিদ্ধান্ত, বড় প্রভাব",
    body: "প্রতিদিনের ছোট ছোট সিদ্ধান্তগুলোই দীর্ঘমেয়াদে সবচেয়ে বড় পার্থক্য তৈরি করে — এখানে দেখানো হয়েছে কীভাবে সেগুলো চিনবেন।",
  },
  {
    title: "একটা সহজ ফ্রেমওয়ার্ক",
    body: "জটিল পরিস্থিতিকে কয়েকটা সহজ প্রশ্নে ভেঙে ফেলার একটা কাঠামো, যা যেকোনো পরিস্থিতিতে প্রয়োগ করা যায়।",
  },
  {
    title: "আবেগ আর যুক্তির ভারসাম্য",
    body: "কখন আবেগের কথা শুনবেন আর কখন যুক্তি দিয়ে সিদ্ধান্ত নেবেন — এই ভারসাম্যটাই আসল দক্ষতা।",
  },
  {
    title: "ভুল থেকে দ্রুত শেখার পদ্ধতি",
    body: "ভুল হওয়াটা সমস্যা না, একই ভুল বারবার হওয়াটাই আসল সমস্যা — কীভাবে সেটা এড়াবেন তার নির্দিষ্ট পদ্ধতি।",
  },
  {
    title: "ফোকাস তৈরির অভ্যাস",
    body: "মনোযোগ নষ্ট করে দেয় এমন জিনিসগুলো চিহ্নিত করে, প্রতিদিন গভীর মনোযোগে কাজ করার একটা রুটিন তৈরি করা।",
  },
  {
    title: "দীর্ঘমেয়াদী চিন্তার অভ্যাস",
    body: "তাৎক্ষণিক ফলাফলের পেছনে না ছুটে, ৫-১০ বছর পরের ফলাফল মাথায় রেখে সিদ্ধান্ত নেওয়ার অনুশীলন।",
  },
  {
    title: "সম্পর্ক ও নেটওয়ার্কের শক্তি",
    body: "একা এগোনো আর সঠিক মানুষদের সাথে এগোনোর মধ্যে পার্থক্য কতটা — বাস্তব উদাহরণসহ ব্যাখ্যা।",
  },
  {
    title: "প্রতিদিনের সিস্টেম বনাম লক্ষ্য",
    body: "শুধু লক্ষ্য ঠিক করলেই হয় না — প্রতিদিন অনুসরণ করার মতো একটা সিস্টেম দরকার, যা এখানে ধাপে ধাপে দেখানো হয়েছে।",
  },
  {
    title: "সীমাবদ্ধতাকে সুযোগে বদলানো",
    body: "সময়, অর্থ বা অভিজ্ঞতার অভাবকে অজুহাত না বানিয়ে সেটাকেই কীভাবে সুবিধা হিসেবে ব্যবহার করবেন।",
  },
  {
    title: "নিজের অগ্রগতি মাপার উপায়",
    body: "অন্যের সাথে তুলনা না করে, নিজের গতকালের সাথে আজকের তুলনা করে এগোনোর একটা ব্যবহারিক পদ্ধতি।",
  },
];

export function getKeyIdeas(product: Product, count = 6): KeyIdea[] {
  const seed = hashString(product.id + ":ideas");
  const start = seed % KEY_IDEA_POOL.length;
  const picked: KeyIdea[] = [];
  for (let i = 0; i < count; i++) {
    picked.push(KEY_IDEA_POOL[(start + i) % KEY_IDEA_POOL.length]);
  }
  return picked;
}

export interface Transformation {
  title: string;
  body: string;
}

const TRANSFORMATION_POOL: Transformation[] = [
  {
    title: "স্পষ্ট মাথায় সিদ্ধান্ত নেবেন",
    body: "দ্বিধা কমে যাবে — কারণ প্রতিটা সিদ্ধান্তের পেছনে থাকবে একটা যাচাই করা প্রক্রিয়া।",
  },
  {
    title: "সময় নষ্ট কমবে",
    body: "কোন কাজে মনোযোগ দেবেন আর কোনটা বাদ দেবেন — এটা বুঝে কাজ করলে দিনে অনেকটা সময় বেঁচে যাবে।",
  },
  {
    title: "আত্মবিশ্বাস বাড়বে",
    body: "একটা প্রমাণিত পদ্ধতি হাতে থাকলে যেকোনো নতুন চ্যালেঞ্জ মোকাবিলা করার সাহস তৈরি হয়।",
  },
  {
    title: "দীর্ঘমেয়াদে ফল পাবেন",
    body: "তাৎক্ষণিক শর্টকাট নয়, এমন একটা ভিত্তি তৈরি হবে যা বছরের পর বছর কাজে লাগবে।",
  },
];

export function getTransformations(product: Product, count = 4): Transformation[] {
  const seed = hashString(product.id + ":transform");
  const start = seed % TRANSFORMATION_POOL.length;
  const picked: Transformation[] = [];
  for (let i = 0; i < count; i++) {
    picked.push(TRANSFORMATION_POOL[(start + i) % TRANSFORMATION_POOL.length]);
  }
  return picked;
}

export interface ExpertOpinion {
  name: string;
  title: string;
  quote: string;
  location: string;
  rating: number;
  hasPhoto: boolean;
  verified: boolean;
}

const EXPERT_TITLE_POOL = [
  "কোচ ও ট্রেইনার",
  "প্রতিষ্ঠাতা, স্টার্টআপ",
  "ম্যানেজমেন্ট কনসালট্যান্ট",
  "সিনিয়র প্রোডাক্ট ম্যানেজার",
  "ক্যারিয়ার কোচ",
  "এইচআর হেড",
  "বিজনেস অ্যানালিস্ট",
  "টিম লিড, টেক কোম্পানি",
];

const EXPERT_QUOTE_POOL = [
  "যারা প্রতিদিন সিদ্ধান্তহীনতায় ভোগেন, তাদের জন্য এটা একটা প্র্যাকটিক্যাল গাইড — জটিল কথাবার্তা নেই, সরাসরি কাজের কথা।",
  "আমি নিজে এরকম অনেক কিছু ব্যবহার করেছি, কিন্তু এত সহজভাবে বাস্তব উদাহরণসহ কমই দেখেছি।",
  "টিমের সবাইকে এটা পড়তে বলেছি — কাজের জায়গায় প্রয়োগ করা যায় এমন কিছু আইডিয়া পেয়েছি।",
  "যা শেখানো হয়েছে তার প্রতিটাই বাস্তবসম্মত, কোনো অতিরঞ্জিত প্রতিশ্রুতি নেই।",
  "প্রফেশনাল লাইফে যে সিদ্ধান্তগুলো নিতে সবচেয়ে বেশি সময় লাগে, সেগুলোর জন্য একটা স্পষ্ট কাঠামো পেয়েছি।",
  "নতুনদের আমি সবসময় এই ধরনের রিসোর্স খুঁজতে বলি — থিওরি না, সরাসরি প্রয়োগযোগ্য কিছু।",
  "কাজের চাপের মধ্যেও পড়া শেষ করা গেছে সহজেই — ভাষা ও উদাহরণ দুটোই সহজবোধ্য।",
  "আমাদের ইন্ডাস্ট্রিতে এই ধরনের প্র্যাক্টিক্যাল কনটেন্ট সত্যিই বিরল।",
  "রেফারেন্স হিসেবে বারবার ফিরে দেখার মতো একটা কনটেন্ট।",
  "টিম মিটিংয়ে এখান থেকে নেওয়া কয়েকটা আইডিয়া নিয়ে আলোচনা করেছি, সবাই ইতিবাচক ফিডব্যাক দিয়েছে।",
];

export function getExpertOpinions(product: Product, count = 15): ExpertOpinion[] {
  const base = hashString(product.id + ":experts");
  const picked: ExpertOpinion[] = [];
  for (let i = 0; i < count; i++) {
    const seed = base + i * 89;
    picked.push({
      name: PERSON_NAMES[seed % PERSON_NAMES.length],
      title: EXPERT_TITLE_POOL[Math.floor(seed / 7) % EXPERT_TITLE_POOL.length],
      quote: EXPERT_QUOTE_POOL[Math.floor(seed / 13) % EXPERT_QUOTE_POOL.length],
      location: BD_LOCATIONS[Math.floor(seed / 17) % BD_LOCATIONS.length],
      rating: 4.5 + (Math.floor(seed / 23) % 2) * 0.5,
      hasPhoto: seed % 3 !== 0,
      verified: seed % 4 !== 0,
    });
  }
  return picked;
}

export function getExpertVideoOpinions(product: Product, count = 7): ExpertOpinion[] {
  const base = hashString(product.id + ":expertvideos");
  const picked: ExpertOpinion[] = [];
  for (let i = 0; i < count; i++) {
    const seed = base + i * 97;
    picked.push({
      name: PERSON_NAMES[seed % PERSON_NAMES.length],
      title: EXPERT_TITLE_POOL[Math.floor(seed / 7) % EXPERT_TITLE_POOL.length],
      quote: EXPERT_QUOTE_POOL[Math.floor(seed / 13) % EXPERT_QUOTE_POOL.length],
      location: BD_LOCATIONS[Math.floor(seed / 17) % BD_LOCATIONS.length],
      rating: 4.5 + (Math.floor(seed / 23) % 2) * 0.5,
      hasPhoto: true,
      verified: seed % 4 !== 0,
    });
  }
  return picked;
}

export interface LiveDemand {
  viewers: number;
  copiesLeft: number;
  stockSoldPercent: number;
  ordersLast24h: number;
  recentOrderInitials: string[];
}

export function getLiveDemand(product: Product): LiveDemand {
  const seed = hashString(product.id + ":demand");
  const viewers = 12 + (seed % 40);
  const copiesLeft = 6 + (Math.floor(seed / 7) % 25);
  const stockSoldPercent = 55 + (Math.floor(seed / 13) % 35);
  const ordersLast24h = 18 + (Math.floor(seed / 19) % 55);
  const recentOrderInitials = [0, 1, 2, 3, 4].map(
    (i) => PERSON_NAMES[(seed + i * 31) % PERSON_NAMES.length].charAt(0)
  );
  return { viewers, copiesLeft, stockSoldPercent, ordersLast24h, recentOrderInitials };
}

const HERO_HEADLINE_POOL = [
  "আপনার বর্তমান জীবন অতীতে নেয়া সিদ্ধান্তের ফল, আপনার ভবিষ্যৎ জীবনটা কেমন হবে তা তৈরি হবে আজকের সিদ্ধান্ত থেকে",
  "আজ যে সিদ্ধান্তটা নেবেন, আগামী কয়েক বছর পর ঠিক সেটাই আপনার গল্প হয়ে দাঁড়াবে",
  "ছোট একটা পদক্ষেপ আজ — বড় একটা পরিবর্তন আগামীকাল",
  "যারা আজ শুরু করে, তারাই কাল এগিয়ে থাকে",
  "প্রতিটা বড় পরিবর্তনের শুরু হয় একটা সাধারণ সিদ্ধান্ত দিয়ে — আজকেরটা আপনার হতে পারে",
  "সময় নষ্ট করার সুযোগ নেই — আজকের সিদ্ধান্তই আগামীর ভিত্তি",
];

export function getHeroHeadline(product: Product): string {
  const seed = hashString(product.id + ":hero-headline");
  return HERO_HEADLINE_POOL[seed % HERO_HEADLINE_POOL.length];
}

export interface Faq {
  q: string;
  a: string;
}

const BOOK_FAQS: Faq[] = [
  {
    q: "ডেলিভারি পেতে কতদিন লাগবে?",
    a: "ঢাকার ভেতরে সাধারণত ১-২ কর্মদিবস এবং ঢাকার বাইরে ৩-৫ কর্মদিবসের মধ্যে বই হাতে পৌঁছে যাবে।",
  },
  {
    q: "ক্যাশ অন ডেলিভারি (COD) আছে কি?",
    a: "হ্যাঁ, সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা আছে — বই হাতে পেয়ে টাকা দিতে পারবেন।",
  },
  {
    q: "বইটি কি অরিজিনাল ও ভালো মানের কাগজে ছাপা?",
    a: "হ্যাঁ, ১০০% অরিজিনাল কপি এবং ভালো মানের হার্ডকভার বাইন্ডিংয়ে ছাপা হয়েছে।",
  },
  {
    q: "একসাথে একাধিক বই অর্ডার করা যাবে?",
    a: "অবশ্যই — কার্টে একাধিক বই/ইবুক/গিয়ার একসাথে যোগ করে একবারে অর্ডার করতে পারবেন।",
  },
  {
    q: "কোনো সমস্যা হলে রিটার্ন বা রিপ্লেসমেন্ট পাব?",
    a: "প্রোডাক্ট ড্যামেজড অবস্থায় পেলে ডেলিভারির ২৪ ঘণ্টার মধ্যে জানালে রিপ্লেসমেন্ট ব্যবস্থা করা হবে।",
  },
];

const EBOOK_FAQS: Faq[] = [
  {
    q: "কেনার পর ইবুকটা কীভাবে পাব?",
    a: "পেমেন্ট সম্পন্ন হওয়ার সাথে সাথে ইমেইলে ডাউনলোড লিংক চলে যাবে — তাৎক্ষণিক অ্যাক্সেস পাবেন।",
  },
  {
    q: "কোন ডিভাইসে পড়া যাবে?",
    a: "মোবাইল, ট্যাবলেট, ল্যাপটপ — যেকোনো ডিভাইসে PDF ফরম্যাটে পড়তে পারবেন, কোনো বিশেষ অ্যাপ লাগবে না।",
  },
  {
    q: "একবার কিনলে কি বারবার ডাউনলোড করা যাবে?",
    a: "হ্যাঁ, কেনার পর যতবার ইচ্ছা ডাউনলোড করে নিজের ডিভাইসে রাখতে পারবেন।",
  },
  {
    q: "প্রিন্ট করে পড়া যাবে কি?",
    a: "হ্যাঁ, ব্যক্তিগত ব্যবহারের জন্য প্রিন্ট করে পড়তে পারবেন।",
  },
  {
    q: "পেমেন্ট করতে সমস্যা হলে কী করব?",
    a: "চেকআউট পেজে কোনো সমস্যা হলে সাপোর্টে যোগাযোগ করুন — দ্রুত সমাধান করে দেওয়া হবে।",
  },
];

const GEAR_FAQS: Faq[] = [
  {
    q: "ডেলিভারি পেতে কতদিন লাগবে?",
    a: "ঢাকার ভেতরে সাধারণত ১-২ কর্মদিবস এবং ঢাকার বাইরে ৩-৫ কর্মদিবসের মধ্যে প্রোডাক্ট হাতে পৌঁছে যাবে।",
  },
  {
    q: "ক্যাশ অন ডেলিভারি (COD) আছে কি?",
    a: "হ্যাঁ, সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা আছে — প্রোডাক্ট হাতে পেয়ে টাকা দিতে পারবেন।",
  },
  {
    q: "প্রোডাক্টের মান কেমন?",
    a: "হ্যাঁ, ১০০% অরিজিনাল ও টেকসই প্রিমিয়াম উপকরণে তৈরি — মান নিশ্চিত করেই পাঠানো হয়।",
  },
  {
    q: "একসাথে একাধিক প্রোডাক্ট অর্ডার করা যাবে?",
    a: "অবশ্যই — কার্টে একাধিক বই/ইবুক/গিয়ার একসাথে যোগ করে একবারে অর্ডার করতে পারবেন।",
  },
  {
    q: "কোনো সমস্যা হলে রিটার্ন বা রিপ্লেসমেন্ট পাব?",
    a: "প্রোডাক্ট ড্যামেজড অবস্থায় পেলে ডেলিভারির ২৪ ঘণ্টার মধ্যে জানালে রিপ্লেসমেন্ট ব্যবস্থা করা হবে।",
  },
];

export function getFaqs(product: Product): Faq[] {
  if (product.category === "ebook") return EBOOK_FAQS;
  if (product.category === "gear") return GEAR_FAQS;
  return BOOK_FAQS;
}

const QUOTE_POOL = [
  "যে সিদ্ধান্তটা আজ নিতে ভয় পাচ্ছেন, ঠিক সেটাই হয়তো আপনার পরবর্তী বড় পরিবর্তনের শুরু।",
  "অগ্রগতি সবসময় বড় লাফে আসে না — প্রতিদিনের ছোট ছোট সঠিক পদক্ষেপেই আসল পরিবর্তন হয়।",
  "যতদিন শুরু না করবেন, ততদিন সম্ভাবনাটা শুধু কল্পনাতেই থেকে যাবে।",
  "নিজেকে গড়ে তোলার সবচেয়ে ভালো সময় ছিল গতকাল — এরপর সেরা সময় হলো আজ।",
  "স্পষ্টতা আসে অ্যাকশন থেকে, শুধু চিন্তা করে বসে থাকা থেকে নয়।",
  "যারা এগিয়ে যায়, তারা পারফেক্ট সময়ের অপেক্ষা করে না — তারা যা আছে তা দিয়েই শুরু করে।",
];

export function getQuote(product: Product): string {
  const seed = hashString(product.id + ":quote");
  return QUOTE_POOL[seed % QUOTE_POOL.length];
}
