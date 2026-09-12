import { buildCatalog } from "./generate";

export const GEAR_SUBCATEGORIES: { slug: string; label: string }[] = [
  { slug: "focus-timers", label: "ফোকাস ও টাইমার" },
  { slug: "planners-notebooks", label: "প্ল্যানার ও নোটবুক" },
  { slug: "desk-organization", label: "ডেস্ক অর্গানাইজেশন" },
  { slug: "tech-workspace", label: "টেক ও ওয়ার্কস্পেস এক্সেসরি" },
];

const titles: { title: string; subcategorySlug: string }[] = [
  { title: "পমোডোরো টাইমার ক্লক", subcategorySlug: "focus-timers" },
  { title: "ডেস্ক অর্গানাইজার সেট", subcategorySlug: "desk-organization" },
  { title: "মিনিমালিস্ট নোটবুক", subcategorySlug: "planners-notebooks" },
  { title: "ডেইলি প্ল্যানার ডায়েরি", subcategorySlug: "planners-notebooks" },
  { title: "হুইটবোর্ড ডেস্ক ম্যাট", subcategorySlug: "tech-workspace" },
  { title: "এলইডি ডেস্ক ল্যাম্প", subcategorySlug: "tech-workspace" },
  { title: "ওয়্যারলেস চার্জিং প্যাড", subcategorySlug: "tech-workspace" },
  { title: "ল্যাপটপ স্ট্যান্ড", subcategorySlug: "desk-organization" },
  { title: "এরগোনমিক মাউস প্যাড", subcategorySlug: "tech-workspace" },
  { title: "স্টিকি নোট সেট", subcategorySlug: "planners-notebooks" },
  { title: "ডেস্ক কেবল অর্গানাইজার", subcategorySlug: "desk-organization" },
  { title: "ফোকাস টাইমার কিউব", subcategorySlug: "focus-timers" },
  { title: "হোয়াইটবোর্ড ক্যালেন্ডার", subcategorySlug: "planners-notebooks" },
  { title: "প্ল্যানার স্টিকার প্যাক", subcategorySlug: "planners-notebooks" },
  { title: "ট্রাভেল নোটবুক", subcategorySlug: "planners-notebooks" },
  { title: "পেন অর্গানাইজার হোল্ডার", subcategorySlug: "desk-organization" },
  { title: "ডেস্ক প্ল্যান্ট পট (আর্টিফিশিয়াল)", subcategorySlug: "tech-workspace" },
  { title: "ব্লু লাইট ব্লকিং গ্লাস", subcategorySlug: "tech-workspace" },
  { title: "পোর্টেবল হোয়াইটবোর্ড", subcategorySlug: "planners-notebooks" },
  { title: "গোল ট্র্যাকিং জার্নাল", subcategorySlug: "planners-notebooks" },
  { title: "হ্যাবিট ট্র্যাকার বোর্ড", subcategorySlug: "planners-notebooks" },
  { title: "ডেস্ক এয়ার হিউমিডিফায়ার", subcategorySlug: "tech-workspace" },
  { title: "ওয়্যারলেস কীবোর্ড", subcategorySlug: "tech-workspace" },
  { title: "মনিটর স্ট্যান্ড রাইজার", subcategorySlug: "desk-organization" },
  { title: "নোট কার্ড বক্স সেট", subcategorySlug: "planners-notebooks" },
  { title: "ডেইলি ফোকাস বোর্ড", subcategorySlug: "focus-timers" },
  { title: "পোমোডোরো ডেস্ক টাইমার (ডিজিটাল)", subcategorySlug: "focus-timers" },
  { title: "ব্যাকপ্যাক অর্গানাইজার", subcategorySlug: "desk-organization" },
  { title: "ডেস্ক বুকস্ট্যান্ড", subcategorySlug: "desk-organization" },
  { title: "ইউএসবি ডেস্ক ফ্যান", subcategorySlug: "tech-workspace" },
];

const items = titles.map(({ title, subcategorySlug }, i) => ({
  title,
  price: 199 + (i % 10) * 130,
  subcategorySlug,
}));

export const gear = buildCatalog("gear", items, {
  bulletsPool: [
    "টেকসই, প্রিমিয়াম মানের ম্যাটেরিয়াল দিয়ে তৈরি",
    "প্রতিদিনের ফোকাস ও প্রোডাক্টিভিটি বাড়াতে ডিজাইন করা",
    "কমপ্যাক্ট সাইজ — ডেস্ক বা ব্যাগে সহজে ফিট হয়",
    "সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা",
    "৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি",
  ],
  specsBase: [
    { label: "ম্যাটেরিয়াল", value: "প্রিমিয়াম মিক্সড" },
    { label: "ওয়ারেন্টি", value: "৭ দিন রিপ্লেসমেন্ট" },
    { label: "ব্যবহার", value: "ডেস্ক / অফিস / স্টাডি" },
    { label: "প্যাকেজিং", value: "গিফট-রেডি বক্স" },
  ],
  shortDescriptionFor: (title) => `${title} — প্রতিদিনের কাজে ফোকাস ও প্রোডাক্টিভিটি বাড়ানোর জন্য দরকারি এক্সেসরি।`,
  descriptionFor: (title) =>
    `${title} তৈরি করা হয়েছে তাদের জন্য যারা প্রতিদিনের কাজে বেশি ফোকাসড ও প্রোডাক্টিভ থাকতে চান। প্রিমিয়াম ম্যাটেরিয়াল ও কমপ্যাক্ট ডিজাইনের কারণে এটি যেকোনো ডেস্ক সেটআপ বা স্টাডি টেবিলে সহজেই মানিয়ে যায়। প্রতিটি প্রোডাক্টের সাথে থাকছে ৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি ও সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা।`,
});
