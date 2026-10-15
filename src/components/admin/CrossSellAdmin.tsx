"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check } from "lucide-react";

interface CrossSellSettings {
  enabled: boolean;
  ebookSlug: string;
  bookSlug: string;
  gearSlug: string;
  soldCount: number;
  message: string;
  secondOfferEnabled: boolean;
}

const fieldClass =
  "w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary";

export function CrossSellAdmin({
  initial,
  ebooks,
  books,
  gear,
}: {
  initial: CrossSellSettings;
  ebooks: { slug: string; title: string }[];
  books: { slug: string; title: string }[];
  gear: { slug: string; title: string }[];
}) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof CrossSellSettings>(field: K, value: CrossSellSettings[K]) {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/cross-sell", {
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
          <h1 className="font-display text-xl font-bold text-foreground">অর্ডার কনফার্মেশনে ক্রস-সেল</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            কাস্টমার অর্ডার করার পর &ldquo;অর্ডার সফল হয়েছে&rdquo; পেজে আরেকটা প্রোডাক্ট সাজেস্ট করে দেখাবে।
            কাস্টমার কী কিনেছেন তার উপর ভিত্তি করে কোন ক্যাটাগরি সাজেস্ট হবে তা এমনিতেই ঠিক হয়ে যায় — বই
            কিনলে ইবুক সাজেস্ট হবে, গিয়ার কিনলে ইবুক, আর ইবুক কিনলে বই সাজেস্ট হবে (একই প্রোডাক্ট দুবার
            সাজেস্ট হয় না)। নিচে প্রতি ক্যাটাগরির জন্য কোন নির্দিষ্ট প্রোডাক্টটা দেখাবেন তা বেছে দিন।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 max-w-xl space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => update("enabled", true)}
            disabled={saving}
            className={`rounded-lg border p-3 text-center ${
              settings.enabled ? "border-cta bg-cta-light" : "border-border hover:border-cta/50"
            } disabled:opacity-50`}
          >
            <span className="text-xs font-semibold text-foreground">চালু আছে</span>
          </button>
          <button
            type="button"
            onClick={() => update("enabled", false)}
            disabled={saving}
            className={`rounded-lg border p-3 text-center ${
              !settings.enabled ? "border-price bg-price/10" : "border-border hover:border-price/50"
            } disabled:opacity-50`}
          >
            <span className="text-xs font-semibold text-foreground">বন্ধ</span>
          </button>
        </div>

        <label className="block text-xs text-ink-soft">
          ইবুক ক্যাটাগরির জন্য কোনটা সাজেস্ট করবেন
          <select
            className={`mt-1 ${fieldClass}`}
            value={settings.ebookSlug}
            onChange={(e) => update("ebookSlug", e.target.value)}
          >
            <option value="">— একটা ইবুক বেছে নিন —</option>
            {ebooks.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs text-ink-soft">
          বই ক্যাটাগরির জন্য কোনটা সাজেস্ট করবেন
          <select
            className={`mt-1 ${fieldClass}`}
            value={settings.bookSlug}
            onChange={(e) => update("bookSlug", e.target.value)}
          >
            <option value="">— একটা বই বেছে নিন —</option>
            {books.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs text-ink-soft">
          গিয়ার ক্যাটাগরির জন্য কোনটা সাজেস্ট করবেন
          <select
            className={`mt-1 ${fieldClass}`}
            value={settings.gearSlug}
            onChange={(e) => update("gearSlug", e.target.value)}
          >
            <option value="">— একটা গিয়ার বেছে নিন —</option>
            {gear.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs text-ink-soft">
          কতজন কিনেছেন (সংখ্যা)
          <input
            type="number"
            min={0}
            className={`mt-1 ${fieldClass}`}
            value={settings.soldCount}
            onChange={(e) => update("soldCount", Math.max(0, Number(e.target.value) || 0))}
          />
        </label>

        <label className="block text-xs text-ink-soft">
          বার্তা — {"{count}"} লিখলে সেখানে উপরের সংখ্যাটা বসে যাবে
          <textarea
            rows={2}
            className={`mt-1 ${fieldClass}`}
            value={settings.message}
            onChange={(e) => update("message", e.target.value)}
          />
        </label>

        <div className="border-t border-border pt-5">
          <p className="text-sm font-semibold text-foreground">দ্বিতীয় সাজেশন</p>
          <p className="mt-1 text-xs text-ink-soft">
            উপরের প্রোডাক্টটা কেনার পর &ldquo;অর্ডার হয়ে গেছে&rdquo; স্ক্রিনে আরেকটা প্রোডাক্ট সাজেস্ট করে
            দেখাবে (ঘূর্ণনক্রমে বাকি থাকা ক্যাটাগরি থেকে), যেখানে ক্লিক করে কাস্টমার সরাসরি সেটা কিনতে
            যেতে পারবেন।
          </p>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => update("secondOfferEnabled", true)}
              disabled={saving}
              className={`rounded-lg border p-3 text-center ${
                settings.secondOfferEnabled ? "border-cta bg-cta-light" : "border-border hover:border-cta/50"
              } disabled:opacity-50`}
            >
              <span className="text-xs font-semibold text-foreground">চালু আছে</span>
            </button>
            <button
              type="button"
              onClick={() => update("secondOfferEnabled", false)}
              disabled={saving}
              className={`rounded-lg border p-3 text-center ${
                !settings.secondOfferEnabled ? "border-price bg-price/10" : "border-border hover:border-price/50"
              } disabled:opacity-50`}
            >
              <span className="text-xs font-semibold text-foreground">বন্ধ</span>
            </button>
          </div>
        </div>

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
