import { Product } from "@/lib/types";

export interface Review {
  name: string;
  location: string;
  rating: number;
  quote: string;
  daysAgo: number;
  verified: boolean;
}

const NAMES = [
  "রাফিদ হাসান",
  "তানজিলা ইসলাম",
  "ইমরান হোসেন",
  "নুসরাত জাহান",
  "আরিফুল ইসলাম",
  "সুমাইয়া আক্তার",
  "মাহমুদুল হাসান",
  "তাহমিনা সুলতানা",
  "শাহরিয়ার কবির",
  "ফারজানা ইয়াসমিন",
  "রুবেল আহমেদ",
  "মিথিলা রহমান",
];

const LOCATIONS = ["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "সিলেট", "খুলনা", "বগুড়া", "রংপুর", "বরিশাল"];

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
];

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

export function getReviewsForProduct(product: Product, count = 4): Review[] {
  const base = hashString(product.id);
  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    const seed = base + i * 97;
    const name = NAMES[seed % NAMES.length];
    const location = LOCATIONS[Math.floor(seed / 7) % LOCATIONS.length];
    const quote = QUOTE_TEMPLATES[Math.floor(seed / 13) % QUOTE_TEMPLATES.length](product.title);
    const rating = 4 + (Math.floor(seed / 29) % 2 === 0 ? 1 : 0.5 * (Math.floor(seed / 53) % 2));
    reviews.push({
      name,
      location,
      rating: Math.min(5, rating),
      quote,
      daysAgo: 2 + (seed % 40),
      verified: seed % 5 !== 0,
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
