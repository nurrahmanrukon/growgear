"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check } from "lucide-react";

interface CategoryIntro {
  eyebrow: string;
  headline: string;
  subtext: string;
  quote: string;
}
interface CategoryIntroSettings {
  book: CategoryIntro;
  ebook: CategoryIntro;
  gear: CategoryIntro;
}

const CATEGORY_LABEL: Record<keyof CategoryIntroSettings, string> = {
  book: "বই পেজ",
  ebook: "ইবুক পেজ",
  gear: "গিয়ার পেজ",
};

const fieldClass =
  "w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary";

export function CategoryIntroAdmin({ initial }: { initial: CategoryIntroSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(cat: keyof CategoryIntroSettings, field: keyof CategoryIntro, value: string) {
    setSettings((prev) => ({ ...prev, [cat]: { ...prev[cat], [field]: value } }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/category-intro", {
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
          <h1 className="font-display text-xl font-bold text-foreground">ক্যাটাগরি পেজের শুরুর লেখা</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            বই, ইবুক ও গিয়ার পেজে লিস্টিংয়ের উপরে যে হেডলাইন ও কথাগুলো দেখা যায় (হোম পেজের মতো) — এখান থেকে
            প্রতিটা পেজের জন্য আলাদাভাবে বদলাতে পারবেন।
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
        {(Object.keys(settings) as (keyof CategoryIntroSettings)[]).map((cat) => (
          <section key={cat}>
            <h2 className="font-display text-base font-bold text-foreground">{CATEGORY_LABEL[cat]}</h2>
            <div className="mt-3 flex flex-col gap-3">
              <label className="block text-xs text-ink-soft">
                উপরের ছোট লেবেল (eyebrow)
                <input
                  className={`mt-1 ${fieldClass}`}
                  value={settings[cat].eyebrow}
                  onChange={(e) => updateField(cat, "eyebrow", e.target.value)}
                />
              </label>
              <label className="block text-xs text-ink-soft">
                হেডলাইন
                <textarea
                  rows={2}
                  className={`mt-1 ${fieldClass}`}
                  value={settings[cat].headline}
                  onChange={(e) => updateField(cat, "headline", e.target.value)}
                />
              </label>
              <label className="block text-xs text-ink-soft">
                সাবটেক্সট
                <textarea
                  rows={2}
                  className={`mt-1 ${fieldClass}`}
                  value={settings[cat].subtext}
                  onChange={(e) => updateField(cat, "subtext", e.target.value)}
                />
              </label>
              <label className="block text-xs text-ink-soft">
                হাইলাইট করা উক্তি (ঐচ্ছিক — খালি রাখলে দেখাবে না)
                <textarea
                  rows={2}
                  className={`mt-1 ${fieldClass}`}
                  value={settings[cat].quote}
                  onChange={(e) => updateField(cat, "quote", e.target.value)}
                />
              </label>
            </div>
          </section>
        ))}

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
