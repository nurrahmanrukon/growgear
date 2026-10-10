"use client";

import { useEffect, useState } from "react";
import { ChevronDown, CreditCard, FileText, Headphones, Layers, Lock, Smartphone, UserCheck, X, Eye } from "lucide-react";
import Link from "next/link";
import { BlogPost } from "@/lib/types";
import { getPremiumPurchaseCount, getPremiumRating } from "@/lib/data/blog";
import { toBengaliNumber, formatTaka } from "@/lib/format";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { BlogAudioPlayer } from "@/components/blog/BlogAudioPlayer";
import { StarRating } from "@/components/ui/StarRating";
import { AuthedProfile, ProfileAuthModal } from "@/components/profile/ProfileAuthModal";

const FREE_PREVIEW_RATIO = 0.25;

type Format = "text" | "audio";
type Tier = "text" | "audio" | "both";

const TIERS: { id: Tier; label: string; price: number; icon: typeof FileText; badge?: string }[] = [
  { id: "text", label: "শুধু টেক্সট", price: 20, icon: FileText },
  { id: "audio", label: "শুধু অডিও", price: 25, icon: Headphones },
  { id: "both", label: "উভয়ই", price: 29, icon: Layers, badge: "সেরা অফার" },
];

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function splitFreeContent(paragraphs: string[], ratio: number) {
  const totalWords = paragraphs.reduce((sum, p) => sum + countWords(p), 0);
  const targetWords = Math.max(1, Math.round(totalWords * ratio));

  let wordsSoFar = 0;
  let cut = 0;
  for (let i = 0; i < paragraphs.length; i++) {
    wordsSoFar += countWords(paragraphs[i]);
    cut = i + 1;
    if (wordsSoFar >= targetWords) break;
  }
  if (paragraphs.length > 1 && cut >= paragraphs.length) cut = paragraphs.length - 1;

  return { free: paragraphs.slice(0, cut), locked: paragraphs.slice(cut) };
}

const GRID_COLS: Record<number, string> = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3" };

export function PremiumGate({ post, hiddenFormats = [] }: { post: BlogPost; hiddenFormats?: string[] }) {
  const { content: paragraphs, premium, title } = post;

  const availableFormats = (["text", "audio"] as Format[]).filter((f) => !hiddenFormats.includes(f));
  const formats = availableFormats.length > 0 ? availableFormats : (["text", "audio"] as Format[]);
  const availableTiers = TIERS.filter((t) => !hiddenFormats.includes(t.id));
  const tiers = availableTiers.length > 0 ? availableTiers : TIERS;

  const [format, setFormat] = useState<Format>(formats[0]);
  const [unlockedFormats, setUnlockedFormats] = useState<Set<Format>>(new Set());
  const [selectedTier, setSelectedTier] = useState<Tier>(
    tiers.some((t) => t.id === "both") ? "both" : tiers[0].id
  );
  const [showGate, setShowGate] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [hiddenPayment, setHiddenPayment] = useState<string[]>([]);
  const [profile, setProfile] = useState<AuthedProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingTier, setPendingTier] = useState<Tier | null>(null);

  useEffect(() => {
    if (!premium) return;
    let cancelled = false;
    fetch(`/api/payment-methods/${post.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setHiddenPayment(data.hidden ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [post.slug, premium]);

  useEffect(() => {
    if (!premium) return;
    let cancelled = false;
    fetch("/api/profile/me")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data.profile) return;
        setProfile({ email: data.profile.email, name: data.profile.name, whatsapp: data.profile.whatsapp });
        const purchase = (data.profile.purchases ?? []).find((p: { slug: string }) => p.slug === post.slug);
        if (purchase) unlockTier(purchase.tier as Tier);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [post.slug, premium]);

  const showBkash = !hiddenPayment.includes("bkash");
  const showCard = !hiddenPayment.includes("card");

  const isLocked = Boolean(premium) && !unlockedFormats.has(format);
  const purchaseCount = getPremiumPurchaseCount(post);
  const { rating } = getPremiumRating(post);
  const selectedTierMeta = tiers.find((t) => t.id === selectedTier) ?? tiers[0];

  function unlockTier(tier: Tier) {
    setUnlockedFormats((prev) => {
      const next = new Set(prev);
      if (tier === "both") {
        next.add("text");
        next.add("audio");
      } else {
        next.add(tier);
      }
      return next;
    });
    setShowSample(false);
  }

  function persistUnlock(tier: Tier) {
    fetch("/api/blog/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: post.slug, tier }),
    }).catch(() => {});
    unlockTier(tier);
  }

  function attemptUnlock(tier: Tier) {
    if (!profile) {
      setPendingTier(tier);
      setAuthModalOpen(true);
      return;
    }
    persistUnlock(tier);
  }

  function handleAuthSuccess(authedProfile: AuthedProfile) {
    setProfile(authedProfile);
    setAuthModalOpen(false);
    if (pendingTier) {
      persistUnlock(pendingTier);
      setPendingTier(null);
    }
  }

  const { free, locked } = premium ? splitFreeContent(paragraphs, FREE_PREVIEW_RATIO) : { free: paragraphs, locked: [] };

  const formatTabs = (
    <div className="mb-4 inline-flex rounded-md border border-border bg-surface-muted p-1 text-sm">
      {formats.includes("text") && (
        <button
          type="button"
          onClick={() => setFormat("text")}
          className={`flex items-center gap-1.5 rounded px-3 py-1.5 font-medium transition ${
            format === "text" ? "bg-surface text-foreground shadow-sm" : "text-ink-soft hover:text-foreground"
          }`}
        >
          <FileText size={14} /> টেক্সট পড়ুন
        </button>
      )}
      {formats.includes("audio") && (
        <button
          type="button"
          onClick={() => setFormat("audio")}
          className={`flex items-center gap-1.5 rounded px-3 py-1.5 font-medium transition ${
            format === "audio" ? "bg-surface text-foreground shadow-sm" : "text-ink-soft hover:text-foreground"
          }`}
        >
          <Headphones size={14} /> অডিও শুনুন
        </button>
      )}
    </div>
  );

  const paywallCard = (
    <div className="relative w-full max-w-sm rounded-lg border border-border bg-surface p-5 text-center shadow-sm">
      <button
        onClick={() => setShowGate(false)}
        aria-label="বন্ধ করুন"
        className="absolute right-2 top-2 rounded-full p-1 text-ink-faint hover:bg-surface-muted hover:text-foreground"
      >
        <X size={16} />
      </button>
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
        <Lock size={18} />
      </div>
      <h3 className="mt-2.5 font-display text-sm font-bold text-foreground">এই লেখাটি প্রিমিয়াম</h3>
      <p className="mt-1 text-xs text-ink-soft">যেভাবে পড়তে/শুনতে চান বেছে নিন</p>
      <div className="mt-1.5 flex justify-center">
        <StarRating rating={rating} size={13} />
      </div>

      <div className={`mt-3 grid gap-1.5 ${GRID_COLS[tiers.length] ?? "grid-cols-3"}`}>
        {tiers.map((tier) => {
          const Icon = tier.icon;
          const active = selectedTier === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => setSelectedTier(tier.id)}
              className={`relative flex flex-col items-center gap-1 rounded-md border p-2 text-center transition ${
                active ? "border-primary bg-primary-light" : "border-border bg-surface hover:border-primary/50"
              }`}
            >
              {tier.badge && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-white">
                  {tier.badge}
                </span>
              )}
              <Icon size={15} className="text-primary" />
              <span className="text-[10px] font-semibold text-foreground">{tier.label}</span>
              <span className="text-xs font-bold text-price">{formatTaka(tier.price)}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-2.5 text-[11px] text-ink-faint">{toBengaliNumber(purchaseCount)} জন এই লেখাটি কিনেছেন</p>

      {profile ? (
        <p className="mt-3 flex items-center justify-center gap-1.5 rounded-md bg-surface-muted px-3 py-2 text-[11px] text-ink-soft">
          <UserCheck size={13} className="text-cta" /> {profile.name} — {profile.email}
        </p>
      ) : (
        <p className="mt-3 text-[11px] text-ink-faint">
          পে করার আগে একটি প্রোফাইল তৈরি করতে হবে, যাতে পরে যেকোনো সময় পড়তে পারেন
        </p>
      )}

      <div className="mt-3 flex flex-col gap-2">
        <button
          onClick={() => setShowSample(true)}
          className="flex items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600"
        >
          <Eye size={13} /> একটু পড়ে দেখুন
        </button>
        {showBkash && (
          <button
            onClick={() => attemptUnlock(selectedTier)}
            className="flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark"
          >
            <Smartphone size={13} /> বিকাশে পে করুন — {formatTaka(selectedTierMeta.price)}
          </button>
        )}
        {showCard && (
          <button
            onClick={() => attemptUnlock(selectedTier)}
            className="flex items-center justify-center gap-1.5 rounded-md border border-primary px-4 py-2 text-xs font-semibold text-primary hover:bg-primary-light"
          >
            <CreditCard size={13} /> কার্ডে পে করুন
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {formatTabs}

      {format === "text" &&
        (isLocked ? (
          <>
            {free.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <div className="relative">
              <div aria-hidden className="pointer-events-none space-y-4 blur-sm select-none">
                {locked.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-background via-background/95 to-transparent pb-2 pt-10">
                {showGate ? (
                  paywallCard
                ) : (
                  <button
                    onClick={() => setShowGate(true)}
                    className="mb-2 flex items-center gap-1.5 rounded-full border border-primary/30 bg-surface px-4 py-2 text-xs font-semibold text-primary shadow-sm hover:bg-primary-light"
                  >
                    <ChevronDown size={13} /> পুরোটা পড়তে চান? এখানে ক্লিক করুন
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {premium && profile && (
              <div className="mb-3 flex items-center justify-between gap-2 rounded-md bg-primary-light px-3 py-2 text-xs font-medium text-primary-dark">
                <span className="flex items-center gap-1.5">
                  <UserCheck size={13} /> আনলক করা হয়েছে — আপনার প্রোফাইল থেকে যেকোনো সময় পড়তে পারবেন
                </span>
                <Link href="/profile" className="shrink-0 underline hover:no-underline">
                  প্রোফাইল দেখুন
                </Link>
              </div>
            )}
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </>
        ))}

      {format === "audio" &&
        (isLocked ? (
          showGate ? (
            <div className="flex justify-center py-4">{paywallCard}</div>
          ) : (
            <button
              onClick={() => setShowGate(true)}
              className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-surface px-4 py-2 text-xs font-semibold text-primary shadow-sm hover:bg-primary-light"
            >
              <ChevronDown size={13} /> পুরো অডিওটি শুনতে চান? এখানে ক্লিক করুন
            </button>
          )
        ) : (
          <BlogAudioPlayer slug={post.slug} title={title} paragraphs={paragraphs} />
        ))}

      <Modal open={showSample} onClose={() => setShowSample(false)}>
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary">
          <Eye size={14} /> সংক্ষিপ্ত প্রিভিউ
        </div>
        <h2 className="mt-1.5 font-display text-lg font-bold text-foreground">{post.title}</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
          <p>{locked[0]}</p>
        </div>
        <div className="mt-5 rounded-md border border-dashed border-border bg-surface-muted p-3 text-center">
          <p className="text-xs text-ink-faint">সম্পূর্ণ লেখা পড়তে/শুনতে আনলক করুন — ৳{selectedTier === "both" ? "২৯" : selectedTier === "audio" ? "২৫" : "২০"} থেকে শুরু।</p>
          <div className="mt-3 flex flex-col gap-2">
            {showBkash && (
              <Button variant="primary" fullWidth onClick={() => attemptUnlock(selectedTier)}>
                <Smartphone size={13} /> বিকাশে পে করুন
              </Button>
            )}
            {showCard && (
              <Button variant="secondary" fullWidth onClick={() => attemptUnlock(selectedTier)}>
                <CreditCard size={13} /> কার্ডে পে করুন
              </Button>
            )}
          </div>
        </div>
      </Modal>

      <ProfileAuthModal
        open={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingTier(null);
        }}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
