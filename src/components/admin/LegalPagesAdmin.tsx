"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check, Plus, X } from "lucide-react";

interface LegalSection {
  heading: string;
  items: string[];
}
interface LegalPageContent {
  title: string;
  updatedLabel: string;
  intro: string;
  sections: LegalSection[];
}
interface LegalPagesSettings {
  privacy: LegalPageContent;
  terms: LegalPageContent;
  refund: LegalPageContent;
}

const fieldClass =
  "w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary";

const PAGE_TABS: { key: keyof LegalPagesSettings; label: string }[] = [
  { key: "privacy", label: "প্রাইভেসি পলিসি" },
  { key: "terms", label: "ব্যবহারের শর্তাবলী" },
  { key: "refund", label: "রিটার্ন ও রিফান্ড পলিসি" },
];

export function LegalPagesAdmin({ initial }: { initial: LegalPagesSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [tab, setTab] = useState<keyof LegalPagesSettings>("privacy");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const page = settings[tab];

  function updatePage(fields: Partial<LegalPageContent>) {
    setSettings((prev) => ({ ...prev, [tab]: { ...prev[tab], ...fields } }));
    setSaved(false);
  }

  function updateSection(i: number, fields: Partial<LegalSection>) {
    updatePage({ sections: page.sections.map((s, idx) => (idx === i ? { ...s, ...fields } : s)) });
  }

  function addSection() {
    updatePage({ sections: [...page.sections, { heading: "", items: [""] }] });
  }

  function removeSection(i: number) {
    updatePage({ sections: page.sections.filter((_, idx) => idx !== i) });
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/legal-pages/${tab}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...page,
          sections: page.sections
            .map((s) => ({ heading: s.heading.trim(), items: s.items.map((x) => x.trim()).filter(Boolean) }))
            .filter((s) => s.heading && s.items.length > 0),
        }),
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
          <h1 className="font-display text-xl font-bold text-foreground">আইনি পেজ (প্রাইভেসি/শর্তাবলী/রিফান্ড)</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            প্রতিটা সেকশনের &ldquo;পয়েন্ট&rdquo;-এ একাধিক লাইন লিখলে সেগুলো বুলেট লিস্ট হিসেবে দেখাবে, একটা লাইন
            লিখলে সাধারণ প্যারাগ্রাফ হিসেবে দেখাবে। কোনো অংশ **এভাবে** লিখলে সেটা বোল্ড হয়ে দেখাবে।
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
        <div className="flex flex-wrap gap-2 border-b border-border">
          {PAGE_TABS.map((t) => (
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

        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-ink-soft">
            পেজের শিরোনাম
            <input className={`mt-1 ${fieldClass}`} value={page.title} onChange={(e) => updatePage({ title: e.target.value })} />
          </label>
          <label className="text-xs text-ink-soft">
            হালনাগাদের তারিখ লাইন
            <input
              className={`mt-1 ${fieldClass}`}
              value={page.updatedLabel}
              onChange={(e) => updatePage({ updatedLabel: e.target.value })}
            />
          </label>
        </div>

        <label className="block text-xs text-ink-soft">
          শুরুর লেখা (ঐচ্ছিক)
          <textarea
            rows={2}
            className={`mt-1 ${fieldClass}`}
            value={page.intro}
            onChange={(e) => updatePage({ intro: e.target.value })}
          />
        </label>

        <div className="flex flex-col gap-3">
          {page.sections.map((section, i) => (
            <div key={i} className="rounded-md border border-border p-3">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1 space-y-2">
                  <label className="block text-xs text-ink-soft">
                    সেকশনের হেডিং
                    <input
                      className={`mt-1 ${fieldClass}`}
                      value={section.heading}
                      onChange={(e) => updateSection(i, { heading: e.target.value })}
                    />
                  </label>
                  <label className="block text-xs text-ink-soft">
                    পয়েন্ট (একাধিক হলে একটা লাইনে একটা পয়েন্ট লিখুন)
                    <textarea
                      rows={Math.max(2, section.items.length)}
                      className={`mt-1 ${fieldClass}`}
                      value={section.items.join("\n")}
                      onChange={(e) => updateSection(i, { items: e.target.value.split("\n") })}
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => removeSection(i)}
                  aria-label="সেকশন মুছে ফেলুন"
                  className="mt-5 shrink-0 rounded-md border border-border p-1.5 text-ink-faint hover:border-price hover:text-price"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addSection}
            className="flex w-fit items-center gap-1 rounded-md border border-dashed border-border px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-primary hover:text-primary"
          >
            <Plus size={13} /> সেকশন যোগ করুন
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
