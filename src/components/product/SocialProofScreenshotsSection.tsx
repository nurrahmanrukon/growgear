import { ThumbsUp, Heart, MessageCircle, Send } from "lucide-react";
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

function initials(name: string) {
  return name.trim().charAt(0);
}

function handleFor(name: string, seed: number) {
  return "@" + name.replace(/\s+/g, "").toLowerCase() + (10 + (seed % 89));
}

function socialProofPosts(product: Product, count: number) {
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

function FacebookMock({ name, text, likes, hoursAgo, seed }: { name: string; text: string; likes: number; hoursAgo: number; seed: number }) {
  return (
    <div className="rounded-md border border-border bg-surface p-2.5 text-left shadow-sm">
      <div>
        <div className="flex items-center gap-1.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e7f0fe] text-[11px] font-bold text-[#1877F2]">
            {initials(name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-foreground">{name}</p>
            <p className="text-[9px] text-ink-faint">{toBengaliNumber(hoursAgo)} ঘণ্টা আগে</p>
          </div>
          <span className="ml-auto shrink-0 text-[#1877F2]">
            <MessageCircle size={13} />
          </span>
        </div>
        <p className="mt-2 line-clamp-4 text-[11px] leading-snug text-foreground">{text}</p>
      </div>
      <div className="mt-2 flex items-center gap-3 border-t border-border pt-1.5 text-[9px] font-medium text-ink-faint">
        <span className="flex items-center gap-1 text-[#1877F2]">
          <ThumbsUp size={10} fill="currentColor" /> {toBengaliNumber(likes)}
        </span>
        <span>উত্তর দিন</span>
        <span className="ml-auto text-ink-faint/70">{seed % 2 === 0 ? "১২" : "৮"} মন্তব্য</span>
      </div>
    </div>
  );
}

function InstagramMock({ name, text, likes, seed }: { name: string; text: string; likes: number; seed: number }) {
  return (
    <div className="rounded-md border border-border bg-surface p-2.5 text-left shadow-sm">
      <div>
        <div className="flex items-center gap-1.5">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full p-[1.5px]"
            style={{ background: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)" }}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-surface text-[10px] font-bold text-foreground">
              {initials(name)}
            </div>
          </div>
          <p className="truncate text-[11px] font-semibold text-foreground">{handleFor(name, seed)}</p>
        </div>
        <p className="mt-2 line-clamp-4 text-[11px] leading-snug text-foreground">{text}</p>
      </div>
      <div className="mt-2 flex items-center gap-2.5 border-t border-border pt-1.5 text-ink-faint">
        <Heart size={13} className="text-[#ee2a7b]" fill="#ee2a7b" />
        <MessageCircle size={13} />
        <Send size={13} />
        <span className="ml-auto text-[9px] font-medium">{toBengaliNumber(likes)} লাইক</span>
      </div>
    </div>
  );
}

function WhatsAppMock({ name, text, hoursAgo }: { name: string; text: string; hoursAgo: number }) {
  return (
    <div className="rounded-md border border-border p-2.5 shadow-sm" style={{ background: "#e9f5e1" }}>
      <div className="ml-auto max-w-[92%] rounded-lg rounded-tr-sm bg-[#dcf8c6] px-2.5 py-2 text-left shadow-sm">
        <p className="text-[10px] font-semibold" style={{ color: "#075e54" }}>
          {name}
        </p>
        <p className="mt-0.5 line-clamp-4 text-[11px] leading-snug text-foreground">{text}</p>
        <p className="mt-1 flex items-center justify-end gap-1 text-[9px] text-ink-faint">
          {toBengaliNumber(hoursAgo)} ঘণ্টা আগে
          <svg viewBox="0 0 16 11" width="13" height="9" fill="#34b7f1">
            <path d="M11.1 0.4 5.5 6.9 3 4.4 1.6 5.8l3.9 4L12.5 1.8Z" />
            <path d="M15 0.4 9.4 6.9 8.6 6l-1.4 1.4 1.5 1.6L16.4 1.8Z" />
          </svg>
        </p>
      </div>
    </div>
  );
}

export function SocialProofScreenshotsSection({ product }: { product: Product }) {
  const posts = socialProofPosts(product, 6);

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
          <div key={i}>
            {post.platform === "facebook" && <FacebookMock {...post} />}
            {post.platform === "instagram" && <InstagramMock {...post} />}
            {post.platform === "whatsapp" && <WhatsAppMock {...post} />}
          </div>
        ))}
      </div>
    </section>
  );
}
