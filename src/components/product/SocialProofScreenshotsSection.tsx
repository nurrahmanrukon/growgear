"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ThumbsUp, Heart, MessageCircle, Send, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ResolvedSocialProofPost, SocialPlatform } from "@/lib/server/socialProofPosts";
import { toBengaliNumber } from "@/lib/format";

const STACK_SIZE = 3;

function initials(name: string) {
  return name.trim().charAt(0);
}

function handleFor(name: string, seed: number) {
  return "@" + name.replace(/\s+/g, "").toLowerCase() + (10 + (seed % 89));
}

function FacebookMock({ name, text, likes, hoursAgo, seed, large }: ResolvedSocialProofPost & { seed: number; large?: boolean }) {
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

function InstagramMock({ name, text, likes, seed, large }: ResolvedSocialProofPost & { seed: number; large?: boolean }) {
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

function WhatsAppMock({ name, text, hoursAgo, large }: ResolvedSocialProofPost & { seed: number; large?: boolean }) {
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

function platformAccent(platform: SocialPlatform) {
  if (platform === "facebook") return "text-[#1877F2]";
  if (platform === "instagram") return "text-[#ee2a7b]";
  return "text-[#25D366]";
}

/** A real uploaded screenshot, when the admin has provided one — shown as-is instead of
 *  the synthetic mock card, with just a small platform-colored corner tag for context. */
function RealScreenshot({ post, large }: { post: ResolvedSocialProofPost; large?: boolean }) {
  if (!post.imageUrl) return null;
  if (large) {
    // The zoomed/lightbox view sizes itself to the image's own natural aspect ratio
    // (width auto, capped by max-height) — next/image's `fill` needs a container with
    // fixed dimensions, which would change that auto-sizing behavior, so this one stays
    // a plain <img>.
    return (
      <div className="overflow-hidden rounded-md border border-border bg-surface shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element -- natural-size lightbox view, see comment above */}
        <img
          src={post.imageUrl}
          alt={`${post.name} এর মন্তব্যের স্ক্রিনশট`}
          className="block max-h-[70vh] w-full object-cover"
        />
      </div>
    );
  }
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-border bg-surface shadow-sm">
      <Image
        src={post.imageUrl}
        alt={`${post.name} এর মন্তব্যের স্ক্রিনশট`}
        fill
        sizes="(max-width: 640px) 45vw, 280px"
        className="object-cover"
      />
    </div>
  );
}

function SocialMock({ post, large }: { post: ResolvedSocialProofPost; large?: boolean }) {
  if (post.imageUrl) return <RealScreenshot post={post} large={large} />;
  const seed = post.id.length + post.name.length + post.likes;
  if (post.platform === "facebook") return <FacebookMock {...post} seed={seed} large={large} />;
  if (post.platform === "instagram") return <InstagramMock {...post} seed={seed} large={large} />;
  return <WhatsAppMock {...post} seed={seed} large={large} />;
}

function SocialStackTile({ stack, onOpen }: { stack: ResolvedSocialProofPost[]; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="স্ক্রিনশট বড় করে দেখুন"
      className="relative block text-left transition hover:opacity-90"
    >
      {stack.length > 2 && (
        <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-md border border-border bg-surface" />
      )}
      {stack.length > 1 && (
        <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md border border-border bg-surface" />
      )}
      <SocialMock post={stack[0]} />
      {stack.length > 1 && (
        <span className="absolute -right-1.5 -top-1.5 rounded-full bg-cta px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
          +{stack.length - 1}
        </span>
      )}
    </button>
  );
}

export function SocialProofScreenshotsSection({
  product,
  posts,
}: {
  product: { title: string };
  posts: ResolvedSocialProofPost[];
}) {
  const stacks: ResolvedSocialProofPost[][] = [];
  for (let i = 0; i < posts.length; i += STACK_SIZE) {
    stacks.push(posts.slice(i, i + STACK_SIZE));
  }
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  function go(delta: number) {
    setActiveIndex((i) => (i === null ? null : (i + delta + posts.length) % posts.length));
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

  if (posts.length === 0) return null;

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

      <div className="mx-auto mt-6 grid max-w-3xl grid-cols-2 items-start gap-4 sm:grid-cols-3">
        {stacks.map((stack, i) => (
          <SocialStackTile key={i} stack={stack} onOpen={() => setActiveIndex(i * STACK_SIZE)} />
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
              <SocialMock post={posts[activeIndex]} large />
              <span
                className={`pointer-events-none absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white ${platformAccent(
                  posts[activeIndex].platform
                )}`}
              >
                {toBengaliNumber(activeIndex + 1)}/{toBengaliNumber(posts.length)}
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
