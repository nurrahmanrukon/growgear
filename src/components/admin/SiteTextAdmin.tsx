"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check } from "lucide-react";

interface TrustStripItem {
  label: string;
  desc: string;
}
interface NewsletterTopicCopy {
  title: string;
  desc: string;
}
interface SiteTextSettings {
  heroHeadline: string;
  heroSubheading: string;
  heroMission: string;
  heroCollectionsLabel: string;
  trustStrip: TrustStripItem[];
  newsletterBadge: string;
  newsletterHeadline: string;
  newsletterDescription: string;
  newsletterTopics: NewsletterTopicCopy[];
  footerAboutTitle: string;
  footerShopTitle: string;
  footerLearnTitle: string;
  footerSupportTitle: string;
  footerCopyright: string;
  purchaseToastBoughtText: string;
  purchaseToastMinutesAgoSuffix: string;
  blogTopicTilesHeading: string;
}

const fieldClass =
  "w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary";

export function SiteTextAdmin({ initial }: { initial: SiteTextSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof SiteTextSettings>(field: K, value: SiteTextSettings[K]) {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function updateTrustStrip(i: number, field: keyof TrustStripItem, value: string) {
    setSettings((prev) => ({
      ...prev,
      trustStrip: prev.trustStrip.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)),
    }));
    setSaved(false);
  }

  function updateNewsletterTopic(i: number, field: keyof NewsletterTopicCopy, value: string) {
    setSettings((prev) => ({
      ...prev,
      newsletterTopics: prev.newsletterTopics.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)),
    }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/site-text", {
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
          <h1 className="font-display text-xl font-bold text-foreground">সাইটের সাধারণ লেখা</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            হোমপেজের হিরো, ট্রাস্ট স্ট্রিপ, নিউজলেটার বক্স, ফুটার, ক্রয় বিজ্ঞপ্তি আর ব্লগের কিছু টেক্সট এখান থেকে
            বদলাতে পারবেন।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 max-w-2xl space-y-8">
        <section>
          <h2 className="font-display text-base font-bold text-foreground">হোমপেজ হিরো</h2>
          <div className="mt-3 flex flex-col gap-3">
            <label className="block text-xs text-ink-soft">
              মূল হেডলাইন
              <textarea
                rows={2}
                className={`mt-1 ${fieldClass}`}
                value={settings.heroHeadline}
                onChange={(e) => update("heroHeadline", e.target.value)}
              />
            </label>
            <label className="block text-xs text-ink-soft">
              সাব-হেডিং
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.heroSubheading}
                onChange={(e) => update("heroSubheading", e.target.value)}
              />
            </label>
            <label className="block text-xs text-ink-soft">
              লক্ষ্য/মিশন লাইন
              <textarea
                rows={2}
                className={`mt-1 ${fieldClass}`}
                value={settings.heroMission}
                onChange={(e) => update("heroMission", e.target.value)}
              />
            </label>
            <label className="block text-xs text-ink-soft">
              কালেকশন সেকশনের উপরে লেখা
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.heroCollectionsLabel}
                onChange={(e) => update("heroCollectionsLabel", e.target.value)}
              />
            </label>
          </div>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-foreground">ট্রাস্ট স্ট্রিপ (হোমপেজের ৪টা বিশ্বাসযোগ্যতার বক্স)</h2>
          <div className="mt-3 flex flex-col gap-3">
            {settings.trustStrip.map((item, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 rounded-md border border-border p-3">
                <label className="text-xs text-ink-soft">
                  টাইটেল
                  <input
                    className={`mt-1 ${fieldClass}`}
                    value={item.label}
                    onChange={(e) => updateTrustStrip(i, "label", e.target.value)}
                  />
                </label>
                <label className="text-xs text-ink-soft">
                  সাব-টেক্সট
                  <input
                    className={`mt-1 ${fieldClass}`}
                    value={item.desc}
                    onChange={(e) => updateTrustStrip(i, "desc", e.target.value)}
                  />
                </label>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-foreground">নিউজলেটার বক্স (ব্লগ পেজে)</h2>
          <div className="mt-3 flex flex-col gap-3">
            <label className="block text-xs text-ink-soft">
              উপরের ব্যাজ টেক্সট
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.newsletterBadge}
                onChange={(e) => update("newsletterBadge", e.target.value)}
              />
            </label>
            <label className="block text-xs text-ink-soft">
              হেডলাইন
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.newsletterHeadline}
                onChange={(e) => update("newsletterHeadline", e.target.value)}
              />
            </label>
            <label className="block text-xs text-ink-soft">
              বর্ণনা
              <textarea
                rows={2}
                className={`mt-1 ${fieldClass}`}
                value={settings.newsletterDescription}
                onChange={(e) => update("newsletterDescription", e.target.value)}
              />
            </label>
            {settings.newsletterTopics.map((topic, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 rounded-md border border-border p-3">
                <label className="text-xs text-ink-soft">
                  {i + 1}. নম্বর বিষয়ের টাইটেল
                  <input
                    className={`mt-1 ${fieldClass}`}
                    value={topic.title}
                    onChange={(e) => updateNewsletterTopic(i, "title", e.target.value)}
                  />
                </label>
                <label className="text-xs text-ink-soft">
                  বর্ণনা
                  <input
                    className={`mt-1 ${fieldClass}`}
                    value={topic.desc}
                    onChange={(e) => updateNewsletterTopic(i, "desc", e.target.value)}
                  />
                </label>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-foreground">ফুটার</h2>
          <div className="mt-3 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-ink-soft">
                ১ম গ্রুপের টাইটেল
                <input
                  className={`mt-1 ${fieldClass}`}
                  value={settings.footerAboutTitle}
                  onChange={(e) => update("footerAboutTitle", e.target.value)}
                />
              </label>
              <label className="text-xs text-ink-soft">
                ২য় গ্রুপের টাইটেল
                <input
                  className={`mt-1 ${fieldClass}`}
                  value={settings.footerShopTitle}
                  onChange={(e) => update("footerShopTitle", e.target.value)}
                />
              </label>
              <label className="text-xs text-ink-soft">
                ৩য় গ্রুপের টাইটেল
                <input
                  className={`mt-1 ${fieldClass}`}
                  value={settings.footerLearnTitle}
                  onChange={(e) => update("footerLearnTitle", e.target.value)}
                />
              </label>
              <label className="text-xs text-ink-soft">
                ৪র্থ গ্রুপের টাইটেল
                <input
                  className={`mt-1 ${fieldClass}`}
                  value={settings.footerSupportTitle}
                  onChange={(e) => update("footerSupportTitle", e.target.value)}
                />
              </label>
            </div>
            <label className="block text-xs text-ink-soft">
              কপিরাইট লাইন (সবার নিচে)
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.footerCopyright}
                onChange={(e) => update("footerCopyright", e.target.value)}
              />
            </label>
          </div>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-foreground">ক্রয় বিজ্ঞপ্তি (পপ-আপ)</h2>
          <p className="mt-1 text-[11px] text-ink-faint">
            যেমন দেখায়: &ldquo;রহিম — ঢাকা — &lsquo;বইয়ের নাম&rsquo; {settings.purchaseToastBoughtText} — ৮{" "}
            {settings.purchaseToastMinutesAgoSuffix}&rdquo;
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="text-xs text-ink-soft">
              &ldquo;কিনেছেন&rdquo;-এর বদলে
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.purchaseToastBoughtText}
                onChange={(e) => update("purchaseToastBoughtText", e.target.value)}
              />
            </label>
            <label className="text-xs text-ink-soft">
              &ldquo;মিনিট আগে&rdquo;-এর বদলে
              <input
                className={`mt-1 ${fieldClass}`}
                value={settings.purchaseToastMinutesAgoSuffix}
                onChange={(e) => update("purchaseToastMinutesAgoSuffix", e.target.value)}
              />
            </label>
          </div>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-foreground">ব্লগ</h2>
          <label className="mt-3 block text-xs text-ink-soft">
            &ldquo;বিষয় অনুযায়ী দেখুন&rdquo; সেকশনের হেডিং
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.blogTopicTilesHeading}
              onChange={(e) => update("blogTopicTilesHeading", e.target.value)}
            />
          </label>
        </section>

        {error && <p className="text-sm text-price">{error}</p>}

        <div className="flex items-center gap-3">
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
