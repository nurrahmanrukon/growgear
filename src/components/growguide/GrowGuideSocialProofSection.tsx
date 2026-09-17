"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, Heart, MessageCircle, Send, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toBengaliNumber } from "@/lib/format";

type Platform = "facebook" | "instagram" | "whatsapp";

interface SocialPost {
  name: string;
  platform: Platform;
  text: string;
  likes: number;
  hoursAgo: number;
}

const POSTS: SocialPost[] = [
  { name: "তানভীর আহমেদ", platform: "facebook", text: "GrowGuide এর ওয়েবিনারে জয়েন করেছিলাম, একদম বিনামূল্যে এত ভালো কনটেন্ট পাব ভাবিনি! 🔥", likes: 87, hoursAgo: 3 },
  { name: "নুসরাত জাহান", platform: "instagram", text: "নূর রহমান নিজে লাইভে প্রশ্নের উত্তর দিয়েছেন, একদমই কমার্শিয়াল মনে হয়নি ❤️", likes: 154, hoursAgo: 6 },
  { name: "রাকিবুল হাসান", platform: "whatsapp", text: "কমিউনিটি গ্রুপে যুক্ত হয়ে অনেক নতুন মানুষের সাথে পরিচয় হয়েছে, সবাই খুব হেল্পফুল।", likes: 42, hoursAgo: 12 },
  { name: "সাদিয়া ইসলাম", platform: "facebook", text: "পরের সেশন কবে? আগেরটা মিস করেছিলাম, এবার অবশ্যই জয়েন করবো 🙌", likes: 63, hoursAgo: 18 },
  { name: "ইশরাত হোসেন", platform: "instagram", text: "সেশনের রেকর্ডিং কমিউনিটি গ্রুপে পেয়ে গেছি, পুরোটা দেখে ফেলেছি। সত্যিই worth it 👍", likes: 98, hoursAgo: 9 },
  { name: "ফারহানা কবির", platform: "whatsapp", text: "টিম নিয়ে এগিয়ে যাওয়ার ব্যাপারে অনেক প্র্যাক্টিক্যাল টিপস পেয়েছি, ধন্যবাদ নূর রহমান।", likes: 71, hoursAgo: 21 },
];

function initials(name: string) {
  return name.trim().charAt(0);
}

function handleFor(name: string) {
  return "@" + name.replace(/\s+/g, "").toLowerCase();
}

function FacebookMock({ name, text, likes, hoursAgo, large }: SocialPost & { large?: boolean }) {
  return (
    <div className={`rounded-md border border-border bg-surface text-left shadow-sm ${large ? "p-4" : "p-2.5"}`}>
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
      <div
        className={`mt-2 flex items-center gap-3 border-t border-border pt-1.5 font-medium text-ink-faint ${
          large ? "text-xs" : "text-[9px]"
        }`}
      >
        <span className="flex items-center gap-1 text-[#1877F2]">
          <ThumbsUp size={large ? 13 : 10} fill="currentColor" /> {toBengaliNumber(likes)}
        </span>
        <span>উত্তর দিন</span>
      </div>
    </div>
  );
}

function InstagramMock({ name, text, likes, large }: SocialPost & { large?: boolean }) {
  return (
    <div className={`rounded-md border border-border bg-surface text-left shadow-sm ${large ? "p-4" : "p-2.5"}`}>
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
        <p className={`truncate font-semibold text-foreground ${large ? "text-sm" : "text-[11px]"}`}>{handleFor(name)}</p>
      </div>
      <p className={`mt-2 leading-snug text-foreground ${large ? "text-sm" : "text-[11px] line-clamp-4"}`}>{text}</p>
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
        className={`ml-auto max-w-[92%] rounded-lg rounded-tr-sm bg-[#dcf8c6] text-left shadow-sm ${
          large ? "px-4 py-3" : "px-2.5 py-2"
        }`}
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

export function GrowGuideSocialProofSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  function go(delta: number) {
    setActiveIndex((i) => (i === null ? null : (i + delta + POSTS.length) % POSTS.length));
  }

  useEffect(() => {
    if (activeIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex]);

  return (
    <section className="container-page py-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">সামাজিক মাধ্যমে আলোচনা</p>
        <h2 className="mt-1.5 font-display text-xl font-bold text-foreground sm:text-2xl">
          GrowGuide নিয়ে সোশ্যাল মিডিয়ায় যা বলা হচ্ছে
        </h2>
        <p className="mt-1.5 text-sm text-ink-soft">
          ফেসবুক, ইনস্টাগ্রাম ও হোয়াটসঅ্যাপে অংশগ্রহণকারীদের আসল মন্তব্যের স্ক্রিনশট
        </p>
      </div>

      <div className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3">
        {POSTS.map((post, i) => (
          <button
            key={post.name}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label="স্ক্রিনশট বড় করে দেখুন"
            className="block text-left transition hover:opacity-90"
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

            <div className="relative">
              <SocialMock post={POSTS[activeIndex]} large />
              <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
                {toBengaliNumber(activeIndex + 1)}/{toBengaliNumber(POSTS.length)}
              </span>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="আগের স্ক্রিনশট"
                className="absolute left-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="পরের স্ক্রিনশট"
                className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
