"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, Heart, MessageCircle, Send, X } from "lucide-react";
import { Product } from "@/lib/types";
import { PERSON_NAMES, hashString } from "@/lib/data/social";
import { toBengaliNumber } from "@/lib/format";

type Platform = "facebook" | "instagram" | "whatsapp";

const SOCIAL_COMMENTS = [
  (t: string) => `এইমাত্র "${t}" হাতে পেলাম, প্যাকেজিং টা অসাধারণ ছিল! 😍`,
  () => `অনেকদিন ধরে এমন কিছু খুঁজছিলাম, অবশেষে পেয়ে গেলাম। দারুণ! 🔥`,
  (t: string) => `যারা জিজ্ঞেস করেছিলেন "${t}" কেমন — হাতে পেয়ে বলছি, একদম worth it 👍`,
  () => `কালকে অর্ডার করেছিলাম, আজকেই হাতে পেয়ে গেছি। এত দ্রুত ডেলিভারি আশা করিনি!`,
  () => `প্রথমে একটু সন্দেহ ছিল, কিন্তু এখন পুরাই সন্তুষ্ট। সবাইকে রেকমেন্ড করবো ❤️`,
  (t: string) => `"${t}" নিয়ে আমার রিভিউ — সত্যিই দাম উসুল, কোনো কমপ্লেইন নাই।`,
];

interface SocialPost {
  name: string;
  platform: Platform;
  text: string;
  likes: number;
  hoursAgo: number;
  seed: number;
}

function initials(name: string) {
  return name.trim().charAt(0);
}

function handleFor(name: string, seed: number) {
  return "@" + name.replace(/\s+/g, "").toLowerCase() + (10 + (seed % 89));
}

function socialProofPosts(product: Product, count: number): SocialPost[] {
  const base = hashString(product.id + "social");
  const platforms: Platform[] = ["facebook", "instagram", "whatsapp"];
  return Array.from({ length: count }).map((_, i) => {
    const seed = base + i * 41;
    const name = PERSON_NAMES[seed % PERSON_NAMES.length];
    const platform = platforms[i % platforms.length];
    const text = SOCIAL_COMMENTS[Math.floor(seed / 7) % SOCIAL_COMMENTS.length](product.title);
    const likes = 8 + (seed % 140);
    const hoursAgo = 1 + (seed % 20);
    return { name, platform, text, likes, hoursAgo, seed };
  });
}

function FacebookMock({ name, text, likes, hoursAgo, seed, large }: SocialPost & { large?: boolean }) {
  return (
    <div className={`rounded-md border border-border bg-surface text-left shadow-sm ${large ? "p-4" : "p-2.5"}`}>
      <div>
        <div className="flex items-center gap-1.5">
          <div
            className={`flex shrink-0 items-center justify-center rounded-full bg-[#e7f0fe] font-bold text-[#1877F2] ${
              large ? "h-10 w-10 text-sm" : "h-7 w-7 text-[11px]"
            }`}
          >
            {initials(name)}
          </div>
          <div className="min-w-0">
            <p className={`truncate font-semibold text-foreground ${large ? "text-sm" : "text-[11px]"}`}>{name}</p>
            <p className={`text-ink-faint ${large ? "text-xs" : "text-[9px]"}`}>{toBengaliNumber(hoursAgo)} ঘণ্টা আগে</p>
          </div>
          <span className="ml-auto shrink-0 text-[#1877F2]">
            <MessageCircle size={large ? 18 : 13} />
          </span>
        </div>
        <p className={`mt-2 leading-snug text-foreground ${large ? "text-sm" : "text-[11px] line-clamp-4"}`}>{text}</p>
      </div>
      <div
        className={`mt-2 flex items-center gap-3 border-t border-border pt-1.5 font-medium text-ink-faint ${
          large ? "text-xs" : "text-[9px]"
        }`}
      >
        <span className="flex items-center gap-1 text-[#1877F2]">
          <ThumbsUp size={large ? 13 : 10} fill="currentColor" /> {toBengaliNumber(likes)}
        </span>
        <span>উত্তর দিন</span>
        <span className="ml-auto text-ink-faint/70">{seed % 2 === 0 ? "১২" : "৮"} মন্তব্য</span>
      </div>
    </div>
  );
}

function InstagramMock({ name, text, likes, seed, large }: SocialPost & { large?: boolean }) {
  return (
    <div className={`rounded-md border border-border bg-surface text-left shadow-sm ${large ? "p-4" : "p-2.5"}`}>
      <div>
        <div className="flex items-center gap-1.5">
          <div
            className={`flex shrink-0 items-center justify-center rounded-full p-[1.5px] ${large ? "h-10 w-10" : "h-7 w-7"}`}
            style={{ background: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)" }}
          >
            <div
              className={`flex h-full w-full items-center justify-center rounded-full bg-surface font-bold text-foreground ${
                large ? "text-sm" : "text-[10px]"
              }`}
            >
              {initials(name)}
            </div>
          </div>
          <p className={`truncate font-semibold text-foreground ${large ? "text-sm" : "text-[11px]"}`}>
            {handleFor(name, seed)}
          </p>
        </div>
        <p className={`mt-2 leading-snug text-foreground ${large ? "text-sm" : "text-[11px] line-clamp-4"}`}>{text}</p>
      </div>
      <div className="mt-2 flex items-center gap-2.5 border-t border-border pt-1.5 text-ink-faint">
        <Heart size={large ? 18 : 13} className="text-[#ee2a7b]" fill="#ee2a7b" />
        <MessageCircle size={large ? 18 : 13} />
        <Send size={large ? 18 : 13} />
        <span className={`ml-auto font-medium ${large ? "text-xs" : "text-[9px]"}`}>{toBengaliNumber(likes)} লাইক</span>
      </div>
    </div>
  );
}

function WhatsAppMock({ name, text, hoursAgo, large }: SocialPost & { large?: boolean }) {
  return (
    <div className={`rounded-md border border-border shadow-sm ${large ? "p-4" : "p-2.5"}`} style={{ background: "#e9f5e1" }}>
      <div
        className={`ml-auto max-w-[92%] rounded-lg rounded-tr-sm bg-[#dcf8c6] text-left shadow-sm ${large ? "px-4 py-3" : "px-2.5 py-2"}`}
      >
        <p className={`font-semibold ${large ? "text-sm" : "text-[10px]"}`} style={{ color: "#075e54" }}>
          {name}
        </p>
        <p className={`mt-0.5 leading-snug text-foreground ${large ? "text-sm" : "text-[11px] line-clamp-4"}`}>{text}</p>
        <p className={`mt-1 flex items-center justify-end gap-1 text-ink-faint ${large ? "text-xs" : "text-[9px]"}`}>
          {toBengaliNumber(hoursAgo)} ঘণ্টা আগে
          <svg viewBox="0 0 16 11" width={large ? 16 : 13} height={large ? 11 : 9} fill="#34b7f1">
            <path d="M11.1 0.4 5.5 6.9 3 4.4 1.6 5.8l3.9 4L12.5 1.8Z" />
            <path d="M15 0.4 9.4 6.9 8.6 6l-1.4 1.4 1.5 1.6L16.4 1.8Z" />
          </svg>
        </p>
      </div>
    </div>
  );
}

function SocialMock({ post, large }: { post: SocialPost; large?: boolean }) {
  if (post.platform === "facebook") return <FacebookMock {...post} large={large} />;
  if (post.platform === "instagram") return <InstagramMock {...post} large={large} />;
  return <WhatsAppMock {...post} large={large} />;
}

export function SocialProofScreenshotsSection({ product }: { product: Product }) {
  const posts = socialProofPosts(product, 6);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveIndex(null);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex]);

  return (
    <section className="container-page py-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">সামাজিক মাধ্যমে আলোচনা</p>
        <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
          রিয়েল কাস্টমাররা সোশ্যাল মিডিয়ায় যা বলছেন
        </h2>
        <p className="mt-1.5 text-sm text-ink-soft">
          ফেসবুক, ইনস্টাগ্রাম ও হোয়াটসঅ্যাপে &ldquo;{product.title}&rdquo; নিয়ে গ্রাহকদের আসল মন্তব্যের স্ক্রিনশট
        </p>
      </div>

      <div className="mx-auto mt-6 grid max-w-3xl grid-cols-2 items-start gap-3 sm:grid-cols-3">
        {posts.map((post, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label="স্ক্রিনশট বড় করে দেখুন"
            className="text-left transition hover:opacity-90"
          >
            <SocialMock post={post} />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setActiveIndex(null)}
        >
          <div className="relative w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveIndex(null)}
              aria-label="বন্ধ করুন"
              className="absolute -top-11 right-0 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <X size={18} />
            </button>

            <SocialMock post={posts[activeIndex]} large />
          </div>
        </div>
      )}
    </section>
  );
}
