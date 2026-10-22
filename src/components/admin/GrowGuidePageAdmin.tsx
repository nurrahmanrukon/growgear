"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check } from "lucide-react";

interface GrowGuideHeroSlide {
  title: string;
  body: string;
}
interface GrowGuideStep {
  title: string;
  body: string;
}
interface GrowGuideTextReview {
  name: string;
  role: string;
  quote: string;
  rating: number;
}
interface GrowGuideSocialPost {
  name: string;
  text: string;
  likes: number;
  hoursAgo: number;
}
interface GrowGuidePageSettings {
  indexHiddenHeading: string;
  mainMessageEyebrow: string;
  mainMessageHeading: string;
  mainMessageParagraph: string;
  videoComingSoonSuffix: string;
  indexVideoCaption: string;
  whyJoinEyebrow: string;
  whyJoinHeading: string;
  testimonialsHeadingSuffix: string;
  heroSlides: GrowGuideHeroSlide[];
  joinFormEyebrow: string;
  joinFormWhatsIncludedLabel: string;
  joinFormNextSessionTemplate: string;
  joinFormNextSessionDate: string;
  joinFormNextSessionTime: string;
  joinFormSegmentLabel: string;
  joinFormSegmentTarget: number;
  joinFormSegmentJoined: number;
  joinFormJoinedCountTemplate: string;
  joinFormTargetCountTemplate: string;
  joinFormProgressCaptionTemplate: string;
  joinFormEmailPlaceholder: string;
  joinFormEmailErrorText: string;
  joinFormPhonePlaceholder: string;
  joinFormPhoneErrorText: string;
  joinFormSubmitButtonLabel: string;
  joinFormJoinedConfirmationTemplate: string;
  joinFormFooterNote: string;
  stepsHeading: string;
  steps: GrowGuideStep[];
  authorInitial: string;
  authorName: string;
  authorRole: string;
  authorBio: string;
  communityHeading: string;
  communityBody: string;
  reviewsEyebrow: string;
  reviewsHeading: string;
  textReviews: GrowGuideTextReview[];
  videoReviews: GrowGuideTextReview[];
  videoReviewCaptionTemplate: string;
  socialProofEyebrow: string;
  socialProofHeading: string;
  socialProofSubheading: string;
  socialPosts: GrowGuideSocialPost[];
}

const fieldClass =
  "w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary";

export function GrowGuidePageAdmin({ initial }: { initial: GrowGuidePageSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof GrowGuidePageSettings>(field: K, value: GrowGuidePageSettings[K]) {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function updateArrayItem<K extends "heroSlides" | "steps" | "textReviews" | "videoReviews" | "socialPosts">(
    field: K,
    i: number,
    patch: Partial<GrowGuidePageSettings[K][number]>
  ) {
    setSettings((prev) => ({
      ...prev,
      [field]: (prev[field] as unknown[]).map((item, idx) => (idx === i ? { ...(item as object), ...patch } : item)),
    }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/growguide-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "সংরক্ষণ করা যায়নি");
        return;
      }
      setSettings(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("সংরক্ষণ করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">GrowGuide — পেজের লেখা</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            /growguide ও এর অডিয়েন্স পেজগুলোর সব ভাগের লেখা (হিরো স্লাইড, জয়েন ফর্ম, ধাপ, লেখকের পরিচিতি, কমিউনিটি,
            রিভিউ, সোশ্যাল প্রুফ) এখান থেকে বদলাতে পারবেন। অডিয়েন্স-ভিত্তিক তথ্য (শিক্ষার্থী/প্রফেশনাল/উদ্যোক্তা)
            আলাদা পেজে (&ldquo;GrowGuide অডিয়েন্স&rdquo;) আছে।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 max-w-2xl space-y-6">
        <section className="space-y-3">
          <h2 className="font-display text-sm font-bold text-foreground">সাধারণ</h2>
          <label className="block text-xs text-ink-soft">
            ইনডেক্স পেজের লুকানো শিরোনাম (SEO-র জন্য, স্ক্রিনে দেখা যায় না)
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.indexHiddenHeading}
              onChange={(e) => update("indexHiddenHeading", e.target.value)}
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-ink-soft">
              &ldquo;মূল বার্তা&rdquo; সেকশনের ছোট লেখা
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.mainMessageEyebrow}
                onChange={(e) => update("mainMessageEyebrow", e.target.value)}
              />
            </label>
            <label className="text-xs text-ink-soft">
              &ldquo;ভিডিও শীঘ্রই আসছে&rdquo; লেখা
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.videoComingSoonSuffix}
                onChange={(e) => update("videoComingSoonSuffix", e.target.value)}
              />
            </label>
          </div>
          <label className="block text-xs text-ink-soft">
            &ldquo;মূল বার্তা&rdquo; হেডিং
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.mainMessageHeading}
              onChange={(e) => update("mainMessageHeading", e.target.value)}
            />
          </label>
          <label className="block text-xs text-ink-soft">
            &ldquo;মূল বার্তা&rdquo; প্যারাগ্রাফ
            <textarea
              rows={2}
              className={`mt-1 ${fieldClass}`}
              value={settings.mainMessageParagraph}
              onChange={(e) => update("mainMessageParagraph", e.target.value)}
            />
          </label>
          <label className="block text-xs text-ink-soft">
            ইনডেক্স পেজের ভিডিও ক্যাপশন
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.indexVideoCaption}
              onChange={(e) => update("indexVideoCaption", e.target.value)}
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-ink-soft">
              &ldquo;কেন যোগ দেবেন&rdquo; ছোট লেখা
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.whyJoinEyebrow}
                onChange={(e) => update("whyJoinEyebrow", e.target.value)}
              />
            </label>
            <label className="text-xs text-ink-soft">
              টেস্টিমোনিয়াল হেডিং-এর শেষ অংশ (নামের পরে বসে)
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.testimonialsHeadingSuffix}
                onChange={(e) => update("testimonialsHeadingSuffix", e.target.value)}
              />
            </label>
          </div>
          <label className="block text-xs text-ink-soft">
            &ldquo;কেন যোগ দেবেন&rdquo; হেডিং
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.whyJoinHeading}
              onChange={(e) => update("whyJoinHeading", e.target.value)}
            />
          </label>
        </section>

        <section className="space-y-3 border-t border-border pt-4">
          <h2 className="font-display text-sm font-bold text-foreground">হিরো স্লাইড (১১টা)</h2>
          <div className="flex flex-col gap-3">
            {settings.heroSlides.map((s, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <p className="text-[11px] font-medium text-ink-faint">স্লাইড {i + 1}</p>
                <input
                  className={`mt-1 ${fieldClass}`}
                  value={s.title}
                  onChange={(e) => updateArrayItem("heroSlides", i, { title: e.target.value })}
                />
                <textarea
                  rows={2}
                  className={`mt-2 ${fieldClass}`}
                  value={s.body}
                  onChange={(e) => updateArrayItem("heroSlides", i, { body: e.target.value })}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 border-t border-border pt-4">
          <h2 className="font-display text-sm font-bold text-foreground">জয়েন ফর্ম</h2>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-ink-soft">
              ছোট লেখা (eyebrow)
              <input className={`mt-1 ${fieldClass}`} value={settings.joinFormEyebrow} onChange={(e) => update("joinFormEyebrow", e.target.value)} />
            </label>
            <label className="text-xs text-ink-soft">
              &ldquo;যা থাকছে&rdquo; লেবেল
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.joinFormWhatsIncludedLabel}
                onChange={(e) => update("joinFormWhatsIncludedLabel", e.target.value)}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-ink-soft">
              পরবর্তী সেশনের তারিখ
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.joinFormNextSessionDate}
                onChange={(e) => update("joinFormNextSessionDate", e.target.value)}
              />
            </label>
            <label className="text-xs text-ink-soft">
              পরবর্তী সেশনের সময়
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.joinFormNextSessionTime}
                onChange={(e) => update("joinFormNextSessionTime", e.target.value)}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-ink-soft">
              সেগমেন্টের নাম
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.joinFormSegmentLabel}
                onChange={(e) => update("joinFormSegmentLabel", e.target.value)}
              />
            </label>
            <label className="text-xs text-ink-soft">
              সেগমেন্টের লক্ষ্য সংখ্যা
              <input
                type="number"
                className={`mt-1 ${fieldClass}`}
                value={settings.joinFormSegmentTarget}
                onChange={(e) => update("joinFormSegmentTarget", Number(e.target.value) || 0)}
              />
            </label>
          </div>
          <label className="block text-xs text-ink-soft">
            শুরুর যুক্ত-হওয়া সংখ্যা (পেজ লোড হওয়ার সময় যা দেখাবে)
            <input
              type="number"
              className={`mt-1 ${fieldClass}`}
              value={settings.joinFormSegmentJoined}
              onChange={(e) => update("joinFormSegmentJoined", Number(e.target.value) || 0)}
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-ink-soft">
              ইমেইল প্লেসহোল্ডার
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.joinFormEmailPlaceholder}
                onChange={(e) => update("joinFormEmailPlaceholder", e.target.value)}
              />
            </label>
            <label className="text-xs text-ink-soft">
              ইমেইল ভুল হলে এরর
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.joinFormEmailErrorText}
                onChange={(e) => update("joinFormEmailErrorText", e.target.value)}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-ink-soft">
              ফোন প্লেসহোল্ডার
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.joinFormPhonePlaceholder}
                onChange={(e) => update("joinFormPhonePlaceholder", e.target.value)}
              />
            </label>
            <label className="text-xs text-ink-soft">
              ফোন ভুল হলে এরর
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.joinFormPhoneErrorText}
                onChange={(e) => update("joinFormPhoneErrorText", e.target.value)}
              />
            </label>
          </div>
          <label className="block text-xs text-ink-soft">
            সাবমিট বাটনের লেখা
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.joinFormSubmitButtonLabel}
              onChange={(e) => update("joinFormSubmitButtonLabel", e.target.value)}
            />
          </label>
          <label className="block text-xs text-ink-soft">
            জয়েন করার পর যে কনফার্মেশন দেখাবে (ভেতরে {"{target}"} লিখলে সেখানে লক্ষ্য সংখ্যা বসবে)
            <textarea
              rows={2}
              className={`mt-1 ${fieldClass}`}
              value={settings.joinFormJoinedConfirmationTemplate}
              onChange={(e) => update("joinFormJoinedConfirmationTemplate", e.target.value)}
            />
          </label>
          <label className="block text-xs text-ink-soft">
            নিচের ছোট নোট
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.joinFormFooterNote}
              onChange={(e) => update("joinFormFooterNote", e.target.value)}
            />
          </label>
        </section>

        <section className="space-y-3 border-t border-border pt-4">
          <h2 className="font-display text-sm font-bold text-foreground">&ldquo;যেভাবে কাজ করে&rdquo; — ৪টা ধাপ</h2>
          <label className="block text-xs text-ink-soft">
            হেডিং
            <input className={`mt-1 ${fieldClass}`} value={settings.stepsHeading} onChange={(e) => update("stepsHeading", e.target.value)} />
          </label>
          <div className="flex flex-col gap-3">
            {settings.steps.map((s, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <p className="text-[11px] font-medium text-ink-faint">ধাপ {i + 1}</p>
                <input className={`mt-1 ${fieldClass}`} value={s.title} onChange={(e) => updateArrayItem("steps", i, { title: e.target.value })} />
                <textarea
                  rows={2}
                  className={`mt-2 ${fieldClass}`}
                  value={s.body}
                  onChange={(e) => updateArrayItem("steps", i, { body: e.target.value })}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 border-t border-border pt-4">
          <h2 className="font-display text-sm font-bold text-foreground">লেখকের পরিচিতি</h2>
          <div className="grid grid-cols-3 gap-2">
            <label className="text-xs text-ink-soft">
              অ্যাভাটারের অক্ষর
              <input className={`mt-1 ${fieldClass}`} value={settings.authorInitial} onChange={(e) => update("authorInitial", e.target.value)} />
            </label>
            <label className="col-span-2 text-xs text-ink-soft">
              নাম
              <input className={`mt-1 ${fieldClass}`} value={settings.authorName} onChange={(e) => update("authorName", e.target.value)} />
            </label>
          </div>
          <label className="block text-xs text-ink-soft">
            পদবি
            <input className={`mt-1 ${fieldClass}`} value={settings.authorRole} onChange={(e) => update("authorRole", e.target.value)} />
          </label>
          <label className="block text-xs text-ink-soft">
            পরিচিতি
            <textarea rows={2} className={`mt-1 ${fieldClass}`} value={settings.authorBio} onChange={(e) => update("authorBio", e.target.value)} />
          </label>
        </section>

        <section className="space-y-3 border-t border-border pt-4">
          <h2 className="font-display text-sm font-bold text-foreground">কমিউনিটি সেকশন</h2>
          <label className="block text-xs text-ink-soft">
            হেডিং
            <input className={`mt-1 ${fieldClass}`} value={settings.communityHeading} onChange={(e) => update("communityHeading", e.target.value)} />
          </label>
          <label className="block text-xs text-ink-soft">
            বর্ণনা
            <textarea rows={2} className={`mt-1 ${fieldClass}`} value={settings.communityBody} onChange={(e) => update("communityBody", e.target.value)} />
          </label>
        </section>

        <section className="space-y-3 border-t border-border pt-4">
          <h2 className="font-display text-sm font-bold text-foreground">রিভিউ সেকশন</h2>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-ink-soft">
              ছোট লেখা
              <input className={`mt-1 ${fieldClass}`} value={settings.reviewsEyebrow} onChange={(e) => update("reviewsEyebrow", e.target.value)} />
            </label>
            <label className="text-xs text-ink-soft">
              হেডিং
              <input className={`mt-1 ${fieldClass}`} value={settings.reviewsHeading} onChange={(e) => update("reviewsHeading", e.target.value)} />
            </label>
          </div>
          <label className="block text-xs text-ink-soft">
            ভিডিও রিভিউ ক্যাপশন (ভেতরে {"{name}"} লিখলে সেখানে নাম বসবে)
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.videoReviewCaptionTemplate}
              onChange={(e) => update("videoReviewCaptionTemplate", e.target.value)}
            />
          </label>

          <p className="text-xs font-semibold text-ink-soft">টেক্সট রিভিউ (৪টা)</p>
          <div className="flex flex-col gap-3">
            {settings.textReviews.map((r, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <div className="grid grid-cols-3 gap-2">
                  <input
                    className={`${fieldClass} col-span-1`}
                    placeholder="নাম"
                    value={r.name}
                    onChange={(e) => updateArrayItem("textReviews", i, { name: e.target.value })}
                  />
                  <input
                    className={`${fieldClass} col-span-1`}
                    placeholder="পরিচয়"
                    value={r.role}
                    onChange={(e) => updateArrayItem("textReviews", i, { role: e.target.value })}
                  />
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    max={5}
                    className={`${fieldClass} col-span-1`}
                    placeholder="রেটিং"
                    value={r.rating}
                    onChange={(e) => updateArrayItem("textReviews", i, { rating: Number(e.target.value) || 0 })}
                  />
                </div>
                <textarea
                  rows={2}
                  className={`mt-2 ${fieldClass}`}
                  placeholder="মন্তব্য"
                  value={r.quote}
                  onChange={(e) => updateArrayItem("textReviews", i, { quote: e.target.value })}
                />
              </div>
            ))}
          </div>

          <p className="text-xs font-semibold text-ink-soft">ভিডিও রিভিউ (২টা)</p>
          <div className="flex flex-col gap-3">
            {settings.videoReviews.map((r, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <div className="grid grid-cols-3 gap-2">
                  <input
                    className={`${fieldClass} col-span-1`}
                    placeholder="নাম"
                    value={r.name}
                    onChange={(e) => updateArrayItem("videoReviews", i, { name: e.target.value })}
                  />
                  <input
                    className={`${fieldClass} col-span-1`}
                    placeholder="পরিচয়"
                    value={r.role}
                    onChange={(e) => updateArrayItem("videoReviews", i, { role: e.target.value })}
                  />
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    max={5}
                    className={`${fieldClass} col-span-1`}
                    placeholder="রেটিং"
                    value={r.rating}
                    onChange={(e) => updateArrayItem("videoReviews", i, { rating: Number(e.target.value) || 0 })}
                  />
                </div>
                <textarea
                  rows={2}
                  className={`mt-2 ${fieldClass}`}
                  placeholder="মন্তব্য"
                  value={r.quote}
                  onChange={(e) => updateArrayItem("videoReviews", i, { quote: e.target.value })}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 border-t border-border pt-4">
          <h2 className="font-display text-sm font-bold text-foreground">সোশ্যাল মিডিয়া প্রুফ</h2>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-ink-soft">
              ছোট লেখা
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.socialProofEyebrow}
                onChange={(e) => update("socialProofEyebrow", e.target.value)}
              />
            </label>
            <label className="text-xs text-ink-soft">
              হেডিং
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.socialProofHeading}
                onChange={(e) => update("socialProofHeading", e.target.value)}
              />
            </label>
          </div>
          <label className="block text-xs text-ink-soft">
            সাব-হেডিং
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.socialProofSubheading}
              onChange={(e) => update("socialProofSubheading", e.target.value)}
            />
          </label>
          <p className="text-xs font-semibold text-ink-soft">
            পোস্ট (৬টা — কোনটা ফেসবুক/ইনস্টাগ্রাম/হোয়াটসঅ্যাপ মক-আপে দেখাবে সেটা ক্রম অনুযায়ী আগে থেকে ঠিক করা, এখান
            থেকে বদলানো যায় না)
          </p>
          <div className="flex flex-col gap-3">
            {settings.socialPosts.map((p, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <div className="grid grid-cols-3 gap-2">
                  <input
                    className={`${fieldClass} col-span-1`}
                    placeholder="নাম"
                    value={p.name}
                    onChange={(e) => updateArrayItem("socialPosts", i, { name: e.target.value })}
                  />
                  <input
                    type="number"
                    className={`${fieldClass} col-span-1`}
                    placeholder="লাইক"
                    value={p.likes}
                    onChange={(e) => updateArrayItem("socialPosts", i, { likes: Number(e.target.value) || 0 })}
                  />
                  <input
                    type="number"
                    className={`${fieldClass} col-span-1`}
                    placeholder="কত ঘণ্টা আগে"
                    value={p.hoursAgo}
                    onChange={(e) => updateArrayItem("socialPosts", i, { hoursAgo: Number(e.target.value) || 0 })}
                  />
                </div>
                <textarea
                  rows={2}
                  className={`mt-2 ${fieldClass}`}
                  placeholder="পোস্টের লেখা"
                  value={p.text}
                  onChange={(e) => updateArrayItem("socialPosts", i, { text: e.target.value })}
                />
              </div>
            ))}
          </div>
        </section>

        {error && <p className="text-sm text-price">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-md bg-cta px-5 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
          >
            {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm font-medium text-success">
              <Check size={15} /> সংরক্ষিত হয়েছে
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
