import { Product } from "@/lib/types";
import { PERSON_NAMES, BD_LOCATIONS, hashString } from "@/lib/data/social";

export interface Review {
  name: string;
  location: string;
  rating: number;
  title: string;
  quote: string;
  daysAgo: number;
  verified: boolean;
  hasPhoto: boolean;
  helpfulCount: number;
}

const TITLE_POOL = [
  "অসাধারণ অভিজ্ঞতা",
  "যা আশা করেছিলাম তার চেয়ে বেশি পেয়েছি",
  "মাস্ট হ্যাভ — দাম উসুল",
  "প্রথমবার পড়েই মুগ্ধ",
  "সবাইকে সাজেস্ট করবো",
  "সত্যিই কাজের জিনিস",
  "প্রত্যাশা ছাড়িয়ে গেছে",
  "চমৎকার কোয়ালিটি ও কনটেন্ট",
  "মনে রাখার মতো একটা অভিজ্ঞতা",
  "টাকা নষ্ট হয়নি, বরং লাভই হয়েছে",
];

const QUOTE_TEMPLATES = [
  (t: string) => `${t} পড়ার পর আমার চিন্তাভাবনায় পুরোপুরি পরিবর্তন এসেছে। প্রতিটি অংশে নতুন কিছু শেখার আছে।`,
  () => `দাম অনুযায়ী কোয়ালিটি অসাধারণ। ডেলিভারিও দ্রুত পেয়েছি, প্যাকেজিং সুন্দর ছিল।`,
  (t: string) => `প্রথমে সন্দেহ ছিল, কিন্তু এখন বলতে পারি "${t}" আমার এই বছরের সেরা কেনাকাটাগুলোর একটা।`,
  () => `বন্ধুর পরামর্শে কিনেছিলাম, এখন নিজেই সবাইকে সাজেস্ট করছি।`,
  () => `কন্টেন্ট খুবই প্র্যাক্টিক্যাল — শুধু থিওরি না, সাথে সাথে অ্যাপ্লাই করা যায়।`,
  (t: string) => `${t} নিয়ে যা আশা করেছিলাম তার চেয়ে বেশি পেয়েছি, মূল্যটাও যথাযথ মনে হয়েছে।`,
  () => `কাজের ফাঁকে অল্প অল্প করে শেষ করেছি, প্রতিটি অংশ থেকেই কিছু না কিছু নিয়েছি।`,
  () => `কাস্টমার সাপোর্ট থেকে সহযোগিতা পেয়েছি, পুরো অর্ডার প্রসেস ছিল ঝামেলাহীন।`,
  (t: string) => `এই মানের কনটেন্ট বাংলায় খুব কম পাওয়া যায় — "${t}" পেয়ে সত্যিই ভালো লাগলো।`,
  () => `শুরুতে ভেবেছিলাম আর দশটা প্রোডাক্টের মতোই হবে, কিন্তু ব্যবহার করে বুঝলাম এটা সত্যিই আলাদা।`,
  () => `রেজাল্ট দেখতে বেশি সময় লাগেনি, প্রথম সপ্তাহেই পার্থক্য বুঝতে পেরেছি।`,
  (t: string) => `${t} — অফিসের সহকর্মীদের মধ্যে এখন বেশ আলোচনায়, সবাই একটা করে চাইছে।`,
  () => `হাতে পেয়ে প্রথমেই মনে হয়েছে দাম উসুল। প্যাকেজিং থেকে শুরু করে সবকিছুই যত্ন করে করা।`,
  (t: string) => `"${t}" নিয়ে বন্ধুদের গ্রুপে শেয়ার করেছিলাম, এখন আরও তিনজন অর্ডার করে ফেলেছে।`,
  () => `রিভিউ পড়ে অর্ডার করেছিলাম, নিজে ব্যবহার করেও একই কথা বলবো — সত্যিই কাজের।`,
];

export function getReviewsForProduct(product: Product, count = 15): Review[] {
  const base = hashString(product.id);
  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    const seed = base + i * 97;
    const name = PERSON_NAMES[seed % PERSON_NAMES.length];
    const location = BD_LOCATIONS[Math.floor(seed / 7) % BD_LOCATIONS.length];
    const quote = QUOTE_TEMPLATES[Math.floor(seed / 13) % QUOTE_TEMPLATES.length](product.title);
    const rating = 4 + (Math.floor(seed / 29) % 2 === 0 ? 1 : 0.5 * (Math.floor(seed / 53) % 2));
    reviews.push({
      name,
      location,
      rating: Math.min(5, rating),
      title: TITLE_POOL[Math.floor(seed / 17) % TITLE_POOL.length],
      quote,
      daysAgo: 2 + (seed % 40),
      verified: seed % 5 !== 0,
      hasPhoto: seed % 3 !== 0,
      helpfulCount: 3 + (Math.floor(seed / 19) % 55),
    });
  }
  return reviews;
}

export function getRatingBreakdown(product: Product): { star: number; pct: number }[] {
  const base = hashString(product.id + "breakdown");
  const raw = [5, 4, 3, 2, 1].map((star, i) => {
    if (star === 5) return 55 + ((base + i) % 20);
    if (star === 4) return 18 + ((base + i * 3) % 15);
    if (star === 3) return 4 + ((base + i * 5) % 8);
    if (star === 2) return 1 + ((base + i * 7) % 4);
    return (base + i) % 3;
  });
  const total = raw.reduce((a, b) => a + b, 0);
  return raw.map((v, i) => ({ star: 5 - i, pct: Math.round((v / total) * 100) }));
}
