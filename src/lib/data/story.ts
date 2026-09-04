import { Product } from "@/lib/types";

export interface StorySection {
  heading: string;
  body: string;
}

export function getStorySections(product: Product): StorySection[] {
  const isPrint = product.category === "book" || product.category === "ebook";

  if (isPrint) {
    return [
      {
        heading: `কেন "${product.title}" বেছে নেবেন`,
        body: product.description,
      },
      {
        heading: "আপনি যা পাবেন",
        body:
          product.bullets.join("। ") +
          "। প্রতিটি অংশ সাজানো হয়েছে যাতে পড়া শেষ করার সাথে সাথে বাস্তব জীবনে প্রয়োগ করতে পারেন — শুধু পড়ে রেখে দেওয়ার জন্য নয়।",
      },
      {
        heading: "কাদের জন্য এটি",
        body: `যারা প্রতিদিন ভালো কাজ করেও কাঙ্ক্ষিত অগ্রগতি দেখতে পাচ্ছেন না, বারবার একই জায়গায় আটকে যাচ্ছেন, অথবা সিদ্ধান্তহীনতায় ভোগেন — "${product.title}" তাদের জন্যই তৈরি। এটা না পড়লে যে সময় ও সুযোগ হাতছাড়া হয়, সেটাই এই বইয়ের সবচেয়ে বড় যুক্তি।`,
      },
    ];
  }

  return [
    {
      heading: `কেন "${product.title}"`,
      body: product.description,
    },
    {
      heading: "প্রতিদিনের কাজে যেভাবে সাহায্য করবে",
      body:
        product.bullets.join("। ") +
        "। ছোট এই পরিবর্তনটাই দিনের শেষে বড় পার্থক্য তৈরি করে — যতটা না মনে হয়, বাস্তবে তার চেয়ে বেশি।",
    },
    {
      heading: "কাদের জন্য তৈরি",
      body: `যারা প্রতিদিন ডেস্কে বসে কাজ করেন অথচ ফোকাস ধরে রাখতে কষ্ট হয়, ছোট ছোট অগোছালো জিনিস যাদের মনোযোগ নষ্ট করে দেয় — "${product.title}" ঠিক তাদের জন্যই বানানো। যতদিন দেরি করবেন, ততদিন এই অল্প খরচের সমাধানটা ছাড়াই কাজ চালিয়ে যেতে হবে।`,
    },
  ];
}
