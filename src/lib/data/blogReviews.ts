import { BlogPost } from "@/lib/types";
import { PERSON_NAMES, BD_LOCATIONS, hashString } from "@/lib/data/social";

export interface BlogReview {
  name: string;
  location: string;
  rating: number;
  title: string;
  quote: string;
  daysAgo: number;
  helpfulCount: number;
}

const TITLE_POOL = [
  "খুবই উপকারী লেখা",
  "প্র্যাক্টিক্যাল উদাহরণসহ চমৎকার ব্যাখ্যা",
  "ঠিক যা খুঁজছিলাম",
  "সহজ ভাষায় গুরুত্বপূর্ণ বিষয়",
  "শেয়ার করার মতো একটা লেখা",
  "আরও লেখা চাই এই বিষয়ে",
];

const QUOTE_TEMPLATES = [
  (t: string) => `${t} পড়ে সত্যিই কাজে লাগানোর মতো কিছু আইডিয়া পেয়েছি। ভাষাও সহজ, বুঝতে সমস্যা হয়নি।`,
  () => `এই ধরনের প্র্যাক্টিক্যাল লেখা বাংলায় কম পাওয়া যায়। শেয়ার করে রাখলাম, বারবার পড়তে হবে।`,
  (t: string) => `"${t}" নিয়ে অনেক জায়গায় পড়েছি, কিন্তু এখানে যেভাবে উদাহরণ দিয়ে বোঝানো হয়েছে সেটা সবচেয়ে স্পষ্ট।`,
  () => `প্রথমে ভেবেছিলাম সাধারণ একটা লেখা, কিন্তু পড়ে দেখি বেশ কিছু নতুন দৃষ্টিভঙ্গি পেয়েছি।`,
  () => `টিমের সাথে শেয়ার করেছি, সবাই ইতিবাচক মন্তব্য করেছে।`,
  (t: string) => `${t} সম্পর্কে আমার নিজের অভিজ্ঞতার সাথেও মিলে যায় — সত্যিই বাস্তবসম্মত।`,
];

export function getBlogReviews(post: BlogPost, count = 6): BlogReview[] {
  const base = hashString(post.id + ":blog-review");
  const reviews: BlogReview[] = [];
  for (let i = 0; i < count; i++) {
    const seed = base + i * 97;
    reviews.push({
      name: PERSON_NAMES[seed % PERSON_NAMES.length],
      location: BD_LOCATIONS[Math.floor(seed / 7) % BD_LOCATIONS.length],
      rating: 4 + (Math.floor(seed / 29) % 2 === 0 ? 1 : 0.5 * (Math.floor(seed / 53) % 2)),
      title: TITLE_POOL[Math.floor(seed / 17) % TITLE_POOL.length],
      quote: QUOTE_TEMPLATES[Math.floor(seed / 13) % QUOTE_TEMPLATES.length](post.title),
      daysAgo: 1 + (seed % 30),
      helpfulCount: 2 + (Math.floor(seed / 19) % 40),
    });
  }
  return reviews;
}
