"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check } from "lucide-react";

interface NewsletterSettings {
  enabled: boolean;
  premiumBlogSlug: string;
}

export function NewsletterAdmin({
  initial,
  premiumPosts,
}: {
  initial: NewsletterSettings;
  premiumPosts: { slug: string; title: string }[];
}) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/newsletter", {
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
          <h1 className="font-display text-xl font-bold text-foreground">নিউজলেটার — ফ্রি প্রিমিয়াম ব্লগ</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            কেউ নিউজলেটারে সাবস্ক্রাইব করলে নিচে বেছে দেওয়া প্রিমিয়াম ব্লগটা (সাধারণত যেটা পড়তে টাকা লাগে) সম্পূর্ণ
            ফ্রি হিসেবে সাথে সাথে তার ইমেইলে পাঠিয়ে দেওয়া হবে। যেকোনো সময় অন্য একটা ব্লগ বেছে পাল্টে দিতে পারবেন।
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
        <div>
          <span className="mb-1.5 block text-xs text-ink-soft">নিউজলেটার বক্স ব্লগ পেজে দেখাবেন কিনা</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setSettings((s) => ({ ...s, enabled: true }));
                setSaved(false);
              }}
              disabled={saving}
              className={`rounded-lg border p-3 text-center ${
                settings.enabled ? "border-cta bg-cta-light" : "border-border hover:border-cta/50"
              } disabled:opacity-50`}
            >
              <span className="text-xs font-semibold text-foreground">চালু আছে</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSettings((s) => ({ ...s, enabled: false }));
                setSaved(false);
              }}
              disabled={saving}
              className={`rounded-lg border p-3 text-center ${
                !settings.enabled ? "border-cta bg-cta-light" : "border-border hover:border-cta/50"
              } disabled:opacity-50`}
            >
              <span className="text-xs font-semibold text-foreground">বন্ধ আছে</span>
            </button>
          </div>
        </div>

        <label className="block text-xs text-ink-soft">
          কোন প্রিমিয়াম ব্লগটা ফ্রি পাঠাবেন
          <select
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            value={settings.premiumBlogSlug}
            onChange={(e) => {
              setSettings((s) => ({ ...s, premiumBlogSlug: e.target.value }));
              setSaved(false);
            }}
          >
            <option value="">— বেছে নিন —</option>
            {premiumPosts.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
          {premiumPosts.length === 0 && (
            <span className="mt-1 block text-[11px] text-price">
              কোনো প্রিমিয়াম ব্লগ পাওয়া যায়নি — ব্লগ অ্যাডমিন থেকে অন্তত একটা পোস্টকে &ldquo;প্রিমিয়াম&rdquo; হিসেবে
              সেট করুন।
            </span>
          )}
          {!settings.premiumBlogSlug && (
            <span className="mt-1 block text-[11px] text-ink-faint">
              কিছু বেছে না দিলে সাবস্ক্রাইব করলেও কোনো ব্লগ ইমেইলে পাঠানো হবে না।
            </span>
          )}
        </label>

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
