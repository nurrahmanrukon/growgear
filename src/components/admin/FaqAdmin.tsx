"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check, Plus, X } from "lucide-react";

interface Faq {
  q: string;
  a: string;
}
interface FaqSettings {
  eyebrow: string;
  heading: string;
  book: Faq[];
  ebook: Faq[];
  gear: Faq[];
}

const fieldClass =
  "w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary";

const CATEGORY_TABS: { key: "book" | "ebook" | "gear"; label: string }[] = [
  { key: "book", label: "বই" },
  { key: "ebook", label: "ইবুক" },
  { key: "gear", label: "গিয়ার" },
];

export function FaqAdmin({ initial }: { initial: FaqSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [tab, setTab] = useState<"book" | "ebook" | "gear">("book");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateFaq(category: "book" | "ebook" | "gear", i: number, field: keyof Faq, value: string) {
    setSettings((prev) => ({
      ...prev,
      [category]: prev[category].map((f, idx) => (idx === i ? { ...f, [field]: value } : f)),
    }));
    setSaved(false);
  }

  function addFaq(category: "book" | "ebook" | "gear") {
    setSettings((prev) => ({ ...prev, [category]: [...prev[category], { q: "", a: "" }] }));
    setSaved(false);
  }

  function removeFaq(category: "book" | "ebook" | "gear", i: number) {
    setSettings((prev) => ({ ...prev, [category]: prev[category].filter((_, idx) => idx !== i) }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/faq", {
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

  const currentFaqs = settings[tab];

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">প্রোডাক্ট পেজের FAQ</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            প্রতিটা প্রোডাক্ট পেজে একটা &ldquo;সাধারণ জিজ্ঞাসা&rdquo; সেকশন থাকে — বই/ইবুক/গিয়ার প্রতিটা ক্যাটাগরির
            জন্য আলাদা প্রশ্ন-উত্তর সেট করা যায়। প্রশ্ন যোগ/বাদ দেওয়া যাবে।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 max-w-2xl space-y-5">
        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-ink-soft">
            সেকশনের উপরের ছোট লেখা
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.eyebrow}
              onChange={(e) => {
                setSettings((s) => ({ ...s, eyebrow: e.target.value }));
                setSaved(false);
              }}
            />
          </label>
          <label className="text-xs text-ink-soft">
            হেডিং
            <input
              className={`mt-1 ${fieldClass}`}
              value={settings.heading}
              onChange={(e) => {
                setSettings((s) => ({ ...s, heading: e.target.value }));
                setSaved(false);
              }}
            />
          </label>
        </div>

        <div className="flex gap-2 border-b border-border">
          {CATEGORY_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`border-b-2 px-3 py-2 text-sm font-medium ${
                tab === t.key ? "border-primary text-primary" : "border-transparent text-ink-soft hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {currentFaqs.map((faq, i) => (
            <div key={i} className="rounded-md border border-border p-3">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1 space-y-2">
                  <label className="block text-xs text-ink-soft">
                    প্রশ্ন
                    <input
                      className={`mt-1 ${fieldClass}`}
                      value={faq.q}
                      onChange={(e) => updateFaq(tab, i, "q", e.target.value)}
                    />
                  </label>
                  <label className="block text-xs text-ink-soft">
                    উত্তর
                    <textarea
                      rows={2}
                      className={`mt-1 ${fieldClass}`}
                      value={faq.a}
                      onChange={(e) => updateFaq(tab, i, "a", e.target.value)}
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => removeFaq(tab, i)}
                  aria-label="মুছে ফেলুন"
                  className="mt-5 shrink-0 rounded-md border border-border p-1.5 text-ink-faint hover:border-price hover:text-price"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addFaq(tab)}
            className="flex w-fit items-center gap-1 rounded-md border border-dashed border-border px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-primary hover:text-primary"
          >
            <Plus size={13} /> প্রশ্ন যোগ করুন
          </button>
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
